import { useState, useMemo, useEffect } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { getSRLevel, getAllSR, updateWordSR } from '../engine/spaced';
import { addXP } from '../engine/xp';
import { clusterColor } from '../utils';
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

// ─── Build questions for a specific word (3 per word, increasing difficulty) ──
function buildWordQuestions(word, allWords) {
  const distractors = shuffle(allWords.filter(w => w.w !== word.w));
  const sameCluster = distractors.filter(d => d.cluster === word.cluster).slice(0, 2);
  const diffCluster = distractors.filter(d => d.cluster !== word.cluster).slice(0, 2);

  // Q1: Simple definition pick
  const q1Opts = shuffle([
    { l: 'A', t: word.def, correct: true },
    ...distractors.slice(0, 3).map((d, i) => ({ l: String.fromCharCode(66 + i), t: d.def, correct: false })),
  ]).map((o, i) => ({ ...o, l: String.fromCharCode(65 + i) }));

  // Q2: Example sentence — what word fits?
  const q2Opts = shuffle([
    { l: 'A', t: word.w, correct: true },
    ...[...sameCluster, ...diffCluster].slice(0, 3).map((d, i) => ({ l: String.fromCharCode(66 + i), t: d.w, correct: false })),
  ]).map((o, i) => ({ ...o, l: String.fromCharCode(65 + i) }));

  // Q3: GRE-style synonym from cluster OR opposite trap
  const synonym = distractors.find(d => d.cluster === word.cluster);
  const antonymCluster = getOppositeCluster(word.cluster);
  const antonym = antonymCluster ? distractors.find(d => d.cluster === antonymCluster) : null;
  const trap = antonym || distractors[0];
  const q3Opts = shuffle([
    { l: 'A', t: word.def, correct: true },
    { l: 'B', t: trap ? trap.def : distractors[0].def, correct: false },
    { l: 'C', t: distractors[1]?.def || distractors[0].def, correct: false },
    { l: 'D', t: distractors[2]?.def || distractors[0].def, correct: false },
  ]).map((o, i) => ({ ...o, l: String.fromCharCode(65 + i) }));

  return [
    { id: 0, round: 1, word: word.w, type: 'definition', question: `What does "${word.w}" mean?`, answer: q1Opts.find(o => o.correct).l, opts: q1Opts, tip: word.tip, ex: word.ex },
    { id: 1, round: 2, word: word.w, type: 'in_context', question: `Fill in the blank:\n"${word.ex.replace(word.w, '________')}"`, answer: q2Opts.find(o => o.correct).l, opts: q2Opts, tip: word.tip, ex: word.ex },
    { id: 2, round: 3, word: word.w, type: 'precision', question: `GRE Precision: What most precisely defines "${word.w}"?`, answer: q3Opts.find(o => o.correct).l, opts: q3Opts, tip: word.tip, ex: word.ex },
  ];
}

function getOppositeCluster(cluster) {
  const opposites = { Quiet: 'Loud', Loud: 'Quiet', Gentle: 'Harsh', Harsh: 'Gentle', Genuine: 'Liar', Liar: 'Genuine', Generous: 'Arrogant', Arrogant: 'Generous', Cautious: 'Bold', Bold: 'Cautious' };
  return opposites[cluster] || null;
}

// ─── Progress ring ────────────────────────────────────────────────────────────
function MasteryRing({ graduated, total }) {
  const pct  = total > 0 ? graduated / total : 0;
  const r    = 28;
  const circ = 2 * Math.PI * r;
  const color = pct >= 1 ? C.greenBr : pct >= 0.5 ? C.gold : C.blue;
  return (
    <div style={{ position: 'relative', width: 68, height: 68 }}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke={C.border} strokeWidth="5" />
        <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${pct * circ} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 34 34)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <span style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Courier New,monospace',
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color, lineHeight: 1 }}>{graduated}</span>
        <span style={{ fontSize: 9, color: C.textDim }}>/{total}</span>
      </span>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function WeakWordBlitz({ weakWords: propWeakWords, onClose, onWordGraduated }) {
  const allWords = useMemo(() => DAYS.flatMap(d => d.words), []);

  // Get the actual 10 weakest words sorted by SR score
  const weakWords = useMemo(() => {
    const srData = getAllSR();
    const wordObjs = (propWeakWords || [])
      .map(w => allWords.find(a => a.w === w))
      .filter(Boolean);
    // Sort by SR level (Weak first, then Learning)
    return wordObjs.sort((a, b) => {
      const scoreA = srData[a.w]?.ease || 3;
      const scoreB = srData[b.w]?.ease || 3;
      return scoreA - scoreB;
    }).slice(0, 10);
  }, [propWeakWords, allWords]);

  const [wordIdx, setWordIdx]     = useState(0);
  const [qIdx, setQIdx]           = useState(0);
  const [selected, setSelected]   = useState(null);
  const [wordResults, setWordResults] = useState({}); // {word: {correct:[T,F,T]}}
  const [graduated, setGraduated] = useState(new Set());
  const [phase, setPhase]         = useState('drill'); // drill | summary

  if (!weakWords.length) {
    return (
      <div style={overlay}>
        <div style={{ ...panel, maxWidth: 400, textAlign: 'center', padding: 32 }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🎉</p>
          <h2 style={{ fontFamily: 'Georgia,serif', color: C.greenBr, marginBottom: 8 }}>No Weak Words!</h2>
          <p style={{ color: C.textMid, fontSize: 14, marginBottom: 20 }}>Your vocabulary is in great shape. Keep practicing to maintain it.</p>
          <Btn onClick={onClose}>Back to Study</Btn>
        </div>
      </div>
    );
  }

  const currentWord = weakWords[wordIdx];
  const questions   = useMemo(() => currentWord ? buildWordQuestions(currentWord, allWords) : [], [currentWord, allWords]);
  const currentQ    = questions[qIdx];
  const cc          = clusterColor(currentWord?.cluster || '');
  const sr          = getSRLevel(currentWord?.w || '');

  const handleSelect = (l) => {
    if (selected !== null) return;
    setSelected(l);
    const correct = l === currentQ.answer;
    updateWordSR(currentWord.w, correct);

    // Track results for this word
    setWordResults(prev => {
      const prev_results = prev[currentWord.w] || { correct: [] };
      return { ...prev, [currentWord.w]: { correct: [...prev_results.correct, correct] } };
    });

    setTimeout(() => {
      setSelected(null);
      if (qIdx + 1 >= questions.length) {
        // Word done — check if graduated (2/3 correct)
        const results  = (wordResults[currentWord.w]?.correct || []);
        const allQ     = [...results, correct];
        const correctCount = allQ.filter(Boolean).length;
        if (correctCount >= 2) {
          setGraduated(prev => new Set([...prev, currentWord.w]));
          onWordGraduated?.(currentWord.w);
          addXP(15, `Graduated weak word: ${currentWord.w}`);
        }
        if (wordIdx + 1 >= weakWords.length) {
          setPhase('summary');
        } else {
          setWordIdx(i => i + 1);
          setQIdx(0);
        }
      } else {
        setQIdx(i => i + 1);
      }
    }, 600);
  };

  // ─── SUMMARY ──────────────────────────────────────────────────────────────
  if (phase === 'summary') {
    const xpEarned = graduated.size * 15;
    return (
      <div style={overlay}>
        <div style={{ ...panel, maxWidth: 460 }}>
          <div style={{ padding: '24px 24px', textAlign: 'center' }}>
            <MasteryRing graduated={graduated.size} total={weakWords.length} />
            <h2 style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 20, margin: '12px 0 6px' }}>
              Blitz Complete!
            </h2>
            <p style={{ color: C.textMid, fontSize: 13, marginBottom: 4 }}>
              {graduated.size}/{weakWords.length} words graduated from Weak → Learning
            </p>
            {xpEarned > 0 && (
              <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center', background: `${C.gold}18`, border: `1px solid ${C.gold}33`, borderRadius: 20, padding: '4px 14px', margin: '8px 0 16px' }}>
                <span style={{ fontSize: 13 }}>⚡</span>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: 14, fontFamily: 'Courier New,monospace' }}>+{xpEarned} XP</span>
              </div>
            )}

            <div style={{ background: C.surface, borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
              {weakWords.map(w => {
                const isGrad = graduated.has(w.w);
                const results = wordResults[w.w]?.correct || [];
                const correctCount = results.filter(Boolean).length;
                return (
                  <div key={w.w} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 16 }}>{isGrad ? '✅' : '🔄'}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 13, color: isGrad ? C.greenBr : C.gold }}>{w.w}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {results.map((r, i) => (
                        <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: r ? C.green : C.red, display: 'inline-block' }} />
                      ))}
                    </div>
                    <Tag color={isGrad ? C.greenBr : C.red}>{isGrad ? 'Graduated ✓' : `${correctCount}/3`}</Tag>
                  </div>
                );
              })}
            </div>

            <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
              {graduated.size === weakWords.length
                ? '🎯 Perfect blitz! All weak words cleared today.'
                : `Words still flagged will reappear in tomorrow's morning drill and practice.`}
            </p>

            <Btn onClick={onClose}>Back to Studying →</Btn>
          </div>
        </div>
      </div>
    );
  }

  // ─── DRILL ────────────────────────────────────────────────────────────────
  const roundColors = [C.gold, C.blue, C.greenBr];
  const roundLabels = ['Round 1: Know It?', 'Round 2: In Context', 'Round 3: GRE Precision'];

  return (
    <div style={overlay}>
      <div style={{ ...panel, maxWidth: 500 }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(135deg, ${C.red}15, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
              Weak Word Blitz
            </p>
            <p style={{ color: C.textDim, fontSize: 11, margin: '2px 0 0' }}>
              Word {wordIdx + 1}/{weakWords.length} · 3 rounds each
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MasteryRing graduated={graduated.size} total={weakWords.length} />
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
        </div>

        {/* Word strip */}
        <div style={{ padding: '0 20px', borderBottom: `1px solid ${C.border}`, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 0, padding: '8px 0' }}>
            {weakWords.map((w, i) => {
              const isGrad = graduated.has(w.w);
              const isCurr = i === wordIdx;
              return (
                <div key={w.w} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
                  borderRadius: 6, flexShrink: 0,
                  background: isCurr ? `${cc}22` : 'transparent',
                  border: isCurr ? `1px solid ${cc}44` : '1px solid transparent',
                }}>
                  <span style={{ fontFamily: 'Courier New,monospace', fontSize: 11, fontWeight: 700, color: isGrad ? C.greenBr : isCurr ? cc : C.textDim }}>
                    {w.w}
                  </span>
                  {isGrad && <span style={{ fontSize: 10 }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Round indicator */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2, transition: 'all 0.2s',
                background: i < qIdx ? C.green : i === qIdx ? roundColors[i] : C.border,
              }} />
            ))}
          </div>

          {/* Round label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Tag color={roundColors[qIdx]}>{roundLabels[qIdx]}</Tag>
            <Tag color={cc}>{currentWord.cluster}</Tag>
            <Tag color={sr.color}>{sr.label}</Tag>
          </div>

          {/* Word + question */}
          <div style={{
            background: C.surface, borderRadius: 10, padding: '14px 16px', marginBottom: 14,
            borderLeft: `3px solid ${cc}`,
          }}>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 22, fontWeight: 700, color: cc, margin: '0 0 6px', letterSpacing: '0.06em' }}>
              {currentWord.w}
            </p>
            <p style={{ color: C.text, fontSize: 13, margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {currentQ.opts.map(opt => {
              const isSel   = selected === opt.l;
              const correct = selected !== null && opt.l === currentQ.answer;
              const wrong   = selected !== null && isSel && opt.l !== currentQ.answer;
              return (
                <button key={opt.l} onClick={() => handleSelect(opt.l)} disabled={selected !== null} style={{
                  padding: '10px 14px', borderRadius: 7, textAlign: 'left', fontSize: 13,
                  cursor: selected !== null ? 'default' : 'pointer', transition: 'all 0.15s',
                  border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                  background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                  color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                  fontWeight: isSel || correct ? 700 : 400,
                }}>
                  <span style={{ color: C.textDim, fontFamily: 'Courier New,monospace', marginRight: 8, fontSize: 11 }}>{opt.l}.</span>
                  {opt.t}
                  {correct && ' ✓'}{wrong && ' ✗'}
                </button>
              );
            })}
          </div>

          {/* GRE tip after answer */}
          {selected && (
            <div style={{
              marginTop: 12, padding: '10px 14px', background: `${C.gold}12`,
              borderRadius: 8, borderLeft: `3px solid ${C.gold}`,
              animation: 'fadeIn 0.2s ease-out',
            }}>
              <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>GRE Tip</p>
              <p style={{ color: C.goldBr, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{currentWord.tip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const overlay = {
  position: 'fixed', inset: 0, zIndex: 200,
  background: 'rgba(7,9,15,0.90)', backdropFilter: 'blur(10px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const panel = {
  background: '#111928',
  border: `1px solid #1C2E4A`,
  borderRadius: 16, width: '92%',
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  overflow: 'hidden',
};
