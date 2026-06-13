import { useState, useEffect } from 'react';
import C from '../theme';
import { getStreak } from '../engine/streak';
import { getXP, getLevel } from '../engine/xp';
import { getShieldStatus } from '../engine/streak';

import { fireConfetti, fireSmallConfetti } from '../engine/confetti';

// ─── ANIMATED SCORE RING ──────────────────────────────────────────────────────
function ScoreRing({ correct, total }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  const pct = total > 0 ? correct / total : 0;
  const r = 60, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - (animated ? pct : 0));
  const color = pct >= 0.9 ? C.greenBr : pct >= 0.7 ? C.gold : pct >= 0.5 ? '#E4A060' : C.red;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="10" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
        <text x={cx} y={cy - 8} textAnchor="middle" fill={color}
          fontFamily="Courier New,monospace" fontSize="28" fontWeight="700">
          {Math.round(pct * 100)}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={C.textMid}
          fontFamily="Courier New,monospace" fontSize="13">
          {correct}/{total}
        </text>
      </svg>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SessionComplete({
  section = 'verbal',   // 'verbal' | 'quant'
  correct = 0,
  total = 0,
  xpGained = 0,
  weakWordsAdded = [],
  sectionBreakdown = {}, // { vic: { correct, total }, tc: {...}, ... }
  pacing = {},            // { vic: [12,18,...], tc: [45,60,...], se: [...] }
  onNext,
  onReview,
  onClose,
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { 
    requestAnimationFrame(() => setVisible(true)); 
    if (total > 0) {
      const pct = correct / total;
      if (pct >= 1) {
        setTimeout(fireConfetti, 300);
      } else if (pct >= 0.8) {
        setTimeout(fireSmallConfetti, 300);
      }
    }
  }, [correct, total]);

  const pct = total > 0 ? correct / total : 0;
  const streak = getStreak();
  const xp = getXP();
  const level = getLevel(xp.total);
  const shield = getShieldStatus();
  const isPerfect = pct >= 1;
  const isGreat = pct >= 0.9;

  const emoji = isPerfect ? '🏆' : isGreat ? '🔥' : pct >= 0.7 ? '💪' : pct >= 0.5 ? '📚' : '🌱';
  const title = isPerfect ? 'Perfect Score!' : isGreat ? 'Excellent!' : pct >= 0.7 ? 'Great Work!' : pct >= 0.5 ? 'Good Progress' : 'Keep Practicing';

  const sectionLabels = {
    vic: 'Vocabulary', tc: 'Text Completion', se: 'Sentence Equiv.',
    rc: 'Reading Comp.', contrast: 'Contrast Recall',
    qc: 'Quant Comparison', mc: 'Multiple Choice', ne: 'Numeric Entry',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, opacity: visible ? 1 : 0, transition: 'opacity 0.3s',
    }}>

      <div style={{
        width: '100%', maxWidth: 440,
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 18, padding: '28px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        position: 'relative', maxHeight: '90vh', overflowY: 'auto',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 14, background: 'none',
          border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 18, padding: 4,
        }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{emoji}</div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: C.gold, margin: '0 0 4px' }}>
            {title}
          </h2>
          <p style={{ color: C.textDim, fontSize: 12 }}>
            {section === 'verbal' ? 'Verbal Practice' : 'Quant Practice'} Complete
          </p>
        </div>

        {/* Score ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <ScoreRing correct={correct} total={total} />
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px', background: `${C.gold}12`, borderRadius: 8, border: `1px solid ${C.gold}22` }}>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 700, color: C.gold, margin: '0 0 2px' }}>+{xpGained}</p>
            <p style={{ color: C.textDim, fontSize: 9, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>XP Earned</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px', background: `#FF6B3512`, borderRadius: 8, border: `1px solid #FF6B3522` }}>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 700, color: '#FF6B35', margin: '0 0 2px' }}>{streak.current}🔥</p>
            <p style={{ color: C.textDim, fontSize: 9, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Day Streak</p>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px', background: `${C.blue}12`, borderRadius: 8, border: `1px solid ${C.blue}22` }}>
            <p style={{ fontFamily: 'Courier New,monospace', fontSize: 18, fontWeight: 700, color: C.blue, margin: '0 0 2px' }}>{level.icon}</p>
            <p style={{ color: C.textDim, fontSize: 9, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{level.name}</p>
          </div>
        </div>

        {/* Shield notification */}
        {shield.justUsed && (
          <div style={{
            display: 'flex', gap: 10, padding: '10px 14px', marginBottom: 14,
            background: `${C.gold}12`, border: `1px solid ${C.gold}33`, borderRadius: 8,
          }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
            <p style={{ color: C.gold, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              <strong>Streak Shield activated!</strong> You missed a day but your streak is safe.
            </p>
          </div>
        )}

        {/* Section breakdown */}
        {Object.keys(sectionBreakdown).length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Section Breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(sectionBreakdown).filter(([, v]) => v.total > 0).map(([sec, v]) => {
                const sPct = v.correct / v.total;
                const sColor = sPct >= 0.8 ? C.greenBr : sPct >= 0.6 ? C.gold : C.red;
                return (
                  <div key={sec} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', background: C.bg, borderRadius: 6 }}>
                    <span style={{ color: C.textMid, fontSize: 12, flex: 1 }}>{sectionLabels[sec] || sec}</span>
                    <div style={{ width: 60, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${sPct * 100}%`, background: sColor, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: 'Courier New,monospace', fontSize: 12, fontWeight: 700, color: sColor, minWidth: 36, textAlign: 'right' }}>
                      {v.correct}/{v.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pacing Analytics */}
        {pacing && Object.values(pacing).some(v => v && v.length > 0) && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ color: C.textDim, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              ⏱ Pacing Analytics
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(pacing).filter(([, times]) => times && times.length > 0).map(([sec, times]) => {
                const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
                const max = Math.max(...times);
                // GRE recommended pace per question type
                const targets = { vic: 45, tc: 90, se: 60, rc: 120 };
                const target = targets[sec] || 60;
                const pacingColor = avg <= target ? C.greenBr : avg <= target * 1.3 ? C.gold : C.red;
                const pacingLabel = avg <= target ? 'On pace' : avg <= target * 1.3 ? 'Slightly slow' : 'Too slow';
                return (
                  <div key={sec} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: C.bg, borderRadius: 6 }}>
                    <span style={{ color: C.textMid, fontSize: 12, flex: 1 }}>{sectionLabels[sec] || sec}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                      <span style={{ fontFamily: 'Courier New,monospace', fontSize: 13, fontWeight: 700, color: pacingColor }}>
                        {avg}s avg
                      </span>
                      <span style={{ fontSize: 9, color: pacingColor, fontWeight: 600 }}>
                        {pacingLabel} · max {max}s
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ color: C.textDim, fontSize: 10, marginTop: 6, lineHeight: 1.5 }}>
              GRE targets: VIC ~45s · TC ~90s · SE ~60s · RC ~2min per question
            </p>
          </div>
        )}

        {/* Weak words */}
        {weakWordsAdded.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              ⚠️ Words to Review ({weakWordsAdded.length})
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {weakWordsAdded.slice(0, 12).map(w => (
                <span key={w} style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 6,
                  background: `${C.red}14`, border: `1px solid ${C.red}33`, color: C.red,
                  fontFamily: 'Courier New,monospace', fontWeight: 600,
                }}>{w}</span>
              ))}
              {weakWordsAdded.length > 12 && (
                <span style={{ fontSize: 11, color: C.textDim, padding: '3px 6px' }}>+{weakWordsAdded.length - 12} more</span>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {onReview && (
            <button onClick={onReview} style={{
              flex: 1, padding: '13px 16px', borderRadius: 10,
              border: `1.5px solid ${C.border}`, background: C.bg,
              color: C.textMid, fontWeight: 700, fontSize: 13, cursor: 'pointer', minHeight: 48,
            }}>Review Mistakes</button>
          )}
          <button onClick={onNext || onClose} style={{
            flex: 2, padding: '13px 16px', borderRadius: 10, border: 'none',
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
            color: '#07090F', fontWeight: 700, fontSize: 14, cursor: 'pointer', minHeight: 48,
            boxShadow: `0 4px 16px ${C.gold}44`,
          }}>
            {onNext ? 'Next Session →' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
