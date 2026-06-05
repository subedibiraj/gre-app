import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Requires service_role key to bypass RLS
);

const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL?.trim()?.toLowerCase() || 'biraj.077bct031@acem.edu.np';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // 1. Verify caller is logged in and is the admin
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Missing auth header' });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid auth token' });
    }

    if (user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Forbidden: You are not the administrator.' });
    }

    // 2. Fetch all users from auth.users (requires service_role)
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    // 3. Fetch all progress data (bypasses RLS because of service_role key)
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*');
    if (progressError) throw progressError;

    // 4. Merge and compute statistics
    const progressMap = {};
    progressData.forEach(row => { progressMap[row.user_id] = row; });

    const enrichedUsers = usersData.users.map(u => {
      const p = progressMap[u.id];
      const data = p?.data || {};
      
      // Calculate active days / streak
      const streak = data.gre_streak || { current: 0, best: 0 };
      const xp = data.gre_xp || 0;
      
      // Calculate completion
      let verbalDaysCompleted = 0;
      if (data.gre_dayScores) {
         verbalDaysCompleted = Object.keys(data.gre_dayScores).length;
      }
      
      let quantTopicsCompleted = 0;
      if (data.gre_quantScores) {
         quantTopicsCompleted = Object.keys(data.gre_quantScores).length;
      }

      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at,
        has_pro: !!data.gre_is_pro,
        streak: streak.current,
        best_streak: streak.best,
        xp,
        verbalDaysCompleted,
        quantTopicsCompleted,
        last_activity: p?.updated_at || u.created_at
      };
    });

    // Sort by most recently active
    enrichedUsers.sort((a, b) => new Date(b.last_activity) - new Date(a.last_activity));

    res.status(200).json({ users: enrichedUsers });
  } catch (err) {
    console.error('Admin Fetch Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
