import { GoogleGenAI } from '@google/genai';
import { getGeminiKey } from './_prompts.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = getGeminiKey(req);
    if (!apiKey) return res.status(400).json({ error: 'No Gemini API key found. Go to Settings (⚙️) and paste your key from aistudio.google.com/apikey' });

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a senior ETS psychometrician creating a complete GRE Quant section.
- 20 questions, bell-curve difficulty (6 easy, 8 medium, 6 hard)
- Topics balanced: Arithmetic 25%, Algebra 25%, Geometry 25%, Data Analysis 25%
- QC choices ALWAYS: A/B/C/D = Qty A greater/Qty B greater/Equal/Cannot determine
- Include full range of GRE traps
- Return ONLY valid JSON`;

    const userPrompt = `Generate a complete GRE Quant section — 20 questions.

QC (8 questions, ids 1-8):
{"id":N,"qtyA":"...","qtyB":"...","info":"...","answer":"A","topic":"Arithmetic","explain":"..."}

MC single (7 questions, ids 9-15):
{"id":N,"q":"...","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}],"answer":"C","topic":"Algebra","explain":"..."}

MC multiple (2 questions, ids 16-17):
{"id":N,"q":"...Select ALL that apply...","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."}],"answers":["A","C"],"topic":"Data","explain":"..."}

NE (3 questions, ids 18-20):
{"id":N,"q":"...","answer":"15","topic":"Geometry","explain":"..."}

RETURN EXACTLY: {"qc":[8],"mc":[7],"mcm":[2],"ne":[3]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: { systemInstruction: systemPrompt, temperature: 0.65, maxOutputTokens: 16384, responseMimeType: 'application/json' },
    });

    const clean = (response.text || '').replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned incomplete response. Try again.' }); }

    if (!parsed.qc || !parsed.mc || !parsed.ne) {
      return res.status(500).json({ error: 'Quant mock missing required sections.' });
    }
    res.json(parsed);
  } catch (error) {
    const msg = error.message || 'Generation failed';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'API rate limit. Wait 30 seconds.' });
    }
    res.status(500).json({ error: msg });
  }
}
