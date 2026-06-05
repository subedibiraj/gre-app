import { useState, useMemo } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { clusterColor } from '../utils';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import Tag from '../components/Tag';

// Build relationship chains from word data
function buildRelationships(words) {
  const clusters = {};
  words.forEach(w => {
    if (!clusters[w.cluster]) clusters[w.cluster] = [];
    clusters[w.cluster].push(w);
  });

  // Find antonym pairs by looking for opposite clusters
  const antonymPairs = [
    ['Quiet', 'Loud'], ['Gentle', 'Harsh'], ['Genuine', 'Liar'],
    ['Generous', 'Arrogant'], ['Cautious', 'Bold'], ['Restrained', 'Excessive'],
    ['Brave/Wise', 'Moody'], ['Sociable', 'Lone'],
  ];

  const relationships = [];

  // Synonym groups (same cluster)
  Object.entries(clusters).forEach(([cluster, clusterWords]) => {
    if (clusterWords.length >= 2) {
      relationships.push({
        type: 'synonyms',
        label: cluster,
        words: clusterWords,
        color: clusterColor(cluster),
      });
    }
  });

  // Antonym connections
  antonymPairs.forEach(([a, b]) => {
    if (clusters[a]?.length && clusters[b]?.length) {
      relationships.push({
        type: 'antonyms',
        labelA: a,
        labelB: b,
        wordsA: clusters[a],
        wordsB: clusters[b],
        colorA: clusterColor(a),
        colorB: clusterColor(b),
      });
    }
  });

  return relationships;
}

export default function WordRelations({ day }) {
  const [expanded, setExpanded] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const allWords = useMemo(() => DAYS.slice(0, day).flatMap(d => d.words), [day]);
  const relationships = useMemo(() => buildRelationships(allWords), [allWords]);

  const synonymGroups = relationships.filter(r => r.type === 'synonyms');
  const antonymPairs = relationships.filter(r => r.type === 'antonyms');

  // Generate quiz questions from relationships
  const quizQuestions = useMemo(() => {
    const qs = [];
    synonymGroups.forEach(g => {
      if (g.words.length >= 2) {
        const w = g.words[0];
        const correct = g.words[1];
        const distractors = allWords
          .filter(x => x.cluster !== g.label && !qs.some(q => q.distractor === x.w))
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        if (distractors.length >= 2) {
          const opts = [correct, ...distractors].sort(() => Math.random() - 0.5);
          qs.push({
            id: `syn-${g.label}`,
            type: 'synonym',
            word: w.w,
            answer: correct.w,
            opts: opts.map(o => o.w),
          });
        }
      }
    });
    return qs.slice(0, 8);
  }, [synonymGroups, allWords]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <SectionHead label="Word Relationships" count={`${allWords.length} words · ${synonymGroups.length} clusters`} color={C.goldBr} />
        <button onClick={() => setQuizMode(!quizMode)} style={{
          padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
          fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 12,
          background: quizMode ? C.gold : C.surface, color: quizMode ? '#07090F' : C.textMid,
          transition: 'all 0.15s',
        }}>
          {quizMode ? '📖 View Map' : '⚡ Quick Quiz'}
        </button>
      </div>

      {quizMode ? (
        // Quiz Mode
        <div>
          <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16 }}>
            For each word, pick its closest synonym from the options.
          </p>
          {quizQuestions.map((q, i) => {
            const answered = quizAnswers[q.id];
            const isCorrect = answered === q.answer;
            return (
              <Card key={q.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: C.textDim, fontSize: 11 }}>Q{i + 1}</span>
                  <span style={{ color: C.text, fontSize: 13 }}>Which word is closest in meaning to</span>
                  <span style={{
                    fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 14,
                    color: C.gold, background: C.goldDim + '33', padding: '2px 8px', borderRadius: 4,
                  }}>{q.word}</span>
                  <span style={{ color: C.text, fontSize: 13 }}>?</span>
                  {answered && <Tag color={isCorrect ? C.green : C.red}>{isCorrect ? '✓' : '✗'}</Tag>}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {q.opts.map(opt => {
                    const isSel = answered === opt;
                    const correct = answered && opt === q.answer;
                    const wrong = answered && isSel && opt !== q.answer;
                    return (
                      <button key={opt} onClick={() => {
                        if (answered) return;
                        setQuizAnswers(p => ({ ...p, [q.id]: opt }));
                      }} style={{
                        padding: '6px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'Courier New,monospace', fontWeight: isSel || correct ? 700 : 400,
                        cursor: answered ? 'default' : 'pointer', transition: 'all 0.15s',
                        border: `1px solid ${correct ? C.green : wrong ? C.red : C.border}`,
                        background: correct ? C.greenBg : wrong ? C.redBg : C.surface,
                        color: correct ? C.greenBr : wrong ? C.red : C.textMid,
                      }}>
                        {opt}{correct ? ' ✓' : wrong ? ' ✗' : ''}
                      </button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
          {Object.keys(quizAnswers).length === quizQuestions.length && quizQuestions.length > 0 && (
            <Card style={{ textAlign: 'center', marginTop: 16 }}>
              <p style={{ fontSize: 24, margin: '0 0 8px' }}>
                {Object.values(quizAnswers).filter((a, i) => a === quizQuestions[i]?.answer).length >= quizQuestions.length * 0.8 ? '🎯' : '📚'}
              </p>
              <p style={{ color: C.gold, fontSize: 16, fontWeight: 700 }}>
                {Object.values(quizAnswers).filter((a, i) => a === quizQuestions[i]?.answer).length}/{quizQuestions.length} correct
              </p>
              <button onClick={() => setQuizAnswers({})} style={{
                marginTop: 8, padding: '6px 16px', borderRadius: 6, border: 'none',
                cursor: 'pointer', background: C.surface, color: C.textMid, fontSize: 12,
              }}>↺ Retry</button>
            </Card>
          )}
        </div>
      ) : (
        // Map Mode
        <div>
          {/* Synonym Groups */}
          <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700 }}>
            Synonym Clusters (words that mean similar things)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 24 }}>
            {synonymGroups.map(g => (
              <Card key={g.label}
                onClick={() => setExpanded(expanded === g.label ? null : g.label)}
                style={{
                  cursor: 'pointer', borderLeft: `3px solid ${g.color}`,
                  background: expanded === g.label ? C.cardHi : C.card,
                  transition: 'all 0.2s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Tag color={g.color}>{g.label}</Tag>
                  <span style={{ color: C.textDim, fontSize: 11 }}>{g.words.length} words</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {g.words.map(w => (
                    <span key={w.w} style={{
                      fontSize: 11, fontFamily: 'Courier New,monospace', fontWeight: 700,
                      color: g.color, padding: '2px 6px', background: g.color + '15', borderRadius: 3,
                    }}>{w.w}</span>
                  ))}
                </div>
                {expanded === g.label && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                    {g.words.map(w => (
                      <p key={w.w} style={{ fontSize: 11, color: C.textMid, marginBottom: 4, lineHeight: 1.5 }}>
                        <strong style={{ color: g.color }}>{w.w}</strong> — {w.def}
                      </p>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Antonym Pairs */}
          {antonymPairs.length > 0 && (
            <>
              <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, fontWeight: 700 }}>
                Antonym Chains (opposites)
              </p>
              <div style={{ display: 'grid', gap: 10 }}>
                {antonymPairs.map(p => (
                  <Card key={`${p.labelA}-${p.labelB}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <Tag color={p.colorA}>{p.labelA}</Tag>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: 6 }}>
                          {p.wordsA.map(w => (
                            <span key={w.w} style={{
                              fontSize: 11, fontFamily: 'Courier New,monospace', fontWeight: 700,
                              color: p.colorA,
                            }}>{w.w}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: C.red + '22', border: `1px solid ${C.red}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, flexShrink: 0,
                      }}>⇋</div>
                      <div style={{ flex: 1 }}>
                        <Tag color={p.colorB}>{p.labelB}</Tag>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                          {p.wordsB.map(w => (
                            <span key={w.w} style={{
                              fontSize: 11, fontFamily: 'Courier New,monospace', fontWeight: 700,
                              color: p.colorB,
                            }}>{w.w}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
