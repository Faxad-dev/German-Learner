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
  GraduationCap,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Award,
  ChevronRight
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rapid Gender Drill state
  const [genderFeedback, setGenderFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // B1 Exam Simulator slider state
  const [examScores, setExamScores] = useState({
    lesen: 75,
    hoeren: 70,
    schreiben: 65,
    sprechen: 75
  });

  // Filter due cards
  const dueCards = progress.srsCards.filter(c => c.dueDate <= Date.now());

  const handleOpenLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLessonCompleted = (score: number) => {
    const updated = progressService.completeLesson(selectedLesson!.id, score);
    setProgress(updated);
    setActiveView('curriculum');
    setSelectedLesson(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSpeak = (text: string) => {
    audioService.speak(text);
  };

  // Next recommended lesson is the first non-completed lesson, or the first lesson
  const nextLesson = CURRICULUM_LESSONS.find(l => !progress.completedLessonIds.includes(l.id)) || CURRICULUM_LESSONS[0];

  // Calculate Goethe B1 exam total and grade
  const totalExamScore = Math.round((examScores.lesen + examScores.hoeren + examScores.schreiben + examScores.sprechen) / 4);
  const getExamGrade = (score: number) => {
    if (score >= 90) return { label: 'Sehr gut (1.0)', passed: true, color: 'text-[#176B52]' };
    if (score >= 80) return { label: 'Gut (2.0)', passed: true, color: 'text-[#176B52]' };
    if (score >= 70) return { label: 'Befriedigend (3.0)', passed: true, color: 'text-[#17243A]' };
    if (score >= 60) return { label: 'Ausreichend (4.0)', passed: true, color: 'text-[#17243A]' };
    return { label: 'Nicht bestanden (Failed)', passed: false, color: 'text-[#B91C1C]' };
  };
  const examResult = getExamGrade(totalExamScore);

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#202B3C] flex flex-col font-sans">
      {/* Top Header - Strict Top Bar Contract (3 zones separated by gap-8) */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E3E8E3] shadow-[0_1px_3px_rgba(23,36,58,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single element brand wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <button 
              onClick={() => { setActiveView('curriculum'); setSelectedLesson(null); }}
              className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-[#176B52] rounded-lg p-1 -ml-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#17243A] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
                DE
              </div>
              <div>
                <span className="font-bold text-[#17243A] text-base tracking-tight block leading-tight">
                  German Learner
                </span>
                <span className="text-[11px] text-[#687386] font-medium block leading-tight">
                  CEFR A1–A2 Platform
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button 
              onClick={() => { setActiveView('curriculum'); setSelectedLesson(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'curriculum' 
                  ? 'bg-[#E8F3ED] text-[#176B52] font-semibold' 
                  : 'text-[#687386] hover:text-[#17243A] hover:bg-[#F0F3EF]'
              }`}
            >
              Curriculum
            </button>

            <button 
              onClick={() => { setActiveView('srs'); setSelectedLesson(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'srs' 
                  ? 'bg-[#E8F3ED] text-[#176B52] font-semibold' 
                  : 'text-[#687386] hover:text-[#17243A] hover:bg-[#F0F3EF]'
              }`}
            >
              <span>Review Deck</span>
              {dueCards.length > 0 && (
                <span className="text-xs px-1.5 py-0.2 rounded-full bg-[#E7B66A] text-[#17243A] font-semibold">
                  {dueCards.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => { setActiveView('mistakes'); setSelectedLesson(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeView === 'mistakes' 
                  ? 'bg-[#E8F3ED] text-[#176B52] font-semibold' 
                  : 'text-[#687386] hover:text-[#17243A] hover:bg-[#F0F3EF]'
              }`}
            >
              <span>Mistakes</span>
              {progress.mistakesNotebook.length > 0 && (
                <span className="text-xs text-[#687386]">
                  ({progress.mistakesNotebook.length})
                </span>
              )}
            </button>

            <button 
              onClick={() => { setActiveView('simulator'); setSelectedLesson(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'simulator' 
                  ? 'bg-[#E8F3ED] text-[#176B52] font-semibold' 
                  : 'text-[#687386] hover:text-[#17243A] hover:bg-[#F0F3EF]'
              }`}
            >
              B1 Simulator & Sandbox
            </button>
          </nav>

          {/* Zone 3: 1 primary action / metric */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#17243A] bg-[#FFFFFF] border border-[#E3E8E3] px-3 py-1.5 rounded-lg shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#E7B66A] fill-[#E7B66A]" />
              <span className="font-semibold">{progress.streakDays} Day Streak</span>
            </div>

            {activeView !== 'lesson' && (
              <button 
                onClick={() => handleOpenLesson(nextLesson)}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#176B52] rounded-lg hover:bg-[#125742] transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                <span>Continue Unit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#687386] hover:text-[#17243A] hover:bg-[#F0F3EF] rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E3E8E3] bg-white px-4 py-3 space-y-1 shadow-lg">
            <button
              onClick={() => { setActiveView('curriculum'); setSelectedLesson(null); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeView === 'curriculum' ? 'bg-[#E8F3ED] text-[#176B52] font-semibold' : 'text-[#687386]'
              }`}
            >
              <span>Curriculum Pathway</span>
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setActiveView('srs'); setSelectedLesson(null); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeView === 'srs' ? 'bg-[#E8F3ED] text-[#176B52] font-semibold' : 'text-[#687386]'
              }`}
            >
              <span>Review Deck ({dueCards.length} due)</span>
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setActiveView('mistakes'); setSelectedLesson(null); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeView === 'mistakes' ? 'bg-[#E8F3ED] text-[#176B52] font-semibold' : 'text-[#687386]'
              }`}
            >
              <span>Mistakes Notebook ({progress.mistakesNotebook.length})</span>
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setActiveView('simulator'); setSelectedLesson(null); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeView === 'simulator' ? 'bg-[#E8F3ED] text-[#176B52] font-semibold' : 'text-[#687386]'
              }`}
            >
              <span>Goethe B1 Simulator & Sandbox</span>
              <GraduationCap className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* VIEW 1: LESSON VIEWER */}
        {activeView === 'lesson' && selectedLesson && (
          <LessonViewer 
            lesson={selectedLesson} 
            onBack={() => { setActiveView('curriculum'); setSelectedLesson(null); }}
            onComplete={handleLessonCompleted}
          />
        )}

        {/* VIEW 2: CURRICULUM OVERVIEW & LEARNING DASHBOARD */}
        {activeView === 'curriculum' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* Editorial Hero Section (Split Column with Authentic Illustration) */}
            <div className="bg-white border border-[#E3E8E3] rounded-2xl shadow-[0_4px_16px_rgba(23,36,58,0.04)] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Left Column: Educational Editorial Narrative */}
                <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#687386]">
                      <span className="font-semibold text-[#176B52]">CEFR Pathway</span>
                      <span aria-hidden="true">·</span>
                      <span>Pre-A1 to A2 Foundations</span>
                      <span aria-hidden="true">·</span>
                      <span>B1 Preparation</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#17243A] font-serif leading-[1.15] tracking-tight">
                      Learn practical German for everyday life.
                    </h1>

                    <p className="text-sm sm:text-base text-[#687386] leading-relaxed max-w-xl">
                      Build your German step by step with practical lessons, useful vocabulary, real-life conversations, and interactive exercises. Master essential greetings, order at cafés, navigate German cities, and conquer the fundamental <strong>Verb in Position 2</strong> rule.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Primary and Secondary CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => handleOpenLesson(nextLesson)}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-[#176B52] hover:bg-[#125742] rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2"
                      >
                        <span>Start Learning Unit {nextLesson.order}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => setActiveView('srs')}
                        className="px-4 py-2.5 text-sm font-medium text-[#17243A] bg-[#FFFFFF] hover:bg-[#F7F8F5] border border-[#E3E8E3] rounded-xl transition-all duration-200 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4 text-[#687386]" />
                        <span>Review Vocabulary ({dueCards.length} due)</span>
                      </button>
                    </div>

                    {/* Progress strip */}
                    <div className="pt-4 border-t border-[#ECEFEA] flex flex-wrap items-center gap-6 text-xs text-[#687386]">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#176B52]" />
                        <span><strong>{progress.completedLessonIds.length}</strong> of {CURRICULUM_LESSONS.length} Units Mastered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-[#E7B66A]" />
                        <span><strong>{progress.streakDays}</strong> Days Active Study</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#687386]" />
                        <span><strong>{progress.srsCards.length}</strong> Cards in Deck</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: High-Fidelity Editorial Visual */}
                <div className="lg:col-span-5 bg-[#F0F3EF] border-t lg:border-t-0 lg:border-l border-[#E3E8E3] relative flex items-center justify-center p-6 md:p-8">
                  <div className="w-full h-full max-h-[360px] rounded-xl overflow-hidden border border-[#E3E8E3] shadow-sm relative group bg-white">
                    <img 
                      src="/hero-german.jpg" 
                      alt="Deutsch Lernen European editorial study desk illustration"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#17243A]/85 via-[#17243A]/40 to-transparent p-4 text-white">
                      <span className="text-[11px] font-semibold text-[#E7B66A] uppercase tracking-wider block">
                        Interactive Immersion
                      </span>
                      <p className="text-xs text-white/95 mt-0.5">
                        Native speech audio, sentence structure drills, and authentic dialogue.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Recommended Next Step Card */}
            <div className="bg-[#E8F3ED] border border-[#C5DDD0] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#176B52]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommended Next Unit</span>
                </div>
                <h3 className="text-base font-bold text-[#17243A]">
                  Unit {nextLesson.order}: {nextLesson.title}
                </h3>
                <p className="text-xs text-[#687386]">
                  {nextLesson.subtitle} · Estimated study time: {nextLesson.durationMinutes} min
                </p>
              </div>
              <button 
                onClick={() => handleOpenLesson(nextLesson)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#176B52] hover:bg-[#125742] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                Start Unit {nextLesson.order} →
              </button>
            </div>

            {/* Stages & Structured Curriculum */}
            <div className="space-y-10">
              <div className="border-b border-[#E3E8E3] pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#17243A] font-serif">Curriculum Progression</h2>
                  <p className="text-xs text-[#687386] mt-0.5">Sequential units structured by communicative capability and CEFR outcomes.</p>
                </div>
                <span className="text-xs text-[#687386]">5 Comprehensive Stages</span>
              </div>

              {CURRICULUM_STAGES.map((stage) => {
                const stageLessons = CURRICULUM_LESSONS.filter(l => l.stageId === stage.id);
                const stageCompletedCount = stageLessons.filter(l => progress.completedLessonIds.includes(l.id)).length;

                return (
                  <section key={stage.id} className="space-y-4">
                    {/* Stage Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#176B52] bg-[#E8F3ED] px-2.5 py-0.5 rounded border border-[#C5DDD0]">
                            {stage.level}
                          </span>
                          <h3 className="text-lg font-bold text-[#17243A]">
                            {stage.title}
                          </h3>
                        </div>
                        <p className="text-xs text-[#687386]">{stage.description}</p>
                      </div>

                      <div className="text-xs text-[#687386] flex items-center gap-2 shrink-0">
                        <span>{stageCompletedCount} of {stageLessons.length} Completed</span>
                        <div className="w-16 h-1.5 rounded-full bg-[#E3E8E3] overflow-hidden">
                          <div 
                            className="h-full bg-[#176B52] rounded-full transition-all duration-300" 
                            style={{ width: `${(stageCompletedCount / Math.max(1, stageLessons.length)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lessons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stageLessons.map((lesson) => {
                        const isCompleted = progress.completedLessonIds.includes(lesson.id);
                        const score = progress.lessonScores[lesson.id];

                        return (
                          <div 
                            key={lesson.id}
                            onClick={() => handleOpenLesson(lesson)}
                            className="bg-white border border-[#E3E8E3] hover:border-[#176B52] p-5 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col justify-between group"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-[#687386]">
                                  Unit {lesson.order} · {lesson.durationMinutes} min
                                </span>
                                {isCompleted ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-[#176B52] bg-[#E8F3ED] px-2 py-0.5 rounded text-[11px]">
                                    <CheckCircle className="w-3 h-3" /> Mastered ({score}%)
                                  </span>
                                ) : (
                                  <span className="text-[#8E9BAE] text-[11px]">
                                    Not started
                                  </span>
                                )}
                              </div>

                              <div>
                                <h4 className="text-base font-bold text-[#17243A] group-hover:text-[#176B52] transition-colors">
                                  {lesson.title}
                                </h4>
                                <p className="text-xs text-[#687386] mt-1 line-clamp-2">
                                  {lesson.subtitle}
                                </p>
                              </div>

                              <div className="p-2.5 rounded-lg bg-[#F7F8F5] border border-[#ECEFEA] text-xs text-[#202B3C]">
                                <span className="font-semibold text-[#17243A]">Objective:</span> {lesson.objective}
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#ECEFEA] flex items-center justify-between text-xs">
                              <span className="text-[#687386]">
                                {lesson.essentialVocabulary.length} words · {lesson.exercises.length} practice tasks
                              </span>
                              <span className="text-[#176B52] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                Study Lesson →
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: SPACED REPETITION FLASHCARD REVIEW */}
        {activeView === 'srs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#E3E8E3] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#176B52]">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Spaced Repetition System</span>
                </div>
                <h2 className="text-2xl font-bold text-[#17243A] font-serif mt-1">Vocabulary Retention Deck</h2>
                <p className="text-xs text-[#687386] mt-0.5">
                  Powered by the SM-2 spaced repetition algorithm. Cards adapt based on your recall confidence.
                </p>
              </div>

              <button 
                onClick={() => setActiveView('curriculum')}
                className="text-xs font-semibold text-[#176B52] hover:text-[#125742] underline"
              >
                Back to Curriculum
              </button>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E3E8E3] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#176B52]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Targeted Error Recovery</span>
                </div>
                <h2 className="text-2xl font-bold text-[#17243A] font-serif mt-1">Mistakes Notebook</h2>
                <p className="text-xs text-[#687386] mt-0.5">
                  Review questions answered incorrectly during practice with complete grammatical explanations.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    const updated = { ...progress, mistakesNotebook: [] };
                    setProgress(updated);
                    progressService.save(updated);
                  }}
                  disabled={progress.mistakesNotebook.length === 0}
                  className="px-3 py-1.5 text-xs font-medium text-[#687386] hover:text-[#17243A] disabled:opacity-40 border border-[#E3E8E3] bg-white rounded-lg transition-colors"
                >
                  Clear Notebook
                </button>
                <button 
                  onClick={() => setActiveView('curriculum')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#176B52] hover:bg-[#125742] rounded-lg transition-colors"
                >
                  Return to Lessons
                </button>
              </div>
            </div>

            {progress.mistakesNotebook.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-[#E3E8E3] shadow-sm max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-[#E8F3ED] text-[#176B52] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#17243A]">No Mistakes Logged Yet!</h3>
                <p className="text-xs text-[#687386] mt-1 max-w-sm mx-auto">
                  Practice exercises and tests will log any challenging questions here automatically for review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {progress.mistakesNotebook.map((m) => (
                  <div key={m.id} className="p-5 rounded-xl bg-white border border-[#E3E8E3] shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#687386]">
                      <span className="font-semibold text-[#17243A]">Exercise Challenge</span>
                      <span>
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[#17243A]">
                      {m.prompt}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B]">
                        <span className="font-bold">Your answer:</span> {m.userAnswer}
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#E8F3ED] border border-[#C5DDD0] text-[#176B52]">
                        <span className="font-bold">Correct answer:</span> {m.correctAnswer}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F7F8F5] border border-[#ECEFEA] text-xs text-[#202B3C] leading-relaxed">
                      <strong className="text-[#17243A]">Grammar Rule:</strong> {m.explanation}
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
            <div className="border-b border-[#E3E8E3] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#176B52]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Interactive Educational Sandbox</span>
                </div>
                <h2 className="text-2xl font-bold text-[#17243A] font-serif mt-1">
                  Goethe B1 Practice Simulator & Grammar Sandbox
                </h2>
                <p className="text-xs text-[#687386] mt-0.5">
                  Rapid gender drill, inflection matrix tables, and official Goethe B1 grading band calculations.
                </p>
              </div>

              <button 
                onClick={() => setActiveView('curriculum')}
                className="text-xs font-semibold text-[#176B52] hover:text-[#125742] underline"
              >
                Back to Curriculum
              </button>
            </div>

            {/* Split Grid: Rapid Gender Drill & Case Inflection Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Rapid Gender Drill */}
              <div className="lg:col-span-6 bg-white border border-[#E3E8E3] rounded-2xl p-6 shadow-sm space-y-5">
                <div>
                  <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider block">
                    Interactive Drill
                  </span>
                  <h3 className="text-lg font-bold text-[#17243A] mt-0.5">
                    Noun Gender Training (der, die, das)
                  </h3>
                  <p className="text-xs text-[#687386] mt-1">
                    German grammatical gender determines article endings in Akkusativ and Dativ. Test your instinct:
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[#F7F8F5] border border-[#E3E8E3] text-center space-y-1">
                  <span className="text-xs text-[#687386]">Which definite article belongs to:</span>
                  <h4 className="text-3xl font-extrabold text-[#17243A] font-serif tracking-wide">
                    Kaffee
                  </h4>
                  <span className="text-xs text-[#687386] italic">meaning "coffee"</span>
                </div>

                {/* Inline feedback banner (No alert popup) */}
                {genderFeedback && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                    genderFeedback.isCorrect 
                      ? 'bg-[#E8F3ED] border border-[#C5DDD0] text-[#176B52]' 
                      : 'bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B]'
                  }`}>
                    {genderFeedback.message}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => {
                      handleSpeak('der Kaffee');
                      setGenderFeedback({
                        isCorrect: true,
                        message: 'Richtig! "der Kaffee" is masculine. In Akkusativ: "Ich trinke einen Kaffee."'
                      });
                    }}
                    className="py-3 px-2 rounded-xl bg-[#F0F4FA] hover:bg-[#E2EAF6] border border-[#CCDCEE] text-[#1E40AF] font-bold text-sm transition-all"
                  >
                    DER (Masc)
                  </button>

                  <button 
                    onClick={() => {
                      handleSpeak('der Kaffee');
                      setGenderFeedback({
                        isCorrect: false,
                        message: 'Falsch! Coffee is masculine in German: "der Kaffee".'
                      });
                    }}
                    className="py-3 px-2 rounded-xl bg-[#FDF2F2] hover:bg-[#FBE4E4] border border-[#F8C8C8] text-[#991B1B] font-bold text-sm transition-all"
                  >
                    DIE (Fem)
                  </button>

                  <button 
                    onClick={() => {
                      handleSpeak('der Kaffee');
                      setGenderFeedback({
                        isCorrect: false,
                        message: 'Falsch! Coffee is masculine in German: "der Kaffee".'
                      });
                    }}
                    className="py-3 px-2 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] font-bold text-sm transition-all"
                  >
                    DAS (Neut)
                  </button>
                </div>
              </div>

              {/* Case Inflection Reference */}
              <div className="lg:col-span-6 bg-white border border-[#E3E8E3] rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider block">
                    Core Grammar Reference
                  </span>
                  <h3 className="text-lg font-bold text-[#17243A] mt-0.5">
                    Definite & Indefinite Article Matrix
                  </h3>
                  <p className="text-xs text-[#687386] mt-1">
                    Notice how masculine singular is the only gender that changes form in the Akkusativ (der → den).
                  </p>
                </div>

                <div className="overflow-x-auto border border-[#E3E8E3] rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F7F8F5] border-b border-[#E3E8E3] text-[#687386] font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Case</th>
                        <th className="py-2.5 px-3 text-[#1E40AF]">Maskulin</th>
                        <th className="py-2.5 px-3 text-[#991B1B]">Feminin</th>
                        <th className="py-2.5 px-3 text-[#166534]">Neutral</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECEFEA] text-[#202B3C]">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#17243A]">Nominativ (Subject)</td>
                        <td className="py-2.5 px-3">der / ein</td>
                        <td className="py-2.5 px-3">die / eine</td>
                        <td className="py-2.5 px-3">das / ein</td>
                      </tr>
                      <tr className="bg-[#E8F3ED]/40">
                        <td className="py-2.5 px-3 font-semibold text-[#176B52]">Akkusativ (Direct Object)</td>
                        <td className="py-2.5 px-3 font-bold text-[#176B52]">den / einen ★</td>
                        <td className="py-2.5 px-3">die / eine</td>
                        <td className="py-2.5 px-3">das / ein</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-[#17243A]">Dativ (Indirect Object)</td>
                        <td className="py-2.5 px-3 text-[#687386]">dem / einem</td>
                        <td className="py-2.5 px-3 text-[#687386]">der / einer</td>
                        <td className="py-2.5 px-3 text-[#687386]">dem / einem</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 rounded-lg bg-[#F7F8F5] border border-[#ECEFEA] text-xs text-[#687386] leading-relaxed">
                  💡 <strong>Rule of Thumb:</strong> When ordering at a café: <em>"Ich möchte <strong>einen</strong> Kaffee (m), <strong>eine</strong> Cola (f), und <strong>ein</strong> Wasser (n)."</em>
                </div>
              </div>
            </div>

            {/* Goethe B1 Exam Simulator & Grade Band Calculator */}
            <div className="bg-white border border-[#E3E8E3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#176B52]">
                  <Award className="w-4 h-4" />
                  <span>Official Goethe-Zertifikat B1 Scoring Matrix</span>
                </div>
                <h3 className="text-xl font-bold text-[#17243A] font-serif mt-1">
                  B1 Modular Exam Score & Certificate Calculator
                </h3>
                <p className="text-xs text-[#687386] mt-0.5">
                  Each module (Lesen, Hören, Schreiben, Sprechen) is scored out of 100 points. A passing score requires $\ge 60$ points in each module.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Sliders */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#17243A] mb-1">
                      <span>Lesen (Reading Comprehension)</span>
                      <span className="font-mono text-[#176B52]">{examScores.lesen} / 100</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={examScores.lesen}
                      onChange={(e) => setExamScores({ ...examScores, lesen: Number(e.target.value) })}
                      className="w-full accent-[#176B52] h-2 bg-[#E3E8E3] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#17243A] mb-1">
                      <span>Hören (Listening Comprehension)</span>
                      <span className="font-mono text-[#176B52]">{examScores.hoeren} / 100</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={examScores.hoeren}
                      onChange={(e) => setExamScores({ ...examScores, hoeren: Number(e.target.value) })}
                      className="w-full accent-[#176B52] h-2 bg-[#E3E8E3] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#17243A] mb-1">
                      <span>Schreiben (Written Expression)</span>
                      <span className="font-mono text-[#176B52]">{examScores.schreiben} / 100</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={examScores.schreiben}
                      onChange={(e) => setExamScores({ ...examScores, schreiben: Number(e.target.value) })}
                      className="w-full accent-[#176B52] h-2 bg-[#E3E8E3] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#17243A] mb-1">
                      <span>Sprechen (Oral Expression & Partner Dialogue)</span>
                      <span className="font-mono text-[#176B52]">{examScores.sprechen} / 100</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={examScores.sprechen}
                      onChange={(e) => setExamScores({ ...examScores, sprechen: Number(e.target.value) })}
                      className="w-full accent-[#176B52] h-2 bg-[#E3E8E3] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Live Certificate Card */}
                <div className="lg:col-span-5 bg-[#F7F8F5] border border-[#E3E8E3] rounded-xl p-6 text-center space-y-3 shadow-inner">
                  <span className="text-[11px] font-semibold text-[#687386] uppercase tracking-wider block">
                    Calculated Overall Result
                  </span>
                  
                  <div className="text-4xl font-extrabold text-[#17243A] font-serif">
                    {totalExamScore} <span className="text-xl font-sans text-[#687386]">/ 100</span>
                  </div>

                  <div className={`text-base font-bold ${examResult.color}`}>
                    {examResult.label}
                  </div>

                  <p className="text-xs text-[#687386] leading-relaxed pt-2 border-t border-[#E3E8E3]">
                    {examResult.passed 
                      ? 'Congratulations! This score qualifies for the Goethe-Zertifikat B1 examination standard.'
                      : 'More practice needed: A minimum score of 60 in all four modules is required to pass Goethe B1.'}
                  </p>

                  <button
                    onClick={() => setActiveView('curriculum')}
                    className="w-full mt-2 py-2 px-4 rounded-lg bg-[#17243A] hover:bg-[#0F1726] text-white text-xs font-semibold transition-colors"
                  >
                    Practice Core Curriculum
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer - Minimal European Editorial Aesthetics */}
      <footer className="border-t border-[#E3E8E3] bg-[#FFFFFF] py-8 text-xs text-[#687386]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#17243A]">German Learner</span>
            <span>·</span>
            <span>CEFR-Aligned Practical Language Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[#687386]">
            <span>Spaced Repetition SM-2</span>
            <span>·</span>
            <span>Goethe & telc B1 Standard</span>
            <span>·</span>
            <span>Web Speech Pronunciation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
