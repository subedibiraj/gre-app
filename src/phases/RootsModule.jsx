import { useState, useMemo } from 'react';
import C from '../theme';
import { ROOTS } from '../data/roots';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import Tag from '../components/Tag';
import Btn from '../components/Btn';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const catColors = {
  Positive: '#2EBB80', Negative: '#B53028', Speech: '#E4A060',
  Mind: '#2B6FBF', Feeling: '#9B6BDB', Size: '#C8A535',
  Change: '#4CAF9C', Power: '#E4A060', Prefix: '#2B6FBF',
};

export default function RootsModule() {
  const [mode, setMode] = useState('learn'); // learn | quiz
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [quizSeed, setQuizSeed] = useState(0);

  const categories = ['All', ...new Set(ROOTS.map(r => r.category))];
  const visible = filter === 'All' ? ROOTS : ROOTS.filter(r => r.category === filter);

  // Quiz state
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);

  const quizQuestions = useMemo(() => {
    const qs = shuffle(ROOTS).slice(0, 10).map(root => {
      const others = shuffle(ROOTS.filter(r => r.root !== root.root)).slice(0, 3);
      const opts = shuffle([
        { text: root.meaning, correct: true },
        ...others.map(o => ({ text: o.meaning, correct: false })),
      ]);
      return { root: root.root, examples: root.examples, answer: opts.findIndex(o => o.correct), opts };
    });
    return qs;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizSeed]);

  const q = quizQuestions[qIdx];
  const done = qIdx >= quizQuestions.length;

  const handleAnswer = (i) => {
    if (answered !== null) return;
    setAnswered(i);
    if (i === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      setAnswered(null);
      setQIdx(idx => idx + 1);
    }, 1200);
  };

  const resetQuiz = () => {
    setQIdx(0); setScore(0); setAnswered(null);
    setQuizSeed(s => s + 1);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <SectionHead label="Root / Prefix Decoder" count={`${ROOTS.length} roots`} color={C.goldBr} />
        <div style={{ display: 'flex', gap: 6 }}>
          <Btn small variant={mode === 'learn' ? 'primary' : 'ghost'} onClick={() => setMode('learn')}>📖 Learn</Btn>
          <Btn small variant={mode === 'quiz' ? 'primary' : 'ghost'} onClick={() => { setMode('quiz'); resetQuiz(); }}>⚡ Quiz</Btn>
        </div>
      </div>

      {mode === 'learn' ? (
        <>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
            Knowing roots lets you decode <strong style={{ color: C.gold }}>unknown words on test day</strong>.
            If you see "magnanimous" and know <code style={{ color: C.goldBr }}>magn- = great</code> + <code style={{ color: C.goldBr }}>anim- = spirit</code>, you can infer "great-spirited."
          </p>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '4px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                background: filter === cat ? C.gold : C.surface,
                color: filter === cat ? '#07090F' : C.textMid,
              }}>{cat}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {visible.map(r => {
              const isOpen = expanded === r.root;
              const color = catColors[r.category] || C.gold;
              return (
                <Card key={r.root}
                  onClick={() => setExpanded(isOpen ? null : r.root)}
                  style={{
                    cursor: 'pointer', borderLeft: `3px solid ${color}`,
                    background: isOpen ? C.cardHi : C.card, transition: 'all 0.2s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: 'Courier New,monospace', fontSize: 16, fontWeight: 700,
                      color, letterSpacing: '0.05em',
                    }}>{r.root}</span>
                    <span style={{ color: C.text, fontSize: 13 }}> = {r.meaning}</span>
                    <Tag color={color}>{r.category}</Tag>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                    {r.examples.map(ex => (
                      <span key={ex} style={{
                        fontSize: 10, fontFamily: 'Courier New,monospace',
                        color: C.textMid, padding: '2px 6px', background: C.surface, borderRadius: 3,
                      }}>{ex}</span>
                    ))}
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                      <p style={{ color: C.textDim, fontSize: 11, marginBottom: 6 }}>Break it down:</p>
                      {r.examples.map(ex => (
                        <p key={ex} style={{ color: C.text, fontSize: 12, marginBottom: 4, lineHeight: 1.5 }}>
                          <strong style={{ color }}>{ex}</strong>
                          <span style={{ color: C.textDim }}> → contains </span>
                          <code style={{ color: C.goldBr }}>{r.root.replace('/', ' or ')}</code>
                          <span style={{ color: C.textDim }}> ({r.meaning})</span>
                        </p>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        // Quiz Mode
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          {!done ? (
            <>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
                {quizQuestions.map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < qIdx ? C.green : i === qIdx ? C.gold : C.border,
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>

              <Card style={{ textAlign: 'center', padding: '24px 20px' }}>
                <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Q{qIdx + 1} of {quizQuestions.length}
                </p>
                <p style={{
                  fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700,
                  color: C.gold, letterSpacing: '0.1em', marginBottom: 8,
                }}>{q.root}</p>
                <p style={{ color: C.textDim, fontSize: 11, marginBottom: 16 }}>
                  e.g., {q.examples.slice(0, 2).join(', ')}
                </p>
                <p style={{ color: C.text, fontSize: 14, marginBottom: 16 }}>What does this root mean?</p>
                <div style={{ display: 'grid', gap: 8 }}>
                  {q.opts.map((opt, i) => {
                    const isSel = answered === i;
                    const correct = answered !== null && i === q.answer;
                    const wrong = answered !== null && isSel && i !== q.answer;
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} style={{
                        padding: '10px 16px', borderRadius: 6, fontSize: 13, textAlign: 'left',
                        cursor: answered !== null ? 'default' : 'pointer', transition: 'all 0.15s',
                        border: `1px solid ${correct ? C.green : wrong ? C.red : C.border}`,
                        background: correct ? C.greenBg : wrong ? C.redBg : C.surface,
                        color: correct ? C.greenBr : wrong ? C.red : C.textMid,
                        fontWeight: correct || isSel ? 700 : 400,
                      }}>
                        {opt.text}{correct ? ' ✓' : wrong ? ' ✗' : ''}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </>
          ) : (
            <Card style={{ textAlign: 'center', padding: '32px 20px' }}>
              <p style={{ fontSize: 40, margin: '0 0 12px' }}>
                {score >= 8 ? '🎯' : score >= 5 ? '💪' : '📚'}
              </p>
              <p style={{ fontFamily: 'Courier New,monospace', fontSize: 32, fontWeight: 700, color: C.gold, margin: '0 0 8px' }}>
                {score}/{quizQuestions.length}
              </p>
              <p style={{ color: C.textMid, fontSize: 14, marginBottom: 20 }}>
                {score >= 8 ? 'Root master! Unknown words won\'t stop you.'
                  : score >= 5 ? 'Good foundation. Review the ones you missed.'
                    : 'Study the roots above, then quiz again.'}
              </p>
              <Btn onClick={resetQuiz}>Quiz Again ↺</Btn>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
