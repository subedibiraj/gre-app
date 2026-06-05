import { useState } from 'react';
import C from '../theme';
import { FREE_LIMITS, getGenerationsLeft, isPro } from '../lib/subscription';
import { checkoutRedirect } from '../lib/subscription';
import { hasGeminiKey } from '../lib/gemini';
import { useAuth } from '../lib/auth.jsx';

// ─── PAYWALL MODAL ────────────────────────────────────────────────────────────
export default function PaywallModal({ onClose, reason = 'days' }) {
  const [showByok, setShowByok] = useState(false);
  const [priceType, setPriceType] = useState('annual'); // 'monthly' | 'annual'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const gensLeft = getGenerationsLeft();
  const { user, signIn } = useAuth();

  const reasons = {
    days: { title: 'Unlock All 30 Days', subtitle: 'Days 8-30 are for Pro members' },
    ai: { title: 'AI Practice Limit Reached', subtitle: `${gensLeft} of ${FREE_LIMITS.aiGenerationsPerDay} daily generations used` },
    mock: { title: 'Monthly Mock Used', subtitle: 'Free tier includes 1 mock exam per month' },
    tutor: { title: 'AI Tutor is Pro Only', subtitle: 'Get unlimited access to the AI tutor' },
    sync: { title: 'Cloud Sync is Pro Only', subtitle: 'Sync progress across all your devices' },
  };

  const r = reasons[reason] || reasons.days;

  const features = [
    { icon: '📚', free: 'Days 1–7 vocabulary', pro: 'All 30 days (445+ words)' },
    { icon: '⚡', free: '3 AI sessions / day', pro: 'Unlimited AI practice' },
    { icon: '🎯', free: '1 mock exam / month', pro: 'Unlimited mock exams' },
    { icon: '📊', free: 'Basic progress', pro: 'Full analytics + section breakdown' },
    { icon: '☁️', free: '—', pro: 'Cloud sync across devices' },
    { icon: '🧠', free: '—', pro: 'AI Tutor chat' },
  ];

  const handleUpgrade = async () => {
    if (!user) {
      // Not signed in — trigger sign-in first
      signIn();
      return;
    }
    setLoading(true);
    setError('');
    try {
      await checkoutRedirect(priceType, user.id, user.email);
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 460,
        background: `linear-gradient(180deg, ${C.surface}, ${C.bg})`,
        border: `1px solid ${C.gold}33`,
        borderRadius: 20, padding: '0',
        boxShadow: `0 20px 80px rgba(0,0,0,0.6), 0 0 40px ${C.gold}11`,
        maxHeight: '92vh', overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 16, background: 'none',
          border: 'none', color: C.textDim, cursor: 'pointer', fontSize: 20,
          padding: 4, zIndex: 2,
        }}>✕</button>

        {/* Gold header */}
        <div style={{
          textAlign: 'center', padding: '28px 24px 20px',
          background: `linear-gradient(180deg, ${C.gold}18, transparent)`,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>👑</div>
          <h2 style={{
            fontFamily: 'Georgia,serif', fontSize: 22, margin: '0 0 6px',
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {r.title}
          </h2>
          <p style={{ color: C.textMid, fontSize: 13, margin: 0 }}>{r.subtitle}</p>
        </div>

        {/* Feature comparison */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginBottom: 20 }}>
            {/* Header row */}
            <div style={{ padding: '8px 0' }} />
            <div style={{ padding: '8px 6px', textAlign: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Free</span>
            </div>
            <div style={{ padding: '8px 6px', textAlign: 'center', background: `${C.gold}12`, borderRadius: '8px 8px 0 0' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pro</span>
            </div>

            {/* Feature rows */}
            {features.map((f, i) => (
              <div key={i} style={{ display: 'contents' }}>
                <div style={{ padding: '10px 0', display: 'flex', alignItems: 'center', gap: 8, borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 14 }}>{f.icon}</span>
                </div>
                <div style={{ padding: '10px 6px', textAlign: 'center', borderTop: `1px solid ${C.border}`, color: C.textDim, fontSize: 11 }}>
                  {f.free === '—' ? <span style={{ opacity: 0.3 }}>—</span> : f.free}
                </div>
                <div style={{
                  padding: '10px 6px', textAlign: 'center',
                  background: `${C.gold}08`, borderTop: `1px solid ${C.gold}15`,
                  color: C.text, fontSize: 11, fontWeight: 600,
                  borderRadius: i === features.length - 1 ? '0 0 8px 8px' : 0,
                }}>
                  {f.pro}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing with toggle */}
          <div style={{
            textAlign: 'center', padding: '18px 16px', marginBottom: 16,
            background: `linear-gradient(135deg, ${C.gold}14, ${C.goldBr}08)`,
            border: `1px solid ${C.gold}33`, borderRadius: 14,
          }}>
            {/* Monthly / Annual toggle */}
            <div style={{
              display: 'inline-flex', borderRadius: 8, overflow: 'hidden',
              border: `1px solid ${C.border}`, marginBottom: 14,
            }}>
              <button
                onClick={() => setPriceType('monthly')}
                style={{
                  padding: '8px 18px', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                  background: priceType === 'monthly' ? C.gold : 'transparent',
                  color: priceType === 'monthly' ? '#07090F' : C.textDim,
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setPriceType('annual')}
                style={{
                  padding: '8px 18px', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                  background: priceType === 'annual' ? C.gold : 'transparent',
                  color: priceType === 'annual' ? '#07090F' : C.textDim,
                }}
              >
                Annual
              </button>
            </div>

            <div>
              {priceType === 'monthly' ? (
                <div>
                  <p style={{ fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700, color: C.gold, margin: '0 0 2px' }}>$2.99</p>
                  <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>/ month</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontFamily: 'Courier New,monospace', fontSize: 28, fontWeight: 700, color: C.greenBr, margin: '0 0 2px' }}>$19.99</p>
                  <p style={{ color: C.textDim, fontSize: 11, margin: 0 }}>/ year <span style={{ color: C.greenBr, fontWeight: 700 }}>Save 44%</span></p>
                </div>
              )}
            </div>
            <p style={{ color: C.textDim, fontSize: 10, margin: '8px 0 0' }}>
              .edu email? <span style={{ color: C.gold }}>50% off automatically</span>
            </p>
          </div>

          {/* Error message */}
          {error && (
            <p style={{
              color: C.red, fontSize: 12, textAlign: 'center',
              margin: '0 0 10px', padding: '8px 12px',
              background: C.redBg, borderRadius: 8,
            }}>{error}</p>
          )}

          {/* CTA button — sign in first if needed */}
          {!user ? (
            <button
              onClick={handleUpgrade}
              style={{
                width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                background: `linear-gradient(135deg, ${C.blue}, #4A90D9)`,
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                minHeight: 52, marginBottom: 10,
                boxShadow: `0 4px 20px ${C.blue}44`,
                transition: 'transform 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in first to upgrade →
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              style={{
                width: '100%', padding: '15px', borderRadius: 12, border: 'none',
                background: loading
                  ? C.textDim
                  : `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
                color: '#07090F', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'wait' : 'pointer',
                minHeight: 52, marginBottom: 10,
                boxShadow: loading ? 'none' : `0 4px 20px ${C.gold}44`,
                transition: 'transform 0.15s',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? 'Redirecting to Stripe…' : 'Upgrade to Pro →'}
            </button>
          )}

          {/* BYOK escape hatch */}
          <button onClick={() => setShowByok(!showByok)} style={{
            width: '100%', padding: '10px', borderRadius: 8,
            border: `1px solid ${C.border}`, background: 'transparent',
            color: C.textDim, fontSize: 12, cursor: 'pointer', marginBottom: showByok ? 10 : 0,
          }}>
            {hasGeminiKey() ? '✓ Your API key is active — unlimited AI!' : 'Or use your own Gemini API key (free)'}
          </button>

          {showByok && (
            <div style={{
              padding: '12px 14px', background: C.bg, borderRadius: 8,
              border: `1px solid ${C.border}`, fontSize: 12, color: C.textMid, lineHeight: 1.6,
            }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong style={{ color: C.text }}>Bring Your Own Key</strong> — Get a free Gemini API key from{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" style={{ color: C.gold }}>
                  Google AI Studio
                </a>
              </p>
              <p style={{ margin: 0 }}>
                Add it in <strong style={{ color: C.text }}>Settings → Gemini API Key</strong>.
                BYOK gives you unlimited AI practice, mock exams, and tutor — completely free.
                Only vocabulary access (Days 8-30) and cloud sync require Pro.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
