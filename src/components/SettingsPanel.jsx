import { useState, useEffect } from 'react';
import C from '../theme';
import Card from './Card';
import Btn from './Btn';
import Tag from './Tag';

const loadJSON = (key, fb) => { try { return JSON.parse(localStorage.getItem(key)) || fb; } catch { return fb; } };
const saveJSON = (key, v) => localStorage.setItem(key, JSON.stringify(v));

export default function SettingsPanel({ open, onClose }) {
  const [testDate, setTestDate] = useState(() => loadJSON('gre_testDate', ''));
  const [dailyGoal, setDailyGoal] = useState(() => loadJSON('gre_dailyGoal', 30));
  const [importing, setImporting] = useState(false);

  useEffect(() => { saveJSON('gre_testDate', testDate); }, [testDate]);
  useEffect(() => { saveJSON('gre_dailyGoal', dailyGoal); }, [dailyGoal]);

  const daysUntilTest = testDate
    ? Math.max(0, Math.ceil((new Date(testDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const exportData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('gre_') || key.startsWith('sr_')) {
        data[key] = localStorage.getItem(key);
      }
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
        Object.entries(data).forEach(([key, val]) => localStorage.setItem(key, val));
        setImporting(true);
        setTimeout(() => window.location.reload(), 1000);
      } catch { alert('Invalid backup file'); }
    };
    reader.readAsText(file);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
        padding: '28px 24px', maxWidth: 480, width: '90%', maxHeight: '80vh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 18, margin: 0 }}>⚙️ Settings & Study Plan</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {/* Test Date */}
        <Card style={{ marginBottom: 16 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>GRE Test Date</p>
          <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} style={{
            padding: '8px 14px', borderRadius: 6, border: `1px solid ${C.border}`,
            background: C.surface, color: C.text, fontSize: 14, fontFamily: 'Courier New,monospace',
            width: '100%', outline: 'none',
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
                  {daysUntilTest <= 7 ? '🔥 Final sprint! Review weak areas + full mocks only.'
                    : daysUntilTest <= 14 ? '⚡ Focus on timed practice + mocks every 2 days.'
                    : daysUntilTest <= 30 ? '📈 Build consistency. New words + daily practice.'
                    : '📚 You have time. Learn deeply, review often.'}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Daily Goal */}
        <Card style={{ marginBottom: 16 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>Daily Study Goal</p>
          <div style={{ display: 'flex', gap: 8 }}>
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
          <p style={{ color: C.textDim, fontSize: 11, marginTop: 6 }}>
            Recommended: {daysUntilTest && daysUntilTest <= 14 ? '60-90 min' : '30-45 min'} per day
          </p>
        </Card>

        {/* Suggested Plan */}
        <Card style={{ marginBottom: 16 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>Daily Study Routine</p>
          {[
            { time: '5 min', task: 'Warm-up: Quick Match + review flagged words', icon: '🔄' },
            { time: '10 min', task: 'Vocabulary: New day\'s words + SR review', icon: '📖' },
            { time: '10 min', task: 'Practice: VIC + TC + SE (timed)', icon: '⚔️' },
            { time: '5 min', task: 'RC Passage: Read + answer carefully', icon: '📝' },
            { time: '5 min', task: 'Roots: Learn 3-5 new roots or quiz', icon: '🌱' },
            { time: dailyGoal >= 45 ? '15 min' : '—', task: 'Quant: 1 topic practice set', icon: '🧮' },
            { time: 'Weekly', task: 'Full Mock Exam (V + Q separately)', icon: '🎯' },
          ].filter(s => s.time !== '—').map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: i < 6 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 14, width: 24 }}>{s.icon}</span>
              <Tag color={C.textDim}>{s.time}</Tag>
              <span style={{ color: C.textMid, fontSize: 12, flex: 1 }}>{s.task}</span>
            </div>
          ))}
        </Card>

        {/* Data Management */}
        <Card style={{ marginBottom: 16 }}>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>Progress Backup</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn small onClick={exportData}>📥 Export Progress</Btn>
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
          <p style={{ color: C.textDim, fontSize: 11, marginTop: 8 }}>
            Export your progress to a JSON file. Import it on another device or after clearing data.
          </p>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>Keyboard Shortcuts</p>
          {[
            { keys: '1-7', desc: 'Jump to Day 1-7 (Verbal)' },
            { keys: 'V / Q', desc: 'Switch to Verbal / Quant' },
            { keys: 'P', desc: 'Practice tab' },
            { keys: 'Esc', desc: 'Close panels' },
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
