import type { Trial } from './academy';

export type TutorReward = {
  mastered: boolean;
  score: number;
  title: string;
  line: string;
  event: string;
  relic: string;
  next: string;
};

const vulgarWords = [
  'asshole',
  'bitch',
  'cock',
  'cunt',
  'dick',
  'fuck',
  'fucking',
  'pussy',
  'shit'
];

const cruelWords = [
  'beat',
  'behead',
  'break his',
  'break her',
  'crush',
  'cut off',
  'destroy',
  'hate',
  'killed',
  'killing',
  'hurt',
  'hurts',
  'kill',
  'kills',
  'kick',
  'punch',
  'revenge',
  'slap',
  'smash',
  'take the head',
  'tongue'
];

const avoidanceWords = [
  'give up',
  'hide',
  'quit',
  'run a way',
  'run away',
  'stupid',
  'weak'
];

const chamberSignals: Record<string, string[]> = {
  'great-hall': ['ask', 'comfort', 'fair', 'give', 'help', 'kind', 'listen', 'return', 'share', 'sorry'],
  'star-tower': ['because', 'blue', 'count', 'gold', 'next', 'pattern', 'repeat', 'same'],
  scriptorium: ['built', 'felt', 'helped', 'learned', 'said', 'saw', 'today', 'true'],
  'training-yard': ['again', 'breathe', 'breath', 'calm', 'stand', 'steady', 'try'],
  'garden-laboratory': ['care', 'gentle', 'leaf', 'light', 'look', 'notice', 'plant', 'water']
};

export function judgeTrialAnswer(trial: Trial, answer: string, artifacts: string[]): TutorReward {
  const text = answer.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const selected = artifacts.map((item) => item.toLowerCase());
  const selectedCount = selected.length;

  if (!words.length && !selectedCount) {
    return correction(
      'Guided Practice',
      `${tutorFor(trial)} waits kindly. Pick one card, point, act it out, or say one small answer.`,
      'Choose one noble move before earning a seal.',
      'Use a card or starter phrase.'
    );
  }

  if (containsAny(lower, vulgarWords)) {
    return correction(
      'Clean Speech',
      `${tutorFor(trial)} protects the prince's speech. A prince can be upset, but he must use clean words that a wise tutor can honor.`,
      'Try again with one plain, noble sentence.',
      'Replace the rough words with a true, calm answer.'
    );
  }

  if (containsAny(lower, cruelWords)) {
    return correction(
      'Merciful Power',
      `${tutorFor(trial)} stops the seal. A prince may be angry, but he does not threaten, shame, or frighten people.`,
      'Choose one protecting or truthful action instead.',
      'Name what happened, then choose a safe action.'
    );
  }

  if (containsAny(lower, avoidanceWords)) {
    return correction(
      'Courage Practice',
      `${tutorFor(trial)} steadies the prince. A prince may feel afraid, but he does not insult himself or run away from the hard thing.`,
      'Stand tall, breathe, and try one brave sentence.',
      trial.chamberId === 'training-yard' ? 'Try: I can breathe and try again.' : 'Try one calm, true sentence.'
    );
  }

  const answerSignals = chamberSignals[trial.chamberId] ?? [];
  const answerSignalCount = answerSignals.filter((signal) => lower.includes(signal)).length;
  const artifactSignalCount = selected.filter((item) => trial.artifacts.map((artifact) => artifact.toLowerCase()).includes(item)).length;
  const starterCount = trial.starters.filter((starter) => lower.includes(starter.toLowerCase().replace('...', '').trim())).length;

  if (words.length > 0 && answerSignalCount + starterCount === 0) {
    return correction(
      'Answer the Chamber',
      `${tutorFor(trial)} listens closely. The answer has words, but it does not answer this tutor's question.`,
      'Use one card and say one fitting sentence.',
      chamberPrompt(trial)
    );
  }

  if (words.length < 2 && artifactSignalCount === 0) {
    return correction(
      'One Clear Thought',
      `${tutorFor(trial)} needs one small idea before giving a seal.`,
      'Point to a card or say a tiny answer.',
      chamberPrompt(trial)
    );
  }

  const score = Math.min(100, 64 + artifactSignalCount * 7 + answerSignalCount * 9 + starterCount * 7 + Math.min(16, words.length * 2));
  return {
    mastered: score >= 66,
    score,
    title: trial.virtue,
    line: `${tutorFor(trial)} nods. That answer fits the lesson and shows a noble step.`,
    event: `The ${trial.relic} lights on the royal path.`,
    relic: trial.relic,
    next: 'Carry this virtue into the next chamber.'
  };
}

function tutorFor(trial: Trial) {
  if (trial.chamberId === 'great-hall') return 'Aurelius';
  if (trial.chamberId === 'star-tower') return 'Hypatia';
  if (trial.chamberId === 'scriptorium') return 'Sappho';
  if (trial.chamberId === 'training-yard') return 'Leonidas';
  return 'Ibn Sina';
}

function correction(title: string, line: string, event: string, next: string): TutorReward {
  return {
    mastered: false,
    score: 25,
    title,
    line,
    event,
    relic: 'Practice Spark',
    next
  };
}

function containsAny(text: string, words: string[]) {
  return words.some((word) => {
    if (word.includes(' ')) {
      return text.includes(word);
    }
    return new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i').test(text);
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function chamberPrompt(trial: Trial) {
  if (trial.chamberId === 'great-hall') return 'Try: I can help, ask, share, or give it back.';
  if (trial.chamberId === 'star-tower') return 'Try: It repeats, so the next one is...';
  if (trial.chamberId === 'scriptorium') return 'Try: I built..., I helped..., I felt..., or I learned...';
  if (trial.chamberId === 'training-yard') return 'Try: I can breathe and try again.';
  return 'Try: I notice..., it needs..., or I can care by...';
}
