import { useState, useMemo } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { getDueWords, getSRLevel, getSRStats } from '../engine/spaced';
import { getStreak } from '../engine/streak';
import Card from '../components/Card';
import Btn from '../components/Btn';
import Tag from '../components/Tag';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WarmupModal({ onClose }) {
  const allWords = useMemo(() => DAYS.flatMap(d => d.words), []);
  const streak = getStreak();
  const stats = getSRStats();
  const dueWords = getDueWords();

  // Pick up to 5 words for warm-up: prioritize due words, then weak, then random
  const warmupWords = useMemo(() => {
    const due = dueWords.slice(0, 5).map(r => allWords.find(w => w.w === r.word)).filter(Boolean);
    if (due.length >= 5) return due;
    const remaining = allWords.filter(w => !due.some(d => d.w === w.w));
    const fill = shuffle(remaining).slice(0, 5 - due.length);
    return [...due, ...fill];
  }, [allWords, dueWords]);

  const [cardIdx, setCardIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState([]);
  const done = cardIdx >= warmupWords.length;
  const card = warmupWords[cardIdx];

  const answer = (knew) => {
    setScores(prev => [...prev, knew]);
    setRevealed(false);
    setCardIdx(prev => prev + 1);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(7,9,15,0.92)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 480, maxWidth: '90vw', background: C.surface,
        border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(135deg, ${C.goldDim}33, transparent)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, color: C.gold, margin: 0 }}>
                {streak.practicedToday ? 'Welcome Back' : 'Daily Warm-up'} ☀️
              </h2>
              <p style={{ color: C.textMid, fontSize: 12, margin: '4px 0 0' }}>
                Quick review before you dive in
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              {streak.current > 0 && (
                <div style={{ fontSize: 20, fontWeight: 700, color: C.gold }}>
                  🔥 {streak.current} day{streak.current !== 1 ? 's' : ''}
                </div>
              )}
              <p style={{ color: C.textDim, fontSize: 10, margin: 0 }}>
                {stats.mastered}/{stats.totalTracked} mastered
              </p>
            </div>
          </div>

          {/* Quick stats bar */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[
              { label: 'Due', val: stats.due, color: stats.due > 0 ? C.red : C.green },
              { label: 'Weak', val: stats.weak, color: stats.weak > 0 ? C.gold : C.green },
              { label: 'Learning', val: stats.learning, color: C.blue },
              { label: 'Mastered', val: stats.mastered, color: C.greenBr },
            ].map(s => (
              <div key={s.label} style={{
                flex: 1, textAlign: 'center', padding: '6px 4px',
                background: C.card, borderRadius: 6,
              }}>
                <p style={{ fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700, color: s.color, margin: 0 }}>{s.val}</p>
                <p style={{ fontSize: 9, color: C.textDim, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 40, margin: '0 0 12px' }}>
                {scores.filter(Boolean).length >= 4 ? '🎯' : scores.filter(Boolean).length >= 2 ? '💪' : '📚'}
              </p>
              <p style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                {scores.filter(Boolean).length}/{scores.length} recalled
              </p>
              <p style={{ color: C.textMid, fontSize: 13, marginBottom: 20 }}>
                {scores.filter(Boolean).length >= 4
                  ? 'Sharp memory! Ready to practice.'
                  : scores.filter(Boolean).length >= 2
                    ? 'Good start. Practice will sharpen these.'
                    : 'These words need attention today.'}
              </p>
              <Btn onClick={onClose}>Start Studying →</Btn>
            </div>
          ) : (
            <>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
                {warmupWords.map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < cardIdx ? (scores[i] ? C.green : C.red) : i === cardIdx ? C.gold : C.border,
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>

              {/* Flash card */}
              <Card style={{
                textAlign: 'center', padding: '24px 20px',
                border: `1px solid ${revealed ? C.gold + '44' : C.border}`,
                minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}>
                {!revealed ? (
                  <>
                    <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                      What word means...
                    </p>
                    <p style={{ color: C.text, fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                      "{card.def}"
                    </p>
                    <div style={{ marginTop: 16 }}>
                      <Btn onClick={() => setRevealed(true)}>Reveal Word</Btn>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{
                      fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700,
                      color: C.gold, letterSpacing: '0.1em', margin: '0 0 6px',
                    }}>
                      {card.w}
                    </p>
                    <Tag color={getSRLevel(card.w).color}>{getSRLevel(card.w).label}</Tag>
                    <p style={{ color: C.textMid, fontSize: 12, margin: '10px 0 4px', fontStyle: 'italic' }}>
                      "{card.ex}"
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
                      <Btn variant="danger" onClick={() => answer(false)}>Didn't know ✗</Btn>
                      <Btn variant="success" onClick={() => answer(true)}>Knew it ✓</Btn>
                    </div>
                  </>
                )}
              </Card>
            </>
          )}
        </div>

        {/* Skip */}
        {!done && (
          <div style={{ padding: '0 24px 16px', textAlign: 'center' }}>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: C.textDim, fontSize: 12,
              cursor: 'pointer', padding: '4px 8px',
            }}>Skip warm-up →</button>
          </div>
        )}
      </div>
    </div>
  );
}
