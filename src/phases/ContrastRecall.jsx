import { useState, useMemo } from 'react';
import C from '../theme';
import { DAYS } from '../data/days';
import { clusterColor } from '../utils';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import Btn from '../components/Btn';
import Tag from '../components/Tag';

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ContrastRecall({ day, onComplete }) {
  const allWords = useMemo(() => DAYS.slice(0, day).flatMap(d => d.words), [day]);

  // Pick 5 random pairs from all days
  const pairs = useMemo(() => {
    const pool = shuffle(allWords).slice(0, 10);
    const result = [];
    for (let i = 0; i < pool.length - 1; i += 2) {
      result.push({ left: pool[i], right: pool[i + 1] });
    }
    return result;
  }, [allWords]);

  // For each pair, randomly decide which word goes with which definition
  const questions = useMemo(() => {
    return pairs.map((pair, idx) => {
      const swap = Math.random() > 0.5;
      const wordA = swap ? pair.right : pair.left;
      const wordB = swap ? pair.left : pair.right;
      return {
        id: idx,
        wordA: wordA.w,
        wordB: wordB.w,
        defA: wordA.def,
        defB: wordB.def,
        clusterA: wordA.cluster,
        clusterB: wordB.cluster,
        // correct mapping: defA -> wordA, defB -> wordB
        correctA: wordA.w,
        correctB: wordB.w,
      };
    });
  }, [pairs]);

  const [answers, setAnswers] = useState(questions.map(() => ({ top: null, bottom: null })));
  const [checked, setChecked] = useState(false);

  const selectAnswer = (qIdx, slot, word) => {
    if (checked) return;
    setAnswers(prev => {
      const n = [...prev];
      const curr = { ...n[qIdx] };
      // If clicking the same word, deselect
      if (curr[slot] === word) {
        curr[slot] = null;
      } else {
        // Remove word from other slot if already there
        if (curr.top === word) curr.top = null;
        if (curr.bottom === word) curr.bottom = null;
        curr[slot] = word;
      }
      n[qIdx] = curr;
      return n;
    });
  };

  const checkAll = () => {
    setChecked(true);
    const correct = questions.filter((q, i) =>
      answers[i].top === q.correctA && answers[i].bottom === q.correctB
    ).length;
    onComplete?.(correct, questions.length);
  };

  const allAnswered = answers.every(a => a.top && a.bottom);
  const score = checked ? questions.filter((q, i) => answers[i].top === q.correctA && answers[i].bottom === q.correctB).length : null;

  return (
    <div>
      <SectionHead label="Contrast Recall" count={`${questions.length} pairs · all days`} color={C.goldBr} />
      <p style={{ color: C.textMid, fontSize: 12, marginBottom: 18, lineHeight: 1.6 }}>
        Match each word to its correct definition. These pairs test your cumulative vocabulary across all {day} days.
      </p>

      {questions.map((q, i) => {
        const ans = answers[i];
        const isCorrectTop = checked && ans.top === q.correctA;
        const isCorrectBot = checked && ans.bottom === q.correctB;
        const isWrongTop = checked && ans.top && ans.top !== q.correctA;
        const isWrongBot = checked && ans.bottom && ans.bottom !== q.correctB;

        return (
          <Card key={q.id} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Tag color={C.gold}>Pair {i + 1}</Tag>
              <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, color: clusterColor(q.clusterA), fontSize: 14 }}>{q.wordA}</span>
              <span style={{ color: C.textDim, fontSize: 12 }}>vs</span>
              <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, color: clusterColor(q.clusterB), fontSize: 14 }}>{q.wordB}</span>
            </div>

            {/* Definition A */}
            <div style={{ marginBottom: 8 }}>
              <p style={{ color: C.text, fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>
                <span style={{ color: C.textDim, marginRight: 6 }}>1.</span>"{q.defA}"
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[q.wordA, q.wordB].map(w => {
                  const isSel = ans.top === w;
                  const correct = checked && w === q.correctA;
                  const wrong = checked && isSel && w !== q.correctA;
                  return (
                    <button key={w} onClick={() => selectAnswer(i, 'top', w)} style={{
                      padding: '6px 16px', borderRadius: 6, fontSize: 12,
                      fontFamily: 'Courier New,monospace', fontWeight: 700,
                      cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
                      border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                      background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                      color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                    }}>
                      {w}{correct ? ' ✓' : wrong ? ' ✗' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Definition B */}
            <div>
              <p style={{ color: C.text, fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>
                <span style={{ color: C.textDim, marginRight: 6 }}>2.</span>"{q.defB}"
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[q.wordA, q.wordB].map(w => {
                  const isSel = ans.bottom === w;
                  const correct = checked && w === q.correctB;
                  const wrong = checked && isSel && w !== q.correctB;
                  return (
                    <button key={w} onClick={() => selectAnswer(i, 'bottom', w)} style={{
                      padding: '6px 16px', borderRadius: 6, fontSize: 12,
                      fontFamily: 'Courier New,monospace', fontWeight: 700,
                      cursor: checked ? 'default' : 'pointer', transition: 'all 0.15s',
                      border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                      background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                      color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                    }}>
                      {w}{correct ? ' ✓' : wrong ? ' ✗' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}

      <div style={{ textAlign: 'right', marginTop: 12 }}>
        {!checked ? (
          <Btn onClick={checkAll} disabled={!allAnswered}>
            {allAnswered ? 'Check All Pairs →' : `Match all pairs first`}
          </Btn>
        ) : (
          <Btn variant="success" onClick={() => {}}>
            ✓ {score}/{questions.length} pairs correct — scroll down ↓
          </Btn>
        )}
      </div>
    </div>
  );
}
