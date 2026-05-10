import C from '../theme';

export default function Btn({ children, onClick, variant='primary', disabled, small, style={} }) {
  const base = {
    border:'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily:'Georgia,serif', fontWeight:700, letterSpacing:'0.04em',
    borderRadius:6, transition:'all 0.15s',
    padding: small ? '6px 14px' : '10px 22px',
    fontSize: small ? 12 : 13,
    opacity: disabled ? 0.4 : 1, ...style,
  };
  const v = {
    primary: { background:C.gold, color:'#07090F' },
    ghost:   { background:'transparent', color:C.textMid, border:`1px solid ${C.border}` },
    danger:  { background:C.red+'22', color:C.red, border:`1px solid ${C.red}44` },
    success: { background:C.green+'22', color:C.greenBr, border:`1px solid ${C.green}44` },
    blue:    { background:C.blue+'22', color:C.blue, border:`1px solid ${C.blue}44` },
  };
  return <button onClick={disabled ? undefined : onClick} style={{...base,...v[variant]}}>{children}</button>;
}
