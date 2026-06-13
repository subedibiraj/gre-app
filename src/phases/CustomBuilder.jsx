import React, { useState } from 'react';
import C from '../theme';
import Icon from '../components/Icon';
import { apiFetch } from '../lib/gemini';
import CustomDrill from './CustomDrill';

export default function CustomBuilder() {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [difficulty, setDifficulty] = useState('Medium');
  
  // Verbal limits
  const [vCounts, setVCounts] = useState({ vic: 0, tc: 5, se: 5, rc: 1 });
  // Quant limits
  const [qCounts, setQCounts] = useState({ arithmetic: 0, algebra: 5, geometry: 5, data: 0 });

  const totalQ = vCounts.vic + vCounts.tc + vCounts.se + (vCounts.rc * 3) + 
                 qCounts.arithmetic + qCounts.algebra + qCounts.geometry + qCounts.data;

  const handleGenerate = async () => {
    if (totalQ === 0) {
      setError('Please select at least 1 question.');
      return;
    }
    if (totalQ > 30) {
      setError('Maximum 30 questions allowed per custom session to prevent timeout.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/api/generate-custom', {
        difficulty,
        verbalCounts: vCounts,
        quantCounts: qCounts
      });
      setExam(data);
    } catch (err) {
      setError(err.message || 'Failed to generate custom practice set.');
    } finally {
      setLoading(false);
    }
  };

  if (exam) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CustomDrill exam={exam} onExit={() => setExam(null)} />
      </div>
    );
  }

  const SectionCount = ({ label, value, onChange, max = 10, isPassage = false }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</div>
        {isPassage && <div style={{ fontSize: 11, color: C.textDim }}>3 questions per passage</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button 
          onClick={() => onChange(Math.max(0, value - 1))}
          style={{ width: 28, height: 28, borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: 'pointer' }}
        >-</button>
        <span style={{ fontFamily: 'Courier New,monospace', width: 20, textAlign: 'center' }}>{value}</span>
        <button 
          onClick={() => onChange(Math.min(max, value + 1))}
          style={{ width: 28, height: 28, borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: 'pointer' }}
        >+</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 20px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: C.gold, margin: '0 0 12px' }}>
          Custom Practice Builder
        </h2>
        <p style={{ color: C.textMid, fontSize: 15, maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
          Create targeted drills to attack your weaknesses. Select the exact mix of questions you want, and our AI will generate a fresh set instantly.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Left Column: Verbal */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: C.blue, margin: '0 0 20px', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              📖 Verbal Reasoning
            </h3>
            <SectionCount label="Text Completion (TC)" value={vCounts.tc} onChange={v => setVCounts({...vCounts, tc: v})} />
            <SectionCount label="Sentence Equivalence (SE)" value={vCounts.se} onChange={v => setVCounts({...vCounts, se: v})} />
            <SectionCount label="Reading Comp (RC)" value={vCounts.rc} onChange={v => setVCounts({...vCounts, rc: v})} max={3} isPassage={true} />
            <SectionCount label="Vocab in Context (VIC)" value={vCounts.vic} onChange={v => setVCounts({...vCounts, vic: v})} />
          </div>
        </div>

        {/* Right Column: Quant */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: C.greenBr, margin: '0 0 20px', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              📐 Quantitative Reasoning
            </h3>
            <SectionCount label="Arithmetic" value={qCounts.arithmetic} onChange={v => setQCounts({...qCounts, arithmetic: v})} />
            <SectionCount label="Algebra" value={qCounts.algebra} onChange={v => setQCounts({...qCounts, algebra: v})} />
            <SectionCount label="Geometry" value={qCounts.geometry} onChange={v => setQCounts({...qCounts, geometry: v})} />
            <SectionCount label="Data Analysis" value={qCounts.data} onChange={v => setQCounts({...qCounts, data: v})} />
          </div>
        </div>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 700 }}>
            Difficulty Level
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Easy', 'Medium', 'Hard'].map(d => (
              <button key={d} onClick={() => setDifficulty(d)} style={{
                background: difficulty === d ? C.gold : 'transparent',
                color: difficulty === d ? '#000' : C.textMid,
                border: `1px solid ${difficulty === d ? C.gold : C.border}`,
                padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: difficulty === d ? 700 : 400, cursor: 'pointer'
              }}>{d}</button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, fontWeight: 700 }}>
            Total Questions
          </div>
          <div style={{ fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700, color: totalQ > 30 ? C.red : C.text }}>
            {totalQ}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: `${C.red}11`, border: `1px solid ${C.red}44`, color: C.red, padding: 16, borderRadius: 8, marginTop: 24, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button 
          onClick={handleGenerate} 
          disabled={loading || totalQ === 0 || totalQ > 30}
          style={{
            background: loading || totalQ === 0 || totalQ > 30 ? C.surface : `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
            color: loading || totalQ === 0 || totalQ > 30 ? C.textDim : '#000',
            border: `1px solid ${loading || totalQ === 0 || totalQ > 30 ? C.border : 'transparent'}`,
            padding: '16px 40px', borderRadius: 30, fontSize: 16, fontWeight: 700, cursor: loading || totalQ === 0 || totalQ > 30 ? 'not-allowed' : 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 10,
            boxShadow: loading || totalQ === 0 || totalQ > 30 ? 'none' : `0 4px 20px ${C.gold}44`
          }}
        >
          {loading ? (
            <><div style={{ animation: 'spin 1s linear infinite' }}>⏳</div> Generating Exam...</>
          ) : (
            <><Icon name="Zap" size={20} /> Start Custom Drill</>
          )}
        </button>
      </div>
    </div>
  );
}
