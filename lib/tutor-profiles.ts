import type { ChamberId } from './academy';

export type TutorMemory = {
  meetings: number;
  seals: number;
  corrections: number;
  trust: number;
  streak: number;
  lastNeed: string;
  lastWin: string;
  lastAnswer: string;
  lastGuidance: string;
};

export type TutorProfile = {
  name: string;
  chamber: string;
  relation: string;
  oath: string;
  watches: string;
  correction: string;
  celebration: string;
  bridge: string;
  parentMove: string;
};

export const blankTutorMemory: TutorMemory = {
  meetings: 0,
  seals: 0,
  corrections: 0,
  trust: 0,
  streak: 0,
  lastNeed: 'First lesson',
  lastWin: 'No seal yet',
  lastAnswer: '',
  lastGuidance: 'Begin with one clear noble act.'
};

export const tutorProfiles: Record<ChamberId, TutorProfile> = {
  'great-hall': {
    name: 'Aurelius',
    chamber: 'Great Hall',
    relation: 'guardian of mercy, fairness, and the first rule of the self',
    oath: 'Power exists to protect what is weaker.',
    watches: 'whether strength bends toward service before command',
    correction: 'He corrects cruelty fast, then offers one small merciful act.',
    celebration: 'That is mercy becoming judgment: power used to restore order.',
    bridge: 'Next he will ask for a reason that protects everyone in the room.',
    parentMove: 'Name the hurt, offer two safe choices, and let him point or act.'
  },
  'star-tower': {
    name: 'Hypatia',
    chamber: 'Star Tower',
    relation: 'keeper of number, pattern, proof, and patient attention',
    oath: 'A clear mind learns to show why.',
    watches: 'whether the prince can point, count, repeat, and explain',
    correction: 'She slows the trial until the pattern can be built with hands.',
    celebration: 'That is order becoming intelligence: he saw the rule and named it.',
    bridge: 'Next she will ask him to show the pattern before saying the answer.',
    parentMove: 'Build it with objects, then ask him what comes next and why.'
  },
  scriptorium: {
    name: 'Sappho',
    chamber: 'Scriptorium',
    relation: 'keeper of true speech, story, memory, and clean words',
    oath: 'A true word can carry a kingdom.',
    watches: 'whether speech is clean, true, complete, and brave',
    correction: 'She protects the tongue without shaming the child.',
    celebration: 'That is speech becoming trust: a clear word placed in the world.',
    bridge: 'Next she will ask for who, what happened, and one feeling.',
    parentMove: 'Echo his words, then help add one true detail.'
  },
  'training-yard': {
    name: 'Leonidas',
    chamber: 'Training Yard',
    relation: 'captain of breath, courage, posture, and the second try',
    oath: 'Strength protects what gentleness loves.',
    watches: 'whether the prince can breathe, stand, return, and try again',
    correction: 'He stops self-insult and turns the body toward courage.',
    celebration: 'That is courage becoming command: the body obeyed the noble aim.',
    bridge: 'Next he will ask for one brave action after the breath.',
    parentMove: 'Stand together, breathe three times, and do one tiny hard thing.'
  },
  'garden-laboratory': {
    name: 'Ibn Sina',
    chamber: 'Garden Laboratory',
    relation: 'physician of observation, care, curiosity, and public welfare',
    oath: 'A ruler looks closely before deciding.',
    watches: 'whether the prince notices details before acting',
    correction: 'He returns the prince to gentle observation before intervention.',
    celebration: 'That is care becoming wisdom: he noticed before he ruled.',
    bridge: 'Next he will ask what changed after the care move.',
    parentMove: 'Look twice, name one detail, then choose one gentle care move.'
  }
};

export function ensureTutorMemory(memory?: Partial<TutorMemory>): TutorMemory {
  return { ...blankTutorMemory, ...memory };
}
