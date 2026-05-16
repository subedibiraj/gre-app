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

// ─── QUESTION GENERATION ENDPOINT ─────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  try {
    const { dayNum, theme, currentWords, allWords, weakWords, scores } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const bankLines = allWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');
    const weakNote = weakWords?.length
      ? `\n\nIMPORTANT — These words the student consistently gets WRONG. Weight them heavily:\n${weakWords.slice(0,12).join(', ')}`
      : '';
    const scoreNote = scores
      ? `\nPrevious session scores: ${JSON.stringify(scores)}`
      : '';

    const systemPrompt = `You are an elite GRE Verbal question writer with 15+ years of experience creating official ETS-quality questions. You produce questions indistinguishable from real GRE items.

ABSOLUTE RULES — VIOLATION OF ANY RULE INVALIDATES YOUR OUTPUT:
1. Return ONLY valid JSON. No markdown fences, no backticks, no commentary outside the JSON object.
2. Use ONLY words from the provided word bank. Never invent words not in the bank.
3. Never use the answer word in the question stem or context clue.
4. Every question must have exactly ONE unambiguous correct answer derivable from the stem alone.
5. TC stems must contain a clear pivot word (despite, although, yet, however, while, surprisingly, nevertheless) OR a clear definitional clue that points to exactly one answer.
6. SE pairs must produce sentences that are alike in meaning — not just both grammatically correct.
7. Distractors must be plausible but clearly wrong upon careful analysis.
8. CONFUSABLE PAIRS: When building distractors, deliberately include words that students commonly confuse (e.g., DEPRECATE vs DEPRECIATE, DISINTERESTED vs UNINTERESTED, ENORMITY vs ENORMOUSNESS). This tests precision.

QUALITY STANDARDS:
- Write stems that feel like actual GRE passages — sophisticated syntax, academic register
- Vary sentence structures: some with subordinate clauses, some with appositives, some with parallel construction
- Include cross-day words as distractors to test cumulative knowledge
- Mix difficulty: 2 easy, 3 medium, 2 hard for drill; 1 easy, 1 medium, 1 hard for TC
- For weak words: create questions that test the EXACT nuance the student likely confused`;

    const currentWordsList = currentWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');

    const userPrompt = `Generate adaptive GRE Verbal practice for Day ${dayNum}: "${theme}"

═══ SECTION 1: VOCABULARY IN CONTEXT (current day words) ═══
For each word below, write a sophisticated sentence USING the word, then provide 4 options for what the word means IN THAT CONTEXT. Only 1 correct answer.
Use ONLY these Day ${dayNum} words:
${currentWordsList}
${weakNote}
${scoreNote}

═══ SECTION 2: TEXT COMPLETION (current day words ONLY) ═══
Word pool for TC: Use ONLY these Day ${dayNum} words as correct answers and distractors.
${currentWordsList}

═══ SECTION 3: SENTENCE EQUIVALENCE (current day words ONLY) ═══
Word pool for SE: Use ONLY Day ${dayNum} words. The 2 correct answers must be from today's word list.
${currentWordsList}

═══ SECTION 4: READING COMPREHENSION (any vocabulary) ═══
Write 1 short academic passage (80-120 words) on any topic (science, humanities, social science, arts).
Then create 3 questions testing: main idea, inference, and vocabulary in context.
Use GRE-level vocabulary (NOT limited to today's words).

═══ GENERATION REQUIREMENTS ═══
• 5 vocabulary-in-context questions — Day ${dayNum} words ONLY, each tests a DIFFERENT word
• 4 text completion questions — Day ${dayNum} words ONLY (2 easy single-blank, 1 medium single-blank, 1 hard double-blank)
• 3 sentence equivalence questions — Day ${dayNum} words ONLY (select exactly 2 synonymous answers from 6 options)
• 1 reading comprehension passage with 3 questions — ANY GRE vocabulary

═══ EXPLANATION FORMAT (CRITICAL) ═══
Every "explain" field MUST include:
1. Why the correct answer is right
2. Why EACH wrong answer is wrong (e.g., "A is wrong because 'verbose' implies excessive length, but the passage describes brevity")
This is the #1 learning tool for 165+ scorers. Do NOT skip wrong-answer analysis.

FORMAT RULES:
- VIC: {"id":N, "word":"WORD", "sentence":"sentence using WORD", "answer":"B", "opts":[{"l":"A","t":"meaning1"},{"l":"B","t":"meaning2"},{"l":"C","t":"meaning3"},{"l":"D","t":"meaning4"}], "explain":"Correct: B because... | A wrong: ... | C wrong: ... | D wrong: ..."}
- TC single-blank: use [B1] marker in stem, provide 5 options A-E
- TC double-blank: use [B1] and [B2] markers in stem, provide A-C for blank 1, D-F for blank 2
- SE: provide 6 options A-F, exactly 2 correct that produce equivalent meaning
- RC: passage text + 3 questions with 4 options A-D each
- ALL explain fields must include wrong-answer analysis

Return this EXACT JSON structure (no other text):
{
  "vic": [
    {"id": 1, "word": "WORD", "sentence": "...", "answer": "B", "opts": [{"l":"A","t":"m1"},{"l":"B","t":"m2"},{"l":"C","t":"m3"},{"l":"D","t":"m4"}], "explain": "Correct: B... | A wrong: ... | C wrong: ... | D wrong: ..."}
  ],
  "tc": [
    {
      "id": 1,
      "stem": "sentence with [B1] marker",
      "blanks": [{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"w1"},{"l":"B","t":"w2"},{"l":"C","t":"w3"},{"l":"D","t":"w4"},{"l":"E","t":"w5"}]}],
      "explain": "Correct: B because... | A wrong: ... | C wrong: ... | D wrong: ... | E wrong: ..."
    }
  ],
  "se": [
    {
      "id": 1,
      "stem": "sentence with _______ blank",
      "answers": ["C","D"],
      "opts": [{"l":"A","t":"w1"},{"l":"B","t":"w2"},{"l":"C","t":"w3"},{"l":"D","t":"w4"},{"l":"E","t":"w5"},{"l":"F","t":"w6"}],
      "explain": "C and D both mean X. | A wrong: ... | B wrong: ... | E wrong: ... | F wrong: ..."
    }
  ],
  "rc": [
    {
      "id": 1,
      "passage": "Full academic passage...",
      "topic": "Topic label",
      "questions": [
        {"id": 1, "q": "Question", "answer": "A", "opts": [{"l":"A","t":"opt1"},{"l":"B","t":"opt2"},{"l":"C","t":"opt3"},{"l":"D","t":"opt4"}], "explain": "A is correct because... | B wrong: ... | C wrong: ... | D wrong: ..."}
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
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
      console.error('Full response:', clean.substring(0, 500));
      return res.status(500).json({ error: 'AI returned incomplete response. Try again.' });
    }

    // Validate structure
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

// ─── QUANT PRACTICE ENDPOINT ──────────────────────────────────────────────────
app.post('/api/quant-generate', async (req, res) => {
  try {
    const { topicId, topicLabel, subtopics, weakAreas } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const weakNote = weakAreas?.length ? `\nThe student struggles with: ${weakAreas.join(', ')}. Generate harder questions on these.` : '';

    const systemPrompt = `You are an expert GRE Quantitative Reasoning question writer.
Create questions that are mathematically precise and unambiguous.
Every answer must be numerically verifiable.
Use GRE-standard difficulty: mix of easy, medium, and hard.
Include common GRE traps (sign errors, edge cases, assuming positive values).
All explanations must show complete step-by-step solutions.`;

    const userPrompt = `Generate GRE Quant practice for topic: ${topicLabel}
Subtopics: ${subtopics.join(', ')}
${weakNote}

═══ GENERATE THESE SECTIONS ═══

1. QUANTITATIVE COMPARISON (5 questions)
   - Show Quantity A and Quantity B
   - Answer is always one of: "A","B","C","D" where A=Qty A greater, B=Qty B greater, C=Equal, D=Cannot determine
   - Mix difficulties: 2 easy, 2 medium, 1 hard
   - At least 1 question should have "D" (Cannot determine) as answer

2. MULTIPLE CHOICE — SINGLE ANSWER (3 questions)
   - Standard problem with 5 options A-E, exactly 1 correct
   - Include word problems and pure computation

3. NUMERIC ENTRY (2 questions)
   - Student types the numeric answer (integer or decimal)
   - Provide answer as a number (e.g., 42, 3.5, -7)

═══ EXPLANATION FORMAT (CRITICAL) ═══
Every "explain" field MUST show:
1. Complete step-by-step solution
2. Why the correct answer is right
3. Common mistakes to avoid

Return this EXACT JSON (no other text):
{
  "qc": [
    {"id":1, "qtyA":"expression or description", "qtyB":"expression or description", "info":"any given information or constraints (optional, can be empty string)", "answer":"A", "explain":"Step 1:... Step 2:... Therefore Qty A > Qty B. Common trap: ..."}
  ],
  "mc": [
    {"id":1, "q":"question text", "opts":[{"l":"A","t":"option"},{"l":"B","t":"option"},{"l":"C","t":"option"},{"l":"D","t":"option"},{"l":"E","t":"option"}], "answer":"B", "explain":"Step 1:... The answer is B because..."}
  ],
  "ne": [
    {"id":1, "q":"question text", "answer":"42", "explain":"Step 1:... The answer is 42."}
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
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

// ─── QUANT MOCK EXAM ENDPOINT ─────────────────────────────────────────────────
app.post('/api/quant-mock', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const systemPrompt = `You are an expert GRE Quantitative Reasoning question writer for ETS.
Create a complete Quant section matching real GRE difficulty and distribution.
Questions must be mathematically precise with unambiguous answers.
Cover all 4 topics: Arithmetic, Algebra, Geometry, Data Analysis.
Include GRE traps and edge cases.`;

    const userPrompt = `Generate a COMPLETE GRE Quantitative Reasoning section — 20 questions total.

═══ SECTION BREAKDOWN ═══
1. QUANTITATIVE COMPARISON: 8 questions (2 Arithmetic, 2 Algebra, 2 Geometry, 2 Data)
2. MULTIPLE CHOICE SINGLE: 7 questions (mix of all topics, 5 options A-E each)
3. MULTIPLE CHOICE MULTI: 2 questions (3-5 options, "select ALL that apply", specify all correct)
4. NUMERIC ENTRY: 3 questions (type the answer)

Time limit: 35 minutes (shown to user)

Return EXACT JSON:
{
  "qc": [
    {"id":1, "qtyA":"...", "qtyB":"...", "info":"given info", "answer":"A", "topic":"Arithmetic", "explain":"..."}
  ],
  "mc": [
    {"id":9, "q":"...", "opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}], "answer":"C", "topic":"Algebra", "explain":"..."}
  ],
  "mcm": [
    {"id":16, "q":"... Select ALL that apply.", "opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."}], "answers":["A","C"], "topic":"Data", "explain":"..."}
  ],
  "ne": [
    {"id":18, "q":"...", "answer":"15", "topic":"Geometry", "explain":"..."}
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
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

// ─── CHAT ENDPOINT (AI TUTOR) ─────────────────────────────────────────────────
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt || 'You are a helpful GRE tutor.',
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

// ─── MOCK EXAM ENDPOINT ───────────────────────────────────────────────────────
app.post('/api/mock-exam', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured in .env' });
    }

    const systemPrompt = `You are an expert GRE Verbal question writer for ETS.
You create questions indistinguishable from real GRE questions.
Use sophisticated, academic-register vocabulary and varied sentence structures.
Every question must have exactly ONE unambiguous correct answer.
TC stems must contain clear pivot words or definitional clues.
SE pairs must produce sentences alike in meaning.
RC passages should be 80-120 words, drawn from academic topics (science, humanities, social science).
RC questions should test: main idea, inference, author's purpose, vocabulary in context, or logical structure.`;

    const userPrompt = `Generate a COMPLETE GRE Verbal Reasoning section — 20 questions total.

Use ANY GRE-level vocabulary. Do NOT limit to any specific word list. This is a real mock exam.

═══ SECTION BREAKDOWN ═══

1. TEXT COMPLETION: 6 questions
   - Q1-Q2: Single-blank (easy) — 5 options A-E
   - Q3-Q4: Single-blank (medium) — 5 options A-E
   - Q5: Double-blank (hard) — [B1] and [B2], options A-C for blank 1, D-F for blank 2
   - Q6: Triple-blank (hard) — [B1], [B2], [B3], options A-C for each blank

2. SENTENCE EQUIVALENCE: 4 questions
   - Q7-Q10: 6 options A-F, exactly 2 correct that create equivalent meaning

3. READING COMPREHENSION: 2 passages with questions
   - Passage 1: 80-100 word academic passage + 3 multiple-choice questions (4 options A-D each)
   - Passage 2: 100-120 word academic passage + 2 multiple-choice questions (4 options A-D each)

Total: 6 TC + 4 SE + 5 RC = 15 scored items (but presented as 20 interaction points)

═══ FORMAT ═══

Return EXACT JSON:
{
  "tc": [
    {
      "id": 1,
      "stem": "sentence with [B1] marker",
      "blanks": [{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"word"},{"l":"B","t":"word"},{"l":"C","t":"word"},{"l":"D","t":"word"},{"l":"E","t":"word"}]}],
      "explain": "The pivot word X signals..."
    }
  ],
  "se": [
    {
      "id": 7,
      "stem": "sentence with _______ blank",
      "answers": ["C","E"],
      "opts": [{"l":"A","t":"word"},{"l":"B","t":"word"},{"l":"C","t":"word"},{"l":"D","t":"word"},{"l":"E","t":"word"},{"l":"F","t":"word"}],
      "explain": "Both X and Y mean..."
    }
  ],
  "rc": [
    {
      "id": 1,
      "passage": "Full academic passage text here...",
      "topic": "Brief topic label",
      "questions": [
        {
          "id": 1,
          "q": "Question text",
          "answer": "A",
          "opts": [{"l":"A","t":"option1"},{"l":"B","t":"option2"},{"l":"C","t":"option3"},{"l":"D","t":"option4"}],
          "explain": "Explanation..."
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
        temperature: 0.8,
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
  console.log(`  📡 POST /api/generate       — Verbal practice`);
  console.log(`  🎯 POST /api/mock-exam      — Verbal mock`);
  console.log(`  🔢 POST /api/quant-generate — Quant practice`);
  console.log(`  🧮 POST /api/quant-mock     — Quant mock`);
  console.log(`  💬 POST /api/chat           — AI tutor\n`);
});

