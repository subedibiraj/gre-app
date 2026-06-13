import React, { useState } from 'react';
import C from '../theme';
import Icon from '../components/Icon';

export default function ReadingComp({ passage, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const q = passage.questions[currentQ];

  const handleSelect = (val) => {
    if (showExplanation) return;
    const currentAns = answers[currentQ] || [];
    if (q.type === 'multiple') {
      if (currentAns.includes(val)) {
        setAnswers({ ...answers, [currentQ]: currentAns.filter(x => x !== val) });
      } else {
        setAnswers({ ...answers, [currentQ]: [...currentAns, val] });
      }
    } else {
      setAnswers({ ...answers, [currentQ]: val });
    }
  };

  const isCorrect = () => {
    if (q.type === 'multiple') {
      const ans = answers[currentQ] || [];
      return ans.length === q.answer.length && ans.every(x => q.answer.includes(x));
    }
    return answers[currentQ] === q.answer;
  };

  const handleSubmit = () => {
    if (showExplanation) {
      if (currentQ < passage.questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setShowExplanation(false);
      } else {
        onComplete(answers);
      }
    } else {
      setShowExplanation(true);
      if (!isCorrect()) {
        import('../engine/error-log').then(({ logMistake }) => {
          logMistake({ ...q, passageText: passage.text, passageTitle: passage.title }, answers[currentQ], 'verbal');
        }).catch(console.error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 120px)', minHeight: 600 }}>
      {/* Left Pane: Passage */}
      <div style={{ flex: 1, background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.surface }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontFamily: 'Georgia,serif' }}>{passage.title}</h3>
          <span style={{ fontSize: 11, color: C.gold, background: `${C.gold}22`, padding: '2px 8px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>
            {passage.difficulty} · {passage.length}
          </span>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, fontFamily: 'Georgia,serif', fontSize: 15, lineHeight: 1.8, color: '#EAE6D7', whiteSpace: 'pre-wrap' }}>
          {q.type === 'select-in-passage' ? (
            <div>
              {q.options.map((sentence, idx) => {
                const isSelected = answers[currentQ] === idx;
                return (
                  <span
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    style={{
                      cursor: showExplanation ? 'default' : 'pointer',
                      background: isSelected ? `${C.blue}33` : 'transparent',
                      borderBottom: isSelected ? `2px solid ${C.blue}` : 'none',
                      padding: '2px 0',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { if (!showExplanation) e.currentTarget.style.background = `${C.blue}1A`; }}
                    onMouseLeave={e => { if (!showExplanation && !isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {sentence}{' '}
                  </span>
                );
              })}
            </div>
          ) : (
            passage.text
          )}
        </div>
      </div>

      {/* Right Pane: Question */}
      <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ color: C.textMid, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Question {currentQ + 1} of {passage.questions.length}
            </span>
            <span style={{ color: C.textDim, fontSize: 11 }}>{q.type === 'multiple' ? 'Select all that apply' : q.type === 'select-in-passage' ? 'Click sentence in passage' : 'Select one'}</span>
          </div>

          <p style={{ color: C.text, fontSize: 15, fontWeight: 600, lineHeight: 1.5, marginBottom: 20 }}>{q.question}</p>

          {q.type !== 'select-in-passage' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, i) => {
                const val = opt.charAt(0); // A, B, C...
                const isSelected = q.type === 'multiple' ? (answers[currentQ] || []).includes(val) : answers[currentQ] === val;
                const isCorrectAns = q.type === 'multiple' ? q.answer.includes(val) : q.answer === val;
                
                let borderColor = isSelected ? C.blue : C.border;
                let bg = isSelected ? `${C.blue}1A` : 'transparent';
                
                if (showExplanation) {
                  if (isCorrectAns) {
                    borderColor = C.greenBr; bg = `${C.greenBr}22`;
                  } else if (isSelected && !isCorrectAns) {
                    borderColor = C.red; bg = `${C.red}22`;
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(val)}
                    style={{
                      textAlign: 'left', padding: '12px 16px', borderRadius: 8,
                      border: `1px solid ${borderColor}`, background: bg,
                      color: C.text, fontSize: 14, cursor: showExplanation ? 'default' : 'pointer',
                      transition: 'all 0.2s ease', display: 'flex', alignItems: 'flex-start', gap: 12
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: q.type === 'multiple' ? 4 : '50%',
                      border: `1px solid ${isSelected ? (showExplanation ? borderColor : C.blue) : C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      background: isSelected ? (showExplanation ? borderColor : C.blue) : 'transparent',
                      marginTop: 2
                    }}>
                      {isSelected && <Icon name="Check" size={12} color="#000" />}
                    </div>
                    <span style={{ lineHeight: 1.4 }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {showExplanation && (
            <div style={{ marginTop: 24, padding: 16, background: isCorrect() ? `${C.greenBr}11` : `${C.red}11`, borderRadius: 8, border: `1px solid ${isCorrect() ? C.greenBr : C.red}33`, animation: 'fadeIn 0.3s' }}>
              <h4 style={{ margin: '0 0 8px', color: isCorrect() ? C.greenBr : C.red, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                {isCorrect() ? '✅ Correct' : '❌ Incorrect'}
              </h4>
              <p style={{ color: C.textMid, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{q.explanation}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!showExplanation && (q.type === 'multiple' ? !(answers[currentQ]?.length > 0) : answers[currentQ] === undefined)}
          style={{
            padding: 16, borderRadius: 12, border: 'none',
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color: '#000',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            opacity: (!showExplanation && (q.type === 'multiple' ? !(answers[currentQ]?.length > 0) : answers[currentQ] === undefined)) ? 0.5 : 1,
            transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8
          }}
        >
          {showExplanation ? (currentQ < passage.questions.length - 1 ? 'Next Question' : 'Finish Passage') : 'Check Answer'}
        </button>
      </div>
    </div>
  );
}
