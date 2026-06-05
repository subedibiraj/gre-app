import { useState, useEffect } from 'react';
import C from '../theme';
import { getXP, getLevel, getUnlockedAchievements, ACHIEVEMENTS } from '../engine/xp';
import Icon from './Icon';

export default function XPBar() {
  const [xp, setXp] = useState(() => getXP());
  const [showPanel, setShowPanel] = useState(false);

  // Refresh XP every 2 seconds to catch updates from other components
  useEffect(() => {
    const id = setInterval(() => setXp(getXP()), 2000);
    return () => clearInterval(id);
  }, []);

  const level = getLevel(xp.total);
  const unlocked = getUnlockedAchievements();
  const locked = ACHIEVEMENTS.filter(a => !unlocked.includes(a.id));

  return (
    <>
      {/* Compact XP pill in header */}
      <button onClick={() => setShowPanel(true)} style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
        background: `linear-gradient(135deg, ${C.gold}22, ${C.gold}08)`,
        border: `1px solid ${C.gold}33`, borderRadius: 20, cursor: 'pointer',
        transition: 'all 0.2s',
      }}>
        <Icon name={level.icon} size={16} color={C.gold} />
        <span style={{ fontFamily: 'Courier New,monospace', fontWeight: 700, fontSize: 12, color: C.gold }}>{xp.total}</span>
        <span style={{ color: C.textDim, fontSize: 9 }}>XP</span>
        {/* Mini progress bar */}
        <div style={{ width: 30, height: 3, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: C.gold, borderRadius: 2, width: `${level.progress * 100}%`, transition: 'width 0.4s' }} />
        </div>
      </button>

      {/* Full XP Panel */}
      {showPanel && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }} onClick={() => setShowPanel(false)}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: '28px 24px', maxWidth: 500, width: '90%', maxHeight: '80vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 18, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name={level.icon} size={20} color={C.gold} /> Level: {level.name}
              </h3>
              <button onClick={() => setShowPanel(false)} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            {/* XP Progress */}
            <div style={{
              background: `linear-gradient(135deg, ${C.gold}15, transparent)`,
              borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${C.gold}22`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700, color: C.gold }}>{xp.total}</span>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: C.textMid, fontSize: 11, margin: 0 }}>Today: +{xp.today} XP</p>
                  {level.nextLevel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', color: C.textDim, fontSize: 10 }}>
                      {level.nextLevel.min - xp.total} XP to <Icon name={level.nextLevel.icon} size={12} /> {level.nextLevel.name}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4, transition: 'width 0.6s ease',
                  background: `linear-gradient(90deg, ${C.gold}, ${C.goldBr})`,
                  width: `${level.progress * 100}%`,
                }} />
              </div>
            </div>

            {/* Achievements */}
            <p style={{ color: C.textDim, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 }}>
              🏆 Achievements ({unlocked.length}/{ACHIEVEMENTS.length})
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 16 }}>
              {ACHIEVEMENTS.map(a => {
                const isUnlocked = unlocked.includes(a.id);
                return (
                  <div key={a.id} style={{
                    background: isUnlocked ? `linear-gradient(135deg, ${C.gold}15, ${C.gold}05)` : C.surface,
                    border: `1px solid ${isUnlocked ? C.gold + '44' : C.border}`,
                    borderRadius: 10, padding: '10px 12px', opacity: isUnlocked ? 1 : 0.5,
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Icon name={a.icon} size={18} color={isUnlocked ? C.gold : C.textDim} />
                      <span style={{ color: isUnlocked ? C.gold : C.textDim, fontSize: 11, fontWeight: 700 }}>{a.name}</span>
                    </div>
                    <p style={{ color: C.textDim, fontSize: 10, margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
                    <p style={{ color: isUnlocked ? C.greenBr : C.textDim, fontSize: 9, margin: '4px 0 0', fontFamily: 'Courier New,monospace' }}>
                      {isUnlocked ? '✓ Unlocked' : `+${a.xp} XP`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
