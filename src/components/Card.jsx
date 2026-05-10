import C from '../theme';

export default function Card({ children, style={} }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`,
      borderRadius:10, padding:20, ...style }}>
      {children}
    </div>
  );
}
