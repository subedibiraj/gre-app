import { useState, useEffect, useRef } from 'react';
import C from '../theme';
import { addXP, getXP, getLevel, checkAchievements, XP_VALUES } from '../engine/xp';
import { getStreak } from '../engine/streak';

const PHASES = [
  { id: 'vocab', label: 'Vocabulary', icon: '📚', minutes: 15, desc: 'Study new words & review weak ones' },
  { id: 'verbal_practice', label: 'Verbal Practice', icon: '✍️', minutes: 10, desc: 'TC, SE, and RC drills' },
  { id: 'quant_learn', label: 'Quant Concepts', icon: '🧠', minutes: 10, desc: 'Learn rules, examples & tricks' },
  { id: 'quant_practice', label: 'Quant Practice', icon: '📐', minutes: 10, desc: 'Solve problems & build speed' },
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function DailySession({ onNavigate, onClose }) {
  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState([]);
  const timerRef = useRef(null);

  const xp = getXP();
  const level = getLevel(xp.total);
  const streak = getStreak();
  const totalMinutes = Math.floor(seconds / 60);
  const currentPhase = PHASES[phase];
  const phaseSeconds = currentPhase.minutes * 60;
  const phaseElapsed = seconds - PHASES.slice(0, phase).reduce((a, p) => a + p.minutes * 60, 0);
  const phaseProgress = Math.min(phaseElapsed / phaseSeconds, 1);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  // Auto-advance phases
  useEffect(() => {
    const elapsed = PHASES.slice(0, phase + 1).reduce((a, p) => a + p.minutes * 60, 0);
    if (seconds >= elapsed && phase < PHASES.length - 1) {
      setCompleted(prev => [...prev, PHASES[phase].id]);
      setPhase(phase + 1);
    }
  }, [seconds, phase]);

  const handleStartPhase = () => {
    setRunning(true);
    // Navigate to the right section
    if (currentPhase.id === 'vocab' || currentPhase.id === 'verbal_practice') {
      onNavigate?.('verbal', currentPhase.id === 'vocab' ? 'vocab' : 'practice');
    } else {
      onNavigate?.('quant', currentPhase.id === 'quant_learn' ? 'learn' : 'practice');
    }
  };

  const handleSkipPhase = () => {
    if (phase < PHASES.length - 1) {
      setCompleted(prev => [...prev, PHASES[phase].id]);
      const newElapsed = PHASES.slice(0, phase + 1).reduce((a, p) => a + p.minutes * 60, 0);
      setSeconds(newElapsed);
      setPhase(phase + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setRunning(false);
    clearInterval(timerRef.current);
    setCompleted(prev => [...prev, PHASES[phase].id]);
    // Award XP for session
    addXP(XP_VALUES.daily_streak * 3, 'Daily session completed');
    const achs = checkAchievements({ practiceCompleted: true, streak: streak.current });
    // Mark today's session in localStorage
    localStorage.setItem(`gre_session_${new Date().toDateString()}`, 'done');
  };

  const sessionDone = completed.length >= PHASES.length || (phase === PHASES.length - 1 && completed.includes(PHASES[phase].id));
  const totalTarget = PHASES.reduce((a, p) => a + p.minutes, 0);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
        padding: '32px 28px', maxWidth: 520, width: '92%',
        boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 20, margin: 0 }}>
              {sessionDone ? '🎉 Session Complete!' : '📅 Daily Study Session'}
            </h2>
            <p style={{ color: C.textMid, fontSize: 12, margin: '4px 0 0' }}>
              {sessionDone ? `Great work! You studied for ${totalMinutes} minutes.` : `${totalTarget} minutes · 4 phases · Guided flow`}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {/* XP & Streak Row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{
            flex: 1, background: `linear-gradient(135deg, ${C.gold}15, transparent)`,
            borderRadius: 10, padding: '10px 14px', border: `1px solid ${C.gold}22`,
          }}>
            <p style={{ color: C.gold, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Level</p>
            <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: '2px 0 0' }}>{level.icon} {level.name}</p>
          </div>
          <div style={{
            flex: 1, background: `linear-gradient(135deg, ${C.greenBr}15, transparent)`,
            borderRadius: 10, padding: '10px 14px', border: `1px solid ${C.greenBr}22`,
          }}>
            <p style={{ color: C.greenBr, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Streak</p>
            <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: '2px 0 0' }}>🔥 {streak.current} day{streak.current !== 1 ? 's' : ''}</p>
          </div>
          <div style={{
            flex: 1, background: `linear-gradient(135deg, ${C.blue}15, transparent)`,
            borderRadius: 10, padding: '10px 14px', border: `1px solid ${C.blue}22`,
          }}>
            <p style={{ color: C.blue, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Today XP</p>
            <p style={{ color: C.text, fontSize: 16, fontWeight: 700, margin: '2px 0 0' }}>+{xp.today}</p>
          </div>
        </div>

        {/* Timer */}
        {running && !sessionDone && (
          <div style={{
            textAlign: 'center', marginBottom: 16, padding: '12px 0',
            background: C.bg, borderRadius: 12,
          }}>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 36, color: C.gold, fontWeight: 700, margin: 0 }}>
              {formatTime(Math.max(0, phaseSeconds - phaseElapsed))}
            </p>
            <p style={{ color: C.textDim, fontSize: 11, margin: '4px 0 0' }}>remaining in {currentPhase.label}</p>
          </div>
        )}

        {/* Phase List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {PHASES.map((p, i) => {
            const isDone = completed.includes(p.id);
            const isCurrent = i === phase && !sessionDone;
            const isActive = isCurrent && running;
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderRadius: 10, transition: 'all 0.25s',
                background: isActive ? `linear-gradient(135deg, ${C.gold}18, ${C.gold}08)` : isCurrent ? C.surface : 'transparent',
                border: `1px solid ${isActive ? C.gold + '44' : isCurrent ? C.border : 'transparent'}`,
                opacity: isDone ? 0.5 : 1,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone ? C.green + '22' : isActive ? C.gold + '22' : C.surface,
                  fontSize: isDone ? 14 : 18,
                  color: isDone ? C.greenBr : C.text,
                }}>
                  {isDone ? '✓' : p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: isDone ? C.greenBr : C.text, fontSize: 13, fontWeight: 700, margin: 0, textDecoration: isDone ? 'line-through' : 'none' }}>{p.label}</p>
                  <p style={{ color: C.textDim, fontSize: 11, margin: '2px 0 0' }}>{p.desc}</p>
                </div>
                <span style={{ fontFamily: 'Courier New,monospace', fontSize: 11, color: C.textDim }}>{p.minutes} min</span>
                {isActive && (
                  <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: C.gold, borderRadius: 2, width: `${phaseProgress * 100}%`, transition: 'width 1s linear' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          {sessionDone ? (
            <button onClick={onClose} style={{
              flex: 1, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
              color: '#07090F', fontWeight: 700, fontSize: 14,
              boxShadow: `0 4px 16px ${C.gold}44`,
            }}>
              🎉 Done — Close
            </button>
          ) : !running ? (
            <button onClick={handleStartPhase} style={{
              flex: 1, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
              color: '#07090F', fontWeight: 700, fontSize: 14,
              boxShadow: `0 4px 16px ${C.gold}44`,
            }}>
              ▶ Start {currentPhase.label}
            </button>
          ) : (
            <>
              <button onClick={handleSkipPhase} style={{
                flex: 1, padding: '12px', borderRadius: 10, border: `1px solid ${C.border}`,
                cursor: 'pointer', background: C.surface, color: C.textMid, fontWeight: 600, fontSize: 13,
              }}>
                Skip →
              </button>
              <button onClick={() => { setCompleted(c => [...c, currentPhase.id]); if (phase < PHASES.length - 1) { setPhase(phase + 1); } else { handleFinish(); } }} style={{
                flex: 1, padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, ${C.green}, ${C.greenBr})`,
                color: '#fff', fontWeight: 700, fontSize: 13,
              }}>
                ✓ Done with {currentPhase.label}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
