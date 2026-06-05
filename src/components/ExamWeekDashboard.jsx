import React from 'react';
import C from '../theme';

export default function ExamWeekDashboard({ weakWords = [], onClose, onNavigate }) {
  // Grab the top 15 most recent/pressing weak words
  const topWeakWords = weakWords.slice(-15).reverse();

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(7,9,15,0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px', overflowY: 'auto'
    }}>
      <div className="scale-in" style={{
        width: '100%', maxWidth: 540, margin: 'auto',
        background: C.surface,
        border: `1px solid ${C.red}44`,
        borderRadius: 20,
        padding: '32px 24px',
        boxShadow: `0 20px 80px rgba(0,0,0,0.8), 0 0 40px ${C.red}22`,
        position: 'relative'
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none', color: C.textDim,
          fontSize: 24, cursor: 'pointer', padding: 4, lineHeight: 1
        }}>×</button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 40, filter: `drop-shadow(0 0 10px ${C.red})` }}>🚨</span>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, color: C.red, margin: '12px 0 6px' }}>
            Exam Week Review
          </h2>
          <p style={{ color: C.textMid, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            You are less than 7 days from your test. This dashboard isolates the highest-yield activities to maximize your score before test day.
          </p>
        </div>

        {/* High-Yield Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          <button onClick={() => { onClose(); onNavigate('verbal_mock'); }} style={{
            display: 'flex', alignItems: 'center', gap: 16, width: '100%',
            padding: '16px', background: `${C.blue}14`, border: `1px solid ${C.blue}44`,
            borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 24 }}>📝</span>
            <div>
              <p style={{ margin: 0, color: C.blue, fontWeight: 700, fontSize: 14 }}>Take Verbal Mock Exam</p>
              <p style={{ margin: '4px 0 0', color: C.textMid, fontSize: 11 }}>Build stamina and get a final score read.</p>
            </div>
          </button>

          <button onClick={() => { onClose(); onNavigate('quant_mock'); }} style={{
            display: 'flex', alignItems: 'center', gap: 16, width: '100%',
            padding: '16px', background: `${C.greenBr}14`, border: `1px solid ${C.greenBr}44`,
            borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 24 }}>🧮</span>
            <div>
              <p style={{ margin: 0, color: C.greenBr, fontWeight: 700, fontSize: 14 }}>Take Quant Mock Exam</p>
              <p style={{ margin: '4px 0 0', color: C.textMid, fontSize: 11 }}>35 minutes. Test your pacing.</p>
            </div>
          </button>
        </div>

        {/* Weak Words Spotlight */}
        <div style={{ background: C.bg, borderRadius: 12, padding: '16px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, color: C.gold, fontSize: 14 }}>Highest-Yield Weak Words</h3>
            <span style={{ fontSize: 11, color: C.textDim }}>{topWeakWords.length} words</span>
          </div>
          
          {topWeakWords.length === 0 ? (
            <p style={{ color: C.textMid, fontSize: 12, textAlign: 'center', margin: '20px 0' }}>
              No weak words tracked yet. Take a practice session!
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {topWeakWords.map(w => (
                <span key={w} style={{
                  background: `${C.red}18`, color: C.red,
                  padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: `1px solid ${C.red}33`
                }}>
                  {w}
                </span>
              ))}
            </div>
          )}

          {topWeakWords.length > 0 && (
            <button onClick={() => { onClose(); onNavigate('blitz'); }} style={{
              width: '100%', marginTop: 16, padding: '12px', borderRadius: 8, border: 'none',
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
              color: '#07090F', fontWeight: 700, fontSize: 13, cursor: 'pointer'
            }}>
              Launch Weak Word Blitz ⚡
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
