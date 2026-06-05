import React from 'react';
import C from '../theme';

export default function ExamWeekBanner({ daysUntilTest, onActivate }) {
  if (daysUntilTest === null || daysUntilTest > 7) return null;

  const isToday = daysUntilTest === 0;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.red}33, ${C.gold}22)`,
      borderBottom: `1px solid ${C.red}44`,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      flexWrap: 'wrap',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle pulsing background glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(circle at 50% 50%, ${C.red}22, transparent 60%)`,
        animation: 'pulse 3s infinite',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
          100% { opacity: 0.4; transform: scale(0.95); }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 1 }}>
        <span style={{ fontSize: 24, filter: `drop-shadow(0 0 6px ${C.red})` }}>
          {isToday ? '🔥' : '🚨'}
        </span>
        <div>
          <p style={{
            margin: 0, color: C.red, fontWeight: 800, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: '0.08em'
          }}>
            {isToday ? 'TEST DAY IS HERE' : 'EXAM WEEK MODE'}
          </p>
          <p style={{ margin: '2px 0 0', color: C.textMid, fontSize: 12 }}>
            {isToday 
              ? "Trust your preparation. You've got this."
              : `${daysUntilTest} day${daysUntilTest > 1 ? 's' : ''} left. Time for high-yield review.`}
          </p>
        </div>
      </div>

      {!isToday && (
        <button
          onClick={onActivate}
          style={{
            zIndex: 1,
            background: `linear-gradient(135deg, ${C.red}, #FF4B4B)`,
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            color: '#fff',
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: `0 4px 12px ${C.red}44`,
            transition: 'transform 0.15s, box-shadow 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = `0 6px 16px ${C.red}66`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = `0 4px 12px ${C.red}44`;
          }}
        >
          Final Review →
        </button>
      )}
    </div>
  );
}
