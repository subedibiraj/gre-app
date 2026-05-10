import C from '../theme';

export default function Input({ value, onChange, placeholder, correct, checked }) {
  const borderColor = !checked ? C.border : correct ? C.green : C.red;
  const bg = !checked ? C.surface : correct ? C.greenBg : C.redBg;
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width:'100%', background:bg, border:`1px solid ${borderColor}`,
        borderRadius:6, padding:'8px 12px', color:C.text, fontFamily:'Courier New, monospace',
        fontSize:13, fontWeight:700, letterSpacing:'0.1em', outline:'none',
        textTransform:'uppercase', boxSizing:'border-box', transition:'all 0.2s' }} />
  );
}
