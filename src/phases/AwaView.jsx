import { useState, useEffect, useRef } from 'react';
import C from '../theme';
import { apiFetch } from '../lib/gemini';
import { addScoreEntry, addAwaEntry, getAwaHistory } from '../engine/history';
import { AWA_PROMPTS } from '../data/awa-prompts';

export default function AwaView({ onSessionComplete }) {
  const [prompt, setPrompt] = useState('');
  const [essay, setEssay] = useState('');
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('write'); // 'write' | 'history'
  const [history, setHistory] = useState(() => getAwaHistory());
  const [viewingHistoryIdx, setViewingHistoryIdx] = useState(null);
  const textareaRef = useRef(null);

  const promptsList = window.__GRE_AWA_PROMPTS || AWA_PROMPTS;

  // Pick random prompt on mount
  useEffect(() => {
    setPrompt(promptsList[Math.floor(Math.random() * promptsList.length)]);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!started || timeLeft <= 0 || grading || result) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft, grading, result]);

  // Auto-submit when time is up
  useEffect(() => {
    if (started && timeLeft === 0 && !grading && !result) {
      handleSubmit();
    }
  }, [timeLeft, started, grading, result]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSubmit = async () => {
    if (!essay.trim() || grading) return;
    setGrading(true);
    
    try {
      const data = await apiFetch('/api/awa-grade', { prompt, essay });
      setResult(data);
      addScoreEntry({ type: 'awa', score: data.score, total: 6.0 });
      addAwaEntry({ prompt, essay, result: data });
      setHistory(getAwaHistory());
      if (onSessionComplete) onSessionComplete({ score: data.score, total: 6.0, type: 'awa' });
    } catch (err) {
      if (window.showToast) window.showToast(err.message || 'Failed to grade essay');
      setGrading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 20 }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 28, color: C.text, margin: '0 0 10px' }}>
            Analytical Writing Assessment
          </h2>
          <div style={{ background: C.card, padding: '16px 20px', borderRadius: 12, border: `1px solid ${C.border}` }}>
            <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
              Analyze an Issue
            </p>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: C.text, margin: 0, lineHeight: 1.5 }}>
              "{prompt}"
            </p>
            <p style={{ color: C.textMid, fontSize: 13, margin: '12px 0 0', fontStyle: 'italic' }}>
              Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take.
            </p>
          </div>
        </div>
        
        {tab === 'write' && started && !result && (
          <div style={{ 
            background: timeLeft < 300 ? `${C.red}15` : C.card, 
            border: `1px solid ${timeLeft < 300 ? C.red : C.border}`,
            padding: '12px 20px', borderRadius: 12, textAlign: 'center', minWidth: 100
          }}>
            <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Time Remaining</p>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 24, fontWeight: 700, color: timeLeft < 300 ? C.red : C.text, margin: 0 }}>
              {timeStr}
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => { setTab('write'); setViewingHistoryIdx(null); }} style={{
          padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: tab === 'write' ? C.gold : C.surface,
          color: tab === 'write' ? '#07090F' : C.textDim, fontWeight: 700, fontSize: 13,
        }}>Write Essay</button>
        <button onClick={() => setTab('history')} style={{
          padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: tab === 'history' ? C.gold : C.surface,
          color: tab === 'history' ? '#07090F' : C.textDim, fontWeight: 700, fontSize: 13,
        }}>Past Essays ({history.length})</button>
      </div>

      {/* History View */}
      {tab === 'history' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: 40, margin: '0 0 10px' }}>📝</p>
              <p style={{ color: C.textMid, fontSize: 15 }}>No past essays found. Write your first essay to see it here!</p>
            </div>
          ) : viewingHistoryIdx !== null ? (
            <div style={{ padding: '0 0 40px' }}>
              <button onClick={() => setViewingHistoryIdx(null)} style={{
                background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', padding: 0, marginBottom: 16, fontSize: 13,
              }}>← Back to History</button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', background: `${C.gold}15`,
                  border: `2px solid ${C.gold}`, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <span style={{ fontFamily: 'Courier New,monospace', fontSize: 32, fontWeight: 700, color: C.gold }}>
                    {history[viewingHistoryIdx].result.score.toFixed(1)}
                  </span>
                  <span style={{ color: C.textDim, fontSize: 10 }}>/ 6.0</span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: 20, fontFamily: 'Georgia,serif' }}>
                    "{history[viewingHistoryIdx].prompt}"
                  </h3>
                  <p style={{ color: C.textDim, fontSize: 12, margin: 0 }}>
                    Written on {history[viewingHistoryIdx].date}
                  </p>
                </div>
              </div>

              {/* Essay content */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px', fontWeight: 700 }}>Your Essay</p>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'Georgia,serif' }}>
                  {history[viewingHistoryIdx].essay}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
                <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}33`, borderRadius: 12, padding: 20 }}>
                  <h4 style={{ color: C.greenBr, marginTop: 0, marginBottom: 12, fontSize: 15 }}>✅ Strengths</h4>
                  <ul style={{ paddingLeft: 20, margin: 0, color: C.textMid, fontSize: 14, lineHeight: 1.6 }}>
                    {history[viewingHistoryIdx].result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}33`, borderRadius: 12, padding: 20 }}>
                  <h4 style={{ color: C.red, marginTop: 0, marginBottom: 12, fontSize: 15 }}>🎯 Areas for Improvement</h4>
                  <ul style={{ paddingLeft: 20, margin: 0, color: C.textMid, fontSize: 14, lineHeight: 1.6 }}>
                    {history[viewingHistoryIdx].result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>

              {history[viewingHistoryIdx].result.grammar_fixes?.length > 0 && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                  <h4 style={{ color: C.gold, marginTop: 0, marginBottom: 12, fontSize: 15 }}>✍️ Grammar & Vocabulary Fixes</h4>
                  <ul style={{ paddingLeft: 20, margin: 0, color: C.textMid, fontSize: 14, lineHeight: 1.6 }}>
                    {history[viewingHistoryIdx].result.grammar_fixes.map((f, i) => <li key={i} style={{ marginBottom: 8 }}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {history.map((entry, idx) => (
                <div key={entry.id} style={{
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: `${C.gold}15`, flexShrink: 0,
                    border: `1px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontFamily: 'Courier New,monospace', fontSize: 15, fontWeight: 700, color: C.gold }}>
                      {entry.result.score.toFixed(1)}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: C.text, fontSize: 14, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Georgia,serif' }}>
                      "{entry.prompt}"
                    </p>
                    <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>
                      {entry.date} · {entry.essay.trim().split(/\s+/).length} words
                    </p>
                  </div>
                  <button onClick={() => setViewingHistoryIdx(idx)} style={{
                    padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`,
                    background: C.surface, color: C.textMid, cursor: 'pointer', fontSize: 12, fontWeight: 600
                  }}>View Report</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor or Results */}
      {tab === 'write' && (!started ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={handleStart} style={{
            padding: '16px 32px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`, color: '#07090F',
            fontSize: 18, fontWeight: 700, boxShadow: `0 4px 20px ${C.gold}44`
          }}>
            Begin 30-Minute Essay
          </button>
        </div>
      ) : result ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', background: `${C.gold}15`,
              border: `2px solid ${C.gold}`, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontFamily: 'Courier New,monospace', fontSize: 32, fontWeight: 700, color: C.gold }}>{result.score.toFixed(1)}</span>
              <span style={{ color: C.textDim, fontSize: 10 }}>/ 6.0</span>
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: 24 }}>AI Grading Report</h3>
              <p style={{ color: C.textMid, fontSize: 14, margin: 0 }}>Graded against official ETS 6.0 rubric parameters.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
            <div style={{ background: `${C.green}10`, border: `1px solid ${C.green}33`, borderRadius: 12, padding: 20 }}>
              <h4 style={{ color: C.greenBr, marginTop: 0, marginBottom: 12, fontSize: 15 }}>✅ Strengths</h4>
              <ul style={{ paddingLeft: 20, margin: 0, color: C.textMid, fontSize: 14, lineHeight: 1.6 }}>
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}33`, borderRadius: 12, padding: 20 }}>
              <h4 style={{ color: C.red, marginTop: 0, marginBottom: 12, fontSize: 15 }}>🎯 Areas for Improvement</h4>
              <ul style={{ paddingLeft: 20, margin: 0, color: C.textMid, fontSize: 14, lineHeight: 1.6 }}>
                {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>

          {result.grammar_fixes?.length > 0 && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <h4 style={{ color: C.gold, marginTop: 0, marginBottom: 12, fontSize: 15 }}>✍️ Grammar & Vocabulary Fixes</h4>
              <ul style={{ paddingLeft: 20, margin: 0, color: C.textMid, fontSize: 14, lineHeight: 1.6 }}>
                {result.grammar_fixes.map((f, i) => <li key={i} style={{ marginBottom: 8 }}>{f}</li>)}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            ref={textareaRef}
            value={essay}
            onChange={e => setEssay(e.target.value)}
            disabled={grading || timeLeft === 0}
            placeholder="Type your essay here..."
            spellCheck="false"
            style={{
              flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: 24, color: C.text, fontSize: 16, fontFamily: 'Arial, sans-serif', lineHeight: 1.6,
              resize: 'none', outline: 'none', transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = C.gold}
            onBlur={e => e.target.style.borderColor = C.border}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <span style={{ color: C.textDim, fontSize: 13, fontFamily: 'Courier New,monospace' }}>
              Word Count: {essay.trim() ? essay.trim().split(/\s+/).length : 0}
            </span>
            <button onClick={handleSubmit} disabled={grading || !essay.trim()} style={{
              padding: '12px 28px', borderRadius: 8, border: 'none', cursor: grading ? 'wait' : 'pointer',
              background: grading ? C.textDim : C.gold, color: '#07090F', fontWeight: 700, fontSize: 14,
              opacity: grading || !essay.trim() ? 0.5 : 1
            }}>
              {grading ? 'Grading Essay...' : 'Submit Essay'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
