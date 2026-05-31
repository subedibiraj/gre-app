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
    if (!apiKey) return res.status(500).json({ error: 'No Gemini API key configured. Add it in Settings.' });

    const { topicId, topicLabel, subtopics, weakAreas } = req.body;
    const ai = new GoogleGenAI({ apiKey });
    const weakNote = weakAreas?.length
      ? `\nWEAK AREAS — MANDATORY FOCUS: ${weakAreas.join(', ')}. At least 3 questions must target these.`
      : '';

    const systemPrompt = `You are a senior ETS psychometrician with 15 years designing GRE Quant sections.
Standards:
1. Every problem is mathematically unambiguous — one correct answer
2. QC choices are ALWAYS: A="Quantity A is greater", B="Quantity B is greater", C="The two quantities are equal", D="The relationship cannot be determined"
3. Include authentic GRE traps: assuming positivity, forgetting 0/negatives/fractions
4. Wrong answers must be results of specific identifiable errors
5. Return ONLY valid JSON — no markdown, no text outside JSON`;

    const userPrompt = `Generate 10 GRE Quant questions for: "${topicLabel}"
Subtopics: ${subtopics.join(', ')}
${weakNote}

SECTION 1: QC (5 questions, ids 1-5)
{"id":N,"qtyA":"...","qtyB":"...","info":"constraint or empty string","answer":"A","explain":"APPROACH:... CALCULATION:... TRAP:..."}

SECTION 2: MC (3 questions, ids 6-8)
{"id":N,"q":"...","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}],"answer":"B","explain":"SETUP:... SOLUTION:... wrong answer analysis..."}

SECTION 3: NE (2 questions, ids 9-10)
{"id":N,"q":"...","answer":"42","explain":"SETUP:... STEPS:... TRAP:..."}

RETURN EXACTLY: {"qc":[5],"mc":[3],"ne":[2]}`;

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
      return res.status(500).json({ error: 'Quant response missing required sections.' });
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
