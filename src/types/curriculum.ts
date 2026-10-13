export interface VocabularyItem {
  id: string;
  german: string;
  english: string;
  gender?: 'der' | 'die' | 'das';
  plural?: string;
  phonetic: string;
  exampleDe: string;
  exampleEn: string;
  notes?: string;
}

export interface GrammarPoint {
  title: string;
  explanation: string;
  examples: Array<{ de: string; en: string; highlight?: string }>;
  commonMistake: {
    wrong: string;
    right: string;
    reason: string;
  };
}

export interface DialogueLine {
  speaker: string;
  role: string;
  de: string;
  en: string;
}

export interface Dialogue {
  title: string;
  context: string;
  lines: DialogueLine[];
  comprehensionQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export type ExerciseType = 
  | 'multiple_choice' 
  | 'word_scramble' 
  | 'listening_choice' 
  | 'cloze_fill' 
  | 'dialogue_choice';

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  germanPrompt?: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string | number; // option index or correct string
  acceptableAnswers?: string[];
  explanation: string;
}

export interface RealLifeMission {
  scenario: string;
  task: string;
  modelAnswer: string;
  hints: string[];
  keyPhrases: string[];
}

export interface Lesson {
  id: string;
  stageId: string;
  level: 'Pre-A1' | 'A1.1' | 'A1.2' | 'A2.1' | 'B1.1';
  order: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  objective: string;
  essentialVocabulary: VocabularyItem[];
  grammarInContext: GrammarPoint;
  dialogue: Dialogue;
  exercises: Exercise[];
  realLifeMission: RealLifeMission;
  summaryTakeaways: string[];
}

export interface Stage {
  id: string;
  level: 'Pre-A1' | 'A1' | 'A2' | 'B1';
  title: string;
  description: string;
  badge: string;
  lessonIds: string[];
}

export interface Flashcard {
  id: string;
  word: string;
  article?: 'der' | 'die' | 'das';
  plural?: string;
  meaning: string;
  exampleDe: string;
  exampleEn: string;
  level: string;
  // SRS properties
  interval: number; // in days or review step
  repetition: number;
  easeFactor: number;
  dueDate: number; // timestamp
  lastReviewed?: number;
}

export interface UserProgressState {
  completedLessonIds: string[];
  lessonScores: Record<string, number>; // lessonId -> percentage
  mistakesNotebook: Array<{
    id: string;
    lessonId: string;
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    timestamp: number;
  }>;
  dailyGoal: number; // lessons per day
  dailyCompletedToday: number;
  lastStudyDate: string;
  streakDays: number;
  voiceSpeed: number; // 0.8, 1.0, 1.2
  srsCards: Flashcard[];
}
