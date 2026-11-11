import type { Bilingual, ResearchBranch, SheetAttribute } from '@/interfaces/terminal';

/** Laboratorio: research branches (original SK). */
export const RESEARCH_BRANCHES: readonly ResearchBranch[] = [
  { ic: 'agent', img: 'p1', n: ['Agentes autónomos','Autonomous agents'], sh: ['Agentes','Agents'], br: ['IA','AI'], d: ['Modelos de lenguaje que razonan, usan herramientas y operan solos. Le interesa qué pasa cuando una máquina decide el siguiente paso.','Language models that reason, use tools and run on their own. He wants to know what happens when a machine decides the next step.'], t: ['LLM','RAG',['Orquestación','Orchestration'],['Herramientas','Tool use']], pv: 4 },
  { ic: 'chip', img: 'p4', n: ['Modelos locales y abiertos','Local & open models'], sh: ['Modelos','Models'], br: ['IA','AI'], d: ['Correr, comparar y afinar modelos fuera de la nube, en su propio hardware, para entender qué hay dentro de la caja.','Running, comparing and tuning models off the cloud, on his own hardware, to understand what’s inside the box.'], t: ['Open weights',['Inferencia local','Local inference'],['Evaluación','Evaluation']], pv: 4 },
  { ic: 'lock', img: 'p8', n: ['Seguridad ofensiva autorizada','Authorized offensive security'], sh: ['Seguridad','Security'], br: ['Seguridad','Security'], d: ['Encontrar cómo se rompe un sistema, con permiso, antes de que lo haga otro. Pensar como atacante para proteger mejor.','Finding how a system breaks, with permission, before someone else does. Thinking like an attacker to protect better.'], t: ['Pentesting',['C2 · red team autorizado','C2 · authorized red team'],['Vulnerabilidades','Vulnerabilities'],'Hardening'], pv: 4 },
  { ic: 'auto', img: 'p3', n: ['Automatizarlo todo','Automate everything'], sh: ['Automatizar','Automate'], br: ['Sistemas','Systems'], d: ['Infraestructura, redes y flujos que se mantienen solos, como una fábrica bien diseñada en un mundo hostil.','Infrastructure, networks and flows that keep themselves running, like a well-designed factory in a hostile world.'], t: ['Linux','Docker','DevOps',['Redes','Networking']], pv: 5 },
  { ic: 'lens', img: 'p7', n: ['Desarmar para entender','Take apart to understand'], sh: ['Desarmar','Take apart'], br: ['Ingeniería','Engineering'], d: ['Abrir un sistema pieza por pieza hasta saber por qué funciona, o por qué dejó de hacerlo. Sin manual, si hace falta.','Opening a system piece by piece until he knows why it works, or why it stopped. Without a manual, if needed.'], t: [['Depuración','Debugging'],['Análisis de sistemas','Systems analysis'],['Experimentación','Experimentation']], pv: 5 },
  { ic: 'cube', img: 'p9', n: ['Arquitectura de mundos','World architecture'], sh: ['Arquitectura','Architecture'], br: ['Arquitectura','Architecture'], d: ['Diseñar sistemas que aguanten entornos extremos y crezcan sin romperse, del primer plano a producción.','Designing systems that survive extreme environments and grow without breaking, from first blueprint to production.'], t: ['AWS serverless','Node / TS','Postgres',['Escalabilidad','Scalability']], pv: 5 },
];

/** Laboratorio · Ficha: character-sheet rows (label, value). */
export const SHEET_ROWS: ReadonlyArray<{ t: Bilingual; v: Bilingual | string; green?: boolean }> = [
  { t: ['Clase', 'Class'], v: ['Ingeniero interdimensional', 'Interdimensional engineer'] },
  { t: ['Raza', 'Race'], v: ['Demonoide', 'Demonoid'] },
  { t: ['Alineamiento', 'Alignment'], v: ['Investigador', 'Researcher'], green: true },
  { t: ['Civil', 'Civil'], v: 'Jorge Bastidas' },
];

export const SHEET_ATTRIBUTES: readonly SheetAttribute[] = [
  { t: ['Curiosidad', 'Curiosity'], v: 10, badge: 'MAX' },
  { t: ['Pensamiento crítico', 'Critical thinking'], v: 9 },
  { t: ['Ingenio', 'Ingenuity'], v: 9 },
  { t: ['Calma bajo presión', 'Calm under pressure'], v: 9 },
  { t: ['Cooperación', 'Cooperation'], v: 8 },
];

export const LAB_TEXT = {
  branchesTitle: ['Ramas de investigación', 'Research branches'],
  sheetTitle: ['Ficha · DECODE9', 'Sheet · DECODE9'],
  passive: ['Rasgo pasivo · Incansable', 'Passive · Relentless'],
  branch: ['Rama', 'Branch'],
  researching: ['Investigando', 'Researching'],
} as const satisfies Record<string, Bilingual>;
