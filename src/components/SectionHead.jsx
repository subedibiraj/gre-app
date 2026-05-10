import C from '../theme';
import Tag from './Tag';

export default function SectionHead({ label, count, color=C.gold }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
      <div style={{ width:3, height:20, background:color, borderRadius:2 }} />
      <span style={{ fontFamily:'Georgia,serif', fontSize:17, fontWeight:700, color:C.text }}>{label}</span>
      {count && <Tag color={color}>{count}</Tag>}
    </div>
  );
}
