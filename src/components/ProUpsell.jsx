import React from 'react';
import C from '../theme';
import Icon from './Icon';

export default function ProUpsell({ featureName, onClose }) {
  const handleUpgrade = async () => {
    try {
      const { checkoutRedirect } = await import('../lib/subscription.js');
      const { supabase } = await import('../lib/supabase.js');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please login first to upgrade.");
        return;
      }
      
      await checkoutRedirect(session.user.id, session.user.email);
    } catch (e) {
      console.error(e);
      alert("Failed to redirect to checkout. Please check the console.");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 20, animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`,
        border: `1px solid ${C.gold}55`, borderRadius: 24, padding: 36,
        maxWidth: 480, width: '100%', position: 'relative',
        boxShadow: `0 20px 60px ${C.gold}15`, animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Glow behind */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: C.gold, opacity: 0.1, borderRadius: '50%', filter: 'blur(40px)' }} />

        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none',
          color: C.textDim, cursor: 'pointer', padding: 8, zIndex: 10
        }}>
          <Icon name="X" size={24} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ background: `linear-gradient(135deg, ${C.gold}33, transparent)`, padding: 16, borderRadius: '50%', border: `1px solid ${C.gold}44` }}>
              <Icon name="Crown" size={32} color={C.gold} />
            </div>
          </div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 26, color: C.text, margin: '0 0 8px' }}>
            Unlock {featureName || 'Pro Features'}
          </h2>
          <p style={{ color: C.textMid, fontSize: 14, margin: 0, lineHeight: 1.5 }}>
            You've hit the limit of the free tier. Upgrade to GRE Pro to access the entire 170-level curriculum and dominate the test.
          </p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
          {[
            'All 30 Days of 445+ High-Yield Words',
            'Full Quantitative Curriculum (Algebra, Geometry, Data)',
            'Unlimited AI Practice Generation',
            'Advanced Analytics & Pacing Tracker',
            'Unlimited Full Mock Exams'
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ background: `${C.greenBr}15`, padding: 4, borderRadius: '50%', display: 'flex' }}>
                <Icon name="Check" size={14} color={C.greenBr} />
              </div>
              <span style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={handleUpgrade} className="glass-hover" style={{
          width: '100%', background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
          border: 'none', borderRadius: 12, padding: '16px 0', cursor: 'pointer',
          color: '#07090F', fontSize: 16, fontWeight: 700,
          boxShadow: `0 4px 14px ${C.gold}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          Upgrade to GRE Pro <Icon name="ArrowRight" size={18} color="#07090F" />
        </button>
        <p style={{ textAlign: 'center', color: C.textDim, fontSize: 12, marginTop: 16, margin: '16px 0 0' }}>
          Cancel anytime. Join thousands of 330+ scorers.
        </p>

        <style>{`
          @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}</style>
      </div>
    </div>
  );
}
