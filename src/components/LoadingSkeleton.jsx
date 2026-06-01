import C from '../theme';

// Shimmer animation for skeleton loading states
function Shimmer({ width = '100%', height = 16, borderRadius = 6, style = {} }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: `linear-gradient(90deg, ${C.card} 25%, ${C.surface} 50%, ${C.card} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  );
}

export function PracticeLoadingSkeleton() {
  return (
    <div style={{ padding: '0 0 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Shimmer width={120} height={20} />
        <Shimmer width={60} height={20} />
      </div>

      {/* Section label */}
      <Shimmer width={160} height={14} style={{ marginBottom: 16 }} />

      {/* 3 question cards */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: 20, marginBottom: 12,
        }}>
          <Shimmer height={14} style={{ marginBottom: 12 }} />
          <Shimmer width="85%" height={14} style={{ marginBottom: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3,4].map(j => (
              <Shimmer key={j} height={40} borderRadius={8} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuantLoadingSkeleton() {
  return (
    <div>
      <Shimmer width={180} height={22} style={{ marginBottom: 20 }} />
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: 20, marginBottom: 12,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 12, marginBottom: 16 }}>
            <Shimmer height={60} borderRadius={8} />
            <Shimmer height={60} borderRadius={8} />
            <Shimmer height={60} borderRadius={8} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {['A','B','C','D'].map(l => <Shimmer key={l} width={80} height={36} borderRadius={8} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function VocabLoadingSkeleton() {
  return (
    <div>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: 16, marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 3, height: 34, background: C.border, borderRadius: 2, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Shimmer width={100} height={14} />
              <Shimmer width={40} height={14} />
            </div>
            <Shimmer width="70%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}
