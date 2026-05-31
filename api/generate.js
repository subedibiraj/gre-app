import { GoogleGenAI } from '@google/genai';
import { GRE_VERBAL_REGISTER, TC_RULES, SE_RULES, RC_RULES, getGeminiKey } from './_prompts.js';

export default async function handler(req, res) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = getGeminiKey(req);
    if (!apiKey) {
      return res.status(500).json({ error: 'No Gemini API key configured. Add it in Settings.' });
    }

    const { dayNum, theme, currentWords, allWords, weakWords, scores } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    const bankLines = allWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');
    const weakNote = weakWords?.length
      ? `\n\nWEAK WORDS — MANDATORY PRIORITY: Include at least 3 of them:\n${weakWords.slice(0, 12).join(', ')}`
      : '';
    const scoreNote = scores
      ? `\nPrevious performance: ${JSON.stringify(scores)}. Adjust difficulty accordingly.`
      : '';

    const systemPrompt = `You are a senior ETS question developer with 20 years of GRE experience.
ABSOLUTE RULES:
1. Return ONLY valid JSON. No markdown, no text outside JSON.
2. Use ONLY words from the provided word bank.
3. Never place the correct answer word in the question stem.
4. Every explanation must analyze why each wrong answer fails.
${GRE_VERBAL_REGISTER}
${TC_RULES}
${SE_RULES}
${RC_RULES}`;

    const currentWordsList = currentWords.map(w => `${w.w} (${w.pos}): ${w.def}`).join('\n');

    const userPrompt = `Generate adaptive GRE Verbal practice for Day ${dayNum}: "${theme}"
${weakNote}${scoreNote}

WORD POOLS:
Today's words: ${currentWordsList}
Full bank (RC only): ${bankLines}

SECTION 1: VIC (5 questions)
{"id":N,"word":"WORD","sentence":"...","answer":"B","opts":[{"l":"A","t":"..."},...],"explain":"..."}

SECTION 2: TC (4 questions — Q1 easy single, Q2 medium single, Q3 medium single, Q4 hard double)
Single: {"id":N,"stem":"...with [B1]...","blanks":[{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."}]}],"explain":"..."}
Double: {"id":N,"stem":"...","blanks":[{"label":"Blank 1","answer":"B","opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."}]},{"label":"Blank 2","answer":"E","opts":[{"l":"D","t":"..."},{"l":"E","t":"..."},{"l":"F","t":"..."}]}],"explain":"..."}

SECTION 3: SE (3 questions)
{"id":N,"stem":"...","answers":["C","D"],"opts":[{"l":"A","t":"..."},{"l":"B","t":"..."},{"l":"C","t":"..."},{"l":"D","t":"..."},{"l":"E","t":"..."},{"l":"F","t":"..."}],"explain":"..."}

SECTION 4: RC (1 passage, 3 questions)
{"id":1,"passage":"...","topic":"...","questions":[{"id":1,"q":"...","answer":"A","opts":[{"l":"A","t":"..."},...],"explain":"..."}]}

RETURN EXACTLY:
{"vic":[5],"tc":[4],"se":[3],"rc":[1]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      config: { systemInstruction: systemPrompt, temperature: 0.75, maxOutputTokens: 16384, responseMimeType: 'application/json' },
    });

    const clean = (response.text || '').replace(/```json|```/g, '').trim();
    let parsed;
    try { parsed = JSON.parse(clean); }
    catch { return res.status(500).json({ error: 'AI returned incomplete response. Try again.' }); }

    if (!parsed.vic || !parsed.tc || !parsed.se) {
      return res.status(500).json({ error: 'AI response missing required sections.' });
    }
    res.json(parsed);
  } catch (error) {
    const msg = error.message || 'Generation failed';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({ error: 'API rate limit reached. Wait 30 seconds.' });
    }
    res.status(500).json({ error: msg });
  }
}
