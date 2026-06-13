import { authenticateAndSecure } from './_middleware.js';
import { DAYS } from './_days.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await authenticateAndSecure(req, res);
  if (!auth) return;

  try {
    const { day } = req.body || {};
    if (day === undefined) {
      return res.status(400).json({ error: 'Missing day parameter' });
    }

    const dayNum = parseInt(day, 10);
    const dayData = DAYS.find(d => d.day === dayNum);
    
    if (!dayData) {
      return res.status(404).json({ error: 'Day not found' });
    }

    // Access check logic
    const isFreeDay = (dayNum > 0 && dayNum <= 7) || dayNum === 0 || dayNum === -1;
    // Removing backend block to allow frontend gating to handle access naturally.
    // if (auth.plan !== 'pro' && !isFreeDay) {
    //   return res.status(403).json({ error: 'Pro subscription required for this day' });
    // }

    return res.status(200).json({ day: dayData });
  } catch (err) {
    console.error('Day API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
