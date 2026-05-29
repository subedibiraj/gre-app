import { useState, useMemo } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { getDueWords, getSRLevel, getSRStats, getWeakWordsSR } from '../engine/spaced';
import { getStreak } from '../engine/streak';
import Btn from './Btn';
import Tag from './Tag';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRecommendedDay() {
  try {
    const scores = JSON.parse(localStorage.getItem('gre_dayScores') || '{}');
    const practiced = Object.keys(scores).map(Number).filter(Boolean);
    if (practiced.length === 0) return 1;
    const maxDone = Math.max(...practiced);
    const latest = scores[maxDone];
    const allSections = ['tc', 'se', 'vic'].every(k => latest?.[k] != null);
    return allSections ? Math.min(maxDone + 1, DAYS.length) : maxDone;
  } catch { return 1; }
}

const AGENDA = [
  { icon: '📖', time: '10', label: 'Vocabulary', desc: 'Study words + TC Patterns + SE Strategy tab' },
  { icon: '✍️', time: '15', label: 'Verbal Practice', desc: 'Contrast Recall → VIC → TC → SE → RC' },
  { icon: '📐', time: '10', label: 'Quant Concepts', desc: 'One topic: concept cards + worked examples' },
  { icon: '⚔️', time: '10', label: 'Quant Practice', desc: 'AI-generated QC + PS questions' },
  { icon: '🔍', time: '5',  label: 'Error Review', desc: 'Understand every wrong answer before moving on' },
];

export default function WarmupModal({ onClose }) {
  const allWords = useMemo(() => DAYS.flatMap(d => d.words), []);
  const streak = getStreak();
  const stats = getSRStats();
  const dueWords = getDueWords();
  const weakSR = getWeakWordsSR ? getWeakWordsSR().slice(0, 3) : [];
  const recommendedDay = useMemo(getRecommendedDay, []);
  const todayTheme = DAYS[recommendedDay - 1]?.theme || '';

  const warmupWords = useMemo(() => {
    const due = dueWords.slice(0, 5).map(r => allWords.find(w => w.w === r.word)).filter(Boolean);
    if (due.length >= 5) return due;
    const fill = shuffle(allWords.filter(w => !due.some(d => d.w === w.w))).slice(0, 5 - due.length);
    return [...due, ...fill];
  }, [allWords, dueWords]);

  const [view, setView] = useState('agenda');
  const [cardIdx, setCardIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState([]);

  const done = cardIdx >= warmupWords.length;
  const card = warmupWords[cardIdx];

  const answer = (knew) => {
    setScores(prev => [...prev, knew]);
    setRevealed(false);
    setCardIdx(i => i + 1);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(7,9,15,0.92)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 500, maxWidth: '92vw',
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(135deg, ${C.goldDim}33, transparent)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: C.gold, margin: 0 }}>
                {streak.practicedToday ? '👋 Welcome Back' : '☀️ Daily Warm-up'}
              </h2>
              <p style={{ color: C.textMid, fontSize: 12, margin: '4px 0 0' }}>
                {streak.practicedToday
                  ? 'Keep the momentum going'
                  : 'Start each day with a clear plan'}
              </p>
            </div>
            {streak.current > 0 && (
              <div style={{
                textAlign: 'center', background: C.gold + '18',
                border: `1px solid ${C.gold}33`, borderRadius: 10, padding: '8px 14px',
              }}>
                <p style={{ fontSize: 20, margin: 0 }}>🔥</p>
                <p style={{ fontFamily: 'Courier New,monospace', fontWeight: 800, fontSize: 16, color: C.gold, margin: 0 }}>
                  {streak.current}
                </p>
                <p style={{ fontSize: 9, color: C.textDim, margin: 0 }}>day streak</p>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {[
              { l: 'Due',      v: stats.due,      c: stats.due > 0 ? C.red : C.greenBr },
              { l: 'Weak',     v: stats.weak,     c: stats.weak > 0 ? C.gold : C.greenBr },
              { l: 'Learning', v: stats.learning, c: C.blue },
              { l: 'Mastered', v: stats.mastered, c: C.greenBr },
            ].map(s => (
              <div key={s.l} style={{
                flex: 1, textAlign: 'center', padding: '7px 4px',
                background: C.card, borderRadius: 7,
              }}>
                <p style={{ fontFamily: 'Courier New,monospace', fontSize: 17, fontWeight: 700, color: s.c, margin: 0 }}>{s.v}</p>
                <p style={{ fontSize: 9, color: C.textDim, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── View toggle ── */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {[
            { id: 'agenda',    label: "📅 Today's Plan" },
            { id: 'flashcard', label: `🃏 Quick Recall (${warmupWords.length})` },
          ].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              flex: 1, padding: 10, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              background: view === v.id ? C.card : 'transparent',
              color: view === v.id ? C.gold : C.textMid,
              borderBottom: view === v.id ? `2px solid ${C.gold}` : '2px solid transparent',
              transition: 'all 0.15s',
            }}>{v.label}</button>
          ))}
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '20px 24px' }}>

          {/* ─ AGENDA VIEW ─ */}
          {view === 'agenda' && (
            <>
              {/* Recommended day */}
              <div style={{
                background: `linear-gradient(135deg, ${C.gold}12, ${C.blue}06)`,
                border: `1px solid ${C.gold}2A`, borderRadius: 12,
                padding: '14px 16px', marginBottom: 16,
              }}>
                <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>
                  📌 Recommended for Today
                </p>
                <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: '0 0 4px', fontFamily: 'Georgia,serif' }}>
                  Day {recommendedDay}: {todayTheme}
                </p>
                <p style={{ color: C.textMid, fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                  Study vocabulary, then run the Practice tab for adaptive AI questions.
                </p>
              </div>

              {/* Weakest SR words */}
              {weakSR.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    ⚠️ Weakest Words — Revisit Today
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {weakSR.map(r => {
                      const w = allWords.find(x => x.w === r.word);
                      return (
                        <div key={r.word} style={{
                          background: C.redBg, border: `1px solid ${C.red}33`,
                          borderRadius: 8, padding: '6px 12px',
                        }}>
                          <p style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 12, color: C.red, margin: 0 }}>{r.word}</p>
                          {w && <p style={{ color: C.textDim, fontSize: 10, margin: '2px 0 0' }}>{w.def.slice(0, 42)}…</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Agenda */}
              <p style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Suggested Session (~50 min)
              </p>
              {AGENDA.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, padding: '9px 12px', borderRadius: 8, marginBottom: 4,
                  background: i === 0 ? C.gold + '0E' : 'transparent',
                  border: `1px solid ${i === 0 ? C.gold + '22' : 'transparent'}`,
                }}>
                  <span style={{ fontSize: 17, width: 24, textAlign: 'center', flexShrink: 0 }}>{step.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: C.text, fontSize: 12, fontWeight: 700, margin: 0 }}>{step.label}</p>
                    <p style={{ color: C.textDim, fontSize: 11, margin: '1px 0 0' }}>{step.desc}</p>
                  </div>
                  <span style={{ fontFamily: 'Courier New,monospace', fontSize: 10, color: C.textDim, whiteSpace: 'nowrap', alignSelf: 'center' }}>
                    {step.time} min
                  </span>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <Btn onClick={onClose} style={{ width: '100%' }}>Start Studying →</Btn>
              </div>
            </>
          )}

          {/* ─ FLASHCARD VIEW ─ */}
          {view === 'flashcard' && (
            <>
              {done ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <p style={{ fontSize: 40, margin: '0 0 10px' }}>
                    {scores.filter(Boolean).length >= 4 ? '🎯' : scores.filter(Boolean).length >= 2 ? '💪' : '📚'}
                  </p>
                  <p style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                    {scores.filter(Boolean).length}/{scores.length} recalled
                  </p>
                  <p style={{ color: C.textMid, fontSize: 13, marginBottom: 20 }}>
                    {scores.filter(Boolean).length >= 4
                      ? 'Solid recall. Ready for today\'s session.'
                      : 'These words need extra attention today.'}
                  </p>
                  <Btn onClick={onClose}>Start Studying →</Btn>
                </div>
              ) : (
                <>
                  {/* Progress dots */}
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
                    {warmupWords.map((_, i) => (
                      <div key={i} style={{
                        width: 9, height: 9, borderRadius: '50%', transition: 'all 0.2s',
                        background: i < cardIdx
                          ? (scores[i] ? C.green : C.red)
                          : i === cardIdx ? C.gold : C.border,
                      }} />
                    ))}
                  </div>

                  {/* Card */}
                  <div style={{
                    background: C.card, borderRadius: 12, padding: '24px 20px',
                    border: `1px solid ${revealed ? C.gold + '44' : C.border}`,
                    textAlign: 'center', minHeight: 150,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    transition: 'border-color 0.2s',
                  }}>
                    {!revealed ? (
                      <>
                        <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                          What word means...
                        </p>
                        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.75, margin: '0 0 18px' }}>
                          "{card.def}"
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Btn onClick={() => setRevealed(true)}>Reveal Word</Btn>
                        </div>
                      </>
                    ) : (
                      <>
                        <p style={{
                          fontFamily: 'Courier New,monospace', fontSize: 26, fontWeight: 700,
                          color: C.gold, letterSpacing: '0.1em', margin: '0 0 6px',
                        }}>{card.w}</p>
                        <div style={{ marginBottom: 8 }}>
                          <Tag color={getSRLevel(card.w).color}>{getSRLevel(card.w).label}</Tag>
                        </div>
                        {card.tip && (
                          <p style={{ color: C.gold, fontSize: 11, margin: '6px 0 14px', lineHeight: 1.55 }}>
                            💡 {card.tip}
                          </p>
                        )}
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                          <Btn variant="danger" onClick={() => answer(false)}>✗ Didn't know</Btn>
                          <Btn variant="success" onClick={() => answer(true)}>✓ Knew it</Btn>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Skip */}
        {!done && (
          <div style={{ padding: '0 24px 16px', textAlign: 'center' }}>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: C.textDim,
              fontSize: 12, cursor: 'pointer', padding: '4px 8px',
            }}>Skip →</button>
          </div>
        )}
      </div>
    </div>
  );
}
