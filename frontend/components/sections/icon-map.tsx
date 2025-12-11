import type { LucideIcon } from 'lucide-react';
import {
  Snowflake,
  Flame,
  Wind,
  Thermometer,
  Wrench,
  Gauge,
  Leaf,
  PhoneCall,
  Clock3,
  ClipboardCheck,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Sun,
  Home,
  Lightbulb,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  snowflake: Snowflake,
  flame: Flame,
  wind: Wind,
  thermometer: Thermometer,
  wrench: Wrench,
  gauge: Gauge,
  leaf: Leaf,
  phone: PhoneCall,
  clock: Clock3,
  'clipboard-check': ClipboardCheck,
  tools: Wrench,
  star: Star,
  shield: ShieldCheck,
  'check-circle': CheckCircle2,
  zap: Zap,
  sun: Sun,
  home: Home,
  lightbulb: Lightbulb,
};

export function getIconByName(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
