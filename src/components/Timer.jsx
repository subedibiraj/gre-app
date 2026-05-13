import { useState, useEffect, useRef } from 'react';
import C from '../theme';

export default function Timer({ seconds, onTimeUp, active = true, label }) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!active) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active, onTimeUp]);

  const pct = (remaining / seconds) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const urgent = pct < 25;
  const warning = pct < 50;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {label && <span style={{ color: C.textDim, fontSize: 11 }}>{label}</span>}
      <div style={{
        flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden',
        minWidth: 60, maxWidth: 120,
      }}>
        <div style={{
          height: '100%', borderRadius: 2,
          width: `${pct}%`,
          background: urgent ? C.red : warning ? C.gold : C.green,
          transition: 'width 1s linear, background 0.3s',
        }} />
      </div>
      <span style={{
        fontFamily: 'Courier New,monospace', fontSize: 13, fontWeight: 700,
        color: urgent ? C.red : warning ? C.gold : C.greenBr,
        minWidth: 42, textAlign: 'right',
      }}>
        {mins}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
