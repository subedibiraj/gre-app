import { useState, useEffect, useMemo, useRef } from 'react';
import C from '../theme';
import { getWeakWordsSR, updateWordSR, getSRLevel } from '../engine/spaced';
import { Sound } from '../engine/audio';
import { DAYS } from '../data/days';
import Card from './Card';
import Btn from './Btn';
import Timer from './Timer';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WeakWordBlitz({ onClose }) {
  const allWords = useMemo(() => DAYS.flatMap(d => d.words), []);
  const weakRecords = useMemo(() => getWeakWordsSR(), []);

  const [phase, setPhase] = useState('intro'); // 'intro' | 'blitz' | 'results'
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);

  // Build the queue based on the weak records
  const queue = useMemo(() => {
    return shuffle(weakRecords).map(record => {
      const targetWord = allWords.find(w => w.w === record.word);
      if (!targetWord) return null;

      const distractors = shuffle(allWords.filter(w => w.w !== targetWord.w)).slice(0, 3);
      const opts = shuffle([
        { t: targetWord.def, correct: true },
        ...distractors.map(d => ({ t: d.def, correct: false }))
      ]);

      return { word: targetWord.w, opts };
    }).filter(Boolean);
  }, [weakRecords, allWords]);

  const handleStart = () => {
    if (queue.length === 0) {
      setPhase('results');
    } else {
      setPhase('blitz');
      Sound.tap();
    }
  };

  const handleAnswer = (isCorrect, word) => {
    if (isCorrect) {
      Sound.success();
      setScore(s => s + 1);
    } else {
      Sound.error();
    }
    
    // Update spaced repetition parameters
    updateWordSR(word, isCorrect);
    setTotalAttempted(t => t + 1);

    if (qIdx + 1 < queue.length) {
      setQIdx(idx => idx + 1);
    } else {
      setPhase('results');
    }
  };

  const handleTimeUp = () => {
    setPhase('results');
  };

  if (phase === 'intro') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}>
        <div style={{
          width: '100%', maxWidth: 440, background: C.card, border: `1px solid ${C.red}33`,
          borderRadius: 20, padding: 32, textAlign: 'center', boxShadow: `0 20px 80px ${C.red}22`
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: C.red, margin: '0 0 12px' }}>Weak Word Blitz</h2>
          {queue.length === 0 ? (
            <>
              <p style={{ color: C.textMid, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                You have no flagged weak words! Your Spaced Repetition mastery is flawless right now. Keep it up!
              </p>
              <Btn onClick={onClose} variant="ghost" style={{ width: '100%' }}>Close</Btn>
            </>
          ) : (
            <>
              <p style={{ color: C.textMid, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                You have <strong style={{ color: C.red }}>{queue.length}</strong> words flagged as Weak or Learning by the Spaced Repetition engine. You have <strong>60 seconds</strong> to accurately define as many as you can.
              </p>
              <Btn onClick={handleStart} style={{
                width: '100%', background: `linear-gradient(135deg, ${C.red}, #E02820)`,
                color: '#fff', fontSize: 16, height: 50, marginBottom: 12
              }}>Start 60s Blitz</Btn>
              <Btn onClick={onClose} variant="ghost" style={{ width: '100%' }}>Maybe Later</Btn>
            </>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'blitz') {
    const q = queue[qIdx];
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 300, background: '#05060A',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20
      }}>
        <div style={{ position: 'absolute', top: 40, left: 40 }}>
          <Timer seconds={60} onTimeUp={handleTimeUp} label="⏱ BLITZ" color={C.red} />
        </div>
        <div style={{ position: 'absolute', top: 40, right: 40 }}>
          <button onClick={() => setPhase('results')} style={{
            background: 'none', border: 'none', color: C.textDim, fontSize: 14, cursor: 'pointer', padding: 8
          }}>End Early ✕</button>
        </div>

        <div style={{ width: '100%', maxWidth: 600 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ color: C.textDim, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Word {qIdx + 1} of {queue.length}
            </p>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 56, color: C.gold, margin: 0, letterSpacing: '0.02em' }}>
              {q.word}
            </h1>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {q.opts.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.correct, q.word)}
                style={{
                  padding: '16px 24px', borderRadius: 12, border: `1px solid ${C.border}`,
                  background: C.surface, color: C.text, fontSize: 16, textAlign: 'left',
                  cursor: 'pointer', transition: 'all 0.1s', display: 'flex', alignItems: 'center', gap: 16
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = `${C.gold}11`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}
              >
                <span style={{ color: C.textDim, fontFamily: 'Courier New,monospace', fontSize: 14 }}>{i + 1}.</span>
                {opt.t}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // phase === 'results'
  const accuracy = totalAttempted > 0 ? Math.round((score / totalAttempted) * 100) : 0;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        width: '100%', maxWidth: 440, background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 20, padding: 32, textAlign: 'center', boxShadow: '0 20px 80px rgba(0,0,0,0.5)'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{accuracy >= 80 ? '🔥' : accuracy >= 50 ? '👍' : '📚'}</div>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: C.text, margin: '0 0 8px' }}>Blitz Complete</h2>
        <p style={{ color: C.textDim, fontSize: 14, margin: '0 0 24px' }}>Targeted weakness mitigation</p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, background: `${C.gold}11`, border: `1px solid ${C.gold}33`, borderRadius: 12, padding: 16 }}>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700, color: C.gold, margin: '0 0 4px' }}>{score}</p>
            <p style={{ color: C.gold, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Correct</p>
          </div>
          <div style={{ flex: 1, background: `${C.blue}11`, border: `1px solid ${C.blue}33`, borderRadius: 12, padding: 16 }}>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700, color: C.blue, margin: '0 0 4px' }}>{accuracy}%</p>
            <p style={{ color: C.blue, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Accuracy</p>
          </div>
        </div>

        <p style={{ color: C.textMid, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          The Spaced Repetition engine has been updated with your new mastery data. Returning to the dashboard.
        </p>
        <Btn onClick={onClose} style={{ width: '100%', height: 50 }}>Return to Dashboard</Btn>
      </div>
    </div>
  );
}
