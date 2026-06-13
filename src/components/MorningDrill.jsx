import { useState, useEffect, useRef, useMemo } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { getSRLevel, getDueWords, updateWordSR } from '../engine/spaced';
import { getStreak } from '../engine/streak';
import { addXP, XP_VALUES } from '../engine/xp';
import Card from '../components/Card';
import Tag from '../components/Tag';
import Btn from '../components/Btn';

// ─── helpers ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DRILL_TIME = 90; // seconds total

// ─── build 5 mixed questions from word bank ───────────────────────────────────
function buildDrillQuestions(allWords) {
  const due    = getDueWords().map(r => allWords.find(w => w.w === r.word)).filter(Boolean);
  const weak   = allWords.filter(w => { const sr = getSRLevel(w.w); return sr.label === 'Weak' || sr.label === 'Learning'; });
  const rest   = shuffle(allWords);

  // Priority: due words → weak → random. Deduplicate.
  const seen = new Set();
  const pool = [];
  for (const w of [...due, ...weak, ...rest]) {
    if (!seen.has(w.w) && pool.length < 8) { seen.add(w.w); pool.push(w); }
  }

  // Build 5 questions from pool
  return pool.slice(0, 5).map((word, i) => {
    const distractors = shuffle(allWords.filter(w => w.w !== word.w)).slice(0, 3);
    const opts = shuffle([
      { l: 'A', t: word.def, correct: true },
      ...distractors.map((d, di) => ({ l: String.fromCharCode(66 + di), t: d.def, correct: false })),
    ]).map((o, idx) => ({ ...o, l: String.fromCharCode(65 + idx) }));
    const correctL = opts.find(o => o.correct).l;
    return { id: i, word: word.w, cluster: word.cluster, answer: correctL, opts, ex: word.ex };
  });
}

// ─── Countdown ring ───────────────────────────────────────────────────────────
function CountdownRing({ remaining, total }) {
  const pct  = remaining / total;
  const r    = 22;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const color = pct > 0.5 ? C.greenBr : pct > 0.25 ? C.gold : C.red;
  return (
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke={C.border} strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 28 28)"
          style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700, color,
      }}>{remaining}</span>
    </div>
  );
}

// ─── Result star rating ───────────────────────────────────────────────────────
function Stars({ score, total }) {
  const pct = score / total;
  const stars = pct === 1 ? 3 : pct >= 0.6 ? 2 : pct >= 0.4 ? 1 : 0;
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          fontSize: 32,
          filter: i < stars ? 'none' : 'grayscale(1) opacity(0.3)',
          transition: `all 0.3s ${i * 0.15}s`,
          transform: i < stars ? 'scale(1)' : 'scale(0.85)',
          display: 'inline-block',
        }}>⭐</span>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MorningDrill({ onClose }) {
  const allWords   = useMemo(() => DAYS.flatMap(d => d.words), []);
  const questions  = useMemo(() => buildDrillQuestions(allWords), [allWords]);
  const streak     = getStreak();

  const [phase, setPhase]     = useState('intro'); // intro | drill | result
  const [qIdx, setQIdx]       = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);       // {word, correct}
  const [timeLeft, setTimeLeft] = useState(DRILL_TIME);
  const [flash, setFlash]     = useState(null);     // 'correct' | 'wrong'
  const timerRef              = useRef(null);

  // ─── Timer ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'drill') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          finishDrill();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finishDrill = () => {
    clearInterval(timerRef.current);
    setPhase('result');
  };

  const handleAnswer = (l) => {
    if (selected !== null) return;
    const q       = questions[qIdx];
    const correct = l === q.answer;
    setSelected(l);
    setFlash(correct ? 'correct' : 'wrong');
    updateWordSR(q.word, correct);

    const newAnswers = [...answers, { word: q.word, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setFlash(null);
      setSelected(null);
      if (qIdx + 1 >= questions.length) {
        // Award XP
        const score = newAnswers.filter(a => a.correct).length;
        addXP(score * 5 + (score === questions.length ? 25 : 0), 'Morning Drill');
        finishDrill();
      } else {
        setQIdx(i => i + 1);
      }
    }, 700);
  };

  // ─── Keyboard shortcuts 1-4 ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'drill') return;
    const handler = (e) => {
      const q   = questions[qIdx];
      const map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
      if (map[e.key] && q.opts.find(o => o.l === map[e.key])) {
        handleAnswer(map[e.key]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qIdx, selected]);

  const score  = answers.filter(a => a.correct).length;
  const q      = questions[qIdx];

  // ─── INTRO ────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    // Get daily drill score history for streak display
    const drillKey   = `gre_drill_streak`;
    let drillStreak  = 0;
    try { drillStreak = JSON.parse(localStorage.getItem(drillKey))?.current || 0; } catch {}

    return (
      <div style={overlay}>
        <div style={{ ...panel, maxWidth: 420 }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${C.gold}22, transparent)`,
            borderRadius: '14px 14px 0 0', borderBottom: `1px solid ${C.border}`,
            padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: C.gold, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
                <h2 style={{ fontFamily: 'Georgia,serif', color: C.text, fontSize: 22, margin: '4px 0 0' }}>
                  Morning Drill ☀️
                </h2>
                <p style={{ color: C.textMid, fontSize: 12, margin: '4px 0 0' }}>
                  5 questions · 90 seconds · Mixed types
                </p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 20, padding: 4 }}>✕</button>
            </div>
          </div>

          <div style={{ padding: '20px 24px' }}>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { icon: '🔥', label: 'Streak', val: `${streak.current}d`, color: C.gold },
                { icon: '📚', label: 'Total Words', val: allWords.length, color: C.blue },
                { icon: '⭐', label: 'Drill Streak', val: `${drillStreak}d`, color: C.greenBr },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, textAlign: 'center', padding: '10px 6px',
                  background: `${s.color}12`, borderRadius: 10, border: `1px solid ${s.color}22`,
                }}>
                  <p style={{ fontSize: 18, margin: '0 0 2px' }}>{s.icon}</p>
                  <p style={{ fontFamily: 'Courier New,monospace', fontSize: 15, fontWeight: 700, color: s.color, margin: 0 }}>{s.val}</p>
                  <p style={{ color: C.textDim, fontSize: 9, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* What to expect */}
            <div style={{
              background: C.surface, borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              border: `1px solid ${C.border}`,
            }}>
              <p style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Today's drill focuses on
              </p>
              {getDueWords().length > 0 && (
                <p style={{ color: C.red, fontSize: 12, margin: '0 0 4px' }}>
                  🔴 <strong>{Math.min(getDueWords().length, 3)} due for review</strong> — spaced repetition flagged these
                </p>
              )}
              <p style={{ color: C.textMid, fontSize: 12, margin: '0 0 4px' }}>
                🟡 <strong>Weakest words</strong> from your history
              </p>
              <p style={{ color: C.textMid, fontSize: 12, margin: 0 }}>
                🟢 <strong>Random sampling</strong> across all {allWords.length} words
              </p>
            </div>

            {/* Tip */}
            <div style={{
              background: `${C.gold}12`, borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              border: `1px solid ${C.gold}22`, display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <span style={{ fontSize: 16 }}>⌨️</span>
              <p style={{ color: C.gold, fontSize: 12, margin: 0 }}>Press <strong>1-4</strong> to answer, no mouse needed</p>
            </div>

            <button onClick={() => setPhase('drill')} style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
              color: '#07090F', fontWeight: 700, fontSize: 15, fontFamily: 'Georgia,serif',
              boxShadow: `0 4px 20px ${C.gold}44`, transition: 'all 0.15s',
              letterSpacing: '0.02em',
            }}>
              Start Drill →
            </button>
            <button onClick={onClose} style={{
              width: '100%', marginTop: 8, padding: '8px', borderRadius: 8, border: 'none',
              background: 'none', color: C.textDim, cursor: 'pointer', fontSize: 12,
            }}>Skip for today</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DRILL ────────────────────────────────────────────────────────────────
  if (phase === 'drill') {
    const bgFlash = flash === 'correct'
      ? `${C.green}22`
      : flash === 'wrong'
      ? `${C.red}22`
      : C.card;

    return (
      <div style={overlay}>
        <div style={{ position: 'absolute', top: 30, right: 30 }}>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: C.textDim, fontSize: 14, cursor: 'pointer', padding: 8
          }}>End Early ✕</button>
        </div>
        <div style={{ ...panel, maxWidth: 480, transition: 'background 0.25s', background: bgFlash }}>
          {/* Progress + Timer */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 6, flex: 1 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  height: 6, flex: 1, borderRadius: 3, transition: 'all 0.2s',
                  background: i < qIdx
                    ? (answers[i]?.correct ? C.green : C.red)
                    : i === qIdx ? C.gold : C.border,
                }} />
              ))}
            </div>
            <CountdownRing remaining={timeLeft} total={DRILL_TIME} />
          </div>

          <div style={{ padding: '20px 24px' }}>
            {/* Q counter + cluster */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ color: C.textDim, fontSize: 12 }}>Q{qIdx + 1} of {questions.length}</span>
              <Tag color={C.gold}>{q.cluster}</Tag>
              <span style={{ marginLeft: 'auto', color: C.textDim, fontSize: 11 }}>
                {answers.filter(a => a.correct).length} correct
              </span>
            </div>

            {/* Word */}
            <div style={{
              textAlign: 'center', margin: '0 0 20px',
              padding: '20px 16px',
              background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`,
            }}>
              <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>
                What does this word mean?
              </p>
              <p style={{
                fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700,
                color: C.gold, letterSpacing: '0.1em', margin: 0,
              }}>{q.word}</p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.opts.map((opt, i) => {
                const isSel   = selected === opt.l;
                const correct = selected !== null && opt.l === q.answer;
                const wrong   = selected !== null && isSel && opt.l !== q.answer;
                return (
                  <button key={opt.l} onClick={() => handleAnswer(opt.l)} disabled={selected !== null} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 14px', borderRadius: 8, textAlign: 'left',
                    cursor: selected !== null ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                    background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                    color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                    fontWeight: isSel || correct ? 700 : 400,
                  }}>
                    <span style={{
                      minWidth: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 10, fontWeight: 700,
                      background: correct ? C.green + '33' : wrong ? C.red + '33' : C.border + '44',
                      color: correct ? C.greenBr : wrong ? C.red : C.textDim,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 13, lineHeight: 1.5 }}>{opt.t}</span>
                    {correct && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✓</span>}
                    {wrong && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✗</span>}
                  </button>
                );
              })}
            </div>

            {/* Example shown after answer */}
            {selected && (
              <div style={{
                marginTop: 12, padding: '10px 14px',
                background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.gold}`,
                animation: 'fadeIn 0.2s ease-out',
              }}>
                <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Example</p>
                <p style={{ color: C.textMid, fontSize: 12, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>"{q.ex}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULT ────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const xpEarned    = score * 5 + (score === questions.length ? 25 : 0);
    const allCorrect  = score === questions.length;
    const mostCorrect = score >= 4;

    // Save drill streak
    const drillKey = `gre_drill_streak`;
    const today    = new Date().toDateString();
    try {
      const prev = JSON.parse(localStorage.getItem(drillKey)) || { current: 0, best: 0, lastDate: null };
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = prev.lastDate === yesterday.toDateString();
      const alreadyDoneToday = prev.lastDate === today;
      if (!alreadyDoneToday) {
        const newCurrent = isConsecutive ? prev.current + 1 : 1;
        localStorage.setItem(drillKey, JSON.stringify({
          current: newCurrent,
          best: Math.max(newCurrent, prev.best || 0),
          lastDate: today,
        }));
      }
    } catch {}

    return (
      <div style={overlay}>
        <div style={{ ...panel, maxWidth: 420, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Confetti particles */}
          {(allCorrect || mostCorrect) && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
              {Array.from({ length: allCorrect ? 40 : 20 }).map((_, i) => {
                const colors = [C.gold, C.goldBr, C.greenBr, C.blue, '#E4C060', '#FF6B6B', '#9B6BDB'];
                const size = Math.random() * 8 + 4;
                const left = Math.random() * 100;
                const delay = Math.random() * 1.5;
                const duration = Math.random() * 2 + 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const rotation = Math.random() * 360;
                return (
                  <div key={i} style={{
                    position: 'absolute',
                    top: -20,
                    left: `${left}%`,
                    width: size,
                    height: size * (Math.random() > 0.5 ? 1 : 0.6),
                    background: color,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    transform: `rotate(${rotation}deg)`,
                    animation: `confettiFall ${duration}s ${delay}s ease-in forwards`,
                    opacity: 0,
                  }} />
                );
              })}
              <style>{`
                @keyframes confettiFall {
                  0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
                  50% { opacity: 1; }
                  100% { opacity: 0; transform: translateY(450px) rotate(720deg) scale(0.5); }
                }
              `}</style>
            </div>
          )}
          <div style={{ padding: '28px 24px', position: 'relative', zIndex: 2 }}>
            {/* Emoji */}
            <p style={{ fontSize: 48, margin: '0 0 4px', animation: 'bounceIn 0.5s ease-out' }}>
              {allCorrect ? '🎯' : mostCorrect ? '💪' : '📚'}
            </p>

            {/* Score */}
            <p style={{
              fontFamily: 'Courier New,monospace', fontSize: 48, fontWeight: 700,
              color: allCorrect ? C.greenBr : mostCorrect ? C.gold : C.textMid,
              margin: '0 0 4px', lineHeight: 1,
            }}>{score}/{questions.length}</p>
            <p style={{ color: C.textMid, fontSize: 13, margin: '0 0 8px' }}>
              {allCorrect ? 'Perfect drill! Flawless.' : mostCorrect ? 'Strong start to the day.' : 'Review these words today.'}
            </p>

            <Stars score={score} total={questions.length} />

            {/* XP earned */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${C.gold}18`, border: `1px solid ${C.gold}33`,
              borderRadius: 20, padding: '6px 16px', margin: '0 0 20px',
            }}>
              <span style={{ fontSize: 14 }}>⚡</span>
              <span style={{ color: C.gold, fontWeight: 700, fontSize: 14, fontFamily: 'Courier New,monospace' }}>+{xpEarned} XP</span>
              {allCorrect && <Tag color={C.greenBr}>Perfect Bonus!</Tag>}
            </div>

            {/* Per-word breakdown */}
            <div style={{ background: C.surface, borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
              {answers.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderBottom: i < answers.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <span style={{ fontSize: 14 }}>{a.correct ? '✅' : '❌'}</span>
                  <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 13, color: a.correct ? C.greenBr : C.red }}>{a.word}</span>
                  {!a.correct && (
                    <span style={{ color: C.textDim, fontSize: 11, marginLeft: 'auto' }}>review today →</span>
                  )}
                </div>
              ))}
            </div>

            <button onClick={onClose} style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
              color: '#07090F', fontWeight: 700, fontSize: 14, fontFamily: 'Georgia,serif',
              boxShadow: `0 4px 16px ${C.gold}44`,
            }}>
              Start Studying →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const overlay = {
  position: 'fixed', inset: 0, zIndex: 200,
  background: 'rgba(7,9,15,0.88)', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const panel = {
  background: '#111928',
  border: `1px solid #1C2E4A`,
  borderRadius: 16, width: '92%',
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  overflow: 'hidden',
};
