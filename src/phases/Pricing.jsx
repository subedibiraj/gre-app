import { useState } from 'react';
import C from '../theme';
import Icon from '../components/Icon';

export default function Pricing() {
  const [billing, setBilling] = useState('annual'); // 'annual' or 'monthly'

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: '$0',
      period: 'forever',
      desc: 'Build your foundational vocabulary.',
      features: [
        'Days 1–7 vocabulary (100 words)',
        'Basic word quiz & spaced repetition',
        '1 mock exam per month',
        '3 AI tutor sessions per day',
      ],
      button: 'Current Plan',
      outline: true,
    },
    {
      id: 'pro',
      name: 'GRE Pro',
      price: billing === 'annual' ? '$99' : '$15',
      period: billing === 'annual' ? 'per year' : 'per month',
      desc: 'Unlock the complete GRE curriculum.',
      features: [
        'All 30 days (445+ high-yield words)',
        'Advanced Word Relations Map',
        'Roots & Prefixes decoder',
        'Unlimited AI tutor & generations',
        'Unlimited mock exams',
        'Cloud sync across all devices',
        'Full quantitative curriculum',
      ],
      button: 'Upgrade to Pro',
      outline: false,
    }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'Georgia,serif', color: C.gold, fontSize: 36, marginBottom: 16 }}>Simple, transparent pricing</h1>
      <p style={{ color: C.textMid, fontSize: 16, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
        Start building your vocabulary for free. Upgrade to Pro when you're ready to master the entire GRE curriculum.
      </p>

      {/* Billing Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
        <div style={{ background: C.surface, borderRadius: 20, padding: 4, display: 'flex', border: `1px solid ${C.border}` }}>
          <button onClick={() => setBilling('monthly')} style={{
            padding: '8px 24px', borderRadius: 16, border: 'none', cursor: 'pointer',
            background: billing === 'monthly' ? C.card : 'transparent',
            color: billing === 'monthly' ? C.text : C.textDim,
            fontWeight: billing === 'monthly' ? 700 : 500, fontSize: 14,
            boxShadow: billing === 'monthly' ? `0 2px 8px rgba(0,0,0,0.2)` : 'none',
          }}>Monthly</button>
          <button onClick={() => setBilling('annual')} style={{
            padding: '8px 24px', borderRadius: 16, border: 'none', cursor: 'pointer',
            background: billing === 'annual' ? C.card : 'transparent',
            color: billing === 'annual' ? C.gold : C.textDim,
            fontWeight: billing === 'annual' ? 700 : 500, fontSize: 14,
            boxShadow: billing === 'annual' ? `0 2px 8px rgba(0,0,0,0.2)` : 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            Annual <span style={{ background: C.gold + '22', color: C.gold, fontSize: 10, padding: '2px 6px', borderRadius: 8 }}>Save 45%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', textAlign: 'left' }}>
        {plans.map(p => (
          <div key={p.id} style={{
            width: '100%', maxWidth: 340, background: p.outline ? C.surface : `linear-gradient(180deg, ${C.cardHi}, ${C.card})`,
            border: `1px solid ${p.outline ? C.border : C.gold + '55'}`, borderRadius: 20,
            padding: 32, display: 'flex', flexDirection: 'column',
            boxShadow: p.outline ? 'none' : `0 20px 40px ${C.gold}11`,
            position: 'relative', overflow: 'hidden',
          }}>
            {!p.outline && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.gold}, ${C.goldBr})` }} />}
            
            <h3 style={{ color: p.outline ? C.text : C.gold, fontSize: 20, margin: '0 0 8px' }}>{p.name}</h3>
            <p style={{ color: C.textDim, fontSize: 14, margin: '0 0 24px', minHeight: 40 }}>{p.desc}</p>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32 }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: C.text, fontFamily: 'Georgia,serif' }}>{p.price}</span>
              <span style={{ color: C.textDim, fontSize: 14 }}>{p.period}</span>
            </div>

            <button style={{
              width: '100%', padding: 14, borderRadius: 10, border: 'none', cursor: p.outline ? 'default' : 'pointer',
              background: p.outline ? C.bg : `linear-gradient(135deg, ${C.gold}, ${C.goldBr})`,
              color: p.outline ? C.textMid : '#07090F', fontWeight: 700, fontSize: 15,
              marginBottom: 32, boxShadow: p.outline ? 'none' : `0 4px 16px ${C.gold}44`,
            }}>
              {p.button}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Icon name="CheckCircle" size={18} color={p.outline ? C.textDim : C.greenBr} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: C.textMid, fontSize: 14, lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 60, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
        <a href="/" style={{ color: C.gold, textDecoration: 'none', fontWeight: 700 }}>← Back to Application</a>
      </div>
    </div>
  );
}
