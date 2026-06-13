import React, { useState, useEffect } from 'react';
import C from '../theme';
import Icon from '../components/Icon';
import ReadingComp from './ReadingComp';
import { RC_PASSAGES } from '../../api/_rc-passages';

const loadJSON = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };

export default function RcLanding({ onUpsell }) {
  const [activePassage, setActivePassage] = useState(null);
  const [progress, setProgress] = useState({});
  const [filterSubj, setFilterSubj] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  useEffect(() => {
    setProgress(loadJSON('gre_rc_progress', {}));
  }, [activePassage]); // reload progress when returning from a passage

  const handleComplete = (id, correct, total) => {
    const p = loadJSON('gre_rc_progress', {});
    // only save the highest score
    if (!p[id] || correct > p[id].correct) {
      p[id] = { correct, total };
      localStorage.setItem('gre_rc_progress', JSON.stringify(p));
    }
    setActivePassage(null);
  };

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
        <ReadingComp passage={activePassage} onComplete={(c, t) => handleComplete(activePassage.id, c, t)} />
      </div>
    );
  }

  const subjects = ['All', ...new Set(RC_PASSAGES.map(p => p.subject))];
  const difficulties = ['All', 'Medium', 'Hard'];

  const filtered = RC_PASSAGES.filter(p => {
    if (filterSubj !== 'All' && p.subject !== filterSubj) return false;
    if (filterDiff !== 'All' && p.difficulty !== filterDiff) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: C.text, margin: '0 0 12px' }}>
          Reading Comprehension Bank
        </h2>
        <p style={{ color: C.textMid, fontSize: 15, maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
          Master the most challenging section of the GRE Verbal. Read closely, identify the author's tone, and avoid trap answers.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {subjects.map(s => (
            <button key={s} onClick={() => setFilterSubj(s)} style={{
              background: filterSubj === s ? C.blue : C.surface, color: filterSubj === s ? '#fff' : C.textMid,
              border: `1px solid ${filterSubj === s ? C.blue : C.border}`,
              padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontWeight: filterSubj === s ? 700 : 400
            }}>{s}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {difficulties.map(d => (
            <button key={d} onClick={() => setFilterDiff(d)} style={{
              background: filterDiff === d ? C.gold : C.surface, color: filterDiff === d ? '#000' : C.textMid,
              border: `1px solid ${filterDiff === d ? C.gold : C.border}`,
              padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontWeight: filterDiff === d ? 700 : 400
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map((p, i) => {
          // Find original index to determine if locked (only first passage is free)
          const origIdx = RC_PASSAGES.findIndex(x => x.id === p.id);
          const isLocked = origIdx > 0;
          const prog = progress[p.id];
          
          return (
            <button
              key={p.id}
              onClick={() => {
                if (isLocked) { onUpsell(`RC Passage: ${p.title}`); return; }
                setActivePassage(p);
              }}
              style={{
                background: prog ? `${C.green}0A` : C.card, border: `1px solid ${prog ? C.green + '44' : C.border}`, borderRadius: 16,
                padding: 24, textAlign: 'left', cursor: 'pointer', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.2s', overflow: 'hidden', opacity: isLocked ? 0.7 : 1
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
                  {prog && (
                    <span style={{ fontSize: 10, color: C.greenBr, background: `${C.green}22`, padding: '2px 8px', borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="Check" size={12} /> {prog.correct}/{prog.total} Correct
                    </span>
                  )}
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
                  <div style={{ background: `${prog ? C.green : C.blue}11`, padding: 10, borderRadius: '50%', color: prog ? C.greenBr : C.blue }}>
                    <Icon name={prog ? 'Check' : 'BookOpen'} size={20} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: C.textDim }}>
            <p>No passages match these filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
