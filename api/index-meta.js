import { authenticateAndSecure } from './_middleware.js';
import { DAYS } from './_days.js';
import { QUANT_TOPICS } from './_quant-topics.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await authenticateAndSecure(req, res);
  if (!auth) return; // Middleware handled the response (e.g., OPTIONS, Rate Limit, CORS fail)

  try {
    // Strip all words from DAYS to create a pure metadata index
    const indexDays = DAYS.map(d => ({
      day: d.day,
      theme: d.theme,
      wordCount: d.words ? d.words.length : 0,
      words: [] // Explicitly empty
    }));

    // For Quant, we strip the questions for the index
    const indexQuant = QUANT_TOPICS.map(t => ({
      id: t.id,
      label: t.label,
      icon: t.icon,
      subtopics: t.subtopics,
      questions: [] // Explicitly empty
    }));

    return res.status(200).json({
      DAYS: indexDays,
      QUANT_TOPICS: indexQuant,
      plan: auth.plan
    });
  } catch (err) {
    console.error('Index API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
