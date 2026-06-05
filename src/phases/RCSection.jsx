import { useState } from 'react';
import C from '../theme';
import { Sound } from '../engine/audio';
import Card from '../components/Card';
import SectionHead from '../components/SectionHead';
import Btn from '../components/Btn';
import Tag from '../components/Tag';
import Timer from '../components/Timer';

export default function RCSection({ passages, onComplete, timed = false }) {
  const [pIdx, setPIdx]       = useState(0);
  const [answers, setAnswers] = useState(passages.map(p => p.questions.map(() => null)));
  const [checked, setChecked] = useState(passages.map(() => false));

  const passage = passages[pIdx];
  const pAnswers = answers[pIdx];
  const isChecked = checked[pIdx];

  const select = (qIdx, letter) => {
    if (isChecked) return;
    if (answers[pIdx][qIdx] !== letter) Sound.tap();
    setAnswers(prev => {
      const n = prev.map(a => [...a]);
      n[pIdx][qIdx] = letter;
      return n;
    });
  };

  const checkPassage = () => {
    const newChecked = checked.map((c, i) => i === pIdx ? true : c);
    setChecked(newChecked);
    if (newChecked.every(Boolean)) {
      let correct = 0, total = 0;
      passages.forEach((p, pi) => {
        p.questions.forEach((q, qi) => {
          total++;
          if (answers[pi][qi] === q.answer) correct++;
        });
      });
      if (correct === total) Sound.success(); else Sound.error();
      setTimeout(() => onComplete(correct, total), 400);
    }
  };

  const allAnswered = pAnswers.every(a => a !== null);

  return (
    <div>
      <SectionHead label="Reading Comprehension" count={`${passages.length} passage${passages.length > 1 ? 's' : ''} · AI generated`} color={C.greenBr} />
      <p style={{ color: C.textMid, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>
        Read the passage carefully, then answer questions on main idea, inference, and vocabulary.
      </p>

      {passages.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          {passages.map((_, i) => (
            <button key={i} onClick={() => setPIdx(i)} style={{
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 12, transition: 'all 0.15s',
              background: i === pIdx ? C.greenBr : checked[i] ? C.green + '33' : C.surface,
              color: i === pIdx ? '#07090F' : checked[i] ? C.greenBr : C.textMid,
            }}>Passage {i + 1}</button>
          ))}
          {timed && !isChecked && (
            <div style={{ marginLeft: 'auto' }}>
              <Timer key={pIdx} seconds={180} onTimeUp={checkPassage} label="⏱" />
            </div>
          )}
        </div>
      )}

      <Card style={{ marginBottom: 16 }}>
        {/* Topic badge */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Tag color={C.greenBr}>{passage.topic || 'Academic'}</Tag>
          <span style={{ color: C.textDim, fontSize: 11 }}>{passage.questions.length} questions</span>
        </div>

        {/* Passage text */}
        <div style={{
          background: C.surface, borderRadius: 8, padding: '18px 20px',
          borderLeft: `3px solid ${C.greenBr}`, marginBottom: 20,
          maxHeight: 300, overflowY: 'auto',
        }}>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 2, margin: 0, textAlign: 'justify' }}>
            {passage.passage}
          </p>
        </div>

        {/* Questions */}
        {passage.questions.map((q, qi) => {
          const sel = pAnswers[qi];
          return (
            <div key={q.id} style={{
              marginBottom: 16, paddingBottom: 16,
              borderBottom: qi < passage.questions.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <p style={{ color: C.text, fontSize: 13, lineHeight: 1.6, marginBottom: 10, fontWeight: 600 }}>
                <span style={{ color: C.greenBr, marginRight: 8 }}>{qi + 1}.</span>{q.q}
              </p>
              <div style={{ display: 'grid', gap: 6 }}>
                {q.opts.map(opt => {
                  const isSel = sel === opt.l;
                  const correct = isChecked && opt.l === q.answer;
                  const wrong = isChecked && isSel && opt.l !== q.answer;
                  return (
                    <button key={opt.l} onClick={() => select(qi, opt.l)} style={{
                      padding: '9px 14px', borderRadius: 6, textAlign: 'left', fontSize: 13,
                      cursor: isChecked ? 'default' : 'pointer', transition: 'all 0.15s',
                      border: `1px solid ${correct ? C.green : wrong ? C.red : isSel ? C.gold : C.border}`,
                      background: correct ? C.greenBg : wrong ? C.redBg : isSel ? C.goldDim + '44' : C.surface,
                      color: correct ? C.greenBr : wrong ? C.red : isSel ? C.gold : C.textMid,
                      fontWeight: isSel || correct ? 700 : 400,
                    }}>
                      <span style={{ color: C.textDim, marginRight: 8, fontFamily: 'Courier New,monospace' }}>{opt.l}.</span>
                      {opt.t}{correct ? ' ✓' : wrong ? ' ✗' : ''}
                    </button>
                  );
                })}
              </div>
              {isChecked && q.explain && (
                <div style={{
                  background: C.surface, borderRadius: 6, padding: 12,
                  borderLeft: `3px solid ${C.greenBr}`, marginTop: 10,
                }}>
                  <p style={{ fontSize: 10, color: C.greenBr, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Analysis
                  </p>
                  <p style={{ color: C.text, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                    {q.explain}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          {!isChecked && (
            <Btn onClick={checkPassage} disabled={!allAnswered}>
              {allAnswered ? 'Check Answers →' : `Answer all ${passage.questions.length} questions`}
            </Btn>
          )}
          {isChecked && pIdx < passages.length - 1 && (
            <Btn variant="ghost" onClick={() => setPIdx(i => i + 1)}>Next Passage →</Btn>
          )}
        </div>
      </Card>
    </div>
  );
}
