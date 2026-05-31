import { GoogleGenAI } from '@google/genai';
import { GRE_VERBAL_REGISTER, TC_RULES, SE_RULES, RC_RULES, getGeminiKey } from './_prompts.js';

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

    const systemPrompt = `You are a senior ETS question developer creating a real GRE Verbal Reasoning section.
20 questions, 30 minutes. Difficulty: 6 easy, 9 medium, 5 hard.
All vocabulary is GRE-level. Return ONLY valid JSON.
${GRE_VERBAL_REGISTER}${TC_RULES}${SE_RULES}${RC_RULES}`;

    const userPrompt = `Generate a complete GRE Verbal mock — 20 items.

TC format: {"id":N,"stem":"...with [B1]...","blanks":[{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}]}],"explain":"..."}
SE format: {"id":N,"stem":"...","answers":["C","E"],"opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."},{"l":"F","t":"..."}],"explain":"..."}
RC format: {"id":1,"passage":"...","topic":"...","questions":[{"id":1,"q":"...","answer":"A","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."}],"explain":"..."}]}

Structure (20 items total):
- TC ids 1,2,3,4,7,11,16 (7 questions)
- SE ids 5,6,10,15,19,20 (6 questions)  
- RC passage 1: ids 8,9 (2 questions)
- RC passage 2: ids 12,13,14 (3 questions)
- RC passage 3: ids 17,18 (2 questions)

RETURN EXACTLY: {"tc":[7 items],"se":[6 items],"rc":[3 passages]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: { systemInstruction: systemPrompt, temperature: 0.78, maxOutputTokens: 16384, responseMimeType: 'application/json' },
    });

    const clean = (response.text || '').replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned incomplete response. Try again.' }); }

    if (!parsed.tc || !parsed.se || !parsed.rc) {
      return res.status(500).json({ error: 'Mock exam missing required sections.' });
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
