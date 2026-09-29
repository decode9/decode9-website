import {
  Bot,
  Cloud,
  Code2,
  Compass,
  Database,
  Gauge,
  GitBranch,
  Layers,
  LayoutDashboard,
  Rocket,
  Server,
  ServerCog,
  Share2,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { DynamicIconProps } from './interface';

/** Icons referenced by name from the data layer. */
const ICONS: Record<string, LucideIcon> = {
  Bot,
  Cloud,
  Code2,
  Compass,
  Database,
  Gauge,
  GitBranch,
  Layers,
  LayoutDashboard,
  Rocket,
  Server,
  ServerCog,
  Share2,
  Sparkles,
  Workflow,
};

const DynamicIcon = ({ name, size = 18, className }: DynamicIconProps) => {
  const Icon = ICONS[name] ?? Layers;
  return <Icon size={size} className={className} aria-hidden="true" />;
};

export default DynamicIcon;
