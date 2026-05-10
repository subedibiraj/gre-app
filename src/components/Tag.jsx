import C from '../theme';

export default function Tag({ children, color = C.gold }) {
  return (
    <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', padding:'2px 8px',
      borderRadius:20, background:color+'22', color, border:`1px solid ${color}44`,
      textTransform:'uppercase', whiteSpace:'nowrap' }}>
      {children}
    </span>
  );
}
