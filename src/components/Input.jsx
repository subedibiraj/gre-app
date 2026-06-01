import C from '../theme';

export default function Input({ value, onChange, placeholder, correct, checked, style = {} }) {
  const borderColor = !checked ? C.border : correct ? C.green : C.red;
  const bg = !checked ? C.surface : correct ? C.greenBg : C.redBg;
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 8,
        border: `1.5px solid ${borderColor}`,
        background: bg,
        color: C.text,
        fontSize: 16,        // 16px prevents iOS auto-zoom
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'border-color 0.2s',
        minHeight: 44,       // touch target
        boxSizing: 'border-box',
        ...style,
      }}
    />
  );
}
