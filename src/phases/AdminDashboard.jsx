import { useState, useEffect } from 'react';
import C from '../theme';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch('/api/admin-users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const totalVerbalDays = users.reduce((acc, u) => acc + u.verbalDaysCompleted, 0);
  const totalQuantTopics = users.reduce((acc, u) => acc + u.quantTopicsCompleted, 0);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: C.text, margin: '0 0 8px' }}>
            Admin Control Panel
          </h2>
          <p style={{ color: C.textMid, fontSize: 14, margin: 0 }}>
            Secure overview of platform usage and user progress.
          </p>
        </div>
        <button onClick={fetchUsers} disabled={loading} style={{
          padding: '10px 16px', borderRadius: 8, border: `1px solid ${C.border}`,
          background: C.surface, color: C.textMid, cursor: loading ? 'wait' : 'pointer',
          fontWeight: 600, fontSize: 13,
        }}>
          {loading ? 'Refreshing...' : '↻ Refresh Data'}
        </button>
      </div>

      {error ? (
        <div style={{ background: `${C.red}15`, border: `1px solid ${C.red}44`, padding: 20, borderRadius: 12 }}>
          <p style={{ color: C.red, margin: 0, fontWeight: 700 }}>Access Denied</p>
          <p style={{ color: C.red, margin: '8px 0 0', fontSize: 14 }}>{error}</p>
        </div>
      ) : loading && users.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.gold, animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* Top Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
            <StatCard label="Total Registered Users" value={users.length} icon="👥" color={C.blue} />
            <StatCard label="Total Verbal Days Completed" value={totalVerbalDays} icon="📖" color={C.greenBr} />
            <StatCard label="Total Quant Topics Finished" value={totalQuantTopics} icon="📐" color={C.gold} />
            <StatCard label="Pro Subscribers" value={users.filter(u => u.has_pro).length} icon="⭐" color={C.goldBr} />
          </div>

          {/* User Table */}
          <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
              <h3 style={{ margin: 0, fontSize: 16, color: C.text }}>User Directory</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: `${C.bg}88`, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>
                    <th style={{ padding: '14px 20px', fontWeight: 700 }}>Email</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700 }}>Joined</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700 }}>Streak</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700 }}>XP</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700 }}>Progress (V / Q)</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700 }}>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : `${C.surface}44` }}>
                      <td style={{ padding: '14px 20px', color: C.text, fontWeight: 500 }}>{u.email}</td>
                      <td style={{ padding: '14px 20px', color: C.textMid }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {u.has_pro 
                          ? <span style={{ background: `${C.gold}22`, color: C.gold, padding: '4px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>PRO</span>
                          : <span style={{ background: `${C.textDim}22`, color: C.textDim, padding: '4px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>FREE</span>
                        }
                      </td>
                      <td style={{ padding: '14px 20px', color: C.textMid }}>
                        🔥 {u.streak} <span style={{ opacity: 0.5 }}>(Best: {u.best_streak})</span>
                      </td>
                      <td style={{ padding: '14px 20px', color: C.blue, fontWeight: 700 }}>{u.xp.toLocaleString()}</td>
                      <td style={{ padding: '14px 20px', color: C.textMid }}>
                        <span style={{ color: C.greenBr }}>{u.verbalDaysCompleted}d</span> / <span style={{ color: C.gold }}>{u.quantTopicsCompleted}t</span>
                      </td>
                      <td style={{ padding: '14px 20px', color: C.textMid }}>
                        {new Date(u.last_activity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: C.textDim }}>No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        {icon}
      </div>
      <div>
        <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px', fontWeight: 700 }}>{label}</p>
        <p style={{ color: C.text, fontSize: 24, fontWeight: 800, margin: 0, fontFamily: 'Courier New,monospace' }}>{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
