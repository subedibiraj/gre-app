import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // This function is meant to be called daily via pg_cron.
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch all users from the auth.users table
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    // 2. Fetch all progress data
    const { data: progressList, error: progressError } = await supabase
      .from('user_progress')
      .select('user_id, data');
    if (progressError) throw progressError;

    // Create a map of user_id -> progress
    const progressMap = {};
    progressList.forEach(p => { progressMap[p.user_id] = p.data; });

    let emailsSent = 0;

    // 3. Iterate through users and send emails if appropriate
    for (const user of users.users) {
      const pData = progressMap[user.id];
      if (!pData) continue;

      const streakData = pData.gre_streak;
      if (!streakData || streakData.current === 0) continue;

      const lastStudyStr = streakData.lastStudyDate;
      if (!lastStudyStr) continue;

      const today = new Date().toDateString();
      const lastStudy = new Date(lastStudyStr).toDateString();

      // Only email if they HAVEN'T studied today yet, to remind them.
      if (today !== lastStudy) {
        // Send email via Resend
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'GRE Complete <hello@yourdomain.com>',
            to: [user.email],
            subject: `🔥 Keep your ${streakData.current}-day GRE streak alive!`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1A1D2D;">
                <h2>Time to study!</h2>
                <p>You've built an incredible <strong>${streakData.current}-day streak</strong>.</p>
                <p>Don't let it slip away! Complete a 15-minute practice session today to keep your momentum going.</p>
                <a href="https://gre-app-eta.vercel.app/" style="display: inline-block; padding: 12px 24px; background: #C8A535; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">
                  Continue Studying
                </a>
              </div>
            `
          })
        });

        if (res.ok) emailsSent++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, emailsSent }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
})
