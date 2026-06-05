import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  // Set CORS headers for all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing required query parameter: userId' });
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('plan, plan_expires')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = row not found, which is expected for new users
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to query subscription status' });
    }

    // Default to free plan if no record found
    if (!data) {
      return res.status(200).json({
        plan: 'free',
        planExpires: null,
        isActive: false,
      });
    }

    const now = new Date();
    const planExpires = data.plan_expires ? new Date(data.plan_expires) : null;
    const isActive = data.plan === 'pro' && (planExpires === null || planExpires > now);

    return res.status(200).json({
      plan: data.plan,
      planExpires: data.plan_expires,
      isActive,
    });
  } catch (err) {
    console.error('Error checking subscription:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
