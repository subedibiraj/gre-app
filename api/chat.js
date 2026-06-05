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
    if (!apiKey) return res.status(400).json({ error: 'No Gemini API key. Add it in ⚙️ Settings.' });

    const { messages, profile = null, context = null } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    // Build a profile-aware system prompt
    const profileNote = profile ? (() => {
      const v = profile.verbal;
      const q = profile.quant;
      const weak = [];
      if (v.tc?.status === 'struggling' || v.tc?.status === 'developing') weak.push(`TC (${v.tc.acc}%)`);
      if (v.se?.status === 'struggling' || v.se?.status === 'developing') weak.push(`SE (${v.se.acc}%)`);
      if (v.rc?.status === 'struggling' || v.rc?.status === 'developing') weak.push(`RC (${v.rc.acc}%)`);
      if (q.qc?.status === 'struggling' || q.qc?.status === 'developing') weak.push(`QC (${q.qc.acc}%)`);
      if (q.mc?.status === 'struggling' || q.mc?.status === 'developing') weak.push(`MC (${q.mc.acc}%)`);
      return weak.length
        ? `\nSTUDENT WEAK AREAS: ${weak.join(', ')} — proactively address these in explanations.`
        : '\nSTUDENT PERFORMANCE: All sections competent or above.';
    })() : '';

    const contextNote = context
      ? `\nCURRENT CONTEXT: Student is working on ${context.section || 'practice'}${context.day ? ` Day ${context.day}` : ''}${context.topic ? ` — ${context.topic}` : ''}.`
      : '';

    const systemPrompt = `You are an elite GRE tutor who has coached 500+ students to 330+ scores.

YOUR TEACHING STYLE:
• Diagnose the SPECIFIC error pattern behind every wrong answer — never just say "that's wrong"
• Teach the underlying RULE, not just the answer to this question
• For TC/SE: always explain the pivot word logic and the twin-test
• For Quant: always show the efficient solution path AND the trap the question was designed to spring
• For vocabulary: teach the root, the nuance, and the most common GRE confusion
• Be direct and specific — 3-6 sentences maximum per explanation
• When the student gets something right, briefly confirm WHY it's right, then push them harder
• Use concrete examples from the current session when possible
${profileNote}
${contextNote}

FORMATTING:
• Use plain text — no markdown, no bullet symbols, no asterisks
• Numbers for steps when showing a solution process
• Keep responses under 150 words unless a full worked solution is needed`;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.65,
        maxOutputTokens: 512,
      },
    });

    res.json({ response: response.text?.trim() || 'No response generated.' });
  } catch (err) {
    const msg = err.message || 'Chat failed';
    if (msg.includes('429')) return res.status(429).json({ error: 'Rate limit. Wait a moment.' });
    res.status(500).json({ error: msg });
  }
}
