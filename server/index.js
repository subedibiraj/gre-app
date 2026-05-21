import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50kb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── SHARED PROMPT FRAGMENTS ───────────────────────────────────────────────────

const GRE_VERBAL_REGISTER = `
AUTHENTIC GRE REGISTER REQUIREMENTS:
- Stems must read like excerpts from academic writing: literary criticism, scientific reviews, historical analysis, philosophical treatises, economic commentary, or art criticism
- Use subordinate clauses, appositives, and parallel constructions — never simple subject-verb sentences
- Avoid first-person, contractions, colloquialisms, and pop-culture references
- Character/subject types authentic to GRE: historians, scientists, philosophers, critics, economists, novelists, biographers, politicians
- Sentence openers authentic to GRE: "Although long celebrated for...", "Despite her reputation for...", "Critics who dismissed X as... failed to recognize...", "The author's insistence on... belied...", "What distinguished X from contemporaries was not... but rather..."
`;

const TC_RULES = `
TEXT COMPLETION RULES (mirror real ETS standards):
1. SINGLE-BLANK (5 options A-E): The stem must contain either:
   (a) A PIVOT WORD signaling contrast: despite, although, yet, however, while, nevertheless, paradoxically, surprisingly, ironically, in spite of
   (b) A SUPPORT/CONTINUATION signal: as expected, indeed, not surprisingly, characteristically, accordingly, consequently
   (c) A DEFINITIONAL CLUE: the blank is explained or illustrated by the surrounding text
   — The correct answer must be derivable from the stem ALONE, not from general knowledge
   — Wrong answers must be from the SAME SEMANTIC FIELD (e.g., if answer is TACITURN, distractors should be RETICENT, LACONIC, LOQUACIOUS, GARRULOUS — not random unrelated words)
   
2. DOUBLE-BLANK (3 options per blank, A-C for blank 1, D-F for blank 2):
   — Each blank must have INDEPENDENT evidence in the stem
   — The two blanks should NOT be simple opposites of each other — that is too easy
   — Correct answer for each blank must work WITH the other correct answer to create coherent meaning
   — Wrong options should create incoherent meaning with the rest of the sentence, not just sound wrong
   
3. DIFFICULTY CALIBRATION:
   — Easy: single pivot word, unambiguous direction, correct answer is the most common word of the semantic group
   — Medium: requires understanding a nuance between similar words, or parsing a longer complex sentence
   — Hard: abstract academic context, correct answer hinges on a precise distinction between near-synonyms, or stem contains multiple clauses that must all be satisfied
`;

const SE_RULES = `
SENTENCE EQUIVALENCE RULES (mirror real ETS standards):
1. The 6 options must include: 2 correct answers + 2 plausible-but-wrong answers from the same field + 2 clearly-wrong answers
2. The 2 correct answers must be genuine synonyms OR produce sentences with the same logical meaning — not just grammatically valid
3. CRITICAL TEST: read the sentence with ONLY Word 1. Read it with ONLY Word 2. The resulting meanings must be essentially the same.
4. The 4 wrong answers must be eliminable: 
   — 2 of them should fit the blank grammatically but change the meaning of the sentence
   — 2 of them should clearly not fit the context at all
5. Difficulty calibration:
   — Easy: 2 correct words are obvious near-synonyms, distractors are clearly different
   — Medium: all 6 words are somewhat related, correct pair requires knowing nuanced difference
   — Hard: correct pair shares only contextual meaning (not dictionary synonyms), and strong distractors could fool a student who only half-understands the clue
`;

const RC_RULES = `
READING COMPREHENSION RULES (mirror real ETS standards):
PASSAGE REQUIREMENTS:
- Academic register throughout — no casual language
- Passages must take a discernible POSITION or present a TENSION: the author asserts X, complicates Y, or contrasts view A with view B
- Topics: natural sciences (evolutionary biology, astronomy, physics, chemistry), humanities (literary criticism, art history, philosophy, linguistics), social sciences (economics, political theory, sociology, psychology)
- Do NOT write about fictional countries, made-up studies, or generic topics like "Company X released a product"
- Each passage should contain at least one statement the student could confuse with another (for inference questions)

QUESTION TYPE DISTRIBUTION (for 3 questions per passage):
Q1: MAIN IDEA or PRIMARY PURPOSE — "The passage primarily serves to..." / "Which best describes the author's main argument?"
Q2: INFERENCE — "The passage suggests/implies that..." / "Based on the passage, it can be inferred that..."
Q3: VOCABULARY IN CONTEXT — "As used in the passage, X most nearly means..." OR SPECIFIC DETAIL — "According to the passage..."

WRONG ANSWER CONSTRUCTION:
- Main idea wrongs: too narrow (focuses on one detail), too broad (overstates the scope), or opposite to the author's stance
- Inference wrongs: too strong (uses "always"/"never" when passage says "often"/"sometimes"), goes beyond what passage states, contradicts passage
- Vocabulary wrongs: the most common everyday meaning of the word (which differs from its contextual meaning), a related word that doesn't fit context
`;

// ─── VERBAL PRACTICE ENDPOINT ──────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  try {
    const { dayNum, theme, currentWords, allWords, weakWords, scores } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const bankLines = allWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');
    const weakNote = weakWords?.length
      ? `\n\nWEAK WORDS — MANDATORY PRIORITY: The student has repeatedly missed these words. You MUST include at least 3 of them across your questions, testing the EXACT nuance they confused:\n${weakWords.slice(0, 12).join(', ')}\nFor each weak word you include, the wrong answers must include the word they likely confused it with.`
      : '';
    const scoreNote = scores
      ? `\nPrevious session performance: ${JSON.stringify(scores)}. Adjust difficulty: if scores are high (>80%), increase difficulty. If low (<60%), include easier anchor questions with harder ones.`
      : '';

    const systemPrompt = `You are a senior ETS question developer with 20 years of experience writing official GRE Verbal Reasoning questions. You have written thousands of questions that appeared on real GRE exams.

Your questions are used by test-prep companies as the gold standard for GRE authenticity.

ABSOLUTE NON-NEGOTIABLE RULES:
1. Return ONLY valid JSON. No markdown fences, no backticks, no text outside the JSON object. Any non-JSON output breaks the application.
2. Use ONLY words explicitly provided in the word bank. Never invent, approximate, or substitute.
3. Never place the correct answer word anywhere in the question stem or context sentence.
4. Every question has exactly ONE unambiguous correct answer — no "it could be argued" situations.
5. Every explanation MUST analyze why each wrong answer fails — this is the primary learning mechanism.

${GRE_VERBAL_REGISTER}
${TC_RULES}
${SE_RULES}
${RC_RULES}`;

    const currentWordsList = currentWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');

    const userPrompt = `Generate adaptive GRE Verbal practice questions for Day ${dayNum}: "${theme}"
${weakNote}
${scoreNote}

━━━ WORD POOLS ━━━
Today's words (REQUIRED for VIC, TC, SE):
${currentWordsList}

Full word bank (for RC distractors and cross-day references only):
${bankLines}

━━━ SECTION 1: VOCABULARY IN CONTEXT (5 questions) ━━━
Write a sophisticated sentence that USES the target word in an authentic academic context.
Then provide 4 answer choices for what the word means IN THAT SPECIFIC CONTEXT.
Requirements:
- The sentence must be complex enough that a student needs to understand the academic context, not just recognize the word
- The sentence should provide at least one contextual clue to the word's meaning (for fair testing)
- One correct answer: precise definition of the word as used
- Three wrong answers: (a) the word from a related but different semantic cluster, (b) the most common everyday misunderstanding of the word, (c) a plausible-sounding but incorrect meaning
- Use ONLY Day ${dayNum} words — each of the 5 questions must test a DIFFERENT word

Format for each:
{"id":N, "word":"WORD", "sentence":"Academic sentence using the word...", "answer":"B", "opts":[{"l":"A","t":"meaning1"},{"l":"B","t":"meaning2"},{"l":"C","t":"meaning3"},{"l":"D","t":"meaning4"}], "explain":"Correct: B because [precise definition + how context confirms it]. | A wrong: [why this definition doesn't fit the usage]. | C wrong: [common trap explanation]. | D wrong: [why this fails]."}

━━━ SECTION 2: TEXT COMPLETION (4 questions) ━━━
Use ONLY Day ${dayNum} words as the correct answer and as distractors.
Difficulty distribution: Q1=easy single-blank, Q2=medium single-blank, Q3=medium single-blank, Q4=hard double-blank

Q1 (Easy, single-blank): Clear pivot word, common word from today's cluster as answer, wrong answers from same cluster but clearly wrong given the pivot
Q2 (Medium, single-blank): Requires parsing a complex clause, answer hinges on a nuance between two similar words
Q3 (Medium, single-blank): Definitional clue approach — the stem explains or illustrates the blank without a pivot word
Q4 (Hard, double-blank): Academic scenario, each blank has independent evidence, wrong options for each blank come from the same cluster

${TC_RULES}

Format — single blank:
{"id":N, "stem":"sentence with [B1]", "blanks":[{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"w1"},{"l":"B","t":"w2"},{"l":"C","t":"w3"},{"l":"D","t":"w4"},{"l":"E","t":"w5"}]}], "explain":"PIVOT WORD: [word]. This signals [contrast/continuation]. B is correct because [link between clue and word's definition]. | A wrong: [this word means X which doesn't fit because...] | C wrong: ... | D wrong: ... | E wrong: ..."}

Format — double blank:
{"id":N, "stem":"sentence with [B1] and [B2]", "blanks":[{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"w1"},{"l":"B","t":"w2"},{"l":"C","t":"w3"}]},{"label":"Blank 2","answer":"E","opts":[{"l":"D","t":"w4"},{"l":"E","t":"w5"},{"l":"F","t":"w6"}]}], "explain":"BLANK 1 EVIDENCE: [quote from stem]. B is correct because... A wrong: ... C wrong: ... | BLANK 2 EVIDENCE: [quote from stem]. E is correct because... D wrong: ... F wrong: ..."}

━━━ SECTION 3: SENTENCE EQUIVALENCE (3 questions) ━━━
Use ONLY Day ${dayNum} words. All 6 options must come from today's word list.
Difficulty: Q1=easy, Q2=medium, Q3=hard

${SE_RULES}

Format:
{"id":N, "stem":"sentence with _______", "answers":["C","D"], "opts":[{"l":"A","t":"w1"},{"l":"B","t":"w2"},{"l":"C","t":"w3"},{"l":"D","t":"w4"},{"l":"E","t":"w5"},{"l":"F","t":"w6"}], "explain":"Correct pair: C and D. MEANING TEST: 'C' produces [sentence meaning X]. 'D' produces [same meaning X]. They are equivalent because [shared semantic property]. | A wrong: grammatically fits but changes meaning to [Y] because [A means...]. | B wrong: ... | E wrong: ... | F wrong: ..."}

━━━ SECTION 4: READING COMPREHENSION (1 passage, 3 questions) ━━━
${RC_RULES}

Write ONE academic passage (90-110 words) on a topic from: evolutionary biology, literary modernism, behavioral economics, Renaissance art, Enlightenment philosophy, or cognitive psychology.
The passage must take a CLEAR POSITION or present a DISCERNIBLE TENSION between two views.
Follow with exactly 3 questions: main idea/purpose, inference, vocabulary-in-context.

Format:
{"id":1, "passage":"Full passage text...", "topic":"Topic label", "questions":[{"id":1,"q":"Question text","answer":"A","opts":[{"l":"A","t":"opt"},{"l":"B","t":"opt"},{"l":"C","t":"opt"},{"l":"D","t":"opt"}],"explain":"A is correct: [why this matches passage]. B wrong: [too narrow/too broad/contradicts passage — quote evidence]. C wrong: [explains misconception]. D wrong: [explains misconception]."}]}

━━━ RETURN EXACTLY THIS JSON STRUCTURE ━━━
{
  "vic": [5 items],
  "tc": [4 items],
  "se": [3 items],
  "rc": [1 item with 3 questions]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const clean = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseErr) {
      console.error('JSON parse failed. Length:', clean.length, 'Last 100 chars:', clean.substring(clean.length - 100));
      return res.status(500).json({ error: 'AI returned incomplete response. Try again.' });
    }

    if (!parsed.vic || !parsed.tc || !parsed.se) {
      return res.status(500).json({ error: 'AI response missing required sections.' });
    }

    res.json(parsed);
  } catch (error) {
    console.error('Generation error:', error.message);
    let msg = error.message || 'Failed to generate questions';
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      msg = 'API rate limit reached. Please wait 30 seconds and try again.';
      return res.status(429).json({ error: msg });
    }
    res.status(500).json({ error: msg });
  }
});

// ─── QUANT PRACTICE ENDPOINT ───────────────────────────────────────────────────
app.post('/api/quant-generate', async (req, res) => {
  try {
    const { topicId, topicLabel, subtopics, weakAreas } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const weakNote = weakAreas?.length
      ? `\nWEAK AREAS — MANDATORY FOCUS: The student consistently fails on: ${weakAreas.join(', ')}. At least 3 of your 10 questions must directly target these weak areas, and the explanations for those questions must identify the exact conceptual error the student likely made.`
      : '';

    const systemPrompt = `You are a senior ETS psychometrician who has designed GRE Quantitative Reasoning sections for 15 years.

Your questions must meet these GRE Quant standards:
1. Every problem is mathematically unambiguous — one correct answer, derivable by calculation alone
2. Quantitative Comparison questions follow EXACT GRE format — the 4 answer choices are ALWAYS:
   A = "Quantity A is greater"
   B = "Quantity B is greater"  
   C = "The two quantities are equal"
   D = "The relationship cannot be determined from the information given"
   Never deviate from these exact answer descriptions.
3. Include authentic GRE traps: assuming variables are positive when not stated, forgetting special cases (0, negatives, fractions), order-of-operations errors, units mismatches
4. Numeric Entry answers must be single numbers (integer, fraction as decimal, or negative)
5. Step-by-step explanations must identify the specific trap a test-taker would fall into

GRE QUANT DIFFICULTY CALIBRATION:
- Easy (130-150 range): direct computation, clearly stated formula, no hidden cases
- Medium (151-160 range): requires 2-3 steps, one non-obvious setup, may involve word problem translation
- Hard (161-170 range): requires insight or non-obvious algebraic manipulation, involves a trap or special case most students miss

TOPIC-SPECIFIC TRAP LIBRARY:
- Arithmetic: percent vs percentage points, ratio ≠ fraction of total, LCM/GCF confusion
- Algebra: exponent rules (negative bases), absolute value removing sign, quadratic having two solutions
- Geometry: similar ≠ congruent, perimeter vs area confusion, 3D volume vs surface area, diagonal formulas
- Data Analysis: mean vs median vs mode in skewed distributions, probability of "at least one" vs complement method, counting with repetition vs without`;

    const userPrompt = `Generate 10 GRE Quantitative Reasoning practice questions for topic: "${topicLabel}"
Subtopics to cover: ${subtopics.join(', ')}
${weakNote}

━━━ SECTION 1: QUANTITATIVE COMPARISON — 5 questions ━━━

GRE QC FORMAT RULES:
- Quantity A is always labeled "Quantity A", Quantity B is always labeled "Quantity B"
- The "info" field contains any constraints given ABOVE both quantities (e.g., "x > 0", "n is a positive integer", "The circle has radius r")
- If no constraint is given, "info" is an empty string ""
- The answer key is ALWAYS from: "A" (Qty A greater), "B" (Qty B greater), "C" (Equal), "D" (Cannot determine)
- Difficulty: Q1=easy, Q2=easy, Q3=medium, Q4=medium, Q5=hard
- MANDATORY: At least 1 question must have answer "D" (Cannot determine) — this is a classic GRE trap
- MANDATORY: At least 1 QC must involve algebra (not just arithmetic)
- For "D" answers: the key insight must be that the answer CHANGES depending on what value(s) the variable takes — show two different values in the explanation that produce different orderings

Format:
{"id":N, "qtyA":"expression or value", "qtyB":"expression or value", "info":"constraint or empty string", "answer":"A", "explain":"APPROACH: [strategy]. CALCULATION: [step-by-step]. RESULT: Qty A = [value], Qty B = [value], therefore A is greater. TRAP: Students often [common mistake] which gives the wrong answer [X]. KEY INSIGHT: [what makes this question hard/interesting]."}

━━━ SECTION 2: MULTIPLE CHOICE (SINGLE ANSWER) — 3 questions ━━━

Requirements:
- Q6: Medium difficulty word problem requiring translation into algebra
- Q7: Medium difficulty involving geometry or data interpretation  
- Q8: Hard difficulty — requires non-obvious approach or recognizing a trap
- 5 options A-E, exactly 1 correct
- Wrong answers must be the RESULTS of specific errors: wrong answer A = what you get if you forget to [X], wrong answer B = what you get if you [Y mistake], etc.

Format:
{"id":N, "q":"Full question with all given information. If a diagram is implied, describe it in text.", "opts":[{"l":"A","t":"value or expression"},{"l":"B","t":"value or expression"},{"l":"C","t":"value or expression"},{"l":"D","t":"value or expression"},{"l":"E","t":"value or expression"}], "answer":"B", "explain":"SETUP: [how to frame the problem]. SOLUTION: Step 1: [calculation]. Step 2: [calculation]. Step 3: [final result = B]. | A wrong: This is the result if you [specific error — e.g., use diameter instead of radius]. | C wrong: This is the result if you [specific error]. | D wrong: [specific error]. | E wrong: [specific error]."}

━━━ SECTION 3: NUMERIC ENTRY — 2 questions ━━━

Requirements:
- Q9: Medium difficulty — a clean integer answer
- Q10: Hard difficulty — may result in a decimal, fraction, or negative number
- The question must be completely self-contained (no diagrams needed)
- Answer field must be a string representing the exact numeric answer

Format:
{"id":N, "q":"Full self-contained question text. Include ALL necessary information.", "answer":"42", "explain":"SETUP: [restate what is being solved]. STEP 1: [calculation]. STEP 2: [calculation]. FINAL ANSWER: [value]. TRAP: A common error is to [mistake], which gives [wrong value] instead."}

━━━ RETURN EXACTLY THIS JSON STRUCTURE ━━━
{
  "qc": [5 items],
  "mc": [3 items],
  "ne": [2 items]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.65,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned incomplete response. Try again.' }); }

    if (!parsed.qc || !parsed.mc || !parsed.ne) {
      return res.status(500).json({ error: 'Quant response missing required sections.' });
    }
    res.json(parsed);
  } catch (error) {
    console.error('Quant generate error:', error.message);
    let msg = error.message;
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED'))
      return res.status(429).json({ error: 'API rate limit. Wait 30 seconds.' });
    res.status(500).json({ error: msg });
  }
});

// ─── QUANT MOCK EXAM ENDPOINT ──────────────────────────────────────────────────
app.post('/api/quant-mock', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const systemPrompt = `You are a senior ETS psychometrician designing a complete GRE Quantitative Reasoning section.

This is a FULL MOCK EXAM section. It must faithfully reproduce the real GRE Quant experience:
- Difficulty follows a bell curve: roughly 6 easy, 8 medium, 6 hard questions
- Topics are balanced: Arithmetic (25%), Algebra (25%), Geometry (25%), Data Analysis (25%)
- QC answer choices are ALWAYS and ONLY: A/B/C/D meaning Qty A greater/Qty B greater/Equal/Cannot determine
- Every answer must be 100% mathematically verifiable
- Include the full range of real GRE traps: variable sign assumptions, percent vs percentage point, special values (0, 1, negatives, fractions)
- Data Analysis questions should reference a described table, chart, or probability scenario (described in text)
- The 20 questions should feel like a coherent exam section, not a random collection`;

    const userPrompt = `Generate a complete GRE Quantitative Reasoning section — 20 questions total.

The section must exactly reproduce a real GRE Quant section:
- Time: 35 minutes for 20 questions (approximately 1:45 per question)
- Topic distribution: 5 Arithmetic, 5 Algebra, 5 Geometry, 5 Data Analysis
- Difficulty distribution: 6 easy (ids 1-6), 9 medium (ids 7-15), 5 hard (ids 16-20)

━━━ SECTION 1: QUANTITATIVE COMPARISON — 8 questions (ids 1-8) ━━━
- QC answers are ALWAYS one of: "A" (Qty A greater), "B" (Qty B greater), "C" (Equal), "D" (Cannot determine)
- Distribution: 2 Arithmetic, 2 Algebra, 2 Geometry, 2 Data Analysis
- Difficulty: ids 1-3 easy, ids 4-6 medium, ids 7-8 hard
- REQUIRED: At least 2 questions with answer "D" — these must test whether students know to try multiple values
- REQUIRED: At least 1 QC with an algebraic expression where the ordering depends on whether the variable is positive/negative/zero

Format: {"id":N, "qtyA":"...", "qtyB":"...", "info":"constraint above quantities (or empty string)", "answer":"A", "topic":"Arithmetic", "explain":"Full step-by-step with trap identification."}

━━━ SECTION 2: MULTIPLE CHOICE SINGLE ANSWER — 7 questions (ids 9-15) ━━━
- 5 options A-E, exactly 1 correct
- Distribution: mix of all four topics
- Difficulty: ids 9-11 medium, ids 12-15 hard
- REQUIRED: At least 1 word problem that must be translated into algebra
- REQUIRED: At least 1 data interpretation question (reference a described table or chart)
- REQUIRED: At least 1 geometry question involving area, volume, or coordinate geometry
- Wrong answers must be results of specific, identifiable errors

Format: {"id":N, "q":"Complete question", "opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}], "answer":"C", "topic":"Algebra", "explain":"Full step-by-step solution with wrong-answer error analysis."}

━━━ SECTION 3: MULTIPLE CHOICE MULTIPLE ANSWER — 2 questions (ids 16-17) ━━━
- "Select ALL that apply" format
- Between 3 and 5 options (labeled A, B, C or A, B, C, D, E)
- Between 1 and all options may be correct (minimum 1, state all correct answers in "answers" array)
- These questions are hard — difficulty 161-170 range
- Wrong options should be tempting but wrong for specific mathematical reasons

Format: {"id":N, "q":"Question text. Select ALL that apply.", "opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."}], "answers":["A","C"], "topic":"Data", "explain":"A correct: [reason]. B wrong: [reason]. C correct: [reason]."}

━━━ SECTION 4: NUMERIC ENTRY — 3 questions (ids 18-20) ━━━
- Student types the answer — no options given
- Include: 1 integer answer, 1 decimal/fraction answer, 1 negative number answer
- These are hard (difficulty 158-170 range)
- The question must be 100% self-contained and unambiguous

Format: {"id":N, "q":"Complete self-contained question.", "answer":"15", "topic":"Geometry", "explain":"Complete step-by-step solution identifying the key insight and common errors."}

━━━ RETURN EXACTLY THIS JSON STRUCTURE ━━━
{
  "qc": [8 items],
  "mc": [7 items],
  "mcm": [2 items],
  "ne": [3 items]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.65,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned incomplete response. Try again.' }); }

    if (!parsed.qc || !parsed.mc || !parsed.ne) {
      return res.status(500).json({ error: 'Quant mock missing required sections.' });
    }
    res.json(parsed);
  } catch (error) {
    console.error('Quant mock error:', error.message);
    let msg = error.message;
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED'))
      return res.status(429).json({ error: 'API rate limit. Wait 30 seconds.' });
    res.status(500).json({ error: msg });
  }
});

// ─── CHAT ENDPOINT (AI TUTOR) ──────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const defaultSystemPrompt = `You are an expert GRE tutor with deep knowledge of both Verbal and Quantitative sections.

Your tutoring style:
- Diagnose the SPECIFIC error pattern behind wrong answers, not just what the right answer is
- Use memorable rules: "Pivot words signal contrast," "SE needs 2 words that produce sentences alike in meaning"
- Teach word roots when explaining vocabulary (e.g., "EXCORIATE: ex=out + corium=skin = to strip skin off")
- For Quant, always show the most efficient solution path AND the common trap the question is designed to exploit
- Be direct and specific — never hedge with "it depends" without explaining what it depends on
- When a student is confused between two words, give a one-line separator they can memorize (e.g., "TACITURN = personality trait. RETICENT = guarded about a specific topic")
- Keep explanations concise — 3-5 sentences maximum per concept`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt || defaultSystemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });
    res.json({ response: response.text || 'No response generated.' });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── MOCK EXAM ENDPOINT ────────────────────────────────────────────────────────
app.post('/api/mock-exam', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const systemPrompt = `You are a senior ETS question developer creating a real GRE Verbal Reasoning section.

This section will be used as a timed practice exam. It must be indistinguishable from an actual GRE Verbal section.

SECTION STANDARDS:
- 20 questions, 30 minutes
- Difficulty follows natural GRE distribution: approximately 6 easy (130-149), 9 medium (150-159), 5 hard (160-170)
- All vocabulary is GRE-level — not limited to any word list
- Academic register throughout — no casual language, no pop culture, no first-person

${GRE_VERBAL_REGISTER}
${TC_RULES}
${SE_RULES}
${RC_RULES}

ADDITIONAL MOCK EXAM STANDARDS:
- Questions should feel like they come from different academic domains — vary topics across questions
- TC stems should represent different sentence structures: complex-compound, periodic, cumulative
- RC passages should come from genuinely different disciplines (one from sciences, one from humanities)
- The section as a whole should assess a range of verbal skills, not just vocabulary
- Hard questions (ids approaching 20) should require careful re-reading and precise word knowledge`;

    const userPrompt = `Generate a complete GRE Verbal Reasoning mock exam section — 20 scorable items.

This is a timed exam simulation. Use ANY GRE-level vocabulary — not limited to any study list.

━━━ SECTION STRUCTURE ━━━
The 20 items are numbered sequentially. Build difficulty gradually:
- Items 1-2: Easy TC single-blank
- Items 3-4: Easy-Medium TC single-blank
- Items 5-6: Medium SE
- Item 7: Hard TC double-blank
- Items 8-9: RC from Passage 1 (2 questions)
- Item 10: Medium SE
- Item 11: Hard TC double-blank or triple-blank (your choice of [B1][B2] or [B1][B2][B3])
- Items 12-14: RC from Passage 2 (3 questions)
- Item 15: Hard SE
- Item 16: Hard TC single-blank (hardest TC vocabulary)
- Items 17-18: RC from Passage 3 (2 questions — inference + vocab in context)
- Items 19-20: Hard SE (these are the hardest items in the section)

━━━ TEXT COMPLETION RULES ━━━
${TC_RULES}

Difficulty examples for reference:
EASY: "The professor, though renowned for her _______ lectures, surprised students who met her privately with her warmth and accessibility." → (A) abstruse (B) stimulating (C) celebrated (D) lucid (E) conventional
HARD: "The historian's account, while _______  in its command of primary sources, was nonetheless criticized for the _______ reasoning that connected them, as though sheer accumulation of evidence could substitute for analytical rigor." → B1: (A) prodigal (B) meticulous (C) cursory) / B2: (D) irrefutable (E) tendentious (F) cogent)

━━━ SENTENCE EQUIVALENCE RULES ━━━
${SE_RULES}

━━━ READING COMPREHENSION RULES ━━━
${RC_RULES}

PASSAGE REQUIREMENTS:
- Passage 1 (2 questions): 80-90 words, natural sciences or social sciences topic
- Passage 2 (3 questions): 100-120 words, humanities topic (literary criticism, art history, philosophy)
- Passage 3 (2 questions): 90-100 words, any academic topic — must contain a word used in an unusual or technical sense (for vocab-in-context question)

━━━ RETURN EXACTLY THIS JSON STRUCTURE (no other text) ━━━
{
  "tc": [
    {
      "id": 1,
      "stem": "sentence with [B1] marker (and [B2] for double-blank)",
      "blanks": [{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"word"},{"l":"B","t":"word"},{"l":"C","t":"word"},{"l":"D","t":"word"},{"l":"E","t":"word"}]}],
      "explain": "PIVOT/CLUE: [identify signal word or definitional clue]. B is correct because [link between clue and definition]. | A wrong: [specific reason]. | C wrong: ... | D wrong: ... | E wrong: ..."
    }
  ],
  "se": [
    {
      "id": 6,
      "stem": "sentence with _______ blank",
      "answers": ["C","E"],
      "opts": [{"l":"A","t":"word"},{"l":"B","t":"word"},{"l":"C","t":"word"},{"l":"D","t":"word"},{"l":"E","t":"word"},{"l":"F","t":"word"}],
      "explain": "C and E both convey [shared meaning]. MEANING TEST: With C: [sentence meaning]. With E: [same meaning]. | A wrong: fits grammatically but changes meaning to [X]. | B wrong: ... | D wrong: ... | F wrong: ..."
    }
  ],
  "rc": [
    {
      "id": 1,
      "passage": "Full academic passage...",
      "topic": "Brief topic label (e.g., 'Evolutionary Biology', 'Modernist Literature')",
      "questions": [
        {
          "id": 1,
          "q": "Full question text",
          "answer": "A",
          "opts": [{"l":"A","t":"option text"},{"l":"B","t":"option text"},{"l":"C","t":"option text"},{"l":"D","t":"option text"}],
          "explain": "A is correct: [evidence from passage + reasoning]. B wrong: [too narrow/broad/opposite — cite passage]. C wrong: [specific reason]. D wrong: [specific reason]."
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.78,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const clean = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseErr) {
      console.error('Mock exam JSON parse failed. Length:', clean.length);
      return res.status(500).json({ error: 'AI returned incomplete response. Try again.' });
    }

    if (!parsed.tc || !parsed.se || !parsed.rc) {
      return res.status(500).json({ error: 'Mock exam missing required sections.' });
    }

    res.json(parsed);
  } catch (error) {
    console.error('Mock exam error:', error.message);
    let msg = error.message || 'Failed to generate mock exam';
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'API rate limit. Wait 30 seconds.' });
    }
    res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`\n  🤖 GRE Complete API on http://localhost:${PORT}`);
  console.log(`  📡 POST /api/generate       — Verbal practice (adaptive)`);
  console.log(`  🎯 POST /api/mock-exam      — Verbal mock (full section)`);
  console.log(`  🔢 POST /api/quant-generate — Quant practice (topic-based)`);
  console.log(`  🧮 POST /api/quant-mock     — Quant mock (full section)`);
  console.log(`  💬 POST /api/chat           — AI tutor\n`);
});