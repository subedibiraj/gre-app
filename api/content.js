import { createClient } from '@supabase/supabase-js';
import { DAYS } from './days';
import { QUANT_TOPICS } from './quant-topics';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

// Helper to determine access
function canAccessDay(dayNum, plan, hasKey) {
  if (plan === 'pro') return true;
  if (hasKey) return true; // BYOK users get access
  if (dayNum === 0 || dayNum === -1) return true; 
  if (dayNum === -2 || dayNum === -3) return false; 
  return dayNum > 0 && dayNum <= 7;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { hasGeminiKey } = req.body || {};
    const authHeader = req.headers.authorization;
    let plan = 'free';
    let userEmail = null;

    if (hasGeminiKey) plan = 'pro'; // BYOK users get curriculum access

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      // Create a scoped client with the user's JWT so RLS works
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

    const isAdmin = userEmail === (process.env.VITE_ADMIN_EMAIL || 'biraj.077bct031@acem.edu.np');
    if (isAdmin) plan = 'pro';

    // Build the secure payload
    const safeDays = DAYS.map(d => {
      // Free users get full access to Days 1-7
      if (plan === 'pro' || d.day <= 7) {
        return d;
      }
      // Free users only get metadata for Days 8-30
      return {
        ...d,
        words: [], // Strip premium words
      };
    });

    const payload = {
      DAYS: safeDays,
      QUANT_TOPICS: QUANT_TOPICS, // Quant is currently fully free
    };

    return res.status(200).json(payload);

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
