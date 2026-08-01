import { GoogleGenAI } from '@google/genai';
import { getGeminiKey, QUANT_RULES, getDifficultyRules, EXPLANATION_FORMAT } from './_prompts.js';
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
      return res.status(402).json({ error: 'Payment Required: Quant Mock requires a Pro subscription.' });
    }

    const { profile = null } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    const qcLevel      = profile?.quant?.qc?.level || 3;
    const mcLevel      = profile?.quant?.mc?.level || 3;
    const neLevel      = profile?.quant?.ne?.level || 3;
    const overallLevel = profile?.quant?.overall?.level || 3;

    const profileNote = profile
      ? `Student quant level: ${overallLevel}/5 (QC:${qcLevel} MC:${mcLevel} NE:${neLevel})`
      : 'Student level: unknown — use standard GRE difficulty (Level 3)';

    const systemPrompt = `You are a senior ETS psychometrician creating a full GRE Quantitative Reasoning mock section.
${QUANT_RULES}
${EXPLANATION_FORMAT}
ABSOLUTE RULES:
1. Return ONLY valid JSON. No markdown. No text outside JSON.
2. All mathematics must be 100% correct — verify every calculation.
3. 20 questions, 35-minute simulation. Topics balanced across all 4 GRE areas.
4. QC answer distribution: approximately 5A, 5B, 5C, 5D across the section.`;

    const userPrompt = `Generate a complete GRE Quantitative mock exam — 20 questions.
${profileNote}

Topic distribution: Arithmetic 25%, Algebra 25%, Geometry 25%, Data Analysis 25%
Difficulty: 30% easy, 40% medium, 30% hard

QC format (8 questions, ids 1-8):
{"id":1,"qtyA":"...","qtyB":"...","info":"constraint or empty string","answer":"A","topic":"Arithmetic","trap":"specific trap","explain":"APPROACH:...\\nSOLUTION:...\\nWHY CORRECT:...\\nWRONG ANSWERS:...\\nTRAP:..."}

MC format (7 questions, ids 9-15):
{"id":9,"q":"...","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}],"answer":"C","topic":"Algebra","explain":"APPROACH:...\\nSOLUTION:...\\nWHY CORRECT:...\\nWRONG ANSWERS: A-wrong because..., B-wrong because..., D-wrong because..., E-wrong because...\\nTRAP:..."}

MCM format (2 questions, ids 16-17, select all that apply):
{"id":16,"q":"...Select ALL that apply...","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."}],"answers":["A","C"],"topic":"Data Analysis","explain":"..."}

NE format (3 questions, ids 18-20):
{"id":18,"q":"...","answer":"42","unit":"","topic":"Geometry","explain":"APPROACH:...\\nSOLUTION:...\\nWHY CORRECT:...\\nCOMMON ERRORS:...\\nTRAP:..."}

CRITICAL DATA INTERPRETATION RULES:
For exactly 2 questions in the 'Data Analysis' topic, include a "chart" object representing a graph. The question text MUST reference this chart.
Chart Format:
"chart": { "title": "Store Revenue 2023", "type": "bar", "xAxisKey": "month", "series": [{"key": "sales", "name": "Sales ($K)"}], "data": [{"month": "Jan", "sales": 120}, {"month": "Feb", "sales": 150}, {"month": "Mar", "sales": 110}] }
Type must be "bar", "line", or "pie".

RETURN EXACTLY: {"qc":[8],"mc":[7],"mcm":[2],"ne":[3]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: { systemInstruction: systemPrompt, temperature: 0.65, maxOutputTokens: 16384, responseMimeType: 'application/json' },
    });

    const clean = (response.text || '').replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned malformed JSON. Try again.' }); }

    if (!parsed.qc || !parsed.mc || !parsed.ne) {
      return res.status(500).json({ error: 'Quant mock missing sections. Try again.' });
    }
    res.json(parsed);
  } catch (err) {
    const msg = err.message || 'Generation failed';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) return res.status(429).json({ error: 'Rate limit. Wait 30 seconds.' });
    if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) return res.status(401).json({ error: 'Invalid API key. Check Settings.' });
    res.status(500).json({ error: msg });
  }
}
