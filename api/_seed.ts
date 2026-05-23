export interface TutorRecord {
  id: string;
  name: string;
  title: string;
  domain: string;
  roomName: string;
  roomDescription: string;
  roomImageUrl: string;
  tone: string;
  motto: string;
  color: string;
  accent: string;
  sigil: string;
  imageUrl: string;
  voiceId?: string | null;
}

export interface LessonRecord {
  id: string;
  tutorId: string;
  level: number;
  title: string;
  opening: string;
  prompt: string;
  answerType: 'choice' | 'spoken' | 'text';
  choices: string[];
  answer: string;
  praise: string;
  stretch: string;
  cadence: string;
}

export const seedTutors: TutorRecord[] = [
  {
    id: 'aurelius',
    name: 'Aurelius',
    title: 'Tutor of Noble Character',
    domain: 'virtue',
    roomName: 'Great Hall',
    roomDescription: 'Judgment, kindness, service, and the first laws of noble conduct.',
    roomImageUrl: '/castle/great-hall.png',
    tone: 'warm, steady, and fatherly',
    motto: 'First rule the self, then serve the realm.',
    color: '#7b3f2f',
    accent: '#f3c969',
    sigil: 'A',
    imageUrl: '/tutors/aurelius.png',
    voiceId: null
  },
  {
    id: 'hypatia',
    name: 'Hypatia',
    title: 'Tutor of Number and Stars',
    domain: 'logic',
    roomName: 'Star Tower',
    roomDescription: 'Numbers, patterns, astronomy, memory, and the clean joy of proof.',
    roomImageUrl: '/castle/star-tower.png',
    tone: 'bright, exact, and encouraging',
    motto: 'A clear mind is a lantern in any dark hall.',
    color: '#174c63',
    accent: '#74d4c0',
    sigil: 'H',
    imageUrl: '/tutors/hypatia.png',
    voiceId: null
  },
  {
    id: 'sappho',
    name: 'Sappho',
    title: 'Tutor of Letters and Song',
    domain: 'language',
    roomName: 'Scriptorium',
    roomDescription: 'Letters, poetry, speech, story, and the power of exact words.',
    roomImageUrl: '/castle/scriptorium.png',
    tone: 'musical, playful, and precise',
    motto: 'A true word can carry a kingdom.',
    color: '#7d3c71',
    accent: '#f0a6ca',
    sigil: 'S',
    imageUrl: '/tutors/sappho.png',
    voiceId: null
  },
  {
    id: 'leonidas',
    name: 'Leonidas',
    title: 'Tutor of Courage and Body',
    domain: 'discipline',
    roomName: 'Training Yard',
    roomDescription: 'Breath, strength, patience, courage, and calm command of the body.',
    roomImageUrl: '/castle/training-yard.png',
    tone: 'brave, direct, and kind',
    motto: 'Strength protects what gentleness loves.',
    color: '#294936',
    accent: '#d6b46a',
    sigil: 'L',
    imageUrl: '/tutors/leonidas.png',
    voiceId: null
  },
  {
    id: 'ibn-sina',
    name: 'Ibn Sina',
    title: 'Tutor of Nature and Care',
    domain: 'nature',
    roomName: 'Garden Laboratory',
    roomDescription: 'Plants, animals, medicine, observation, and reverence for living things.',
    roomImageUrl: '/castle/garden-lab.png',
    tone: 'curious, calm, and wise',
    motto: 'To know the world, look closely and ask why.',
    color: '#315c7c',
    accent: '#a8dadc',
    sigil: 'I',
    imageUrl: '/tutors/ibn-sina.png',
    voiceId: null
  }
];

export const seedLessons: LessonRecord[] = [
  {
    id: 'virtue-001',
    tutorId: 'aurelius',
    level: 1,
    title: 'The Small Throne',
    opening: 'A prince begins with one small choice done well.',
    prompt: 'Your little brother drops his blocks. What does a noble prince do first?',
    answerType: 'choice',
    choices: ['Laugh and walk away', 'Help him gather the blocks', 'Take the biggest block'],
    answer: 'Help him gather the blocks',
    praise: 'That is service. A ruler lifts others before asking to be lifted.',
    stretch: 'Name one helpful act you can do before supper.',
    cadence: 'daily'
  },
  {
    id: 'logic-001',
    tutorId: 'hypatia',
    level: 1,
    title: 'Three Bright Stars',
    opening: 'Numbers are stars that stay where you put them.',
    prompt: 'You have two apples and I give you one more. How many apples shine in your basket?',
    answerType: 'choice',
    choices: ['Two', 'Three', 'Five'],
    answer: 'Three',
    praise: 'Exactly. You counted the world and made it clearer.',
    stretch: 'Show three with your fingers, then find three things in the room.',
    cadence: 'daily'
  },
  {
    id: 'letters-001',
    tutorId: 'sappho',
    level: 1,
    title: 'The Golden Sound',
    opening: 'Letters are tiny gates. Open them and meaning walks out.',
    prompt: 'Which word begins with the same sound as prince?',
    answerType: 'choice',
    choices: ['Pear', 'Moon', 'Sun'],
    answer: 'Pear',
    praise: 'Well heard. P and prince begin with the same proud little puff.',
    stretch: 'Say three more words that begin with P.',
    cadence: 'daily'
  },
  {
    id: 'discipline-001',
    tutorId: 'leonidas',
    level: 1,
    title: 'The Still Shield',
    opening: 'Courage can be quiet. Sometimes it stands still and breathes.',
    prompt: 'Before a hard task, what should a strong prince do first?',
    answerType: 'choice',
    choices: ['Take one calm breath', 'Shout at the task', 'Run away quickly'],
    answer: 'Take one calm breath',
    praise: 'Good. Breath is the handle of the shield.',
    stretch: 'Take three slow breaths and stand tall like a guardian.',
    cadence: 'daily'
  },
  {
    id: 'nature-001',
    tutorId: 'ibn-sina',
    level: 1,
    title: 'The Patient Leaf',
    opening: 'Nature rewards the prince who looks twice.',
    prompt: 'What does a seed need to begin growing?',
    answerType: 'choice',
    choices: ['Water, warmth, and time', 'Loud music only', 'A golden crown'],
    answer: 'Water, warmth, and time',
    praise: 'Yes. Life grows by small faithful gifts.',
    stretch: 'Look at a plant and tell what shape its leaves make.',
    cadence: 'daily'
  },
  {
    id: 'virtue-002',
    tutorId: 'aurelius',
    level: 2,
    title: 'The Hidden Crown',
    opening: 'A greater prince does the right thing even when no one claps.',
    prompt: 'You find a toy that is not yours and no one is watching. What is the noble choice?',
    answerType: 'choice',
    choices: ['Hide it for later', 'Return it to its owner', 'Trade it without asking'],
    answer: 'Return it to its owner',
    praise: 'That is honor. A true crown is worn inside first.',
    stretch: 'Tell me one thing you can do rightly even when no one sees.',
    cadence: 'daily'
  },
  {
    id: 'logic-002',
    tutorId: 'hypatia',
    level: 2,
    title: 'The Pattern Gate',
    opening: 'A sharp mind sees what comes next.',
    prompt: 'The stones go red, blue, red, blue. Which stone should come next?',
    answerType: 'choice',
    choices: ['Red', 'Blue', 'Gold'],
    answer: 'Red',
    praise: 'Yes. You saw the pattern and stepped through the gate.',
    stretch: 'Make a two-color pattern with blocks or crayons.',
    cadence: 'daily'
  },
  {
    id: 'letters-002',
    tutorId: 'sappho',
    level: 2,
    title: 'The True Sentence',
    opening: 'A prince speaks clearly so others can trust his meaning.',
    prompt: 'Which sentence tells a complete thought?',
    answerType: 'choice',
    choices: ['The brave prince helped.', 'Under the table', 'Because the moon'],
    answer: 'The brave prince helped.',
    praise: 'Well spoken. That sentence stands on its own feet.',
    stretch: 'Make one complete sentence about your day.',
    cadence: 'daily'
  },
  {
    id: 'discipline-002',
    tutorId: 'leonidas',
    level: 2,
    title: 'The Second Try',
    opening: 'Discipline is returning to the work after the first stumble.',
    prompt: 'If a puzzle is hard and you fail once, what does a disciplined prince do?',
    answerType: 'choice',
    choices: ['Try again calmly', 'Throw the puzzle', 'Say it is impossible'],
    answer: 'Try again calmly',
    praise: 'That is discipline. Strength returns to the task.',
    stretch: 'Practice one hard thing for one quiet minute.',
    cadence: 'daily'
  },
  {
    id: 'nature-002',
    tutorId: 'ibn-sina',
    level: 2,
    title: 'The Careful Observer',
    opening: 'A learned prince uses his eyes before his guesses.',
    prompt: 'Before deciding what an unknown plant needs, what should you do first?',
    answerType: 'choice',
    choices: ['Observe it closely', 'Pull it out', 'Ignore it'],
    answer: 'Observe it closely',
    praise: 'Exactly. Observation is the first kindness of science.',
    stretch: 'Describe one plant using color, shape, and size.',
    cadence: 'daily'
  }
];
