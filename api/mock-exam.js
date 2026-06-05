import { GoogleGenAI } from '@google/genai';
import { getGeminiKey, GRE_VERBAL_REGISTER, getDifficultyRules, TC_RULES, SE_RULES, RC_RULES, EXPLANATION_FORMAT } from './_prompts.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = getGeminiKey(req);
    if (!apiKey) return res.status(400).json({ error: 'No Gemini API key. Add it in ⚙️ Settings.' });

    const { profile = null } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    const overallLevel = profile?.verbal?.overall?.level || 3;
    const tcLevel      = profile?.verbal?.tc?.level      || 3;
    const seLevel      = profile?.verbal?.se?.level      || 3;
    const rcLevel      = profile?.verbal?.rc?.level      || 3;

    const rcLength = { 1:150, 2:200, 3:260, 4:320, 5:380 }[rcLevel] || 250;

    const profileNote = profile
      ? `Student level: Verbal ${overallLevel}/5 (TC:${tcLevel} SE:${seLevel} RC:${rcLevel})`
      : 'Student level: unknown — use standard GRE difficulty (Level 3)';

    const systemPrompt = `You are a senior ETS Verbal question developer creating a real GRE Verbal Reasoning mock section.
${GRE_VERBAL_REGISTER}
${TC_RULES}
${SE_RULES}
${RC_RULES}
${EXPLANATION_FORMAT}
ABSOLUTE RULES:
1. Return ONLY valid JSON. No markdown. No text outside JSON.
2. This is a real mock exam — every question must meet actual GRE quality standards.
3. 20 questions total, 30-minute simulation.
4. Difficulty distribution: 25% easy, 40% medium, 35% hard.`;

    const userPrompt = `Generate a complete GRE Verbal mock exam — 20 questions.
${profileNote}

TC format (7 questions, ids 1,2,3,4,7,11,16):
{"id":1,"stem":"...with [B1]...","blanks":[{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}]}],"explain":"APPROACH:...\\nSOLUTION:...\\nWHY CORRECT:...\\nWRONG ANSWERS:...\\nTRAP:..."}

SE format (6 questions, ids 5,6,10,15,19,20):
{"id":5,"stem":"...","answers":["C","E"],"opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."},{"l":"F","t":"..."}],"explain":"APPROACH:...\\nSOLUTION:...\\nCORRECT PAIR:...\\nTWIN TEST:...\\nWRONG ANSWERS:...\\nTRAP:..."}

RC format (3 passages):
- Passage 1 (ids 8,9): ${Math.min(rcLength, 180)} words, 2 questions
- Passage 2 (ids 12,13,14): ${rcLength} words, 3 questions
- Passage 3 (ids 17,18): ${Math.min(rcLength, 200)} words, 2 questions
{"id":1,"topic":"...","passage":"...","questions":[{"id":8,"type":"primary_purpose","q":"...","answer":"B","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."}],"explain":"..."}]}

RETURN EXACTLY: {"tc":[7],"se":[6],"rc":[3]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: { systemInstruction: systemPrompt, temperature: 0.75, maxOutputTokens: 16384, responseMimeType: 'application/json' },
    });

    const clean = (response.text || '').replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned malformed JSON. Try again.' }); }

    if (!parsed.tc || !parsed.se || !parsed.rc) {
      return res.status(500).json({ error: 'Mock exam missing sections. Try again.' });
    }
    res.json(parsed);
  } catch (err) {
    const msg = err.message || 'Generation failed';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) return res.status(429).json({ error: 'Rate limit. Wait 30 seconds.' });
    if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) return res.status(401).json({ error: 'Invalid API key. Check Settings.' });
    res.status(500).json({ error: msg });
  }
}
