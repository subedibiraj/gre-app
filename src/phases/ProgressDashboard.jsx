import { useState, useMemo } from 'react';
import C from '../theme';
import { getXP, getLevel } from '../engine/xp';
import { getStreak } from '../engine/streak';
import { DAYS } from '../data/days';
import { QUANT_TOPICS } from '../data/quant-topics';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const loadJSON = (key, fb) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } };

function MiniBar({ value, max, color, label, height = 6 }) {
  const pct = max > 0 ? Math.min(value / max * 100, 100) : 0;
  return (
    <div style={{ flex: 1 }}>
      {label && <p style={{ color: C.textDim, fontSize: 10, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>}
      <div style={{ height, background: C.border, borderRadius: height / 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: height / 2, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color, glow }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}12, ${color}06)`,
      border: `1px solid ${color}22`, borderRadius: 12, padding: '16px 18px',
      flex: 1, minWidth: 120, transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      </div>
      <p style={{ fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 800, color, margin: 0 }}>{value}</p>
      {sub && <p style={{ color: C.textDim, fontSize: 11, margin: '4px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProgressDashboard({ dayScores, quantScores, weakWords, currentDay }) {
  const xp = getXP();
  const level = getLevel(xp.total);
  const streak = getStreak();
  const totalWords = DAYS.slice(0, currentDay).flatMap(d => d.words).length;
  const masteredFormulas = loadJSON('gre_formulaMastered', {});
  const masteredCount = Object.values(masteredFormulas).filter(Boolean).length;

  // Verbal stats
  const verbalScores = Object.entries(dayScores).map(([day, scores]) => ({
    day: parseInt(day),
    ...scores,
    pct: scores.total > 0 ? Math.round(scores.correct / scores.total * 100) : 0,
  })).sort((a, b) => a.day - b.day);
  const avgVerbal = verbalScores.length > 0 ? Math.round(verbalScores.reduce((a, s) => a + s.pct, 0) / verbalScores.length) : 0;

  // Quant stats
  const quantEntries = Object.entries(quantScores).map(([topic, sc]) => ({
    topic,
    label: QUANT_TOPICS.find(t => t.id === topic)?.label || topic,
    icon: QUANT_TOPICS.find(t => t.id === topic)?.icon || '📐',
    ...sc,
    pct: sc.total > 0 ? Math.round(sc.correct / sc.total * 100) : 0,
  }));
  const avgQuant = quantEntries.length > 0 ? Math.round(quantEntries.reduce((a, s) => a + s.pct, 0) / quantEntries.length) : 0;

  // Weak areas
  const weakVerbalDays = verbalScores.filter(s => s.pct < 70).sort((a, b) => a.pct - b.pct).slice(0, 3);
  const weakQuantTopics = quantEntries.filter(s => s.pct < 70).sort((a, b) => a.pct - b.pct).slice(0, 3);

  // Estimated scores (rough mapping)
  const estVerbal = Math.min(170, Math.round(130 + avgVerbal * 0.4));
  const estQuant = Math.min(170, Math.round(130 + avgQuant * 0.4));
  const estTotal = estVerbal + estQuant;

  // Study time estimate
  const daysStudied = verbalScores.length + quantEntries.length;
  const totalPracticed = verbalScores.reduce((a, s) => a + s.total, 0) + quantEntries.reduce((a, s) => a + s.total, 0);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 0 40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: C.gold, margin: '0 0 4px' }}>
          📊 Progress Analytics
        </h2>
        <p style={{ color: C.textDim, fontSize: 12 }}>Track your journey to 330+</p>
      </div>

      {/* Top Stats Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard icon={level.icon} label="Level" value={level.name} sub={`${xp.total} XP earned`} color={C.gold} />
        <StatCard icon="🔥" label="Streak" value={`${streak.current}d`} sub={`Best: ${streak.best} days`} color="#FF6B35" />
        <StatCard icon="📝" label="Practiced" value={totalPracticed} sub={`${daysStudied} sessions`} color={C.blue} />
        <StatCard icon="📚" label="Words" value={totalWords} sub={`${weakWords.length} flagged weak`} color={C.greenBr} />
      </div>

      {/* Estimated Score */}
      <div style={{
        background: `linear-gradient(135deg, ${C.gold}15, ${C.blue}10, ${C.greenBr}08)`,
        border: `1px solid ${C.gold}33`, borderRadius: 14, padding: '20px 24px', marginBottom: 20,
        textAlign: 'center',
      }}>
        <p style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
          Estimated GRE Score
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 40, fontWeight: 800, color: C.gold, margin: 0 }}>
              {daysStudied > 0 ? estTotal : '—'}
            </p>
            <p style={{ color: C.textDim, fontSize: 11 }}>Total</p>
          </div>
          <span style={{ color: C.textDim, fontSize: 20 }}>=</span>
          <div>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 24, fontWeight: 700, color: C.blue, margin: 0 }}>{daysStudied > 0 ? estVerbal : '—'}</p>
            <p style={{ color: C.textDim, fontSize: 10 }}>Verbal</p>
          </div>
          <span style={{ color: C.textDim, fontSize: 20 }}>+</span>
          <div>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 24, fontWeight: 700, color: C.greenBr, margin: 0 }}>{daysStudied > 0 ? estQuant : '—'}</p>
            <p style={{ color: C.textDim, fontSize: 10 }}>Quant</p>
          </div>
        </div>
        {daysStudied === 0 && <p style={{ color: C.textMid, fontSize: 12, marginTop: 8 }}>Complete practice sessions to see your estimated score</p>}
        {daysStudied > 0 && estTotal < 330 && (
          <p style={{ color: C.gold, fontSize: 11, marginTop: 8 }}>
            💡 {330 - estTotal} points to go! Focus on your weak areas below.
          </p>
        )}
        {daysStudied > 0 && estTotal >= 330 && (
          <p style={{ color: C.greenBr, fontSize: 11, marginTop: 8 }}>🎯 You're on track for 330+! Keep it up!</p>
        )}
      </div>

      {/* Two Column: Verbal & Quant Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Verbal */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: C.blue, margin: 0 }}>📖 Verbal</h3>
            <span style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 800, color: avgVerbal >= 80 ? C.greenBr : avgVerbal >= 50 ? C.gold : C.red }}>{avgVerbal}%</span>
          </div>
          <MiniBar value={avgVerbal} max={100} color={C.blue} label={`${verbalScores.length} days practiced`} />
          {verbalScores.slice(-5).map(s => (
            <div key={s.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.textMid, fontSize: 11 }}>Day {s.day}</span>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 12, fontWeight: 700, color: s.pct >= 80 ? C.greenBr : s.pct >= 50 ? C.gold : C.red }}>{s.pct}%</span>
            </div>
          ))}
          {verbalScores.length === 0 && <p style={{ color: C.textDim, fontSize: 11, marginTop: 8 }}>No verbal practice yet</p>}
        </div>

        {/* Quant */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: C.greenBr, margin: 0 }}>📐 Quant</h3>
            <span style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 800, color: avgQuant >= 80 ? C.greenBr : avgQuant >= 50 ? C.gold : C.red }}>{avgQuant}%</span>
          </div>
          <MiniBar value={avgQuant} max={100} color={C.greenBr} label={`${quantEntries.length} topics practiced`} />
          {quantEntries.map(s => (
            <div key={s.topic} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.textMid, fontSize: 11 }}>{s.icon} {s.label}</span>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 12, fontWeight: 700, color: s.pct >= 80 ? C.greenBr : s.pct >= 50 ? C.gold : C.red }}>{s.pct}%</span>
            </div>
          ))}
          {quantEntries.length === 0 && <p style={{ color: C.textDim, fontSize: 11, marginTop: 8 }}>No quant practice yet</p>}
        </div>
      </div>

      {/* Weak Areas */}
      {(weakVerbalDays.length > 0 || weakQuantTopics.length > 0) && (
        <div style={{
          background: `linear-gradient(135deg, ${C.red}08, ${C.card})`,
          border: `1px solid ${C.red}22`, borderRadius: 12, padding: '16px 18px', marginBottom: 20,
        }}>
          <h3 style={{ fontSize: 13, color: C.red, margin: '0 0 12px', fontWeight: 700 }}>
            ⚠️ Focus Areas (below 70%)
          </h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {weakVerbalDays.map(s => (
              <div key={s.day} style={{ background: C.surface, borderRadius: 8, padding: '8px 14px', border: `1px solid ${C.border}` }}>
                <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: 0 }}>📖 Verbal Day {s.day}</p>
                <p style={{ color: C.red, fontSize: 11, margin: '2px 0 0', fontFamily: 'Courier New,monospace' }}>{s.pct}% ({s.correct}/{s.total})</p>
              </div>
            ))}
            {weakQuantTopics.map(s => (
              <div key={s.topic} style={{ background: C.surface, borderRadius: 8, padding: '8px 14px', border: `1px solid ${C.border}` }}>
                <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: 0 }}>{s.icon} {s.label}</p>
                <p style={{ color: C.red, fontSize: 11, margin: '2px 0 0', fontFamily: 'Courier New,monospace' }}>{s.pct}% ({s.correct}/{s.total})</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formula Mastery */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: C.gold, margin: 0 }}>📋 Formula Mastery</h3>
          <span style={{ fontFamily: 'Courier New,monospace', fontSize: 14, fontWeight: 700, color: C.gold }}>{masteredCount}/68</span>
        </div>
        <MiniBar value={masteredCount} max={68} color={C.gold} label={`${Math.round(masteredCount / 68 * 100)}% mastered`} />
      </div>

      {/* Study Recommendations */}
      <div style={{
        background: `linear-gradient(135deg, ${C.greenBr}08, ${C.card})`,
        border: `1px solid ${C.greenBr}22`, borderRadius: 12, padding: '16px 18px',
      }}>
        <h3 style={{ fontSize: 13, color: C.greenBr, margin: '0 0 12px', fontWeight: 700 }}>💡 Recommendations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {streak.current === 0 && (
            <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>🔥 Start a streak today! Consistency is the #1 factor for 330+.</p>
          )}
          {weakWords.length > 10 && (
            <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>📚 You have {weakWords.length} weak words. Review them daily to lock in vocabulary.</p>
          )}
          {masteredCount < 34 && (
            <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>📋 Master at least 50% of formulas. You're at {Math.round(masteredCount / 68 * 100)}%.</p>
          )}
          {avgVerbal > 0 && avgVerbal < 75 && (
            <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>📖 Verbal avg is {avgVerbal}%. Focus on TC patterns and word clusters.</p>
          )}
          {avgQuant > 0 && avgQuant < 75 && (
            <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>📐 Quant avg is {avgQuant}%. Review concept traps and do more timed practice.</p>
          )}
          {daysStudied === 0 && (
            <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>🚀 Get started! Complete your first Verbal and Quant practice sessions.</p>
          )}
          {avgVerbal >= 80 && avgQuant >= 80 && (
            <p style={{ color: C.greenBr, fontSize: 12, margin: 0 }}>🎯 Both sections above 80%! Focus on timed mock exams to build stamina.</p>
          )}
        </div>
      </div>
    </div>
  );
}
