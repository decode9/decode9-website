import type { Clock } from "../../interfaces/ports/clock.interface.js";

export const createSystemClock = (): Clock => ({ now: () => new Date() });
