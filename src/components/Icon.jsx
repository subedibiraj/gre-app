import {
  Sprout, BookOpen, GraduationCap, Brain, Zap, Crown, Gem,
  Target, Award, Flame, Waves, Trophy, Library, Medal,
  Sparkles, Star, Binary, Calculator, CheckCircle, Moon, Sun, PenTool
} from 'lucide-react';

const iconMap = {
  Sprout, BookOpen, GraduationCap, Brain, Zap, Crown, Gem,
  Target, Award, Flame, Waves, Trophy, Library, Medal,
  Sparkles, Star, Binary, Calculator, CheckCircle, Moon, Sun, PenTool
};

export default function Icon({ name, size = 16, color, style, ...props }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} style={style} {...props} />;
}
