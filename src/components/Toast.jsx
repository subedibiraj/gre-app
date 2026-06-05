import { useState, useEffect } from 'react';
import C from '../theme';

export default function Toast({ message, type = 'error', onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!message) return;
    setTimeout(() => setShow(true), 10);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 400); // Wait for transition
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const bg = type === 'error' ? `${C.red}15` : type === 'success' ? `${C.green}15` : `${C.gold}15`;
  const border = type === 'error' ? C.red : type === 'success' ? C.green : C.gold;
  const icon = type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';

  return (
    <div style={{
      position: 'fixed', top: 20, left: '50%', transform: `translateX(-50%) ${show ? 'translateY(0)' : 'translateY(-100px)'}`,
      zIndex: 9999, transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      background: C.surface, border: `1px solid ${border}55`, borderRadius: 12, padding: '12px 20px',
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${bg}`,
      display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, maxWidth: '90vw',
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <p style={{ color: C.text, fontSize: 14, margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
        {message}
      </p>
    </div>
  );
}
