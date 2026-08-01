import { GoogleGenAI } from '@google/genai';
import { getGeminiKey } from './_prompts.js';
import { verifyProStatus } from './_auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-key, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = getGeminiKey(req);
    if (!apiKey) {
      return res.status(400).json({ error: 'No Gemini API key configured.' });
    }

    const isAuthorized = await verifyProStatus(req);
    if (!isAuthorized) {
      return res.status(402).json({ error: 'Payment Required: AWA Essay Grading requires a Pro subscription.' });
    }

    const { prompt, essay } = req.body;
    
    if (!prompt || !essay) {
      return res.status(400).json({ error: 'Missing prompt or essay in request body.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an official ETS human grader for the GRE Analytical Writing Assessment (AWA) "Analyze an Issue" task. 
Your job is to strictly grade the user's essay from 0.0 to 6.0 in half-point increments based on the official ETS scoring rubric.

The official criteria for a 6.0 (Outstanding):
- Articulates a clear and insightful position on the issue
- Compelling reasons and/or persuasive examples
- Sustained, well-focused, and well-organized
- Superior facility with standard written English (grammar, syntax, vocabulary)

Return the response STRICTLY as a JSON object with this exact structure:
{
  "score": number (0.0 to 6.0),
  "strengths": ["array of 2-3 specific things the writer did well"],
  "weaknesses": ["array of 2-3 specific areas for improvement"],
  "grammar_fixes": ["array of 1-3 specific grammar/vocab corrections with quotes from the essay"]
}`;

    const promptText = `PROMPT:\n"${prompt}"\n\nESSAY:\n"""\n${essay}\n"""\n\nGrade the essay and return the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2, // low temperature for consistent grading
      }
    });

    const text = response.text;
    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (err) {
    console.error('AWA Grade Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to grade essay.' });
  }
}
