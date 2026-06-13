import React, { useState } from 'react';
import C from '../theme';
import Icon from '../components/Icon';
import ReadingComp from './ReadingComp';
import { RC_PASSAGES } from '../../api/_rc-passages';

export default function RcLanding({ onUpsell }) {
  const [activePassage, setActivePassage] = useState(null);
  
  if (activePassage) {
    return (
      <div style={{ animation: 'fadeIn 0.3s' }}>
        <button
          onClick={() => setActivePassage(null)}
          style={{
            background: 'transparent', border: 'none', color: C.textMid,
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            marginBottom: 20, fontSize: 13, fontWeight: 600, padding: 0
          }}
        >
          <Icon name="ArrowLeft" size={16} /> Back to Passages
        </button>
        <ReadingComp passage={activePassage} onComplete={() => setActivePassage(null)} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: C.text, margin: '0 0 12px' }}>
          Reading Comprehension
        </h2>
        <p style={{ color: C.textMid, fontSize: 15, maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
          Master the most challenging section of the GRE Verbal. Read closely, identify the author's tone, and avoid trap answers.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {RC_PASSAGES.map((p, i) => {
          const isLocked = i > 0; // Lock everything after the first passage for free users
          
          return (
            <button
              key={p.id}
              onClick={() => {
                if (isLocked) { onUpsell(`RC Passage: ${p.title}`); return; }
                setActivePassage(p);
              }}
              style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
                padding: 24, textAlign: 'left', cursor: 'pointer', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.2s', overflow: 'hidden'
              }}
              className="glass-hover"
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: C.textMid, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {p.subject}
                  </span>
                  <span style={{ fontSize: 10, color: p.difficulty === 'Hard' ? C.red : p.difficulty === 'Medium' ? C.gold : C.greenBr, background: `${p.difficulty === 'Hard' ? C.red : p.difficulty === 'Medium' ? C.gold : C.greenBr}22`, padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                    {p.difficulty}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, color: C.text, fontFamily: 'Georgia,serif' }}>
                  {p.title}
                </h3>
                <p style={{ margin: 0, color: C.textDim, fontSize: 13 }}>
                  {p.length} length · {p.questions.length} questions
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isLocked ? (
                  <div style={{ background: `${C.gold}11`, padding: 10, borderRadius: '50%', color: C.gold }}>
                    <Icon name="Lock" size={20} />
                  </div>
                ) : (
                  <div style={{ background: `${C.blue}11`, padding: 10, borderRadius: '50%', color: C.blue }}>
                    <Icon name="BookOpen" size={20} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
