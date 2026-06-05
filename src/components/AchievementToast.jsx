import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import C from '../theme';
import Icon from './Icon';

export default function AchievementToast({ ach, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (ach) {
      setShow(true);
      // Fire hyper-realistic viral confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [C.gold, C.greenBr, C.blue, '#9B6BDB', '#FF6B6B'],
        zIndex: 1000,
      });

      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [ach, onClose]);

  if (!ach) return null;

  return (
    <>
      {/* Toast popup */}
      <div style={{
        position: 'fixed', top: show ? 24 : -100, left: '50%', transform: 'translateX(-50%)',
        background: `linear-gradient(135deg, ${C.cardHi}, ${C.card})`,
        border: `1px solid ${C.gold}44`, borderRadius: 16,
        padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16,
        boxShadow: `0 10px 40px ${C.gold}33`, zIndex: 210,
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: show ? 1 : 0, pointerEvents: 'none',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 24, background: C.gold + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 20px ${C.gold}44 inset`,
        }}>
          <Icon name={ach.icon} size={24} color={C.gold} />
        </div>
        <div>
          <p style={{ color: C.gold, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px', fontWeight: 700 }}>
            Achievement Unlocked!
          </p>
          <p style={{ color: C.text, fontSize: 16, margin: '0 0 2px', fontWeight: 700 }}>
            {ach.name}
          </p>
          <p style={{ color: C.textDim, fontSize: 12, margin: 0 }}>
            +{ach.xp} XP
          </p>
        </div>
      </div>
    </>
  );
}
