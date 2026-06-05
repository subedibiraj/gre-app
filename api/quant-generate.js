import { GoogleGenAI } from '@google/genai';
import { getGeminiKey, QUANT_RULES, getDifficultyRules, EXPLANATION_FORMAT } from './_prompts.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = getGeminiKey(req);
    if (!apiKey) return res.status(400).json({ error: 'No Gemini API key. Add it in ⚙️ Settings.' });

    const { topicId, topicLabel, subtopics, weakAreas = [], profile = null } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    // ── Compute difficulty from profile ──────────────────────────────────────
    const qcLevel = profile?.quant?.qc?.level || 2;
    const mcLevel = profile?.quant?.mc?.level || 2;
    const neLevel = profile?.quant?.ne?.level || 2;
    const overallLevel = profile?.quant?.overall?.level || 2;

    const weakNote = weakAreas.length
      ? `\nWEAK AREAS (generate at least 3 questions targeting these specifically):\n${weakAreas.join(', ')}`
      : '';

    const profileNote = profile ? `
STUDENT QUANT PERFORMANCE PROFILE:
• QC accuracy: ${profile.quant.qc?.acc ?? 'unknown'}% → Level ${qcLevel}/5
• MC accuracy: ${profile.quant.mc?.acc ?? 'unknown'}% → Level ${mcLevel}/5  
• NE accuracy: ${profile.quant.ne?.acc ?? 'unknown'}% → Level ${neLevel}/5

CALIBRATION INSTRUCTIONS:
${qcLevel <= 2
  ? '• QC: Use concrete numbers where possible. Avoid abstract variable-only constraints. One trap per question.'
  : qcLevel >= 4
    ? '• QC: Abstract algebraic constraints. Multiple simultaneous traps. At least 2 questions where answer is D.'
    : '• QC: Mix concrete and abstract. 1-2 strong traps per question.'}
${mcLevel <= 2
  ? '• MC: Single-step computation. Wrong answers are off by a simple arithmetic error.'
  : mcLevel >= 4
    ? '• MC: Multi-step problems requiring multiple concepts. Wrong answers designed to catch specific error patterns.'
    : '• MC: 2-step problems. Mix of computation and conceptual questions.'}
${neLevel <= 2
  ? '• NE: Straightforward setup, integer answers.'
  : neLevel >= 4
    ? '• NE: Requires algebraic setup + careful attention to constraints. Non-obvious answer.'
    : '• NE: Moderate complexity. May require setting up an equation.'}
` : 'CALIBRATION: Medium difficulty — student has not established a baseline.';

    const systemPrompt = `You are a senior ETS psychometrician who has designed GRE Quantitative questions for 15 years.

ABSOLUTE RULES:
1. Return ONLY valid JSON. Zero text outside JSON. Zero markdown.
2. Every problem must be mathematically unambiguous with exactly one correct answer.
3. All calculations must be verified correct before including them.
4. QC choices are ALWAYS and ONLY: A="Quantity A is greater", B="Quantity B is greater", C="The two quantities are equal", D="The relationship cannot be determined from the information given"
5. Explanations must follow the required format precisely.

${QUANT_RULES}
${EXPLANATION_FORMAT}`;

    const userPrompt = `Generate 10 adaptive GRE Quant questions for topic: "${topicLabel}"
Subtopics to cover: ${subtopics.join(', ')}
${profileNote}${weakNote}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: QC — 5 QUESTIONS (ids 1-5)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getDifficultyRules(qcLevel)}

Required trap distribution across 5 questions:
• Q1: Easy — concrete numbers, answer A or B
• Q2: Medium — one variable, one obvious trap, answer B or C
• Q3: Medium — constraint with boundary case
• Q4: Hard — answer D (relationship cannot be determined) — MUST include this
• Q5: Hard — abstract constraint, multiple traps

Format:
{
  "id": 1,
  "qtyA": "x² + 2x + 1",
  "qtyB": "(x + 1)²",
  "info": "x is a real number",
  "answer": "C",
  "topic": "${topicLabel}",
  "trap": "Assuming x>0 — but this holds for ALL real x",
  "explain": "APPROACH: Factor or expand to compare directly.\nSOLUTION: x²+2x+1 = (x+1)² by perfect square factoring. So QtyA = QtyB for all real x.\nWHY CORRECT: C — always equal regardless of x's value.\nWRONG ANSWERS: A and B fail because equality holds for all x, not just some. D fails because the relationship is always determined (always equal).\nTRAP: Students who substitute only x=2 get 9=9 and pick C correctly, but students who don't recognize the algebraic identity might try x=-3 and get confused."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: MC — 3 QUESTIONS (ids 6-8)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getDifficultyRules(mcLevel)}

Each wrong answer must correspond to a SPECIFIC error:
Format:
{
  "id": 6,
  "q": "A store reduces the price of a jacket by 20%, then reduces the sale price by an additional 15%. What is the total percentage reduction from the original price?",
  "opts": [
    {"l":"A","t":"32%","error":"correct"},
    {"l":"B","t":"35%","error":"adds 20+15 directly"},
    {"l":"C","t":"30%","error":"averages 20 and 15"},
    {"l":"D","t":"28%","error":"applies 20% twice"},
    {"l":"E","t":"33%","error":"rounds incorrectly"}
  ],
  "answer": "A",
  "topic": "${topicLabel}",
  "explain": "APPROACH: Successive percentage changes — multiply the multipliers.\nSOLUTION: 0.80 × 0.85 = 0.68. Total reduction = 1 - 0.68 = 0.32 = 32%.\nWHY CORRECT: A-32% — multiply multipliers, don't add percentages.\nWRONG ANSWERS: B-35% adds 20+15 (the most common wrong answer — treats successive discounts as additive). C-30% averages the two rates. D-28% applies both discounts to original simultaneously. E-33% rounds intermediate step.\nTRAP: The most seductive wrong answer is B-35% because addition feels natural and the answer is close enough to seem plausible."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: NE — 2 QUESTIONS (ids 9-10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getDifficultyRules(neLevel)}

Format:
{
  "id": 9,
  "q": "A rectangular garden has a perimeter of 56 meters. If the length is 4 meters more than twice the width, what is the area of the garden in square meters?",
  "answer": "160",
  "unit": "square meters",
  "topic": "${topicLabel}",
  "explain": "APPROACH: Set up two equations from the given relationships.\nSOLUTION: Let width = w. Length = 2w+4. Perimeter: 2(w + 2w+4) = 56 → 2(3w+4) = 56 → 6w+8 = 56 → 6w = 48 → w = 8. Length = 2(8)+4 = 20. Area = 8 × 20 = 160.\nWHY CORRECT: 160 square meters.\nCOMMON ERRORS: (1) Setting perimeter = length+width instead of 2(l+w): gives w=24 → wrong. (2) Finding dimensions correctly but computing perimeter instead of area. (3) Arithmetic error in 2(3w+4) expansion.\nTRAP: The problem gives length in terms of width — students must choose which variable to define first and remain consistent."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETURN EXACTLY: {"qc":[5],"mc":[3],"ne":[2]}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

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

    const clean = (response.text || '').replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned malformed JSON. Try again.' }); }

    if (!parsed.qc || !parsed.mc || !parsed.ne) {
      return res.status(500).json({ error: 'Quant response missing sections. Try again.' });
    }
    res.json(parsed);
  } catch (err) {
    const msg = err.message || 'Generation failed';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'Rate limit. Wait 30 seconds.' });
    }
    if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
      return res.status(401).json({ error: 'Invalid Gemini API key. Check Settings.' });
    }
    res.status(500).json({ error: msg });
  }
}
