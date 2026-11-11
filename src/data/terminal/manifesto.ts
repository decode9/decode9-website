import type { Bilingual, KnowledgeQuote, MethodStep, MythEntry } from '@/interfaces/terminal';

/** Manifiesto · Método: the six steps (original METHOD). */
export const METHOD: readonly MethodStep[] = [
  { ic: 'eye', t: ['Observar','Observe'], d: ['Ver sin decidir todavía. El prejuicio se queda en este paso.','See without deciding yet. Prejudice stays at this step.'] },
  { ic: 'ask', t: ['Preguntar','Ask'], d: ['¿Por qué es así? ¿Qué no estoy viendo?','Why is it like this? What am I not seeing?'] },
  { ic: 'bulb', t: ['Suponer','Hypothesize'], d: ['Una explicación que se pueda poner a prueba.','An explanation that can be tested.'] },
  { ic: 'flask', t: ['Experimentar','Experiment'], d: ['Construir algo para comprobarlo.','Build something to check it.'] },
  { ic: 'target', t: ['Probar','Test'], d: ['Medir e intentar romperlo.','Measure it and try to break it.'] },
  { ic: 'cycle', t: ['Cambiar','Change'], d: ['Si falla, se corrige y se empieza otra vez. Aquí empieza el conocimiento.','If it fails, fix it and start again. Knowledge starts here.'] },
];

/** Manifiesto · Lo que ves (original MYTH). */
export const MYTHS: readonly MythEntry[] = [
  { ic: 'shield', s: ['Cuernos','Horns'], t: ['Resistencia','Resilience'], d: ['Protección natural en un mundo de rocas que caen y tormentas de energía.','Natural protection in a world of falling rock and energy storms.'], k: ['Adaptación','Adaptation'] },
  { ic: 'flame', s: ['Piel roja','Red skin'], t: ['Calor','Heat'], d: ['Una piel que soporta el magma. Así pudo quedarse a estudiar lo que otros solo evitaban.','Skin that withstands magma. That is how he could stay and study what others only avoided.'], k: ['Supervivencia','Survival'] },
  { ic: 'bulb', s: ['Sonrisa astuta','Sly grin'], t: ['Ingenio','Wit'], d: ['Es la cara de quien acaba de entender cómo funciona algo. Le pasa seguido.','The face of someone who just figured out how something works. It happens often.'], k: ['Descubrimiento','Discovery'] },
  { ic: 'eye', s: ['Ojos que brillan','Glowing eyes'], t: ['Atención','Focus'], d: ['Ven en la oscuridad del Averno y de los sistemas. Ahora mismo te están mirando.','They see in the dark of the Averno and of systems. Right now they are looking at you.'], k: ['Curiosidad','Curiosity'] },
];

/** Manifiesto · Conocimiento: quotes (original Q). */
export const QUOTES: readonly KnowledgeQuote[] = [
  { author: 'Sócrates', src: ['atribuido','attributed'], quote: ['«Solo sé que no sé nada.»','“I know that I know nothing.”'], gloss: ['Saber empieza por admitir lo que no sabes.','Knowing starts by admitting what you don\'t know.'] },
  { author: 'Aristóteles', src: ['Metafísica','Metaphysics'], quote: ['«Todos los hombres desean por naturaleza saber.»','“All men by nature desire to know.”'], gloss: ['La curiosidad no es un defecto: es la condición de partida.','Curiosity isn\'t a flaw: it\'s the starting condition.'] },
  { author: 'Platón', src: ['Teeteto · idea','Theaetetus · idea'], quote: ['Creencia verdadera y justificada.','Justified true belief.'], gloss: ['No basta con acertar: hay que poder explicar por qué.','Being right isn\'t enough: you have to be able to explain why.'] },
  { author: 'René Descartes', src: ['1644','1644'], quote: ['«Para buscar la verdad es necesario dudar, una vez en la vida, de todas las cosas tanto como sea posible.»','“To seek truth, it is necessary once in the course of our life to doubt, as far as possible, of all things.”'], gloss: ['La duda no destruye: limpia el terreno para construir.','Doubt doesn\'t destroy: it clears the ground to build.'] },
  { author: 'Francis Bacon', src: ['1597 · atribuido','1597 · attributed'], quote: ['«El conocimiento es poder.»','“Knowledge is power.”'], gloss: ['Por eso importa qué haces con él.','That\'s why what you do with it matters.'] },
  { author: 'Isaac Newton', src: ['1675','1675'], quote: ['«Si he visto más lejos es porque estoy sentado sobre hombros de gigantes.»','“If I have seen further it is by standing on the shoulders of giants.”'], gloss: ['Nadie investiga solo. En el Averno tampoco.','No one researches alone. Not in the Averno either.'] },
  { author: 'Immanuel Kant', src: ['1784','1784'], quote: ['«Sapere aude: ¡ten el valor de servirte de tu propio entendimiento!»','“Sapere aude! Have the courage to use your own understanding!”'], gloss: ['Pensar por cuenta propia también es un acto de valentía.','Thinking for yourself is also an act of courage.'] },
  { author: 'Marie Curie', src: ['atribuido','attributed'], quote: ['«Nada en la vida debe ser temido, solo comprendido.»','“Nothing in life is to be feared, it is only to be understood.”'], gloss: ['Lo que da miedo suele ser lo que todavía no se ha estudiado.','What frightens us is usually what hasn\'t been studied yet.'] },
  { author: 'Albert Einstein', src: ['1929','1929'], quote: ['«La imaginación es más importante que el conocimiento.»','“Imagination is more important than knowledge.”'], gloss: ['Primero se imagina el portal. Después se construye.','First you imagine the portal. Then you build it.'] },
  { author: 'Karl Popper', src: ['idea','idea'], quote: ['El conocimiento científico es una conjetura que resiste los intentos de refutarla.','Scientific knowledge is a conjecture that survives attempts to refute it.'], gloss: ['Lo que no se puede poner a prueba no es ciencia.','What can\'t be tested isn\'t science.'] },
  { author: 'Richard Feynman', src: ['1974','1974'], quote: ['«El primer principio es que no debes engañarte, y tú eres la persona más fácil de engañar.»','“The first principle is that you must not fool yourself, and you are the easiest person to fool.”'], gloss: ['El primer prejuicio que hay que probar es el propio.','The first bias to test is your own.'] },
  { author: 'Carl Sagan', src: ['1996','1996'], quote: ['«La ciencia es más que un cuerpo de conocimiento: es una forma de pensar.»','“Science is more than a body of knowledge. It is a way of thinking.”'], gloss: ['Por eso decode9 no colecciona respuestas: entrena preguntas.','That\'s why decode9 doesn\'t collect answers: he trains questions.'] },
];

/** Fixed texts of the Manifiesto windows. */
export const MANIFESTO_TEXT = {
  diagTitle: ['Diagnóstico', 'Diagnosis'],
  diagHead: ['Viste cuernos y ya decidiste quién es.', 'You saw horns and already decided who he is.'],
  diagPre: ['La psicología lo llama ', 'Psychology calls it '],
  diagTerm: ['efecto cuerno', 'the horn effect'],
  diagPost: [
    ': un solo rasgo que no te gusta tiñe el juicio sobre todo lo demás.',
    ': a single trait you dislike colors your judgment of everything else.',
  ],
  dataTitle: ['Dato · 1920', 'Data · 1920'],
  dataQuote: ['Efecto halo → efecto cuerno', 'Halo effect → horn effect'],
  dataBody: [
    'Descrito en 1920. Un rasgo visible decide por todos los demás.',
    'Described in 1920. One visible trait decides for all the others.',
  ],
  sourceTitle: ['Fuente · UT Austin', 'Source · UT Austin'],
  sourceQuote: [
    '«El efecto halo tiene un reverso, conocido como el efecto “cuerno” (del diablo).»',
    '“The halo effect has a flipside, known as the ‘horn’ (of the devil) effect.”',
  ],
  sourceLink: ['Leer la explicación completa ↗', 'Read the full explanation ↗'],
  logTitle: ['Registro', 'Log'],
  logBody: [
    'Pasa cuando te quedas en la observación y saltas directo a la conclusión. decode9 es un demonoide, y eso no dice nada de él. Lo que lo define es lo que hace con lo que ve: pregunta, prueba y cambia de idea cuando los datos se lo piden.',
    'It happens when you stop at observation and jump straight to a conclusion. decode9 is a demonoid, and that says nothing about him. What defines him is what he does with what he sees: he asks, tests and changes his mind when the data says so.',
  ],
  next: ['Siguiente: el método →', 'Next: the method →'],
  stepsTitle: ['Método · 6 pasos', 'Method · 6 steps'],
  step: ['Paso', 'Step'],
  prejudice: ['El prejuicio se queda aquí', 'Prejudice stops here'],
  knowledgeStarts: ['Aquí empieza el conocimiento', 'Knowledge starts here'],
  mythsTitle: ['Lo que ves', 'What you see'],
  youSee: ['Lo que ves: ', 'What you see: '],
  quotesTitle: ['¿Qué es el conocimiento?', 'What is knowledge?'],
  quotesNote: ['Cada cita abre una ventana. Puedes tener tres a la vez.', 'Each quote opens a window. You can keep three at once.'],
  conclusionTitle: ['Conclusión', 'Conclusion'],
  conclusion: [
    'Para decode9 el conocimiento no es bueno ni malo: es lo que queda en pie después de dudar, probar y corregir.',
    'For decode9, knowledge is neither good nor evil: it’s what’s left standing after doubting, testing and correcting.',
  ],
} as const satisfies Record<string, Bilingual>;

export const MANIFESTO_LINKS = {
  source: 'https://ethicsunwrapped.utexas.edu/glossary/halo-effect',
  sourceBy: 'Ethics Unwrapped · McCombs School of Business',
  thorndike: 'Edward Thorndike',
} as const;
