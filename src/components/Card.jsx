import C from '../theme';

// Card with hover effect — disabled on touch devices to prevent stuck hover state
const isTouchDevice = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

export default function Card({ children, style = {}, glow, onClick, ...props }) {
  const glowColor = glow || C.gold;
  const clickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 20,
        transition: 'all 0.2s ease',
        cursor: clickable ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={e => {
        if (isTouchDevice()) return;
        e.currentTarget.style.borderColor = `${glowColor}44`;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = `0 4px 16px ${glowColor}12`;
      }}
      onMouseLeave={e => {
        if (isTouchDevice()) return;
        e.currentTarget.style.borderColor = style.borderColor || C.border;
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    >
      {children}
    </div>
  );
}
