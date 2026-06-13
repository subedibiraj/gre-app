import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import C from '../theme';
import Tag from './Tag';
import { Sound } from '../engine/audio';

export default function Flashcards({ words, onClose, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [exitDir, setExitDir] = useState(0); // -1 left, 1 right
  
  // Provide a key so framer-motion knows when card changes
  const currentWord = words[idx];

  const handleNext = (known) => {
    Sound.tap();
    setExitDir(known ? 1 : -1);
    setTimeout(() => {
      if (idx + 1 >= words.length) {
        onComplete?.();
      } else {
        setIdx(i => i + 1);
        setFlipped(false);
        setExitDir(0);
      }
    }, 300);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === '2') {
        if (!flipped) setFlipped(true);
        else handleNext(true);
      } else if (e.key === 'ArrowLeft' || e.key === '1') {
        if (!flipped) setFlipped(true);
        else handleNext(false);
      } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFlipped(f => !f);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [idx, flipped]);

  if (!currentWord) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(7,9,15,0.95)', backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Header */}
      <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 24, padding: 8
        }}>✕</button>
        <div style={{ color: C.textDim, fontSize: 14, fontFamily: 'Courier New,monospace', fontWeight: 700 }}>
          {idx + 1} / {words.length}
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ position: 'relative', width: 340, height: 480, perspective: 1200 }}>
        <AnimatePresence mode="popLayout" custom={exitDir}>
          <motion.div
            key={idx + (flipped ? '-back' : '-front')}
            initial={{ opacity: 0, x: exitDir === 0 ? 0 : exitDir * 200, rotateY: exitDir === 0 ? (flipped ? -180 : 180) : 0, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, x: exitDir * -200, rotateY: exitDir === 0 ? (flipped ? 180 : -180) : 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            onClick={() => setFlipped(!flipped)}
            style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(145deg, ${C.surface}, ${C.card})`,
              border: `1px solid ${C.border}`,
              borderRadius: 24, padding: 32,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center', textAlign: 'center',
              boxShadow: `0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
              cursor: 'pointer', backfaceVisibility: 'hidden',
            }}
          >
            {!flipped ? (
              // FRONT
              <>
                <p style={{ color: C.textDim, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Tap or space to flip</p>
                <h2 style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 44, margin: '0 0 12px' }}>
                  {currentWord.w}
                </h2>
                {currentWord.cluster && (
                  <Tag color={C.blue}>{currentWord.cluster}</Tag>
                )}
              </>
            ) : (
              // BACK
              <>
                <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Definition</p>
                <p style={{ color: C.text, fontSize: 18, lineHeight: 1.5, margin: '0 0 24px', fontWeight: 500 }}>
                  {currentWord.def}
                </p>
                
                <p style={{ color: C.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>Example</p>
                <p style={{ color: C.textMid, fontSize: 14, fontStyle: 'italic', margin: '0 0 24px', lineHeight: 1.6 }}>
                  "{currentWord.ex}"
                </p>

                {currentWord.tip && (
                  <div style={{ background: `${C.gold}11`, border: `1px solid ${C.gold}33`, padding: '10px 14px', borderRadius: 8, marginTop: 'auto' }}>
                    <p style={{ color: C.gold, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px', fontWeight: 700 }}>Mnemonic</p>
                    <p style={{ color: C.goldBr, fontSize: 12, margin: 0 }}>{currentWord.tip}</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{
        marginTop: 48, display: 'flex', gap: 24,
        opacity: flipped ? 1 : 0.3, pointerEvents: flipped ? 'auto' : 'none',
        transition: 'opacity 0.3s'
      }}>
        <button onClick={() => handleNext(false)} style={{
          width: 80, height: 80, borderRadius: '50%', border: `2px solid ${C.red}44`,
          background: `radial-gradient(circle, ${C.redBg}, ${C.surface})`,
          color: C.red, fontSize: 24, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          boxShadow: `0 8px 24px ${C.red}22`
        }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>✗</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Still Learning</span>
        </button>

        <button onClick={() => handleNext(true)} style={{
          width: 80, height: 80, borderRadius: '50%', border: `2px solid ${C.green}44`,
          background: `radial-gradient(circle, ${C.greenBg}, ${C.surface})`,
          color: C.greenBr, fontSize: 24, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          boxShadow: `0 8px 24px ${C.green}22`
        }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>✓</span>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Got it</span>
        </button>
      </div>
      
      <p style={{ color: C.textDim, fontSize: 12, marginTop: 24 }}>
        Keyboard: <strong>Space</strong> to flip, <strong>Left/Right</strong> arrows to swipe
      </p>
    </div>
  );
}
