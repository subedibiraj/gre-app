import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  'https://gre.biraj-subedi.com.np',
  'https://gre-app-eta.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const rateLimit = new Map();

export async function authenticateAndSecure(req, res) {
  // 1. Strict CORS Check
  const origin = req.headers.origin || req.headers.referer;
  const isAllowedOrigin = ALLOWED_ORIGINS.some(o => origin?.startsWith(o));
  
  if (!isAllowedOrigin && process.env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Forbidden: Invalid Origin' });
    return null;
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return null; // Signals the handler to stop
  }

  // 2. IP Rate Limiting (10 reqs per 10s)
  const ip = req.headers['x-forwarded-for'] || 'unknown_ip';
  const now = Date.now();
  const reqCount = rateLimit.get(ip) || { count: 0, time: now };
  
  if (now - reqCount.time > 10000) {
    reqCount.count = 1;
    reqCount.time = now;
  } else {
    reqCount.count++;
  }
  rateLimit.set(ip, reqCount);

  if (reqCount.count > 10) {
    res.status(429).json({ error: 'Too Many Requests' });
    return null;
  }

  // 3. User Authentication
  const { geminiKey } = req.body || {};
  const authHeader = req.headers.authorization;
  let plan = 'free';
  let userEmail = null;

  if (geminiKey) {
    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
      if (geminiRes.ok) plan = 'pro';
    } catch (e) {}
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
      });

      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        userEmail = user.email;
        const { data: progress } = await supabase
          .from('user_progress')
          .select('plan, plan_expires')
          .eq('user_id', user.id)
          .single();
        
        if (progress?.plan) {
          if (progress.plan_expires && new Date(progress.plan_expires) < new Date()) {
            plan = 'free';
          } else {
            plan = progress.plan;
          }
        }
      }
    }
  }

  const isAdmin = userEmail === (process.env.VITE_ADMIN_EMAIL || 'biraj.077bct031@acem.edu.np');
  if (isAdmin) plan = 'pro';

  // Fallback for testing: if Supabase is not configured, assume pro to allow testing without env vars
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    plan = 'pro';
  }

  return { plan, userEmail, origin };
}
