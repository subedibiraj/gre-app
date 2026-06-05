import { createClient } from '@supabase/supabase-js';

export async function verifyProStatus(req) {
  // If the user provided their own Gemini key, they bypass the Pro check
  // since they are paying for their own API usage.
  if (req.headers['x-gemini-key']) {
    return true;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  if (!token) return false;

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) return false;

  // Check Admin bypass
  if (user.email === 'biraj.077bct031@acem.edu.np') return true;

  // Check Subscription Status
  const { data: progress } = await supabase
    .from('user_progress')
    .select('plan, plan_expires')
    .eq('user_id', user.id)
    .single();

  if (!progress) return false;

  const isPro = progress.plan === 'pro' && (!progress.plan_expires || new Date(progress.plan_expires) > new Date());
  return isPro;
}
