import type { TerminalScreenId, WireTarget } from '@/interfaces/terminal';
import type { AssemblyPlan } from '../../assembly';

export interface HudProps {
  screen: TerminalScreenId;
  /** Mini-map marker position (same target as the wire logo). */
  target: WireTarget;
  /** Post-login assembly plan (hud[i] delays), null outside the assembly. */
  assembly: AssemblyPlan | null;
  reduceMotion: boolean;
}
