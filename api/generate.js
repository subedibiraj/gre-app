import { GoogleGenAI } from '@google/genai';
import {
  getGeminiKey, GRE_VERBAL_REGISTER, getDifficultyRules,
  TC_RULES, SE_RULES, RC_RULES, EXPLANATION_FORMAT
} from './_prompts.js';
import { verifyProStatus } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = getGeminiKey(req);
    if (!apiKey) {
      return res.status(400).json({ error: 'No Gemini API key configured.' });
    }

    const isAuthorized = await verifyProStatus(req);
    if (!isAuthorized) {
      return res.status(402).json({ error: 'Payment Required: This feature requires a Pro subscription.' });
    }

    const {
      dayNum, theme, currentWords, allWords,
      weakWords = [], profile = null,
    } = req.body;

    const ai = new GoogleGenAI({ apiKey });

    // ── Compute difficulty from profile ──────────────────────────────────────
    const overallLevel = profile?.verbal?.overall?.level || 2;
    const vicLevel     = profile?.verbal?.vic?.level     || 2;
    const tcLevel      = profile?.verbal?.tc?.level      || 2;
    const seLevel      = profile?.verbal?.se?.level      || 2;
    const rcLevel      = profile?.verbal?.rc?.level      || 2;

    // TC distribution by difficulty
    const tcDist = {
      1: { easy: 3, medium: 1, hard: 0 },
      2: { easy: 2, medium: 2, hard: 0 },
      3: { easy: 1, medium: 2, hard: 1 },
      4: { easy: 0, medium: 2, hard: 2 },
      5: { easy: 0, medium: 1, hard: 3 },
    }[tcLevel] || { easy: 1, medium: 2, hard: 1 };

    const rcLength = { 1: 150, 2: 200, 3: 260, 4: 320, 5: 380 }[rcLevel] || 220;

    // ── Word bank ─────────────────────────────────────────────────────────────
    const wordLines = currentWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');
    const allLines  = allWords.slice(0, 80).map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');

    // ── Weak word priority ────────────────────────────────────────────────────
    const weakNote = weakWords.length > 0
      ? `\nPRIORITY — WEAK WORDS (include ≥3 of these across all sections):\n${weakWords.slice(0, 10).join(', ')}`
      : '';

    // ── Profile note ──────────────────────────────────────────────────────────
    const profileNote = profile ? `
STUDENT PERFORMANCE PROFILE:
• VIC accuracy:  ${profile.verbal.vic?.acc ?? 'unknown'}% → Level ${vicLevel}/5
• TC accuracy:   ${profile.verbal.tc?.acc  ?? 'unknown'}% → Level ${tcLevel}/5
• SE accuracy:   ${profile.verbal.se?.acc  ?? 'unknown'}% → Level ${seLevel}/5
• RC accuracy:   ${profile.verbal.rc?.acc  ?? 'unknown'}% → Level ${rcLevel}/5

CALIBRATION INSTRUCTIONS:
${vicLevel <= 2 ? '• VIC: Use clear context sentences, common definitions, avoid near-synonyms as distractors.' : vicLevel >= 4 ? '• VIC: Use subtle contextual meanings, rare senses of known words, near-synonym distractors.' : '• VIC: Standard difficulty — mix common and uncommon senses.'}
${tcLevel <= 2 ? '• TC: Use explicit pivot words, simple vocabulary, only 1 strong distractor.' : tcLevel >= 4 ? '• TC: Abstract academic contexts, no obvious pivot word, 3-4 near-synonym distractors.' : '• TC: Clear pivot words, 2-3 plausible distractors.'}
${seLevel <= 2 ? '• SE: Correct twins are obvious dictionary synonyms. Wrong answers are from different semantic fields.' : seLevel >= 4 ? '• SE: Twins share ONLY contextual meaning (not dictionary synonyms). All distractors same tone as correct.' : '• SE: Twins are clear synonyms. 1-2 same-tone distractors.'}
${rcLevel <= 2 ? `• RC: ${rcLength} words, clear main idea, straightforward main-purpose question.` : rcLevel >= 4 ? `• RC: ${rcLength} words, dense argument, inference + vocabulary-in-context questions.` : `• RC: ${rcLength} words, 2-3 clear questions.`}
` : 'CALIBRATION: Medium difficulty (student has not yet established a baseline).';

    const systemPrompt = `You are a senior ETS question developer with 20 years of experience writing GRE Verbal questions.

ABSOLUTE RULES:
1. Return ONLY valid JSON. Zero text outside the JSON object. Zero markdown.
2. Use ONLY words from the provided word bank for fill-in answers.
3. NEVER include the answer word verbatim in the question stem.
4. Every explanation must follow the required format exactly.
5. Questions must read as if they appeared in an actual GRE test booklet.

${GRE_VERBAL_REGISTER}
${TC_RULES}
${SE_RULES}
${RC_RULES}
${EXPLANATION_FORMAT}`;

    const userPrompt = `Generate a complete adaptive GRE Verbal practice set for Day ${dayNum}: "${theme}"
${profileNote}
${weakNote}

TODAY'S WORD BANK (use for fill-in answers):
${wordLines}

EXTENDED BANK (RC passages only — for realistic academic language):
${allLines}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: VIC — 5 QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getDifficultyRules(vicLevel)}

VIC format — each question is a complete sentence that CONTAINS the target word. The options must be DEFINITIONS or SYNONYM PHRASES.
{
  "id": 1,
  "word": "TACITURN",
  "sentence": "The ambassador, long known for his taciturn demeanor, surprised observers when he delivered a two-hour speech without notes.",
  "answer": "B",
  "opts": [
    {"l":"A","t":"excessively talkative or wordy"},
    {"l":"B","t":"habitually silent or reserved"},
    {"l":"C","t":"pompous and grandiloquent"},
    {"l":"D","t":"shy and lacking self-confidence"},
    {"l":"E","t":"hostile and argumentative"}
  ],
  "explain": "APPROACH: Look at the context clue 'surprised observers when he delivered a two-hour speech'.\nSOLUTION: The word must mean the opposite of delivering long speeches, so 'habitually silent' fits perfectly.\nWHY CORRECT: Taciturn means reserved or saying little.\nWRONG ANSWERS: A is the opposite. C describes the speech, not the demeanor. D is related to shyness, not necessarily silence. E is unrelated."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: TC — 4 QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getDifficultyRules(tcLevel)}

Distribution: ${tcDist.easy} easy, ${tcDist.medium} medium, ${tcDist.hard} hard
Q1-Q${tcDist.easy}: easy single-blank (if 0, skip)
Q${tcDist.easy+1}-Q${tcDist.easy+tcDist.medium}: medium single-blank
Q${tcDist.easy+tcDist.medium+1}-Q4: hard (use double-blank if hard count ≥ 1)

Single-blank format (ids 5-8):
{
  "id": 5,
  "stem": "Although the committee had expected the review process to be [B1], the sheer volume of submissions rendered it unexpectedly protracted.",
  "blanks": [{"label":"Blank 1","answer":"C","opts":[{"l":"A","t":"exhaustive"},{"l":"B","t":"contentious"},{"l":"C","t":"perfunctory"},{"l":"D","t":"meticulous"},{"l":"E","t":"rigorous"}]}],
  "explain": "APPROACH: Pivot word 'although' signals contrast...\nSOLUTION: The committee expected [blank] but got 'protracted' — so the blank must mean quick/cursory.\nWHY CORRECT: Perfunctory = minimal effort, done quickly as routine.\nWRONG ANSWERS: A-exhaustive and D-meticulous and E-rigorous all mean thorough (opposite of the blank). B-contentious means argumentative (irrelevant).\nTRAP: Confusing 'exhaustive review' (thorough) with 'exhausting review' (tiring)."
}

Double-blank format (id 8 if hard):
{
  "id": 8,
  "stem": "The critic's reputation for [B1] was so well established that her occasional lapses into [B2] drew particular notice from those accustomed to her unflinching verdicts.",
  "blanks": [
    {"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"equivocation"},{"l":"B","t":"candor"},{"l":"C","t":"prolixity"}]},
    {"label":"Blank 2","answer":"E","opts":[{"l":"D","t":"perspicacity"},{"l":"E","t":"reticence"},{"l":"F","t":"vehemence"}]}
  ],
  "explain": "APPROACH: Find independent evidence for each blank...\nSOLUTION: 'unflinching verdicts' → Blank 1 must be honesty/directness = candor. 'lapses' contrasting with that → Blank 2 = silence/holding back = reticence.\nWHY CORRECT: Candor (B) + Reticence (E): the critic is usually candid but sometimes holds back.\nWRONG ANSWERS: A-equivocation (deliberately vague) contradicts 'unflinching'. D-perspicacity (keenness) and F-vehemence (intensity) don't contrast with candor.\nTRAP: Reading 'lapses' as a negative and choosing something that sounds bad, without testing each blank independently."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: SE — 3 QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getDifficultyRules(seLevel)}

SE format (ids 9-11):
{
  "id": 9,
  "stem": "The biographer's account of the statesman's early career was surprisingly ___, dwelling on domestic minutiae while barely mentioning the diplomatic negotiations that defined his legacy.",
  "answers": ["C","E"],
  "opts": [
    {"l":"A","t":"incisive"},
    {"l":"B","t":"tendentious"},
    {"l":"C","t":"myopic"},
    {"l":"D","t":"laudatory"},
    {"l":"E","t":"parochial"},
    {"l":"F","t":"digressive"}
  ],
  "explain": "APPROACH: Apply the twin test — both correct answers must produce sentences alike in meaning.\nSOLUTION: 'domestic minutiae' while missing 'diplomatic negotiations' → blank = narrow-focused / missing the big picture.\nCORRECT PAIR: Myopic (C) = short-sighted/narrow. Parochial (E) = narrow in scope. Both produce: 'the account was [narrow-focused]' — identical meaning.\nTWIN TEST: 'The account was myopic' = missed the larger significance. 'The account was parochial' = missed the larger significance. ✓\nWRONG ANSWERS: A-incisive (sharp, penetrating) — opposite. B-tendentious (biased toward a viewpoint) — wrong type of flaw. D-laudatory (full of praise) — irrelevant. F-digressive (wandering off topic) — close but fails twin test: 'digressive' implies rambling, not narrowness.\nTRAP: F-digressive looks right because the account 'dwells on minutiae' but digressive implies the author loses track, not that the focus is systematically too narrow."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: RC — 1 PASSAGE (${rcLength} words), 3 QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getDifficultyRules(rcLevel)}

RC format (id 1 passage):
{
  "id": 1,
  "topic": "brief topic description",
  "passage": "${rcLength}-word passage here...",
  "questions": [
    {
      "id": 1,
      "type": "primary_purpose",
      "q": "The primary purpose of the passage is to",
      "answer": "B",
      "opts": [{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."}],
      "explain": "APPROACH: Identify the author's overall goal across the entire passage...\nSOLUTION: ...\nWHY CORRECT: ...\nWRONG ANSWERS: A is too narrow (only paragraph 1). C contradicts the author's qualified tone. D is the opposite of what the author argues.\nTRAP: ..."
    },
    {
      "id": 2,
      "type": "inference",
      "q": "The passage implies that...",
      "answer": "A",
      "opts": [{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."}],
      "explain": "..."
    },
    {
      "id": 3,
      "type": "vocabulary_in_context",
      "q": "As used in the passage, the word [X] most nearly means",
      "answer": "C",
      "opts": [{"l":"A","t":"most common meaning"},{"l":"B","t":"related but wrong"},{"l":"C","t":"correct contextual meaning"},{"l":"D","t":"antonym"}],
      "explain": "..."
    }
  ]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETURN EXACTLY THIS JSON STRUCTURE:
{"vic":[5 items],"tc":[4 items],"se":[3 items],"rc":[1 passage]}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 16384,
        responseMimeType: 'application/json',
      },
    });

    const clean = (response.text || '').replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned malformed JSON. Try again.' }); }

    if (!parsed.vic || !parsed.tc || !parsed.se || !parsed.rc) {
      return res.status(500).json({ error: 'AI response missing sections. Try again.' });
    }

    res.json(parsed);
  } catch (err) {
    const msg = err.message || 'Generation failed';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'Rate limit reached. Wait 30 seconds and try again.' });
    }
    if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
      return res.status(401).json({ error: 'Invalid Gemini API key. Check your key in Settings.' });
    }
    res.status(500).json({ error: msg });
  }
}
