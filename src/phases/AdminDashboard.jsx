import { useState, useEffect } from 'react';
import C from '../theme';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [tab, setTab] = useState('users'); // users, verbal, awa
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      {/* Admin Sidebar */}
      <div style={{ width: 250, borderRight: `1px solid ${C.border}`, background: C.surface, padding: 20 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: C.text, margin: '0 0 30px' }}>
          Admin Panel
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SidebarBtn active={tab === 'users'} onClick={() => setTab('users')} icon="👥" label="Users" />
          <SidebarBtn active={tab === 'verbal'} onClick={() => setTab('verbal')} icon="📖" label="Verbal Content" />
          <SidebarBtn active={tab === 'awa'} onClick={() => setTab('awa')} icon="✍️" label="AWA Prompts" />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
        {tab === 'users' && <UsersTab />}
        {tab === 'verbal' && <VerbalTab />}
        {tab === 'awa' && <AwaTab />}
      </div>
    </div>
  );
}

function SidebarBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      background: active ? `${C.gold}22` : 'transparent',
      border: `1px solid ${active ? C.gold : 'transparent'}`,
      color: active ? C.gold : C.textMid,
      borderRadius: 8, cursor: 'pointer', textAlign: 'left',
      fontWeight: active ? 700 : 500, transition: 'all 0.2s'
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
    </button>
  );
}

// ─── USERS TAB ─────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch('/api/admin-users', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
      setUsers(data.users || []);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const totalVerbalDays = users.reduce((acc, u) => acc + u.verbalDaysCompleted, 0);

  if (error) return <div style={{ color: C.red }}>{error}</div>;
  if (loading) return <div style={{ color: C.textMid }}>Loading users...</div>;

  return (
    <div>
      <h2 style={{ fontSize: 24, margin: '0 0 20px', color: C.text }}>User Directory</h2>
      <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
        <StatCard label="Total Users" value={users.length} />
        <StatCard label="Pro Users" value={users.filter(u => u.has_pro).length} />
        <StatCard label="Total Verbal Days" value={totalVerbalDays} />
      </div>
      
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: C.surface, color: C.textDim }}>
            <th style={{ padding: 12 }}>Email</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Streak</th>
            <th style={{ padding: 12 }}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: 12, color: C.text }}>{u.email}</td>
              <td style={{ padding: 12, color: u.has_pro ? C.gold : C.textMid }}>{u.has_pro ? 'PRO' : 'FREE'}</td>
              <td style={{ padding: 12, color: C.text }}>{u.streak}</td>
              <td style={{ padding: 12, color: C.textMid }}>{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: C.surface, padding: 20, borderRadius: 8, border: `1px solid ${C.border}`, flex: 1 }}>
      <div style={{ color: C.textDim, fontSize: 12, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ color: C.text, fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>{value}</div>
    </div>
  );
}

// ─── VERBAL CONTENT TAB ───────────────────────────────────────────────────
function VerbalTab() {
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchDays(); }, []);

  const fetchDays = async () => {
    const { data, error } = await supabase.from('curriculum_verbal').select('*').order('day');
    if (!error && data) setDays(data);
  };

  const handleSave = async () => {
    if (!selectedDay) return;
    setSaving(true);
    const { error } = await supabase.from('curriculum_verbal').update({
      theme: selectedDay.theme,
      patterns: selectedDay.patterns,
      se_strategy: selectedDay.se_strategy,
      words: selectedDay.words
    }).eq('day', selectedDay.day);
    
    setSaving(false);
    if (error) alert('Failed to save: ' + error.message);
    else {
      alert('Saved successfully! Refreshing app will reflect changes.');
      fetchDays();
    }
  };

  if (!days.length) return <div>Loading verbal curriculum...</div>;

  return (
    <div style={{ display: 'flex', gap: 30, height: '100%' }}>
      {/* Day List */}
      <div style={{ width: 250, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 10px', color: C.text }}>Select a Day</h3>
        {days.map(d => (
          <button key={d.day} onClick={() => setSelectedDay(d)} style={{
            padding: 12, textAlign: 'left', borderRadius: 8,
            background: selectedDay?.day === d.day ? C.surface : 'transparent',
            border: `1px solid ${selectedDay?.day === d.day ? C.gold : C.border}`,
            color: C.text, cursor: 'pointer'
          }}>
            <strong>Day {d.day}</strong> <span style={{ color: C.textMid, fontSize: 12, display: 'block' }}>{d.theme}</span>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, background: C.surface, padding: 30, borderRadius: 12, border: `1px solid ${C.border}`, overflowY: 'auto' }}>
        {!selectedDay ? (
          <div style={{ color: C.textMid }}>Select a day to edit content.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: C.text }}>Editing Day {selectedDay.day}</h2>
              <button onClick={handleSave} disabled={saving} style={{
                background: C.gold, color: '#000', padding: '10px 20px', borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer'
              }}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>

            <div>
              <label style={{ display: 'block', color: C.textDim, marginBottom: 8 }}>Theme</label>
              <input value={selectedDay.theme} onChange={e => setSelectedDay({...selectedDay, theme: e.target.value})} style={{
                width: '100%', padding: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8
              }} />
            </div>

            <div>
              <label style={{ display: 'block', color: C.textDim, marginBottom: 8 }}>Patterns (one per line)</label>
              <textarea value={(selectedDay.patterns || []).join('\n')} onChange={e => setSelectedDay({...selectedDay, patterns: e.target.value.split('\n')})} rows={5} style={{
                width: '100%', padding: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontFamily: 'monospace'
              }} />
            </div>

            <div>
              <label style={{ display: 'block', color: C.textDim, marginBottom: 8 }}>SE Strategy (one per line)</label>
              <textarea value={(selectedDay.se_strategy || []).join('\n')} onChange={e => setSelectedDay({...selectedDay, se_strategy: e.target.value.split('\n')})} rows={5} style={{
                width: '100%', padding: 12, background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, fontFamily: 'monospace'
              }} />
            </div>

            <div>
              <h3 style={{ color: C.text, borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>Words ({selectedDay.words?.length || 0})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(selectedDay.words || []).map((w, i) => (
                  <div key={i} style={{ padding: 16, border: `1px solid ${C.border}`, borderRadius: 8, background: C.bg }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <input value={w.w} onChange={e => {
                        const newWords = [...selectedDay.words];
                        newWords[i].w = e.target.value;
                        setSelectedDay({...selectedDay, words: newWords});
                      }} style={{ flex: 1, padding: 8, background: C.surface, color: C.gold, border: `1px solid ${C.border}`, borderRadius: 4, fontWeight: 'bold' }} />
                      <input value={w.pos} onChange={e => {
                        const newWords = [...selectedDay.words];
                        newWords[i].pos = e.target.value;
                        setSelectedDay({...selectedDay, words: newWords});
                      }} style={{ width: 80, padding: 8, background: C.surface, color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 4 }} placeholder="POS" />
                    </div>
                    <textarea value={w.def} onChange={e => {
                      const newWords = [...selectedDay.words];
                      newWords[i].def = e.target.value;
                      setSelectedDay({...selectedDay, words: newWords});
                    }} style={{ width: '100%', padding: 8, background: C.surface, color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, marginBottom: 10 }} placeholder="Definition" rows={2} />
                    <textarea value={w.ex} onChange={e => {
                      const newWords = [...selectedDay.words];
                      newWords[i].ex = e.target.value;
                      setSelectedDay({...selectedDay, words: newWords});
                    }} style={{ width: '100%', padding: 8, background: C.surface, color: C.textMid, border: `1px solid ${C.border}`, borderRadius: 4, fontStyle: 'italic' }} placeholder="Example Sentence" rows={2} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AWA PROMPTS TAB ──────────────────────────────────────────────────────
function AwaTab() {
  const [prompts, setPrompts] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAwa(); }, []);

  const fetchAwa = async () => {
    const { data, error } = await supabase.from('curriculum_awa').select('*').eq('id', 1).single();
    if (!error && data) setPrompts(data.prompts || []);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('curriculum_awa').update({ prompts }).eq('id', 1);
    setSaving(false);
    if (error) alert('Failed to save: ' + error.message);
    else alert('AWA Prompts saved successfully!');
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, margin: 0, color: C.text }}>AWA Prompts Management</h2>
        <button onClick={handleSave} disabled={saving} style={{
          background: C.gold, color: '#000', padding: '10px 20px', borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer'
        }}>{saving ? 'Saving...' : 'Save All Prompts'}</button>
      </div>
      <p style={{ color: C.textMid }}>Edit the list of valid AWA prompts. Enter one prompt per line.</p>
      
      <textarea 
        value={prompts.join('\n')} 
        onChange={e => setPrompts(e.target.value.split('\n').filter(p => p.trim() !== ''))}
        style={{
          width: '100%', height: 600, padding: 20, background: C.surface, color: C.text,
          border: `1px solid ${C.border}`, borderRadius: 12, fontFamily: 'Georgia, serif',
          fontSize: 14, lineHeight: 1.6
        }}
        placeholder="Paste prompts here..."
      />
    </div>
  );
}
