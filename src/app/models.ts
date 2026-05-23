export interface Tutor {
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
}

export interface Quest {
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

export interface AnswerResult {
  correct: boolean;
  mentorLine: string;
  expected: string;
  stretch: string;
}

export interface ProgressUpdate {
  lessonId: string;
  tutorId: string;
  status: 'started' | 'answered' | 'mastered';
  answer?: string;
  score?: number;
}
