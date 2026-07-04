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
      return res.status(402).json({ error: 'Payment Required: Mock Exams require a Pro subscription.' });
    }

    const { profile = null, section = 1, previousScore = null } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    let overallLevel = profile?.verbal?.overall?.level || 3;
    let tcLevel      = profile?.verbal?.tc?.level      || 3;
    let seLevel      = profile?.verbal?.se?.level      || 3;
    let rcLevel      = profile?.verbal?.rc?.level      || 3;

    // ADAPTIVE ROUTING LOGIC
    if (section === 2 && previousScore !== null) {
      if (previousScore > 0.75) {
        overallLevel = 5; tcLevel = 5; seLevel = 5; rcLevel = 5;
      } else if (previousScore > 0.45) {
        overallLevel = 3; tcLevel = 3; seLevel = 3; rcLevel = 3;
      } else {
        overallLevel = 1; tcLevel = 1; seLevel = 1; rcLevel = 1;
      }
    }

    const rcLength = { 1:150, 2:200, 3:260, 4:320, 5:380 }[rcLevel] || 250;

    const profileNote = `Student level for this section: Verbal ${overallLevel}/5 (TC:${tcLevel} SE:${seLevel} RC:${rcLevel})`;

    const isSection1 = section === 1;
    const numQuestions = isSection1 ? 12 : 15;

    const systemPrompt = `You are a senior ETS Verbal question developer creating a real GRE Verbal Reasoning mock section.
${GRE_VERBAL_REGISTER}
${TC_RULES}
${SE_RULES}
${RC_RULES}
${EXPLANATION_FORMAT}
ABSOLUTE RULES:
1. Return ONLY valid JSON. No markdown. No text outside JSON.
2. This is a real mock exam — every question must meet actual GRE quality standards.
3. ${numQuestions} questions total for Section ${section}.
4. Difficulty distribution: ${section === 2 && overallLevel === 5 ? '80% hard, 20% medium' : section === 2 && overallLevel === 1 ? '80% easy, 20% medium' : '25% easy, 40% medium, 35% hard'}.`;

    let userPrompt = '';
    if (isSection1) {
      userPrompt = `Generate Section 1 of GRE Verbal — 12 questions.
${profileNote}

TC format (4 questions, ids 1,2,3,4):
{"id":1,"stem":"...with [B1]...","blanks":[{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}]}],"explain":"..."}

SE format (3 questions, ids 5,6,7):
{"id":5,"stem":"...","answers":["C","E"],"opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."},{"l":"F","t":"..."}],"explain":"..."}

RC format (2 passages, 5 total questions):
- Passage 1 (ids 8,9): ${Math.min(rcLength, 180)} words, 2 questions
- Passage 2 (ids 10,11,12): ${rcLength} words, 3 questions

RETURN EXACTLY: {"tc":[4],"se":[3],"rc":[2]}`;
    } else {
      userPrompt = `Generate Section 2 of GRE Verbal — 15 questions.
${profileNote}

TC format (5 questions, ids 1,2,3,4,5):
{"id":1,"stem":"...with [B1]...","blanks":[{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}]}],"explain":"..."}

SE format (4 questions, ids 6,7,8,9):
{"id":6,"stem":"...","answers":["C","E"],"opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."},{"l":"F","t":"..."}],"explain":"..."}

RC format (2 passages, 6 total questions):
- Passage 1 (ids 10,11,12): ${Math.min(rcLength, 200)} words, 3 questions
- Passage 2 (ids 13,14,15): ${rcLength} words, 3 questions

RETURN EXACTLY: {"tc":[5],"se":[4],"rc":[2]}`;
    }

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
