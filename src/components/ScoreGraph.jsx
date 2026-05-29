import { useState, useMemo } from 'react';
import C from '../theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getScoreHistory() {
  try { return JSON.parse(localStorage.getItem('gre_score_history')) || []; }
  catch { return []; }
}

export function recordScoreSnapshot(verbal, quant) {
  const history = getScoreHistory();
  const today   = new Date().toDateString();
  // Only record once per day (update if already exists today)
  const todayIdx = history.findIndex(h => h.date === today);
  const entry    = { date: today, verbal, quant, total: verbal + quant, ts: Date.now() };
  if (todayIdx >= 0) history[todayIdx] = entry;
  else history.push(entry);
  // Keep last 60 days
  localStorage.setItem('gre_score_history', JSON.stringify(history.slice(-60)));
}

function getActivityData() {
  // Returns last 10 weeks of study activity (questions answered per day)
  try { return JSON.parse(localStorage.getItem('gre_activity')) || {}; }
  catch { return {}; }
}

export function recordActivity(count = 1) {
  const data    = getActivityData();
  const today   = new Date().toDateString();
  data[today]   = (data[today] || 0) + count;
  localStorage.setItem('gre_activity', JSON.stringify(data));
}

// ─── Mini sparkline ───────────────────────────────────────────────────────────
function Sparkline({ data, color, width = 280, height = 56 }) {
  if (!data || data.length < 2) return null;
  const min    = Math.min(...data) - 2;
  const max    = Math.max(...data) + 2;
  const range  = max - min || 1;
  const pts    = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / range) * height,
  ]);
  const path   = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area   = `${path} L${width},${height} L0,${height} Z`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`grad_${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad_${color.replace('#', '')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r={4} fill={color}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {/* First point dot */}
      <circle cx={pts[0][0]} cy={pts[0][1]} r={3} fill={color} opacity={0.5} />
    </svg>
  );
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────
function StudyHeatmap() {
  const activity = getActivityData();
  const WEEKS    = 10;
  const DAYS     = 7;
  const today    = new Date();

  // Build grid: last 10 weeks, 7 days each
  const cells = [];
  for (let w = WEEKS - 1; w >= 0; w--) {
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (today.getDay() - d + 7) % 7));
      // Align properly: today is always in the last column at current day-of-week
      const offset = (WEEKS - 1) * 7 + today.getDay();
      const dayOffset = offset - (w * 7 + d);
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - dayOffset);
      if (cellDate > today) { cells.push({ date: null, count: 0 }); continue; }
      const key   = cellDate.toDateString();
      const count = activity[key] || 0;
      cells.push({ date: key, count, label: cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
    }
  }

  const maxCount = Math.max(...cells.map(c => c.count), 1);

  const getColor = (count) => {
    if (!count) return C.border;
    const pct = count / maxCount;
    if (pct >= 0.75) return C.greenBr;
    if (pct >= 0.5)  return C.green;
    if (pct >= 0.25) return C.gold;
    return C.goldDim;
  };

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-start', overflowX: 'auto' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 0, marginRight: 4 }}>
          {days.map((d, i) => (
            <span key={i} style={{ fontSize: 9, color: C.textDim, height: 10, lineHeight: '10px' }}>{d}</span>
          ))}
        </div>
        {/* Grid — week columns */}
        {Array.from({ length: WEEKS }, (_, w) => (
          <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: DAYS }, (_, d) => {
              const cell = cells[w * DAYS + d];
              return (
                <div key={d} title={cell?.date ? `${cell.label}: ${cell.count} questions` : ''} style={{
                  width: 10, height: 10, borderRadius: 2,
                  background: cell?.date ? getColor(cell.count) : 'transparent',
                  transition: 'background 0.2s',
                  cursor: cell?.count ? 'default' : 'default',
                  opacity: cell?.date ? 1 : 0,
                }} />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <span style={{ color: C.textDim, fontSize: 9 }}>Less</span>
        {[0, C.goldDim, C.gold, C.green, C.greenBr].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c || C.border }} />
        ))}
        <span style={{ color: C.textDim, fontSize: 9 }}>More</span>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ScoreGraph({ dayScores, quantScores }) {
  const [view, setView] = useState('trend'); // trend | heatmap

  const history = getScoreHistory();

  // Compute estimated scores from practice data over time
  // Build a virtual score history from dayScores + quantScores timestamps
  const scoreHistory = useMemo(() => {
    if (history.length > 0) return history;
    // Fall back: compute a single current estimate
    const verbalScores = Object.values(dayScores || {});
    const quantEntries = Object.values(quantScores || {});
    if (!verbalScores.length && !quantEntries.length) return [];
    const avgV = verbalScores.length
      ? verbalScores.reduce((a, s) => a + (s.total > 0 ? s.correct / s.total : 0), 0) / verbalScores.length
      : 0;
    const avgQ = quantEntries.length
      ? quantEntries.reduce((a, s) => a + (s.total > 0 ? s.correct / s.total : 0), 0) / quantEntries.length
      : 0;
    const estV = Math.round(130 + avgV * 40);
    const estQ = Math.round(130 + avgQ * 40);
    return [{ date: new Date().toDateString(), verbal: estV, quant: estQ, total: estV + estQ }];
  }, [history, dayScores, quantScores]);

  const verbalData = scoreHistory.map(h => h.verbal).filter(Boolean);
  const quantData  = scoreHistory.map(h => h.quant).filter(Boolean);
  const totalData  = scoreHistory.map(h => h.total).filter(Boolean);

  const latestVerbal = verbalData[verbalData.length - 1] || 0;
  const latestQuant  = quantData[quantData.length - 1] || 0;
  const latestTotal  = totalData[totalData.length - 1] || 0;

  const firstVerbal  = verbalData[0] || latestVerbal;
  const firstQuant   = quantData[0] || latestQuant;
  const firstTotal   = totalData[0] || latestTotal;

  const deltaV = latestVerbal - firstVerbal;
  const deltaQ = latestQuant - firstQuant;
  const deltaT = latestTotal - firstTotal;

  const hasData = scoreHistory.length > 0;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 16, margin: 0 }}>📈 Score Trajectory</h3>
          <p style={{ color: C.textDim, fontSize: 11, margin: '2px 0 0' }}>Your estimated GRE score over time</p>
        </div>
        <div style={{ display: 'flex', background: C.surface, borderRadius: 8, padding: 3, gap: 2 }}>
          {['trend', 'heatmap'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
              background: view === v ? C.gold : 'transparent',
              color: view === v ? '#07090F' : C.textMid,
              transition: 'all 0.15s',
            }}>{v === 'trend' ? '📈 Trend' : '🗓 Activity'}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 20px 16px' }}>
        {view === 'trend' ? (
          !hasData ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: 32, margin: '0 0 8px' }}>📊</p>
              <p style={{ color: C.textMid, fontSize: 14, marginBottom: 4 }}>No score history yet</p>
              <p style={{ color: C.textDim, fontSize: 12 }}>Complete practice sessions to see your score trend here.</p>
            </div>
          ) : (
            <>
              {/* Score deltas */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Verbal', score: latestVerbal, delta: deltaV, color: C.blue },
                  { label: 'Quant', score: latestQuant, delta: deltaQ, color: C.greenBr },
                  { label: 'Total', score: latestTotal, delta: deltaT, color: C.gold },
                ].map(s => (
                  <div key={s.label} style={{
                    flex: 1, textAlign: 'center', padding: '12px 8px',
                    background: `${s.color}12`, borderRadius: 10, border: `1px solid ${s.color}22`,
                  }}>
                    <p style={{ color: C.textDim, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>{s.label}</p>
                    <p style={{ fontFamily: 'Courier New,monospace', fontSize: 22, fontWeight: 700, color: s.color, margin: 0 }}>{s.score || '—'}</p>
                    {s.delta !== 0 && s.score && (
                      <p style={{ color: s.delta > 0 ? C.greenBr : C.red, fontSize: 11, margin: '3px 0 0', fontFamily: 'Courier New,monospace' }}>
                        {s.delta > 0 ? '▲' : '▼'}{Math.abs(s.delta)} pts
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Sparklines */}
              {totalData.length >= 2 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Score Trend</span>
                    <span style={{ color: C.gold, fontSize: 11, fontFamily: 'Courier New,monospace' }}>Target: 330</span>
                  </div>
                  <Sparkline data={totalData} color={C.gold} width={300} height={60} />

                  {/* Target line annotation */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 16, height: 2, background: C.blue, borderRadius: 1 }} />
                      <span style={{ color: C.textDim, fontSize: 10 }}>Verbal</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 16, height: 2, background: C.greenBr, borderRadius: 1 }} />
                      <span style={{ color: C.textDim, fontSize: 10 }}>Quant</span>
                    </div>
                  </div>

                  {verbalData.length >= 2 && quantData.length >= 2 && (
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                      <div style={{ flex: 1 }}>
                        <Sparkline data={verbalData} color={C.blue} width={130} height={36} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Sparkline data={quantData} color={C.greenBr} width={130} height={36} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 330 gap message */}
              {latestTotal > 0 && (
                <div style={{
                  marginTop: 12, padding: '10px 14px', borderRadius: 8,
                  background: latestTotal >= 330 ? `${C.greenBr}15` : `${C.gold}12`,
                  border: `1px solid ${latestTotal >= 330 ? C.greenBr : C.gold}22`,
                }}>
                  <p style={{ color: latestTotal >= 330 ? C.greenBr : C.gold, fontSize: 12, margin: 0 }}>
                    {latestTotal >= 330
                      ? '🎯 You\'re on track for 330+! Maintain consistency.'
                      : `💡 ${330 - latestTotal} points to 330. Stay consistent — your trend is the evidence.`}
                  </p>
                </div>
              )}
            </>
          )
        ) : (
          <>
            <p style={{ color: C.textDim, fontSize: 11, marginBottom: 12 }}>Study activity — last 10 weeks</p>
            <StudyHeatmap />
            <div style={{ marginTop: 16, padding: '10px 14px', background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
              <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>
                💡 <strong style={{ color: C.gold }}>The heatmap never lies.</strong> Every green cell is a day you showed up. Gaps compound into lost points.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
