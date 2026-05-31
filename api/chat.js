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

    const { messages, systemPrompt } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const defaultSystemPrompt = `You are an expert GRE tutor.
Style:
- Diagnose the SPECIFIC error pattern behind wrong answers
- Use memorable rules: "Pivot words signal contrast", "SE needs 2 words that produce sentences alike in meaning"
- Teach word roots when explaining vocabulary
- For Quant, show the most efficient solution path AND the common trap
- Be direct and specific — 3-5 sentences maximum per concept`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: { systemInstruction: systemPrompt || defaultSystemPrompt, temperature: 0.7, maxOutputTokens: 1024 },
    });

    res.json({ response: response.text || 'No response generated.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
