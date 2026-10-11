import React, { useState } from 'react';
import { CURRICULUM_STAGES, CURRICULUM_LESSONS, INITIAL_SRS_FLASHCARDS } from './data/curriculumData';
import { Lesson, UserProgressState } from './types/curriculum';
import { progressService } from './services/progressService';
import { audioService } from './services/audioService';
import { LessonViewer } from './components/LessonViewer';
import { FlashcardReview } from './components/FlashcardReview';
import { 
  BookOpen, 
  Flame, 
  RotateCcw, 
  CheckCircle, 
  Volume2, 
  Layers, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgressState>(() => {
    const loaded = progressService.load();
    if (!loaded.srsCards || loaded.srsCards.length === 0) {
      loaded.srsCards = INITIAL_SRS_FLASHCARDS;
      progressService.save(loaded);
    }
    return loaded;
  });

  const [activeView, setActiveView] = useState<'curriculum' | 'lesson' | 'srs' | 'mistakes' | 'simulator'>('curriculum');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Filter due cards
  const dueCards = progress.srsCards.filter(c => c.dueDate <= Date.now());

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveView('lesson');
  };

  const handleLessonCompleted = (score: number) => {
    const updated = progressService.completeLesson(selectedLesson!.id, score);
    setProgress(updated);
    setActiveView('curriculum');
    setSelectedLesson(null);
  };

  const handleSpeak = (text: string) => {
    audioService.speak(text);
  };

  return (
    <div className="min-h-screen bg-[#0a0909] text-[#fcfcfc] flex flex-col selection:bg-orange-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0a0909]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center font-black text-sm tracking-wider shadow-lg shadow-orange-600/30">
              DE
            </div>
            <div>
              <span className="font-bold text-white tracking-tight">German Learner</span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-orange-400 ml-2 px-2 py-0.5 rounded bg-orange-950/60 border border-orange-800/40">
                A1–A2 Practical Platform
              </span>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => { setActiveView('curriculum'); setSelectedLesson(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'curriculum' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum</span>
            </button>

            <button 
              onClick={() => setActiveView('srs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'srs' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Review Deck</span>
              {dueCards.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-yellow-400 text-black text-[10px] font-bold">
                  {dueCards.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveView('mistakes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'mistakes' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mistakes ({progress.mistakesNotebook.length})</span>
            </button>

            <button 
              onClick={() => setActiveView('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeView === 'simulator' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>B1 Simulator</span>
            </button>
          </nav>

          {/* User Progress Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-orange-400 bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-800/40">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{progress.streakDays}d Streak</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* VIEW 1: LESSON VIEWER */}
        {activeView === 'lesson' && selectedLesson && (
          <LessonViewer 
            lesson={selectedLesson} 
            onBack={() => { setActiveView('curriculum'); setSelectedLesson(null); }}
            onComplete={handleLessonCompleted}
          />
        )}

        {/* VIEW 2: CURRICULUM OVERVIEW */}
        {activeView === 'curriculum' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Hero Banner */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 relative overflow-hidden">
              <div className="max-w-2xl space-y-4 relative z-10">
                <span className="inline-block text-xs font-mono text-orange-400 font-bold uppercase tracking-wider bg-orange-950/80 px-2.5 py-1 rounded border border-orange-800">
                  Sequential CEFR Learning Pathway
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif leading-tight">
                  Speak, understand, and use German in everyday life.
                </h1>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  No disconnected flashcards or gimmicks. Learn essential greetings, introduce yourself, master the <strong>Verb in Position 2</strong> rule, order at cafes, and ask for directions with full native audio.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{progress.completedLessonIds.length} of {CURRICULUM_LESSONS.length} Units Mastered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-yellow-400" />
                    <span>{dueCards.length} Vocabulary Reviews Due</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stages & Lessons List */}
            <div className="space-y-8">
              {CURRICULUM_STAGES.map((stage) => {
                const stageLessons = CURRICULUM_LESSONS.filter(l => l.stageId === stage.id);
                return (
                  <div key={stage.id} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {stage.level}
                          </span>
                          <h2 className="text-lg font-bold text-white">{stage.title}</h2>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">{stage.description}</p>
                      </div>
                      <span className="hidden sm:inline-block text-xs font-mono text-orange-400 bg-orange-950/40 px-2.5 py-1 rounded border border-orange-800/40">
                        {stage.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stageLessons.map((lesson) => {
                        const isCompleted = progress.completedLessonIds.includes(lesson.id);
                        const score = progress.lessonScores[lesson.id];

                        return (
                          <div 
                            key={lesson.id}
                            onClick={() => handleOpenLesson(lesson)}
                            className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase">
                                  Unit {lesson.order} • {lesson.durationMinutes} min
                                </span>
                                {isCompleted ? (
                                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                                    <CheckCircle className="w-3 h-3" /> Mastered ({score}%)
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-mono text-neutral-500">
                                    Not started
                                  </span>
                                )}
                              </div>

                              <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                                {lesson.title}
                              </h3>
                              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                                {lesson.subtitle}
                              </p>

                              <div className="mt-3 p-2.5 rounded bg-black/40 border border-neutral-800/80 text-[11px] text-neutral-300">
                                <span className="font-semibold text-neutral-400">Goal:</span> {lesson.objective}
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                              <span className="text-neutral-500">
                                {lesson.essentialVocabulary.length} words • {lesson.exercises.length} practice tasks
                              </span>
                              <span className="text-orange-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                                Study Lesson →
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: SPACED REPETITION FLASHCARD REVIEW */}
        {activeView === 'srs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-lg mx-auto">
              <span className="text-xs font-mono text-orange-400 uppercase">Spaced Repetition System</span>
              <h2 className="text-2xl font-bold text-white font-serif mt-1">Vocabulary Retention Deck</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Based on the SM-2 algorithm. Cards you find hard repeat sooner; easy words schedule into long-term memory.
              </p>
            </div>

            <FlashcardReview 
              cards={dueCards.length > 0 ? dueCards : progress.srsCards.slice(0, 10)}
              onFinish={() => setActiveView('curriculum')}
            />
          </div>
        )}

        {/* VIEW 4: MISTAKES NOTEBOOK */}
        {activeView === 'mistakes' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Mistakes Notebook</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Every error made during practice exercises is logged here with full grammatical explanations for targeted revision.
                </p>
              </div>
              <button 
                onClick={() => {
                  const updated = { ...progress, mistakesNotebook: [] };
                  setProgress(updated);
                  progressService.save(updated);
                }}
                disabled={progress.mistakesNotebook.length === 0}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-mono text-neutral-300"
              >
                Clear Notebook
              </button>
            </div>

            {progress.mistakesNotebook.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-neutral-900 border border-neutral-800">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No Active Mistakes Logged!</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Keep doing practice exercises. Any questions you miss will automatically show up here for review.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {progress.mistakesNotebook.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-neutral-400">Question:</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">{m.prompt}</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded bg-red-950/30 border border-red-900/40 text-red-300">
                        <span className="font-bold">Your answer:</span> {m.userAnswer}
                      </div>
                      <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                        <span className="font-bold">Correct answer:</span> {m.correctAnswer}
                      </div>
                    </div>

                    <div className="text-xs text-neutral-300 bg-black/40 p-2.5 rounded border border-neutral-800">
                      💡 <strong>Why:</strong> {m.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: B1 SIMULATOR & GRAMMAR SANDBOX */}
        {activeView === 'simulator' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-neutral-800 pb-4">
              <span className="text-xs font-mono text-orange-400 uppercase">Interactive Studio</span>
              <h2 className="text-2xl font-bold text-white font-serif mt-1">
                Goethe & telc B1 Practice Simulator & Grammar Sandbox
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Reference standard inflection tables, train noun genders, and calculate official Goethe B1 grading bands.
              </p>
            </div>

            {/* Rapid Gender Drill */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
                <span className="text-xs font-mono uppercase text-orange-400 font-bold">
                  Rapid Gender Drill (Der, Die, Das)
                </span>
                <p className="text-xs text-neutral-400">
                  Instinctive gender recognition is key to fluent German speech and accusative/dative inflections.
                </p>

                <div className="p-6 rounded-lg bg-black/50 border border-neutral-800 text-center">
                  <span className="text-xs text-neutral-400 font-mono">Which article belongs to:</span>
                  <h3 className="text-3xl font-extrabold text-white my-2 font-serif">Kaffee</h3>
                  <span className="text-xs text-neutral-400 italic">"coffee"</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      handleSpeak('der Kaffee');
                      alert('🎉 Richtig! "der Kaffee" is masculine (Akkusativ: einen Kaffee).');
                    }}
                    className="py-3 rounded bg-blue-950/60 hover:bg-blue-900 border border-blue-800 text-blue-300 font-bold text-sm transition-all"
                  >
                    DER (Masc)
                  </button>
                  <button 
                    onClick={() => {
                      handleSpeak('der Kaffee');
                      alert('❌ Falsch! Coffee is masculine: "der Kaffee".');
                    }}
                    className="py-3 rounded bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-sm transition-all"
                  >
                    DIE (Fem)
                  </button>
                  <button 
                    onClick={() => {
                      handleSpeak('der Kaffee');
                      alert('❌ Falsch! Coffee is masculine: "der Kaffee".');
                    }}
                    className="py-3 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold text-sm transition-all"
                  >
                    DAS (Neut)
                  </button>
                </div>
              </div>

              {/* Inflection Table */}
              <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                  Case Inflection Reference
                </span>
                <p className="text-xs text-neutral-400">
                  Notice how masculine is the only singular gender that changes form in the Akkusativ!
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400">
                        <th className="py-2">Case</th>
                        <th className="py-2 text-blue-400">Masc</th>
                        <th className="py-2 text-red-400">Fem</th>
                        <th className="py-2 text-emerald-400">Neut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-300">
                      <tr>
                        <td className="py-2.5 font-sans font-semibold text-white">Nominativ</td>
                        <td className="py-2.5">der / ein</td>
                        <td className="py-2.5">die / eine</td>
                        <td className="py-2.5">das / ein</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-sans font-semibold text-orange-400">Akkusativ</td>
                        <td className="py-2.5 text-orange-400 font-bold">den / einen ⚠️</td>
                        <td className="py-2.5">die / eine</td>
                        <td className="py-2.5">das / ein</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-sans font-semibold text-yellow-400">Dativ</td>
                        <td className="py-2.5 text-yellow-400">dem / einem</td>
                        <td className="py-2.5 text-yellow-400">der / einer</td>
                        <td className="py-2.5 text-yellow-400">dem / einem</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-[#0a0909] py-8 text-center text-xs text-neutral-500">
        <p>German Learner • Practical everyday German communication platform aligned with CEFR standards.</p>
      </footer>
    </div>
  );
};
