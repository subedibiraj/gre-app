import { useState, useEffect } from 'react';
import C from '../theme';
import Card from './Card';
import Btn from './Btn';
import Tag from './Tag';
import { getGeminiKey, setGeminiKey } from '../lib/gemini';
import { useAuth } from '../lib/auth';
import { pushProgressToCloud } from '../lib/supabase';
import { setPlan } from '../lib/subscription';

const loadJSON = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) || fb; } catch { return fb; } };
const saveJSON = (key, v) => localStorage.setItem(key, JSON.stringify(v));

export default function SettingsPanel({ open, onClose }) {
  const { user, signIn, signOut } = useAuth();
  const [testDate, setTestDate]   = useState(() => loadJSON('gre_testDate', ''));
  const [dailyGoal, setDailyGoal] = useState(() => loadJSON('gre_dailyGoal', 30));
  const [geminiKey, setGeminiKeyState] = useState(() => getGeminiKey());
  const [keyVisible, setKeyVisible]    = useState(false);
  const [keySaved, setKeySaved]        = useState(false);
  const [syncing, setSyncing]          = useState(false);
  const [importing, setImporting]      = useState(false);

  useEffect(() => { saveJSON('gre_testDate', testDate); }, [testDate]);
  useEffect(() => { saveJSON('gre_dailyGoal', dailyGoal); }, [dailyGoal]);

  const daysUntilTest = testDate
    ? Math.max(0, Math.ceil((new Date(testDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const saveKey = () => {
    const trimmed = geminiKey.trim();
    setGeminiKey(trimmed);          // writes to localStorage
    setGeminiKeyState(trimmed);     // keep state in sync
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  // Also save on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveKey();
  };

  const clearKey = () => {
    setGeminiKey('');
    setGeminiKeyState('');
  };

  const exportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('gre_') || k?.startsWith('sr_')) data[k] = localStorage.getItem(k);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gre-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
        setImporting(true);
        setTimeout(() => window.location.reload(), 1000);
      } catch { alert('Invalid backup file'); }
    };
    reader.readAsText(file);
  };

  const syncNow = async () => {
    if (!user) return;
    setSyncing(true);
    await pushProgressToCloud(user.id);
    setSyncing(false);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div className="settings-panel" style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
        padding: '28px 24px', maxWidth: 500, width: '92%',
        maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 18, margin: 0 }}>⚙️ Settings</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 18, padding: 4 }}>✕</button>
        </div>

        {/* ── Google Account ── */}
        <Card style={{ marginBottom: 14 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700 }}>
            Account & Cloud Sync
          </p>
          {user ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {user.user_metadata?.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt="avatar"
                    style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${C.border}` }} />
                )}
                <div>
                  <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p style={{ color: C.textDim, fontSize: 11, margin: '2px 0 0' }}>{user.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn small onClick={syncNow} disabled={syncing}>
                  {syncing ? '⏳ Syncing…' : '☁️ Sync Now'}
                </Btn>
                <Btn small variant="ghost" onClick={signOut}>Sign Out</Btn>
              </div>
              <p style={{ color: C.textDim, fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
                Your progress syncs automatically across all devices every 5 minutes.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: C.textMid, fontSize: 12, marginBottom: 12, lineHeight: 1.6 }}>
                Sign in with Google to sync your progress across devices and never lose your streak.
              </p>
              <button onClick={signIn} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
                borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface,
                color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                transition: 'all 0.15s', width: '100%', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          )}
        </Card>

        {/* ── Admin / Developer Tools ── */}
        {user?.email === 'biraj.077bct031@acem.edu.np' && (
          <Card style={{ marginBottom: 14, border: `1px solid ${C.gold}`, background: `${C.gold}0A` }}>
            <p style={{ color: C.gold, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700 }}>
              🛠️ Developer Tools (Admin Only)
            </p>
            <p style={{ color: C.textMid, fontSize: 12, marginBottom: 12 }}>
              Manually toggle subscription states to test paywalls and premium features.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn small onClick={() => { setPlan('pro'); window.location.reload(); }}>
                Unlock Pro Mode
              </Btn>
              <Btn small variant="ghost" onClick={() => { setPlan('free'); window.location.reload(); }}>
                Reset to Free
              </Btn>
            </div>
          </Card>
        )}

        {/* ── Gemini API Key ── */}
        <Card style={{ marginBottom: 14 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>
            Gemini API Key
          </p>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 10, lineHeight: 1.6 }}>
            Required for AI question generation. Get a free key at{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
              style={{ color: C.gold, textDecoration: 'none' }}>
              aistudio.google.com
            </a>.
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type={keyVisible ? 'text' : 'password'}
                value={geminiKey}
                onChange={e => setGeminiKeyState(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="AIza..."
                style={{
                  width: '100%', padding: '9px 40px 9px 14px',
                  borderRadius: 8, border: `1px solid ${geminiKey ? C.green : C.border}`,
                  background: C.surface, color: C.text, fontSize: 13,
                  fontFamily: 'Courier New, monospace', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button onClick={() => setKeyVisible(v => !v)} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 14,
              }}>
                {keyVisible ? '🙈' : '👁'}
              </button>
            </div>
            <Btn small onClick={saveKey} style={{ background: keySaved ? '#24976A' : undefined }}>
              {keySaved ? '✓ Saved!' : 'Save Key'}
            </Btn>
            {geminiKey && (
              <Btn small variant="ghost" onClick={clearKey}>Clear</Btn>
            )}
          </div>
          {geminiKey ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ color: C.greenBr, fontSize: 11 }}>
                ✓ Key saved — AI features active
              </p>
              <p style={{ color: C.textDim, fontSize: 10, fontFamily: 'Courier New, monospace' }}>
                {geminiKey.slice(0, 8)}...
              </p>
            </div>
          ) : (
            <p style={{ color: C.red, fontSize: 11 }}>
              ✗ No key set — paste your key above and click Save Key
            </p>
          )}
        </Card>

        {/* ── Test Date ── */}
        <Card style={{ marginBottom: 14 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>GRE Test Date</p>
          <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} style={{
            padding: '8px 14px', borderRadius: 6, border: `1px solid ${C.border}`,
            background: C.surface, color: C.text, fontSize: 14,
            fontFamily: 'Courier New,monospace', width: '100%', outline: 'none', boxSizing: 'border-box',
          }} />
          {daysUntilTest !== null && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700,
                color: daysUntilTest <= 7 ? C.red : daysUntilTest <= 30 ? C.gold : C.greenBr,
              }}>{daysUntilTest}</span>
              <div>
                <p style={{ color: C.text, fontSize: 13, fontWeight: 700, margin: 0 }}>days until test</p>
                <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>
                  {daysUntilTest <= 7 ? '🔥 Final sprint! Mocks + weak areas only.'
                    : daysUntilTest <= 14 ? '⚡ Timed practice + mock every 2 days.'
                    : daysUntilTest <= 30 ? '📈 Build consistency. New words + daily practice.'
                    : '📚 You have time. Learn deeply, review often.'}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* ── Daily Goal ── */}
        <Card style={{ marginBottom: 14 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>Daily Study Goal</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[15, 30, 45, 60, 90].map(mins => (
              <button key={mins} onClick={() => setDailyGoal(mins)} style={{
                padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 13,
                background: dailyGoal === mins ? C.gold : C.surface,
                color: dailyGoal === mins ? '#07090F' : C.textMid,
                transition: 'all 0.15s',
              }}>{mins}m</button>
            ))}
          </div>
        </Card>

        {/* ── Progress Backup ── */}
        <Card style={{ marginBottom: 14 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>Local Backup</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Btn small onClick={exportData}>📥 Export JSON</Btn>
            <label style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12,
              background: C.surface, color: C.textMid, cursor: 'pointer',
              border: `1px solid ${C.border}`, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              📤 Import
              <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
            </label>
          </div>
          {importing && <p style={{ color: C.greenBr, fontSize: 12, marginTop: 8 }}>✓ Imported! Reloading...</p>}
        </Card>

        {/* ── Keyboard Shortcuts ── */}
        <Card>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>Keyboard Shortcuts</p>
          {[
            { keys: '1–9', desc: 'Jump to Day 1–9 (Verbal section)' },
            { keys: 'V / Q', desc: 'Switch to Verbal / Quant' },
            { keys: 'P', desc: 'Switch to Practice tab' },
            { keys: 'Esc', desc: 'Close any open panel' },
          ].map(s => (
            <div key={s.keys} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 0' }}>
              <code style={{ fontFamily: 'Courier New,monospace', fontSize: 12, color: C.gold, background: C.surface, padding: '2px 8px', borderRadius: 4, minWidth: 40, textAlign: 'center' }}>
                {s.keys}
              </code>
              <span style={{ color: C.textMid, fontSize: 12 }}>{s.desc}</span>
            </div>
          ))}
        </Card>

      </div>
    </div>
  );
}
