import {
  Archive,
  BookOpen,
  Brain,
  Castle,
  Dumbbell,
  Gavel,
  HeartHandshake,
  Landmark,
  Leaf,
  MessagesSquare,
  Mountain,
  ScrollText,
  Scale,
  Shield,
  Sparkles,
  Stars,
  Swords,
  Telescope
} from 'lucide-react';
import type { ComponentType } from 'react';

export type ChamberId = 'great-hall' | 'star-tower' | 'scriptorium' | 'training-yard' | 'garden-laboratory';

export type Chamber = {
  id: ChamberId;
  tutorId: string;
  tutor: string;
  title: string;
  chamber: string;
  domain: string;
  voice: string;
  image: string;
  roomImage: string;
  color: string;
  accent: string;
  motto: string;
  duty: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

export type Trial = {
  id: string;
  chamberId: ChamberId;
  title: string;
  mode: string;
  doctrine: string;
  story: string;
  prompt: string;
  parentCue: string;
  ritual: string;
  artifacts: string[];
  starters: string[];
  success: string[];
  relic: string;
  virtue: string;
};

export type Ring = {
  name: string;
  purpose: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

export const doctrine = {
  thesis: 'A prince is not raised to be powerful. He is raised to become worthy of power.',
  northStar:
    'Royal formation is a protected ecosystem of tutors, elders, ritual, physical hardening, moral correction, public responsibility, and managed exposure to power.',
  question:
    'What kind of ruler is this knowledge making him?'
};

export const chambers: Chamber[] = [
  {
    id: 'great-hall',
    tutorId: 'aurelius',
    tutor: 'Aurelius',
    title: 'Tutor of Noble Character',
    chamber: 'Great Hall',
    domain: 'Soul and judgment',
    voice: 'warm, steady, fatherly',
    image: '/tutors/aurelius.png',
    roomImage: '/castle/great-hall.png',
    color: '#7b3f2f',
    accent: '#f3c969',
    motto: 'First rule the self, then serve the realm.',
    duty: 'truth, mercy, fairness, service',
    icon: Shield
  },
  {
    id: 'star-tower',
    tutorId: 'hypatia',
    tutor: 'Hypatia',
    title: 'Tutor of Number and Stars',
    chamber: 'Star Tower',
    domain: 'Memory and measure',
    voice: 'bright, exact, encouraging',
    image: '/tutors/hypatia.png',
    roomImage: '/castle/star-tower.png',
    color: '#174c63',
    accent: '#74d4c0',
    motto: 'A clear mind is a lantern in any dark hall.',
    duty: 'counting, patterns, proof, proportion',
    icon: Telescope
  },
  {
    id: 'scriptorium',
    tutorId: 'sappho',
    tutor: 'Sappho',
    title: 'Tutor of Letters and Song',
    chamber: 'Scriptorium',
    domain: 'Speech and memory',
    voice: 'musical, playful, precise',
    image: '/tutors/sappho.png',
    roomImage: '/castle/scriptorium.png',
    color: '#7d3c71',
    accent: '#f0a6ca',
    motto: 'A true word can carry a kingdom.',
    duty: 'letters, story, rhetoric, naming',
    icon: ScrollText
  },
  {
    id: 'training-yard',
    tutorId: 'leonidas',
    tutor: 'Leonidas',
    title: 'Tutor of Courage and Body',
    chamber: 'Training Yard',
    domain: 'Body and courage',
    voice: 'brave, direct, kind',
    image: '/tutors/leonidas.png',
    roomImage: '/castle/training-yard.png',
    color: '#294936',
    accent: '#d6b46a',
    motto: 'Strength protects what gentleness loves.',
    duty: 'breath, hardship, balance, courage',
    icon: Swords
  },
  {
    id: 'garden-laboratory',
    tutorId: 'ibn-sina',
    tutor: 'Ibn Sina',
    title: 'Tutor of Nature and Care',
    chamber: 'Garden Laboratory',
    domain: 'Care and observation',
    voice: 'curious, calm, wise',
    image: '/tutors/ibn-sina.png',
    roomImage: '/castle/garden-lab.png',
    color: '#315c7c',
    accent: '#a8dadc',
    motto: 'To know the world, look closely and ask why.',
    duty: 'medicine, living things, public welfare',
    icon: Leaf
  }
];

export const formationRings: Ring[] = [
  { name: 'Soul', purpose: 'truth, reverence, self-command', icon: Sparkles },
  { name: 'Body', purpose: 'strength, endurance, stress tolerance', icon: Dumbbell },
  { name: 'Speech', purpose: 'clear words, courage, timing', icon: MessagesSquare },
  { name: 'Law', purpose: 'justice, equity, public good', icon: Gavel },
  { name: 'Memory', purpose: 'history, poetry, records, precedent', icon: Archive },
  { name: 'Statecraft', purpose: 'systems, counsel, diplomacy, logistics', icon: Landmark },
  { name: 'Wisdom', purpose: 'choosing rightly when the cost is real', icon: Brain }
];

export const civilizationPods = [
  ['Persia', 'truth, riding, archery, justice cases'],
  ['Macedonia', 'Aristotle, philosophy, heroic literature'],
  ['Greece', 'guardian model, music, gymnastic, dialectic'],
  ['Egypt', 'scribal order, royal instruction, moral kingship'],
  ['China', 'self-cultivation, teacher selection, household to state'],
  ['Assyria', 'archives, scholarship, imperial intelligence'],
  ['Rome', 'rhetoric, philosophy, moral exemplars'],
  ['India', 'Arthashastra, counsel, discipline, political economy']
] as const;

export const readinessStandards = [
  ['Truthfulness', 'Tells truth under cost'],
  ['Self-command', 'Delays pleasure and masters emotion'],
  ['Justice', 'Judges by law, equity, and public good'],
  ['Courage', 'Faces danger with discipline'],
  ['Speech', 'Speaks clearly, truthfully, and with timing'],
  ['Learning', 'Asks deep questions and changes under evidence'],
  ['Counsel', 'Welcomes correction and competent advisors'],
  ['Mercy', 'Balances compassion and order'],
  ['Administration', 'Understands records, logistics, people'],
  ['Public spirit', 'Sees rule as stewardship']
] as const;

const tierNames = [
  'Guarded Nurture',
  'Truth and Noble Stories',
  'Discipline and Hardiness',
  'Apprentice of Rule',
  'Command Under Supervision',
  'Philosophical Rule'
];

const trialBank: Record<ChamberId, Omit<Trial, 'id' | 'chamberId'>[]> = {
  'great-hall': [
    {
      title: 'The Fallen Tower',
      mode: 'Justice Case',
      doctrine: 'Power begins as service.',
      story: 'A little friend is crying because a block tower fell and a toy was taken. The room waits for the prince to restore order.',
      prompt: 'What should the prince do first?',
      parentCue: 'Read the scene, offer two choices if he freezes, and let him point or act it out.',
      ritual: 'Touch heart, name the hurt, choose the helpful act.',
      artifacts: ['kind voice', 'helping hand', 'ask what happened', 'return the toy'],
      starters: ['I can help.', 'I can ask nicely.', 'I can give it back.', 'I can comfort him.'],
      success: ['names one kind action', 'protects the smaller child', 'does not shame anyone'],
      relic: 'Seal of First Mercy',
      virtue: 'Mercy'
    }
  ],
  'star-tower': [
    {
      title: 'The Pattern Gate',
      mode: 'Measure Trial',
      doctrine: 'A ruler must see order before giving orders.',
      story: 'Three lanterns shine gold, blue, gold. The gate will open only if the prince can finish the pattern.',
      prompt: 'What color comes next, and how do you know?',
      parentCue: 'Use blocks, cups, or fingers. Let him build the pattern before speaking.',
      ritual: 'Point, count, repeat, then answer.',
      artifacts: ['gold', 'blue', 'repeat', 'next lantern'],
      starters: ['Gold comes next.', 'It goes gold, blue.', 'I can make the pattern.', 'It repeats.'],
      success: ['continues a pattern', 'uses one reason', 'shows with objects'],
      relic: 'Star of Clear Measure',
      virtue: 'Order'
    }
  ],
  scriptorium: [
    {
      title: 'The True Word',
      mode: 'Speech Trial',
      doctrine: 'Civilization is governed through words before weapons.',
      story: 'A messenger brings mixed-up words to the Scriptorium. The prince must choose words that tell the truth plainly.',
      prompt: 'Say one true sentence about what happened today.',
      parentCue: 'Accept a short sentence. Help him add who, what, and one feeling.',
      ritual: 'Breathe, remember, speak one true thing.',
      artifacts: ['who', 'what happened', 'feeling word', 'clear voice'],
      starters: ['I built...', 'I helped...', 'I felt...', 'I learned...'],
      success: ['speaks one complete thought', 'uses a true detail', 'tries a clear voice'],
      relic: 'Quill of True Speech',
      virtue: 'Truthful Speech'
    }
  ],
  'training-yard': [
    {
      title: 'The Still Shield',
      mode: 'Hardiness Drill',
      doctrine: 'The prince must learn hardship before command.',
      story: 'The Training Yard grows quiet. A hard task stands before the prince like a heavy shield.',
      prompt: 'What does a strong prince do before trying again?',
      parentCue: 'Have him stand tall, take three slow breaths, and try one small hard thing.',
      ritual: 'Feet steady, shoulders back, three slow breaths.',
      artifacts: ['calm breath', 'steady feet', 'try again', 'quiet courage'],
      starters: ['I can breathe.', 'I can try again.', 'I can stand tall.', 'I will not quit.'],
      success: ['uses breath', 'returns to task', 'shows calm courage'],
      relic: 'Shield of the Second Try',
      virtue: 'Courage'
    }
  ],
  'garden-laboratory': [
    {
      title: 'The Patient Leaf',
      mode: 'Care Mission',
      doctrine: 'A ruler must understand human vulnerability and living systems.',
      story: 'A small plant bends near the Garden Laboratory window. The prince must observe before deciding what it needs.',
      prompt: 'What do you notice, and how can you care for it?',
      parentCue: 'Let him look closely at a real object or plant and name color, shape, or need.',
      ritual: 'Look twice, speak softly, choose one care move.',
      artifacts: ['look closely', 'water', 'light', 'gentle hands'],
      starters: ['I notice...', 'It needs...', 'I can care by...', 'I will be gentle.'],
      success: ['observes one detail', 'chooses one care move', 'protects living things'],
      relic: 'Leaf of Public Care',
      virtue: 'Care'
    }
  ]
};

export function chamberById(id: ChamberId): Chamber {
  return chambers.find((chamber) => chamber.id === id) ?? chambers[0];
}

export function tierTitle(tier: number): string {
  return tierNames[Math.min(tier - 1, tierNames.length - 1)] ?? `Royal Formation ${tier}`;
}

export function buildTrial(chamberId: ChamberId, tier: number): Trial {
  const bank = trialBank[chamberId];
  const base = bank[(tier - 1) % bank.length];
  return {
    ...base,
    id: `${chamberId}-${tier}`,
    chamberId,
    title: tier > 1 ? `${base.title}: Tier ${tier}` : base.title,
    doctrine: `${base.doctrine} ${tier >= 2 ? 'Connect this to yesterday and make the answer a little wiser.' : ''}`.trim()
  };
}

export function chamberIndex(id: ChamberId): number {
  return chambers.findIndex((chamber) => chamber.id === id);
}

export function nextChamberId(current: ChamberId): ChamberId {
  const index = chamberIndex(current);
  return chambers[Math.min(index + 1, chambers.length - 1)].id;
}

export const dailyRegimen = [
  ['Dawn', 'Body and reverence'],
  ['Morning', 'Memory and mind'],
  ['Midday', 'Restraint and manners'],
  ['Afternoon', 'Statecraft and action'],
  ['Evening', 'Reflection and correction']
] as const;

export const platformZones = [
  { title: 'Civilization Map', body: 'Persia, Macedonia, Greece, Egypt, China, Assyria, Rome, India', icon: Castle },
  { title: 'Source Library', body: 'Primary texts, reliability notes, leadership principles', icon: BookOpen },
  { title: 'Formation Timeline', body: 'Birth to 5 through philosophical rule', icon: Mountain },
  { title: 'Engagement Labs', body: 'Justice cases, council simulations, diplomacy, hardship', icon: Scale },
  { title: 'Readiness Dashboard', body: 'Truth, courage, judgment, counsel, mercy, public spirit', icon: Stars },
  { title: 'Tutor Manual', body: 'Correction, questioning, care protocol, warning signs', icon: HeartHandshake }
] as const;
