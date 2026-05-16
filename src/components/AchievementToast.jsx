import { useState, useEffect } from 'react';
import C from '../theme';

// Lightweight confetti burst — no dependencies
function Confetti({ count = 30 }) {
  const colors = [C.gold, C.goldBr, C.greenBr, C.blue, '#9B6BDB', '#FF6B6B'];
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.3,
    angle: Math.random() * 360,
    distance: 60 + Math.random() * 140,
    size: 4 + Math.random() * 6,
    duration: 0.8 + Math.random() * 0.6,
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: '40%',
          width: p.size, height: p.size, borderRadius: p.size > 7 ? 2 : '50%',
          background: p.color,
          animation: `confetti-burst ${p.duration}s ${p.delay}s ease-out forwards`,
          '--angle': `${p.angle}deg`, '--dist': `${p.distance}px`,
        }} />
      ))}
      <style>{`
        @keyframes confetti-burst {
          0% { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(calc(cos(var(--angle)) * var(--dist)), calc(sin(var(--angle)) * var(--dist) - 100px)) rotate(720deg) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Achievement toast notification
export default function AchievementToast({ achievement, onDone }) {
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (!achievement) return;
    setConfetti(true);
    setTimeout(() => setShow(true), 50);
    setTimeout(() => { setShow(false); setConfetti(false); }, 3500);
    setTimeout(() => onDone?.(), 4000);
  }, [achievement]);

  if (!achievement) return null;

  return (
    <>
      {confetti && <Confetti />}
      <div style={{
        position: 'fixed', top: 20, left: '50%', transform: `translateX(-50%) ${show ? 'translateY(0)' : 'translateY(-80px)'}`,
        zIndex: 201, transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        background: `linear-gradient(135deg, ${C.card}, ${C.cardHi})`,
        border: `1px solid ${C.gold}55`, borderRadius: 14, padding: '14px 24px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${C.gold}22`,
        display: 'flex', alignItems: 'center', gap: 14, minWidth: 280,
      }}>
        <span style={{ fontSize: 32 }}>{achievement.icon}</span>
        <div>
          <p style={{ color: C.gold, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Achievement Unlocked!</p>
          <p style={{ color: C.text, fontSize: 15, fontWeight: 700, margin: '2px 0 0' }}>{achievement.name}</p>
          <p style={{ color: C.textMid, fontSize: 11, margin: '2px 0 0' }}>{achievement.desc} · +{achievement.xp} XP</p>
        </div>
      </div>
    </>
  );
}
