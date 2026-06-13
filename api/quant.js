import { authenticateAndSecure } from './_middleware.js';
import { QUANT_TOPICS } from './_quant-topics.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await authenticateAndSecure(req, res);
  if (!auth) return;

  try {
    const { topicId } = req.body || {};
    if (!topicId) {
      return res.status(400).json({ error: 'Missing topicId parameter' });
    }

    const topicData = QUANT_TOPICS.find(t => t.id === topicId);
    
    if (!topicData) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // if (auth.plan !== 'pro' && topicId !== 'arithmetic') {
    //   return res.status(403).json({ error: 'Pro subscription required for this topic' });
    // }

    return res.status(200).json({ topic: topicData });
  } catch (err) {
    console.error('Quant API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
