import { useState } from 'react';
import C from '../theme';

export default function Card({ children, style={}, glow, ...props }) {
  const [hovered, setHovered] = useState(false);
  const glowColor = glow || C.gold;
  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{
        background: C.card,
        border: `1px solid ${hovered ? glowColor+'44' : C.border}`,
        borderRadius: 10, padding: 20,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? `0 4px 16px ${glowColor}12` : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
