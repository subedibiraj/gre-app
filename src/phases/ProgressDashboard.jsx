import { useState, useMemo } from 'react';
import { getDifficultyProfile } from '../engine/adaptive';
import C from '../theme';
import { getXP, getLevel, getUnlockedAchievements, ACHIEVEMENTS } from '../engine/xp';
import { getStreak } from '../engine/streak';
import { getSRStats, getAllSR, getSRLevel } from '../engine/spaced';
import { DAYS } from '../data/days';
import { QUANT_TOPICS } from '../data/quant-topics';
import { getQuantWeakAreas, getQuantStats } from '../engine/QuantErrorEngine';
import { getBossResult, BOSSES } from '../components/BossChallenge';
import ShareModal from '../components/ShareCard';

const loadJSON = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };

// ─── Sub-components ────────────────────────────────────────────────────────────
function Bar({ value, max, color, height = 6 }) {
  const pct = max > 0 ? Math.min(value / max * 100, 100) : 0;
  return (
    <div style={{ height, background: C.border, borderRadius: height / 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: height / 2, transition: 'width 0.6s ease' }} />
    </div>
  );
}

function StatPill({ icon, label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 100, textAlign: 'center', padding: '12px 8px',
      background: `${color}12`, borderRadius: 10, border: `1px solid ${color}22`,
    }}>
      <p style={{ fontSize: 20, margin: '0 0 3px' }}>{icon}</p>
      <p style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ color: C.textDim, fontSize: 9, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
    </div>
  );
}

// ─── Score Estimation ─────────────────────────────────────────────────────────
// Non-linear ETS GRE score scale (matches actual score distribution)
function scalePct(pct) {
  const p = Math.min(Math.max(pct, 0), 1);
  const bands = [
    [0.00, 0.10, 130, 133], [0.10, 0.18, 133, 136], [0.18, 0.26, 136, 139],
    [0.26, 0.34, 139, 142], [0.34, 0.42, 142, 145], [0.42, 0.50, 145, 148],
    [0.50, 0.56, 148, 151], [0.56, 0.62, 151, 153], [0.62, 0.68, 153, 155],
    [0.68, 0.73, 155, 157], [0.73, 0.78, 157, 159], [0.78, 0.82, 159, 161],
    [0.82, 0.86, 161, 163], [0.86, 0.90, 163, 165], [0.90, 0.93, 165, 167],
    [0.93, 0.96, 167, 168], [0.96, 0.99, 168, 169], [0.99, 1.01, 169, 170],
  ];
  const band = bands.find(([lo, hi]) => p >= lo && p < hi) || bands[bands.length - 1];
  const t = band[1] === band[0] ? 1 : (p - band[0]) / (band[1] - band[0]);
  return Math.round(band[2] + t * (band[3] - band[2]));
}

function estimateScores(dayScores, quantScores) {
  const vEntries = Object.values(dayScores).filter(s => s.total > 0);
  const qEntries = Object.values(quantScores).filter(s => s.total > 0);
  
  const vTotalQs = vEntries.reduce((a, s) => a + s.total, 0);
  const qTotalQs = qEntries.reduce((a, s) => a + s.total, 0);

  // For real GRE prediction, more recent scores should be weighted heavier,
  // but for now we'll do an average and calculate Standard Error of Measurement (SEM).
  const avgVPct = vEntries.length ? vEntries.reduce((a, s) => a + s.correct / s.total, 0) / vEntries.length : 0;
  const avgQPct = qEntries.length ? qEntries.reduce((a, s) => a + s.correct / s.total, 0) / qEntries.length : 0;
  
  const vPoint = avgVPct > 0 ? scalePct(avgVPct) : null;
  const qPoint = avgQPct > 0 ? scalePct(avgQPct) : null;

  // SEM starts at +/- 4 points and shrinks as N questions increases (min +/- 1 point)
  const semV = vTotalQs > 0 ? Math.max(1, 4 - Math.floor(vTotalQs / 40)) : null;
  const semQ = qTotalQs > 0 ? Math.max(1, 4 - Math.floor(qTotalQs / 40)) : null;

  const estV = vPoint ? [Math.max(130, vPoint - semV), Math.min(170, vPoint + semV)] : null;
  const estQ = qPoint ? [Math.max(130, qPoint - semQ), Math.min(170, qPoint + semQ)] : null;
  const estTotal = estV && estQ ? [estV[0] + estQ[0], estV[1] + estQ[1]] : null;

  return { estV, estQ, estTotal, avgV: Math.round(avgVPct * 100), avgQ: Math.round(avgQPct * 100) };
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────
function ScoreGauge({ range, label, color }) {
  const r = 44;
  const cx = 56, cy = 56;
  const pathBG = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  let pathArc = null, arcX = cx, arcY = cy;
  if (range) {
    const [low, high] = range;
    const pctLow = (low - 130) / 40;
    const pctHigh = (high - 130) / 40;
    const a1 = -90 + pctLow * 180;
    const a2 = -90 + pctHigh * 180;
    
    const x1 = cx + r * Math.cos((a1 * Math.PI) / 180);
    const y1 = cy + r * Math.sin((a1 * Math.PI) / 180);
    const x2 = cx + r * Math.cos((a2 * Math.PI) / 180);
    const y2 = cy + r * Math.sin((a2 * Math.PI) / 180);
    
    // SVG arc drawing (large-arc-flag is 0 since difference < 180deg)
    pathArc = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
    
    // For the dot (midpoint)
    const midPct = ((low + high) / 2 - 130) / 40;
    const aMid = -90 + midPct * 180;
    arcX = cx + r * Math.cos((aMid * Math.PI) / 180);
    arcY = cy + r * Math.sin((aMid * Math.PI) / 180);
  }

  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <svg width="112" height="64" viewBox="0 0 112 64">
        {/* Track */}
        <path d={pathBG} fill="none" stroke={C.border} strokeWidth="8" strokeLinecap="round" />
        
        {/* Confidence Interval Fill */}
        {range && pathArc && (
          <path d={pathArc} fill="none" stroke={`${color}66`} strokeWidth="8" strokeLinecap="round" />
        )}
        
        {/* Point estimate dot */}
        {range && (
          <circle cx={arcX} cy={arcY} r="4" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        )}
        
        {/* Score text */}
        <text x="56" y="52" textAnchor="middle" fill={range ? color : C.textDim}
          fontFamily="Courier New,monospace" fontSize="18" fontWeight="700">
          {range ? `${range[0]}-${range[1]}` : '—'}
        </text>
      </svg>
      <p style={{ color: C.textDim, fontSize: 10, margin: '-4px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p style={{ color: C.textDim, fontSize: 9, margin: '2px 0 0' }}>130–170</p>
    </div>
  );
}

// ─── Vocabulary mastery stacked bar ───────────────────────────────────────────
function VocabMastery({ allWords }) {
  const levels = { Mastered: [], Strong: [], Familiar: [], Learning: [], Weak: [], New: [] };
  allWords.forEach(w => {
    const sr = getSRLevel(w.w);
    (levels[sr.label] || levels.New).push(w.w);
  });
  const colors = { Mastered: C.greenBr, Strong: C.green, Familiar: C.gold, Learning: C.blue, Weak: C.red, New: C.textDim };
  const total  = allWords.length;

  return (
    <div>
      {/* Stacked bar */}
      <div style={{ display: 'flex', height: 18, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
        {Object.entries(levels).map(([label, words]) => {
          const pct = (words.length / Math.max(total, 1)) * 100;
          if (!pct) return null;
          return (
            <div key={label} title={`${label}: ${words.length}`} style={{
              width: `${pct}%`, background: colors[label],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: '#07090F',
            }}>
              {pct > 10 ? `${Math.round(pct)}%` : ''}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(levels).map(([label, words]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[label] }} />
            <span style={{ color: C.textDim, fontSize: 10 }}>{label} <strong style={{ color: colors[label] }}>{words.length}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Achievements grid ────────────────────────────────────────────────────────
function AchievementsGrid({ unlocked }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ACHIEVEMENTS : ACHIEVEMENTS.slice(0, 8);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8, marginBottom: 10 }}>
        {visible.map(a => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <div key={a.id} style={{
              background: isUnlocked ? `linear-gradient(135deg, ${C.gold}14, ${C.gold}06)` : C.surface,
              border: `1px solid ${isUnlocked ? C.gold + '44' : C.border}`,
              borderRadius: 10, padding: '10px 12px',
              opacity: isUnlocked ? 1 : 0.45, transition: 'all 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ color: isUnlocked ? C.gold : C.textDim, fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>{a.name}</span>
              </div>
              <p style={{ color: C.textDim, fontSize: 10, margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
              <p style={{ color: isUnlocked ? C.greenBr : C.textDim, fontSize: 9, margin: '4px 0 0', fontFamily: 'Courier New,monospace' }}>
                {isUnlocked ? '✓ Unlocked' : `+${a.xp} XP`}
              </p>
            </div>
          );
        })}
      </div>
      {ACHIEVEMENTS.length > 8 && (
        <button onClick={() => setShowAll(s => !s)} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 12, padding: '4px 0' }}>
          {showAll ? '▲ Show less' : `▼ Show all ${ACHIEVEMENTS.length} achievements`}
        </button>
      )}
    </div>
  );
}

// ─── Boss tracker ─────────────────────────────────────────────────────────────
function BossTracker() {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {BOSSES.map(b => {
        const result = getBossResult(b.id);
        const beaten = result?.beaten;
        return (
          <div key={b.id} style={{
            flex: 1, minWidth: 110, padding: '12px 14px', borderRadius: 10,
            background: beaten ? `${C.greenBr}12` : `${C.red}08`,
            border: `1px solid ${beaten ? C.greenBr + '44' : C.border}`,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 24, margin: '0 0 4px' }}>{beaten ? '🏆' : b.emoji}</p>
            <p style={{ color: beaten ? C.greenBr : C.textMid, fontSize: 11, fontWeight: 700, margin: '0 0 2px' }}>{b.name}</p>
            <p style={{ color: C.textDim, fontSize: 10, margin: '0 0 4px' }}>After Day {b.afterDay}</p>
            {beaten
              ? <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 10, background: `${C.greenBr}22`, color: C.greenBr, fontWeight: 700 }}>✓ Defeated</span>
              : <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 10, background: `${C.border}`, color: C.textDim, fontWeight: 700 }}>Locked</span>}
            {result && !beaten && <p style={{ color: C.red, fontSize: 10, margin: '4px 0 0' }}>Best: {result.score}/{result.total}</p>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Day-by-day verbal table ───────────────────────────────────────────────────
function VerbalTable({ dayScores }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {['Day', 'Theme', 'Match', 'VIC', 'TC', 'SE', 'RC', 'Total'].map(h => (
              <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${C.border}`, fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map(d => {
            const sc = dayScores[d.day];
            const notDone = !sc || Object.keys(sc).length === 0;
            const totalC = notDone ? null : (sc.contrast || 0) + (sc.vic || 0) + (sc.tc || 0) + (sc.se || 0) + (sc.rc || 0);
            const totalM = notDone ? null : (sc.contrastTotal || 0) + (sc.vicTotal || 0) + (sc.tcTotal || 0) + (sc.seTotal || 0) + (sc.rcTotal || 0);
            const pct    = totalM > 0 ? Math.round(totalC / totalM * 100) : null;
            const color  = pct >= 80 ? C.greenBr : pct >= 60 ? C.gold : C.red;
            return (
              <tr key={d.day} style={{ borderBottom: `1px solid ${C.border}`, opacity: notDone ? 0.45 : 1 }}>
                <td style={{ padding: '8px', color: notDone ? C.textDim : C.greenBr, fontFamily: 'Courier New,monospace', fontWeight: 700 }}>D{d.day}</td>
                <td style={{ padding: '8px', color: C.textMid, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.theme}</td>
                <td style={{ padding: '8px', color: C.textMid, fontFamily: 'Courier New,monospace', fontSize: 11 }}>{sc?.contrast != null ? `${sc.contrast}/${sc.contrastTotal}` : '—'}</td>
                <td style={{ padding: '8px', color: C.textMid, fontFamily: 'Courier New,monospace', fontSize: 11 }}>{sc?.vic != null ? `${sc.vic}/${sc.vicTotal}` : '—'}</td>
                <td style={{ padding: '8px', color: C.textMid, fontFamily: 'Courier New,monospace', fontSize: 11 }}>{sc?.tc != null ? `${sc.tc}/${sc.tcTotal}` : '—'}</td>
                <td style={{ padding: '8px', color: C.textMid, fontFamily: 'Courier New,monospace', fontSize: 11 }}>{sc?.se != null ? `${sc.se}/${sc.seTotal}` : '—'}</td>
                <td style={{ padding: '8px', color: C.textMid, fontFamily: 'Courier New,monospace', fontSize: 11 }}>{sc?.rc != null ? `${sc.rc}/${sc.rcTotal}` : '—'}</td>
                <td style={{ padding: '8px', fontFamily: 'Courier New,monospace', fontWeight: 700, color: pct != null ? color : C.textDim }}>{pct != null ? `${pct}%` : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Quant breakdown ──────────────────────────────────────────────────────────
function QuantBreakdown({ quantScores }) {
  const weakAreas = getQuantWeakAreas();
  return (
    <div>
      {QUANT_TOPICS.map(t => {
        const sc  = quantScores[t.id];
        const pct = sc?.total > 0 ? Math.round(sc.correct / sc.total * 100) : null;
        const color = pct >= 80 ? C.greenBr : pct >= 60 ? C.gold : C.red;
        const topicWeak = weakAreas.filter(w => t.subtopics?.includes(w.subtopic)).slice(0, 2);
        return (
          <div key={t.id} style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: topicWeak.length ? 6 : 0 }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span style={{ color: C.text, fontSize: 13, flex: 1 }}>{t.label}</span>
              {pct != null
                ? <>
                    <div style={{ width: 80, height: 5, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: 'Courier New,monospace', fontSize: 12, fontWeight: 700, color, minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                  </>
                : <span style={{ color: C.textDim, fontSize: 11 }}>Not practiced</span>}
            </div>
            {topicWeak.length > 0 && (
              <div style={{ paddingLeft: 28, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {topicWeak.map(w => (
                  <span key={w.subtopic} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: `${C.red}18`, color: C.red, fontWeight: 700 }}>
                    {w.subtopic} {w.accuracy}%
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Study Recommendations ────────────────────────────────────────────────────
function Recommendations({ estV, estQ, avgV, avgQ, weakWords, streak, srStats, quantStats }) {
  const recs = [];
  if (streak.current === 0) recs.push({ icon: '🔥', color: C.red, text: 'Start your streak today. Consistency is the single biggest predictor of a 330+ score.' });
  if (streak.current > 0 && streak.current < 7) recs.push({ icon: '📅', color: C.gold, text: `${streak.current} day streak — keep going! 7 consecutive days unlocks a performance jump.` });
  if (srStats.due > 5) recs.push({ icon: '🔴', color: C.red, text: `${srStats.due} words due for SR review. Do the Weak Word Blitz before any new content.` });
  if (weakWords?.length > 10) recs.push({ icon: '📚', color: C.gold, text: `${weakWords.length} weak words flagged. Run the Blitz daily until this drops below 5.` });
  if (avgV > 0 && avgV < 70) recs.push({ icon: '📖', color: C.blue, text: `Verbal accuracy at ${avgV}%. Focus on TC clue-word strategy and SE synonym pairs.` });
  if (avgQ > 0 && avgQ < 70) recs.push({ icon: '📐', color: C.greenBr, text: `Quant accuracy at ${avgQ}%. Review concept traps in ConceptLearn before more practice.` });
  if (quantStats.weakCount > 2) recs.push({ icon: '⚠️', color: C.gold, text: `${quantStats.weakCount} quant subtopics below 60%. Targeted practice on those topics will have the biggest impact.` });
  if (estV && estV < 155) recs.push({ icon: '🎯', color: C.blue, text: 'Verbal est. below 155. Do timed TC+SE daily — GRE is a pacing game as much as vocab.' });
  if (estQ && estQ < 155) recs.push({ icon: '🎯', color: C.greenBr, text: 'Quant est. below 155. Take a Quant Mock now to see exactly where you\'re losing points.' });
  if ((!estV || !estQ) && streak.current === 0) recs.push({ icon: '🚀', color: C.gold, text: 'Start with today\'s roadmap. 30 days of 1-2 hours/day is enough to hit 330+ with this app.' });
  if (estV && estQ && estV + estQ >= 330) recs.push({ icon: '🏆', color: C.greenBr, text: 'You\'re projecting 330+! Take timed full mocks now to build stamina and eliminate pacing errors.' });
  if (!recs.length) recs.push({ icon: '✨', color: C.gold, text: 'You\'re on track. Keep your streak alive and take a full mock this week.' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {recs.slice(0, 5).map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: `${r.color}0D`, border: `1px solid ${r.color}22`, borderRadius: 8 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>{r.icon}</span>
          <p style={{ color: C.text, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{r.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ color: C.text, fontSize: 14, fontWeight: 700, fontFamily: 'Georgia,serif' }}>{title}</span>
        <span style={{ color: C.textDim, fontSize: 13, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${C.border}` }}>{children}</div>}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProgressDashboard({ dayScores, quantScores, weakWords, currentDay }) {
  const [showShare, setShowShare] = useState(false);
  const adaptiveProfile = getDifficultyProfile();
  const xp         = getXP();
  const level      = getLevel(xp.total);
  const streak     = getStreak();
  const srStats    = getSRStats();
  const quantStats = getQuantStats();
  const unlocked   = getUnlockedAchievements();
  const allWords   = useMemo(() => DAYS.flatMap(d => d.words), []);
  const masteredFormulas = useMemo(() => {
    const raw = loadJSON('gre_formulaMastered', []);
    return Array.isArray(raw) ? raw.length : Object.values(raw).filter(Boolean).length;
  }, []);

  const { estV, estQ, estTotal, avgV, avgQ } = estimateScores(dayScores, quantScores);
  const daysStudied = Object.keys(dayScores).length + Object.keys(quantScores).length;
  const totalPracticed = Object.values(dayScores).reduce((a, s) => a + (s.total || 0), 0)
    + Object.values(quantScores).reduce((a, s) => a + (s.total || 0), 0);

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', paddingBottom: 40, position: 'relative' }}>
      
      {/* Page title & Share Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: C.gold, margin: '0 0 4px' }}>📊 Progress Dashboard</h2>
          <p style={{ color: C.textDim, fontSize: 12, margin: 0 }}>Full picture of your GRE preparation</p>
        </div>
        <button onClick={() => setShowShare(true)} style={{
          padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.blue}44`,
          background: `${C.blue}11`, color: C.blue, cursor: 'pointer', fontWeight: 600,
          fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s'
        }}>
          <span>↗</span> Share Progress
        </button>
      </div>

      {showShare && (
        <ShareModal 
          level={level} 
          streak={streak.current} 
          estTotal={estTotal} 
          onClose={() => setShowShare(false)} 
        />
      )}

      {/* Top stat pills */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatPill icon={level.icon} label="Level" value={level.name} color={C.gold} />
        <StatPill icon="🔥" label="Streak" value={`${streak.current}d`} color="#FF6B35" />
        <StatPill icon="📝" label="Questions" value={totalPracticed} color={C.blue} />
        <StatPill icon="📚" label="Words" value={allWords.length} color={C.greenBr} />
        <StatPill icon="📋" label="Formulas" value={`${masteredFormulas}/68`} color="#9B6BDB" />
      </div>

      {/* Score projection */}
      <Section title="🎯 Estimated GRE Score" defaultOpen={true}>
        <div style={{ paddingTop: 14 }}>
          {daysStudied === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{ color: C.textMid, fontSize: 13 }}>Complete practice sessions to see your estimated score.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
                <ScoreGauge range={estV} label="Verbal" color={C.blue} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 20 }}>
                  <span style={{ color: C.textDim, fontSize: 24, fontWeight: 300 }}>+</span>
                </div>
                <ScoreGauge range={estQ} label="Quant" color={C.greenBr} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 20 }}>
                  <span style={{ color: C.textDim, fontSize: 24, fontWeight: 300 }}>=</span>
                </div>
                <div style={{ textAlign: 'center', flex: 1, minWidth: 100 }}>
                  <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Total (est)</p>
                  <p style={{ fontFamily: 'Courier New,monospace', fontSize: 36, fontWeight: 700, color: estTotal && estTotal[1] >= 330 ? C.greenBr : estTotal && estTotal[1] >= 310 ? C.gold : C.red, margin: 0, lineHeight: 1.2 }}>
                    {estTotal ? `${estTotal[0]}-${estTotal[1]}` : '—'}
                  </p>
                  <p style={{ color: C.textDim, fontSize: 11, margin: '0' }}>/ 340</p>
                </div>
              </div>

              {/* 330 progress bar */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: C.textDim, fontSize: 11 }}>Progress to 330</span>
                  <span style={{ color: C.textDim, fontSize: 11 }}>{estTotal ? `${330 - estTotal[1] > 0 ? 330 - estTotal[1] + ' pts to go (high end)' : '🎯 Target reachable!'}` : '—'}</span>
                </div>
                <Bar value={estTotal ? estTotal[1] - 260 : 0} max={80} color={estTotal && estTotal[1] >= 330 ? C.greenBr : C.gold} height={8} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ color: C.textDim, fontSize: 9 }}>260</span>
                  <span style={{ color: C.gold, fontSize: 9 }}>330 target</span>
                  <span style={{ color: C.textDim, fontSize: 9 }}>340</span>
                </div>
              </div>
            </>
          )}
        </div>
      </Section>

      {/* XP & level */}
      <Section title={`⚡ XP & Level — ${level.icon} ${level.name}`} defaultOpen={false}>
        <div style={{ paddingTop: 14 }}>
          <div style={{ background: `${C.gold}12`, borderRadius: 10, padding: '14px 16px', marginBottom: 14, border: `1px solid ${C.gold}22` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 32, fontWeight: 700, color: C.gold }}>{xp.total}</span>
              <span style={{ color: C.textMid, fontSize: 11 }}>Today +{xp.today} XP</span>
            </div>
            <Bar value={level.progress * 100} max={100} color={C.gold} height={8} />
            {level.nextLevel && (
              <p style={{ color: C.textDim, fontSize: 11, marginTop: 6 }}>
                {level.nextLevel.min - xp.total} XP to {level.nextLevel.icon} {level.nextLevel.name}
              </p>
            )}
          </div>
          <AchievementsGrid unlocked={unlocked} />
        </div>
      </Section>

      {/* Vocabulary mastery */}
      <Section title="📚 Vocabulary Mastery" defaultOpen={true}>
        <div style={{ paddingTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: C.textDim, fontSize: 12 }}>{allWords.length} total words across {DAYS.length} days</span>
            {weakWords?.length > 0 && <span style={{ color: C.red, fontSize: 12, fontWeight: 700 }}>⚠️ {weakWords.length} flagged weak</span>}
          </div>
          <VocabMastery allWords={allWords} />
          {srStats.due > 0 && (
            <div style={{ marginTop: 12, padding: '8px 14px', background: `${C.red}12`, borderRadius: 8, border: `1px solid ${C.red}22` }}>
              <p style={{ color: C.red, fontSize: 12, margin: 0 }}>🔴 <strong>{srStats.due}</strong> words due for spaced repetition review — do the Morning Drill or Weak Word Blitz.</p>
            </div>
          )}
        </div>
      </Section>

      {/* Verbal performance */}
      <Section title="📖 Verbal Performance — Day by Day" defaultOpen={false}>
        <div style={{ paddingTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ color: C.textMid, fontSize: 12 }}>Overall accuracy:</span>
            <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 16, color: avgV >= 80 ? C.greenBr : avgV >= 60 ? C.gold : avgV > 0 ? C.red : C.textDim }}>
              {avgV > 0 ? `${avgV}%` : '—'}
            </span>
          </div>
          <VerbalTable dayScores={dayScores} />
        </div>
      </Section>

      {/* Quant performance */}
      <Section title="📐 Quant Performance — By Topic" defaultOpen={false}>
        <div style={{ paddingTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ color: C.textMid, fontSize: 12 }}>Overall accuracy:</span>
            <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 16, color: avgQ >= 80 ? C.greenBr : avgQ >= 60 ? C.gold : avgQ > 0 ? C.red : C.textDim }}>
              {avgQ > 0 ? `${avgQ}%` : '—'}
            </span>
            <span style={{ color: C.textDim, fontSize: 11 }}>· {quantStats.totalAttempts} questions attempted</span>
          </div>
          <QuantBreakdown quantScores={quantScores} />
        </div>
      </Section>

      {/* Boss battles */}
      <Section title="⚔️ Boss Battles" defaultOpen={false}>
        <div style={{ paddingTop: 14 }}>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 12 }}>Defeat all 3 bosses to prove you've mastered cumulative vocabulary.</p>
          <BossTracker />
        </div>
      </Section>

      {/* Formula mastery */}
      <Section title="📋 Formula Sheet Mastery" defaultOpen={false}>
        <div style={{ paddingTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: C.textMid, fontSize: 13 }}>{masteredFormulas} / 68 formulas mastered</span>
            <span style={{ color: masteredFormulas >= 50 ? C.greenBr : C.gold, fontSize: 13, fontWeight: 700 }}>{Math.round(masteredFormulas / 68 * 100)}%</span>
          </div>
          <Bar value={masteredFormulas} max={68} color={C.gold} height={10} />
          <p style={{ color: C.textDim, fontSize: 11, marginTop: 8 }}>
            {masteredFormulas < 34 ? '⚠️ Under 50% — spend 10 min on the formula sheet daily.' :
             masteredFormulas < 55 ? '💪 Good progress — push toward 80% before your exam.' :
             '🎯 Formula sheet solid. Maintain with quick reviews.'}
          </p>
        </div>
      </Section>

      {/* Adaptive Performance Breakdown */}
      <Section title="🧠 Performance by Question Type" defaultOpen={true}>
        <div style={{ paddingTop: 14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
            {[
              { sec:'vic',  label:'VIC',      icon:'📝', cat:'verbal' },
              { sec:'tc',   label:'TC',       icon:'🔤', cat:'verbal' },
              { sec:'se',   label:'SE',       icon:'⚡', cat:'verbal' },
              { sec:'rc',   label:'RC',       icon:'📖', cat:'verbal' },
              { sec:'qc',   label:'QC',       icon:'⚖️', cat:'quant' },
              { sec:'mc',   label:'MC',       icon:'🔢', cat:'quant' },
              { sec:'ne',   label:'NE',       icon:'✏️', cat:'quant' },
            ].map(({ sec, label, icon, cat }) => {
              const p = cat === 'verbal' ? adaptiveProfile.verbal[sec] : adaptiveProfile.quant[sec];
              const lvl = p?.level || null;
              const acc = p?.acc;
              const status = p?.status || 'calibrating';
              const color = status === 'advanced' ? C.greenBr : status === 'proficient' ? C.green : status === 'competent' ? C.gold : status === 'developing' ? '#E4A060' : status === 'struggling' ? C.red : C.textDim;
              const barWidth = acc !== null ? `${acc}%` : '0%';
              return (
                <div key={sec} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 12px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                    <span style={{ fontSize:14 }}>{icon}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{label}</span>
                    {lvl && <span style={{ fontSize:10, color, background:color+'22', padding:'1px 6px', borderRadius:4, marginLeft:'auto', fontWeight:700 }}>L{lvl}</span>}
                  </div>
                  {acc !== null ? (
                    <>
                      <div style={{ height:4, background:C.surface, borderRadius:2, marginBottom:6, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:barWidth, background:color, borderRadius:2, transition:'width 0.6s ease' }} />
                      </div>
                      <p style={{ fontSize:12, color, fontFamily:'Courier New,monospace', fontWeight:700, margin:0 }}>{acc}%</p>
                      <p style={{ fontSize:10, color:C.textDim, margin:'2px 0 0', textTransform:'capitalize' }}>{status}</p>
                    </>
                  ) : (
                    <p style={{ fontSize:11, color:C.textDim, margin:0 }}>Not yet practiced</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Recommendations */}
      <Section title="💡 Personalised Recommendations" defaultOpen={true}>
        <div style={{ paddingTop: 14 }}>
          <Recommendations
            estV={estV} estQ={estQ} avgV={avgV} avgQ={avgQ}
            weakWords={weakWords} streak={streak}
            srStats={srStats} quantStats={quantStats}
          />
        </div>
      </Section>
    </div>
  );
}

