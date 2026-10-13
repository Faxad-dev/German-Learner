import { UserProgressState } from '../types/curriculum';

const STORAGE_KEY = 'german_learner_progress_v2';

const defaultState: UserProgressState = {
  completedLessonIds: [],
  lessonScores: {},
  mistakesNotebook: [],
  dailyGoal: 2,
  dailyCompletedToday: 0,
  lastStudyDate: new Date().toISOString().split('T')[0],
  streakDays: 1,
  voiceSpeed: 0.9,
  srsCards: []
};

export const progressService = {
  load(): UserProgressState {
    if (typeof window === 'undefined') return defaultState;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return defaultState;
      const parsed = JSON.parse(data) as UserProgressState;

      // Check streak and daily goal reset
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastStudyDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (parsed.lastStudyDate === yesterday) {
          // consecutive day! Streak continues if completed tasks
        } else {
          // missed day: preserve positive streak if completed daily goals, otherwise reset to 1
          if (parsed.streakDays > 1 && parsed.dailyCompletedToday < parsed.dailyGoal) {
            parsed.streakDays = 1;
          }
        }
        parsed.dailyCompletedToday = 0;
        parsed.lastStudyDate = today;
      }

      // Ensure fields exist if loaded from older version
      if (!parsed.mistakesNotebook) parsed.mistakesNotebook = [];
      if (!parsed.lessonScores) parsed.lessonScores = {};
      if (!parsed.completedLessonIds) parsed.completedLessonIds = [];
      if (typeof parsed.voiceSpeed !== 'number') parsed.voiceSpeed = 0.9;

      return parsed;
    } catch (e) {
      console.warn('Failed to parse progress from storage:', e);
      return defaultState;
    }
  },

  save(state: UserProgressState) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save progress to storage:', e);
    }
  },

  reset(): UserProgressState {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
    }
    return { ...defaultState };
  },

  completeLesson(lessonId: string, score: number) {
    const current = this.load();
    if (!current.completedLessonIds.includes(lessonId)) {
      current.completedLessonIds.push(lessonId);
      current.dailyCompletedToday += 1;
      if (current.dailyCompletedToday >= current.dailyGoal) {
        current.streakDays = Math.max(current.streakDays, current.streakDays + 1);
      }
    }
    current.lessonScores[lessonId] = Math.max(current.lessonScores[lessonId] || 0, score);
    this.save(current);
    return current;
  },

  recordMistake(lessonId: string, prompt: string, userAnswer: string, correctAnswer: string, explanation: string) {
    const current = this.load();
    current.mistakesNotebook.unshift({
      id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      lessonId,
      prompt,
      userAnswer,
      correctAnswer,
      explanation,
      timestamp: Date.now()
    });
    // keep last 50 mistakes
    if (current.mistakesNotebook.length > 50) {
      current.mistakesNotebook = current.mistakesNotebook.slice(0, 50);
    }
    this.save(current);
  },

  removeMistake(id: string) {
    const current = this.load();
    current.mistakesNotebook = current.mistakesNotebook.filter(m => m.id !== id);
    this.save(current);
    return current;
  },

  // SM-2 Spaced Repetition calculation
  reviewCard(cardId: string, grade: 1 | 2 | 3 | 4 | 5) {
    const current = this.load();
    const card = current.srsCards.find(c => c.id === cardId);
    if (!card) return current;

    if (grade >= 3) {
      // Successful recall
      if (card.repetition === 0) {
        card.interval = 1; // 1 day
      } else if (card.repetition === 1) {
        card.interval = 3; // 3 days
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetition += 1;
    } else {
      // Failed recall
      card.repetition = 0;
      card.interval = 1;
    }

    // Adjust ease factor according to SM-2 formula
    card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
    card.dueDate = Date.now() + card.interval * 86400000;
    card.lastReviewed = Date.now();

    this.save(current);
    return current;
  }
};
