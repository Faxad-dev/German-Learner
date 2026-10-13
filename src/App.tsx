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
  ChevronRight,
  AlertCircle,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';

interface GenderDrillWord {
  word: string;
  article: 'der' | 'die' | 'das';
  translation: string;
  ruleExplanation: string;
}

const GENDER_DRILL_POOL: GenderDrillWord[] = [
  { word: 'Kaffee', article: 'der', translation: 'coffee', ruleExplanation: 'Masculine. Drink: der Kaffee. In Akkusativ: "Ich trinke einen Kaffee."' },
  { word: 'Zeitung', article: 'die', translation: 'newspaper', ruleExplanation: 'Feminine. Nouns ending in "-ung" are virtually 100% feminine (die Zeitung, die Rechnung).' },
  { word: 'Mädchen', article: 'das', translation: 'girl', ruleExplanation: 'Neuter. Diminutive suffix "-chen" is always grammatically neuter (das Mädchen, das Brötchen).' },
  { word: 'Tisch', article: 'der', translation: 'table', ruleExplanation: 'Masculine. Everyday furniture: der Tisch, den Tisch (Akkusativ).' },
  { word: 'Freiheit', article: 'die', translation: 'freedom', ruleExplanation: 'Feminine. Nouns ending in "-heit" and "-keit" are always feminine (die Freiheit, die Möglichkeit).' },
  { word: 'Auto', article: 'das', translation: 'car', ruleExplanation: 'Neuter. Most motor vehicle and transport words: das Auto, das Fahrrad, das Flugzeug.' },
  { word: 'Universität', article: 'die', translation: 'university', ruleExplanation: 'Feminine. Latinate nouns ending in "-tät" are feminine (die Universität, die Qualität).' },
  { word: 'Museum', article: 'das', translation: 'museum', ruleExplanation: 'Neuter. Nouns ending in "-um" derived from Latin are neuter (das Museum, das Zentrum).' },
  { word: 'Schlüssel', article: 'der', translation: 'key', ruleExplanation: 'Masculine. Most agentive nouns and implements ending in "-el": der Schlüssel, der Löffel.' },
  { word: 'Bäckerei', article: 'die', translation: 'bakery', ruleExplanation: 'Feminine. Establishments ending in "-ei" are feminine (die Bäckerei, die Konditorei).' }
];

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
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Rapid Gender Drill state
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillScore, setDrillScore] = useState(0);
  const [drillAttempts, setDrillAttempts] = useState(0);
  const [genderFeedback, setGenderFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Mistakes practice inline state
  const [activeMistakePracticeId, setActiveMistakePracticeId] = useState<string | null>(null);
  const [mistakeUserAnswer, setMistakeUserAnswer] = useState('');
  const [mistakeFeedback, setMistakeFeedback] = useState<string | null>(null);

  // Goethe B1 Modular Exam Simulator state (4 independent modules: 0-100 pts)
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

  const handleScoreChange = (module: 'lesen' | 'hoeren' | 'schreiben' | 'sprechen', value: number) => {
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setExamScores(prev => ({ ...prev, [module]: clamped }));
  };

  // Next recommended lesson is the first non-completed lesson, or the first lesson
  const nextLesson = CURRICULUM_LESSONS.find(l => !progress.completedLessonIds.includes(l.id)) || CURRICULUM_LESSONS[0];

  // Current Gender Drill item
  const currentDrill = GENDER_DRILL_POOL[drillIndex % GENDER_DRILL_POOL.length];

  const handleGenderChoice = (choice: 'der' | 'die' | 'das') => {
    const isCorrect = choice === currentDrill.article;
    setDrillAttempts(prev => prev + 1);
    if (isCorrect) {
      setDrillScore(prev => prev + 1);
      audioService.speak(`${currentDrill.article} ${currentDrill.word}`);
      setGenderFeedback({
        isCorrect: true,
        message: `Richtig! "${currentDrill.article} ${currentDrill.word}". ${currentDrill.ruleExplanation}`
      });
    } else {
      audioService.speak(`${currentDrill.article} ${currentDrill.word}`);
      setGenderFeedback({
        isCorrect: false,
        message: `Nicht ganz! Das richtige Wort ist "${currentDrill.article} ${currentDrill.word}". ${currentDrill.ruleExplanation}`
      });
    }
  };

  const handleNextGenderWord = () => {
    setDrillIndex(prev => prev + 1);
    setGenderFeedback(null);
  };

  // Goethe B1 Modular Scoring Calculations (Strict adherence to Goethe-Institut regulations)
  const PASSING_THRESHOLD = 60;
  const modules = [
    { key: 'lesen', name: 'Lesen (Reading)', score: examScores.lesen },
    { key: 'hoeren', name: 'Hören (Listening)', score: examScores.hoeren },
    { key: 'schreiben', name: 'Schreiben (Writing)', score: examScores.schreiben },
    { key: 'sprechen', name: 'Sprechen (Speaking)', score: examScores.sprechen }
  ];

  const passedModules = modules.filter(m => m.score >= PASSING_THRESHOLD);
  const failedModules = modules.filter(m => m.score < PASSING_THRESHOLD);
  const isFullCertificateAwarded = failedModules.length === 0;

  const totalAverageScore = Math.round(
    (examScores.lesen + examScores.hoeren + examScores.schreiben + examScores.sprechen) / 4
  );

  const getGoetheGrade = (avg: number) => {
    if (avg >= 90) return { label: 'Sehr gut (1.0)', color: 'text-[#176B52]' };
    if (avg >= 80) return { label: 'Gut (2.0)', color: 'text-[#176B52]' };
    if (avg >= 70) return { label: 'Befriedigend (3.0)', color: 'text-[#17243A]' };
    if (avg >= 60) return { label: 'Ausreichend (4.0)', color: 'text-[#17243A]' };
    return { label: 'Nicht bestanden', color: 'text-[#B91C1C]' };
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#202B3C] flex flex-col font-sans">
      {/* Skip to Content for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#17243A] text-white rounded-lg text-xs font-semibold shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Header - Strict Top Bar Contract (3 zones separated by gap-8) */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E3E8E3] shadow-[0_1px_3px_rgba(23,36,58,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <button 
              onClick={() => { setActiveView('curriculum'); setSelectedLesson(null); }}
              className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-[#176B52] rounded-lg p-1 -ml-1 outline-none"
              aria-label="German Learner homepage"
            >
              <div className="w-8 h-8 rounded-lg bg-[#17243A] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
                DE
              </div>
              <div>
                <span className="font-bold text-[#17243A] text-base tracking-tight block leading-tight">
                  German Learner
                </span>
                <span className="text-[11px] text-[#687386] font-medium block leading-tight">
                  CEFR A1–B1 Platform
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main navigation">
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

          {/* Zone 3: Metric and primary action */}
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
                <span>Continue Unit {nextLesson.order}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#687386] hover:text-[#17243A] hover:bg-[#F0F3EF] rounded-lg focus-visible:ring-2 focus-visible:ring-[#176B52]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
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
      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
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
                      <span>B1 Modular Bridge</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#17243A] font-serif leading-[1.15] tracking-tight">
                      Learn practical German for everyday life.
                    </h1>

                    <p className="text-sm sm:text-base text-[#687386] leading-relaxed max-w-xl">
                      Build your German step by step with practical lessons, useful vocabulary, real-life conversations, and interactive exercises. Master essential greetings, order at cafés, navigate German cities, conquer the fundamental <strong>Verb in Position 2</strong> rule, and advance to complex <strong>weil/dass</strong> subordinate clauses.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Primary and Secondary CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => handleOpenLesson(nextLesson)}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-[#176B52] hover:bg-[#125742] rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#176B52]"
                      >
                        <span>Start Learning Unit {nextLesson.order}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => setActiveView('srs')}
                        className="px-4 py-2.5 text-sm font-medium text-[#17243A] bg-[#FFFFFF] hover:bg-[#F7F8F5] border border-[#E3E8E3] rounded-xl transition-all duration-200 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#17243A]"
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
                        <span><strong>{progress.srsCards.length}</strong> Cards in Retention Deck</span>
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
                        Authentic speech audio, sentence structure drills, and communicative dialogues.
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
                <span className="text-xs text-[#687386]">{CURRICULUM_STAGES.length} Structured Stages</span>
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
                            tabIndex={0}
                            role="button"
                            aria-label={`Lesson ${lesson.order}: ${lesson.title}. Duration: ${lesson.durationMinutes} minutes.`}
                            className="bg-white border border-[#E3E8E3] hover:border-[#176B52] focus-visible:ring-2 focus-visible:ring-[#176B52] p-5 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col justify-between group outline-none"
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
                  Powered by the SM-2 spaced repetition algorithm. Cards dynamically adapt based on your recall confidence.
                </p>
              </div>

              <button 
                onClick={() => setActiveView('curriculum')}
                className="text-xs font-semibold text-[#176B52] hover:text-[#125742] underline self-start sm:self-auto"
              >
                Back to Curriculum
              </button>
            </div>

            <FlashcardReview 
              cards={dueCards.length > 0 ? dueCards : progress.srsCards.slice(0, 15)}
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
                  Review questions answered incorrectly during practice with complete grammatical explanations, or retry them to clear errors.
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
                  Practice exercises and tests will log any challenging questions here automatically for targeted review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {progress.mistakesNotebook.map((m) => (
                  <div key={m.id} className="p-5 rounded-xl bg-white border border-[#E3E8E3] shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#687386]">
                      <span className="font-semibold text-[#17243A]">Exercise Challenge</span>
                      <div className="flex items-center gap-3">
                        <span>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => {
                            const updated = progressService.removeMistake(m.id);
                            setProgress(updated);
                          }}
                          className="text-[#991B1B] hover:underline text-[11px]"
                          title="Remove item"
                        >
                          Dismiss
                        </button>
                      </div>
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

                    {/* Inline Retry Mechanism */}
                    {activeMistakePracticeId === m.id ? (
                      <div className="p-3 rounded-xl bg-[#F0F3EF] border border-[#E3E8E3] space-y-2">
                        <label className="text-xs font-bold text-[#17243A] block">
                          Type the correct German answer to clear this mistake:
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={mistakeUserAnswer}
                            onChange={(e) => setMistakeUserAnswer(e.target.value)}
                            placeholder="Type correct answer..."
                            className="flex-1 p-2 rounded-lg bg-white border border-[#E3E8E3] text-xs font-mono"
                          />
                          <button
                            onClick={() => {
                              const cleanUser = mistakeUserAnswer.trim().toLowerCase().replace(/[.,!?;:]/g, '');
                              const cleanTarget = String(m.correctAnswer).trim().toLowerCase().replace(/[.,!?;:]/g, '');
                              if (cleanUser === cleanTarget) {
                                const updated = progressService.removeMistake(m.id);
                                setProgress(updated);
                                setActiveMistakePracticeId(null);
                                setMistakeFeedback(null);
                                setMistakeUserAnswer('');
                              } else {
                                setMistakeFeedback('Try again! Compare closely with the correct answer above.');
                              }
                            }}
                            className="px-4 py-2 bg-[#176B52] text-white rounded-lg text-xs font-semibold"
                          >
                            Check & Resolve
                          </button>
                        </div>
                        {mistakeFeedback && (
                          <p className="text-xs text-[#991B1B] font-medium">{mistakeFeedback}</p>
                        )}
                      </div>
                    ) : (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => {
                            setActiveMistakePracticeId(m.id);
                            setMistakeUserAnswer('');
                            setMistakeFeedback(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#F0F3EF] hover:bg-[#E2E8E0] text-[#17243A] text-xs font-semibold border border-[#E3E8E3] transition-colors"
                        >
                          Retry Question
                        </button>
                      </div>
                    )}
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
                  Rapid gender drill, inflection matrix tables, and official Goethe B1 modular certificate rules.
                </p>
              </div>

              <button 
                onClick={() => setActiveView('curriculum')}
                className="text-xs font-semibold text-[#176B52] hover:text-[#125742] underline self-start sm:self-auto"
              >
                Back to Curriculum
              </button>
            </div>

            {/* Split Grid: Rapid Gender Drill & Case Inflection Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Dynamic Rapid Gender Drill */}
              <div className="lg:col-span-6 bg-white border border-[#E3E8E3] rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider block">
                      Interactive Drill
                    </span>
                    <h3 className="text-lg font-bold text-[#17243A] mt-0.5">
                      Noun Gender Training (der, die, das)
                    </h3>
                  </div>
                  <div className="text-xs font-mono bg-[#E8F3ED] text-[#176B52] px-2.5 py-1 rounded-md font-semibold">
                    Score: {drillScore} / {drillAttempts}
                  </div>
                </div>

                <p className="text-xs text-[#687386]">
                  German grammatical gender determines article endings in Akkusativ and Dativ. Test your instinct on common nouns:
                </p>

                <div className="p-6 rounded-xl bg-[#F7F8F5] border border-[#E3E8E3] text-center space-y-1 relative">
                  <span className="text-xs text-[#687386]">Which definite article belongs to:</span>
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="text-3xl font-extrabold text-[#17243A] font-serif tracking-wide">
                      {currentDrill.word}
                    </h4>
                    <button
                      onClick={() => handleSpeak(currentDrill.word)}
                      className="p-1.5 text-[#687386] hover:text-[#176B52]"
                      title="Listen"
                      aria-label={`Listen to ${currentDrill.word}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-[#687386] italic">meaning "{currentDrill.translation}"</span>
                </div>

                {/* Inline feedback banner */}
                {genderFeedback && (
                  <div className={`p-3.5 rounded-lg text-xs leading-relaxed space-y-2 ${
                    genderFeedback.isCorrect 
                      ? 'bg-[#E8F3ED] border border-[#C5DDD0] text-[#176B52]' 
                      : 'bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B]'
                  }`} aria-live="polite">
                    <div>{genderFeedback.message}</div>
                    <button
                      onClick={handleNextGenderWord}
                      className="px-3 py-1.5 rounded-md bg-white text-[#17243A] border border-[#CCD4CB] font-semibold text-xs shadow-sm hover:bg-[#F7F8F5]"
                    >
                      Next Word →
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleGenderChoice('der')}
                    className="py-3 px-2 rounded-xl bg-[#F0F4FA] hover:bg-[#E2EAF6] border border-[#CCDCEE] text-[#1E40AF] font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-[#1E40AF]"
                  >
                    DER (Masc)
                  </button>

                  <button 
                    onClick={() => handleGenderChoice('die')}
                    className="py-3 px-2 rounded-xl bg-[#FDF2F2] hover:bg-[#FBE4E4] border border-[#F8C8C8] text-[#991B1B] font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-[#991B1B]"
                  >
                    DIE (Fem)
                  </button>

                  <button 
                    onClick={() => handleGenderChoice('das')}
                    className="py-3 px-2 rounded-xl bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-[#166534]"
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

            {/* Official Goethe B1 Modular Exam Simulator & Grade Band Calculator */}
            <div className="bg-white border border-[#E3E8E3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#176B52]">
                    <Award className="w-4 h-4" />
                    <span>Official Goethe-Zertifikat B1 Scoring Matrix</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#17243A] font-serif mt-1">
                    Goethe-Zertifikat B1 Modular Simulator
                  </h3>
                  <p className="text-xs text-[#687386] mt-0.5">
                    Official regulation: 4 autonomous modules (Lesen, Hören, Schreiben, Sprechen) evaluated out of 100 points each.
                  </p>
                </div>

                {/* Preset Testing Buttons */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#687386] font-medium">Test Presets:</span>
                  <button
                    onClick={() => setExamScores({ lesen: 75, hoeren: 59, schreiben: 75, sprechen: 75 })}
                    className="px-2.5 py-1 rounded bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] font-medium transition-colors"
                    title="Test boundary: 59 in Hören fails the module despite high average"
                  >
                    Boundary 59 (Fail)
                  </button>
                  <button
                    onClick={() => setExamScores({ lesen: 60, hoeren: 60, schreiben: 60, sprechen: 60 })}
                    className="px-2.5 py-1 rounded bg-[#F0F3EF] hover:bg-[#E3E8E3] text-[#17243A] border border-[#CCD4CB] font-medium transition-colors"
                    title="All exactly 60"
                  >
                    Boundary 60 (Pass)
                  </button>
                  <button
                    onClick={() => setExamScores({ lesen: 92, hoeren: 95, schreiben: 90, sprechen: 94 })}
                    className="px-2.5 py-1 rounded bg-[#E8F3ED] hover:bg-[#D5EADB] text-[#176B52] border border-[#C5DDD0] font-medium transition-colors"
                  >
                    Honors (92+)
                  </button>
                </div>
              </div>

              {/* Regulatory Notice Banner */}
              <div className="p-4 rounded-xl bg-[#F0F4FA] border border-[#BFDBFE] text-xs text-[#1E3A8A] flex items-start gap-3">
                <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-[#1E40AF]">
                    Official Goethe-Institut B1 Modular Rule:
                  </p>
                  <p className="text-[#1E3A8A] leading-relaxed">
                    A candidate passes a module ONLY if they score <strong>≥ 60 points</strong> (60%). A high overall average <strong>cannot compensate</strong> for a failed module. Candidates receive modular certificates for passed sections, and can retake individual failed modules within one year.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Sliders and Direct Numeric Inputs */}
                <div className="lg:col-span-7 space-y-5">
                  {modules.map((m) => {
                    const isModulePassed = m.score >= PASSING_THRESHOLD;
                    return (
                      <div key={m.key} className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E3E8E3] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#17243A]">{m.name}</span>
                            {isModulePassed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3ED] text-[#176B52] border border-[#C5DDD0]">
                                <Check className="w-3 h-3" /> Bestanden (≥60)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]">
                                <AlertCircle className="w-3 h-3" /> Nicht bestanden ({60 - m.score} pkt short)
                              </span>
                            )}
                          </div>

                          {/* Direct Numeric Input with Clamping */}
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={m.score}
                              onChange={(e) => handleScoreChange(m.key as any, parseInt(e.target.value, 10))}
                              className="w-16 p-1 text-center font-mono text-xs font-bold text-[#17243A] bg-white border border-[#CCD4CB] rounded-md focus:outline-none focus:border-[#176B52]"
                            />
                            <span className="font-mono text-[#687386]">/ 100</span>
                          </div>
                        </div>

                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={m.score}
                          onChange={(e) => handleScoreChange(m.key as any, Number(e.target.value))}
                          className="w-full accent-[#176B52] h-2 bg-[#E3E8E3] rounded-lg cursor-pointer"
                          aria-label={`Score slider for ${m.name}`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Certificate Assessment Card */}
                <div className="lg:col-span-5 bg-[#F7F8F5] border border-[#E3E8E3] rounded-xl p-6 text-center space-y-4 shadow-inner">
                  <span className="text-[11px] font-semibold text-[#687386] uppercase tracking-wider block">
                    Goethe-Zertifikat B1 Assessment
                  </span>
                  
                  {/* Status Banner */}
                  {isFullCertificateAwarded ? (
                    <div className="p-4 rounded-xl bg-[#E8F3ED] border border-[#C5DDD0] space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white text-[#176B52] flex items-center justify-center mx-auto shadow-sm">
                        <Award className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-[#176B52] font-serif">
                        Gesamtzertifikat B1 Erteilt
                      </h4>
                      <p className="text-xs text-[#176B52]">
                        All 4 autonomous modules passed successfully (≥ 60 points each).
                      </p>
                      <div className="pt-2 text-2xl font-extrabold text-[#17243A]">
                        {totalAverageScore} <span className="text-sm font-normal text-[#687386]">/ 100 Schnitt</span>
                      </div>
                      <div className={`text-sm font-bold ${getGoetheGrade(totalAverageScore).color}`}>
                        Gesamtnote: {getGoetheGrade(totalAverageScore).label}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-2">
                      <div className="w-10 h-10 rounded-full bg-white text-[#991B1B] flex items-center justify-center mx-auto shadow-sm">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-[#991B1B] font-serif">
                        Teilzertifikat (Modulbescheinigung)
                      </h4>
                      <p className="text-xs text-[#991B1B] leading-relaxed">
                        {passedModules.length} of 4 modules passed. Full certificate cannot be issued because <strong>{failedModules.map(f => f.name.split(' ')[0]).join(', ')}</strong> scored below 60 points.
                      </p>
                      <div className="text-xs text-[#7F1D1D] bg-white p-2.5 rounded-lg border border-[#FCA5A5] text-left mt-2">
                        <strong>Action Needed:</strong> Retake {failedModules.map(f => f.name.split(' ')[0]).join(', ')} within 1 year to complete the full certificate.
                      </div>
                    </div>
                  )}

                  {/* Modular Summary Breakdown */}
                  <div className="text-left text-xs space-y-1.5 pt-2 border-t border-[#E3E8E3]">
                    <span className="font-semibold text-[#17243A] block">Module Status:</span>
                    {modules.map(m => (
                      <div key={m.key} className="flex justify-between items-center text-[#687386]">
                        <span>{m.name.split(' ')[0]}</span>
                        <span className={`font-mono font-bold ${m.score >= 60 ? 'text-[#176B52]' : 'text-[#991B1B]'}`}>
                          {m.score} pts ({m.score >= 60 ? 'Pass' : 'Retake'})
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-[#8E9BAE] italic leading-relaxed pt-1">
                    * This is an educational estimation tool based on official Goethe B1 exam regulations. It does not replace an official examination taken at a certified test center.
                  </p>
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
            <span>CEFR A1–B1 Practical Language Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[#687386]">
            <span>Spaced Repetition SM-2</span>
            <span>·</span>
            <span>Goethe B1 Modular Rules</span>
            <span>·</span>
            <span>Web Speech API (de-DE)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
