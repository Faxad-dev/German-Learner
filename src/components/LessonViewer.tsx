import React, { useState } from 'react';
import { Lesson, Exercise } from '../types/curriculum';
import { audioService } from '../services/audioService';
import { progressService } from '../services/progressService';
import { 
  Volume2, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Lightbulb, 
  AlertTriangle, 
  BookOpen, 
  MessageSquare, 
  Award,
  Sparkles,
  ChevronLeft,
  RotateCcw
} from 'lucide-react';

interface LessonViewerProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (score: number) => void;
}

type TabType = 'overview' | 'vocabulary' | 'grammar' | 'dialogue' | 'practice' | 'mission';

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onBack, onComplete }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Exercise practice state
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [exerciseFeedback, setExerciseFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  
  // Dialogue comprehension state
  const [dialogueAnswerSelected, setDialogueAnswerSelected] = useState<number | null>(null);
  const [dialogueFeedback, setDialogueFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Mission state
  const [missionAnswer, setMissionAnswer] = useState('');
  const [showMissionModel, setShowMissionModel] = useState(false);

  // Audio helper
  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioService.speak(text);
  };

  const currentExercise = lesson.exercises[currentExIndex];

  const handleSelectOption = (idx: number | string) => {
    if (isAnswerSubmitted) return;
    setUserSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (userSelectedOption === null || isAnswerSubmitted) return;
    
    let isCorrect = false;
    if (currentExercise.type === 'word_scramble') {
      const trimmedUser = String(userSelectedOption).trim().toLowerCase();
      isCorrect = currentExercise.acceptableAnswers?.some(a => a.toLowerCase() === trimmedUser) 
        || String(currentExercise.correctAnswer).toLowerCase() === trimmedUser;
    } else {
      isCorrect = userSelectedOption === currentExercise.correctAnswer;
    }

    setIsAnswerSubmitted(true);
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      setExerciseFeedback({
        isCorrect: true,
        text: `Richtig! Ausgezeichnet. ${currentExercise.explanation}`
      });
    } else {
      setExerciseFeedback({
        isCorrect: false,
        text: `Nicht ganz. ${currentExercise.explanation}`
      });
      // Record into Mistake Notebook
      progressService.recordMistake(
        lesson.id,
        currentExercise.prompt,
        String(userSelectedOption),
        String(currentExercise.correctAnswer),
        currentExercise.explanation
      );
    }
  };

  const handleNextExercise = () => {
    if (currentExIndex + 1 < lesson.exercises.length) {
      setCurrentExIndex(prev => prev + 1);
      setUserSelectedOption(null);
      setIsAnswerSubmitted(false);
      setExerciseFeedback(null);
    } else {
      setPracticeCompleted(true);
    }
  };

  const handleFinishLesson = () => {
    const totalScore = Math.round((correctAnswersCount / Math.max(1, lesson.exercises.length)) * 100);
    progressService.completeLesson(lesson.id, totalScore);
    onComplete(totalScore);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Navigation */}
      <div className="bg-white border border-[#E3E8E3] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(23,36,58,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={onBack}
            className="text-xs font-semibold text-[#176B52] hover:text-[#125742] flex items-center gap-1 mb-2 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Curriculum
          </button>
          
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-[#E8F3ED] text-[#176B52] border border-[#C5DDD0]">
              {lesson.level}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17243A] font-serif tracking-tight">
              Unit {lesson.order}: {lesson.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#687386] mt-1">
            {lesson.subtitle} · Estimated duration: {lesson.durationMinutes} minutes
          </p>
        </div>

        {/* Clean Segmented Sub-Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#F0F3EF] rounded-xl border border-[#E3E8E3] self-start md:self-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-white text-[#176B52] shadow-sm' 
                : 'text-[#687386] hover:text-[#17243A]'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('vocabulary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'vocabulary' 
                ? 'bg-white text-[#176B52] shadow-sm' 
                : 'text-[#687386] hover:text-[#17243A]'
            }`}
          >
            Vocabulary ({lesson.essentialVocabulary.length})
          </button>
          <button 
            onClick={() => setActiveTab('grammar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'grammar' 
                ? 'bg-white text-[#176B52] shadow-sm' 
                : 'text-[#687386] hover:text-[#17243A]'
            }`}
          >
            Grammar
          </button>
          <button 
            onClick={() => setActiveTab('dialogue')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'dialogue' 
                ? 'bg-white text-[#176B52] shadow-sm' 
                : 'text-[#687386] hover:text-[#17243A]'
            }`}
          >
            Dialogue
          </button>
          <button 
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'practice' 
                ? 'bg-white text-[#176B52] shadow-sm' 
                : 'text-[#687386] hover:text-[#17243A]'
            }`}
          >
            Practice ({lesson.exercises.length})
          </button>
          <button 
            onClick={() => setActiveTab('mission')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'mission' 
                ? 'bg-white text-[#176B52] shadow-sm' 
                : 'text-[#687386] hover:text-[#17243A]'
            }`}
          >
            Mission
          </button>
        </div>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-[#E3E8E3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider block">
                Communicative Objective
              </span>
              <h3 className="text-xl font-bold text-[#17243A] font-serif mt-1">
                What you will be able to do in German:
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-[#E8F3ED] border border-[#C5DDD0] flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#176B52] shrink-0 mt-0.5" />
              <p className="text-sm text-[#17243A] leading-relaxed font-medium">
                {lesson.objective}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#17243A]">Key Learning Outcomes in this Unit:</h4>
              <ul className="space-y-2">
                {lesson.summaryTakeaways.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-[#687386] flex items-start gap-2.5">
                    <span className="text-[#176B52] font-bold text-base leading-none">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#ECEFEA] flex justify-end">
              <button 
                onClick={() => setActiveTab('vocabulary')}
                className="px-5 py-2.5 rounded-xl bg-[#176B52] hover:bg-[#125742] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <span>Study Vocabulary ({lesson.essentialVocabulary.length} Words)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-[#E3E8E3] rounded-2xl p-6 shadow-sm text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F3ED] text-[#176B52] flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#17243A]">CEFR {lesson.level} Roadmap</h4>
              <p className="text-xs text-[#687386] leading-relaxed">
                Every unit targets active communication: accurate listening, natural speech rhythm, and structured sentence construction.
              </p>
            </div>

            <div className="bg-[#F7F8F5] border border-[#E3E8E3] rounded-2xl p-5 space-y-3">
              <h5 className="text-xs font-bold text-[#17243A] uppercase tracking-wider">Lesson Sequence</h5>
              <div className="space-y-2 text-xs text-[#687386]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E3E8E3] text-[#17243A] font-semibold flex items-center justify-center text-[10px]">1</span>
                  <span>Vocabulary with Audio</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E3E8E3] text-[#17243A] font-semibold flex items-center justify-center text-[10px]">2</span>
                  <span>Grammar in Context</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E3E8E3] text-[#17243A] font-semibold flex items-center justify-center text-[10px]">3</span>
                  <span>Realistic Audio Dialogue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E3E8E3] text-[#17243A] font-semibold flex items-center justify-center text-[10px]">4</span>
                  <span>Guided Practice Exercises</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E3E8E3] text-[#17243A] font-semibold flex items-center justify-center text-[10px]">5</span>
                  <span>Real-Life Communication Mission</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. ESSENTIAL VOCABULARY */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E3E8E3] rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#17243A]">Essential Unit Vocabulary</h3>
              <p className="text-xs text-[#687386]">Click any word card or speaker button to hear authentic German pronunciation.</p>
            </div>
            <button 
              onClick={() => setActiveTab('grammar')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#17243A] hover:bg-[#0F1726] text-white transition-colors whitespace-nowrap"
            >
              Continue to Grammar →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson.essentialVocabulary.map((v) => (
              <div 
                key={v.id}
                onClick={() => handleSpeak(v.german + '. ' + v.exampleDe)}
                className="bg-white border border-[#E3E8E3] hover:border-[#176B52] p-5 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      {v.gender && (
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1.5 ${
                          v.gender === 'der' ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]' :
                          v.gender === 'die' ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]' :
                          'bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]'
                        }`}>
                          {v.gender}
                        </span>
                      )}
                      <h4 className="text-lg font-bold text-[#17243A] group-hover:text-[#176B52] transition-colors">
                        {v.german}
                      </h4>
                      <span className="text-xs text-[#8E9BAE] font-mono">/{v.phonetic}/</span>
                    </div>

                    <button 
                      onClick={(e) => handleSpeak(v.german, e)}
                      className="p-2 rounded-full bg-[#F0F3EF] group-hover:bg-[#E8F3ED] text-[#687386] group-hover:text-[#176B52] transition-colors"
                      title="Listen"
                      aria-label={`Listen to pronunciation of ${v.german}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 text-sm text-[#202B3C] font-semibold">
                    {v.english}
                  </div>

                  <div className="mt-2 p-2.5 rounded-lg bg-[#F7F8F5] border border-[#ECEFEA] text-xs">
                    <div className="text-[#17243A] font-medium italic">"{v.exampleDe}"</div>
                    <div className="text-[#687386] mt-0.5">{v.exampleEn}</div>
                  </div>
                </div>

                {v.notes && (
                  <div className="mt-3 pt-2 border-t border-[#ECEFEA] text-[11px] text-[#B45309] flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>{v.notes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. GRAMMAR IN CONTEXT */}
      {activeTab === 'grammar' && (
        <div className="bg-white border border-[#E3E8E3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[#176B52] text-xs font-semibold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" /> Grammar in Context
            </div>
            <h3 className="text-2xl font-bold text-[#17243A] font-serif">{lesson.grammarInContext.title}</h3>
            <p className="text-sm text-[#687386] leading-relaxed max-w-3xl mt-2">
              {lesson.grammarInContext.explanation}
            </p>
          </div>

          {/* Model Sentences Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17243A]">Model Sentences:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lesson.grammarInContext.examples.map((ex, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSpeak(ex.de)}
                  className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E3E8E3] hover:border-[#176B52] cursor-pointer flex items-start justify-between group transition-all duration-200"
                >
                  <div>
                    <div className="text-sm font-bold text-[#17243A] group-hover:text-[#176B52] transition-colors">
                      {ex.de}
                    </div>
                    <div className="text-xs text-[#687386] mt-1">{ex.en}</div>
                  </div>
                  <Volume2 className="w-4 h-4 text-[#8E9BAE] group-hover:text-[#176B52] shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistake Callout */}
          <div className="p-5 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] space-y-3">
            <div className="flex items-center gap-2 text-[#991B1B] text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" /> Common Beginner Mistake:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white border border-[#FECACA] text-[#991B1B]">
                ❌ Falsch: {lesson.grammarInContext.commonMistake.wrong}
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#BBF7D0] text-[#15803D]">
                ✓ Richtig: {lesson.grammarInContext.commonMistake.right}
              </div>
            </div>
            <p className="text-xs text-[#7F1D1D] leading-relaxed">
              <strong>Why this happens:</strong> {lesson.grammarInContext.commonMistake.reason}
            </p>
          </div>

          <div className="pt-4 border-t border-[#ECEFEA] flex justify-end">
            <button 
              onClick={() => setActiveTab('dialogue')}
              className="px-5 py-2.5 rounded-xl bg-[#176B52] hover:bg-[#125742] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Listen to Realistic Dialogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. REALISTIC DIALOGUE */}
      {activeTab === 'dialogue' && (
        <div className="bg-white border border-[#E3E8E3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECEFEA]">
            <div>
              <div className="flex items-center gap-2 text-[#176B52] text-xs font-semibold uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" /> Everyday Dialogue
              </div>
              <h3 className="text-2xl font-bold text-[#17243A] font-serif mt-1">{lesson.dialogue.title}</h3>
              <p className="text-xs text-[#687386] mt-0.5">{lesson.dialogue.context}</p>
            </div>

            <button 
              onClick={() => {
                const fullText = lesson.dialogue.lines.map(l => `${l.speaker}: ${l.de}`).join('. ');
                audioService.speak(fullText);
              }}
              className="px-4 py-2 rounded-lg bg-[#17243A] hover:bg-[#0F1726] text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-sm"
            >
              <Volume2 className="w-4 h-4" /> Play Entire Dialogue
            </button>
          </div>

          {/* Conversation Flow */}
          <div className="space-y-3">
            {lesson.dialogue.lines.map((line, idx) => (
              <div 
                key={idx}
                onClick={() => handleSpeak(line.de)}
                className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E3E8E3] hover:border-[#176B52] cursor-pointer flex items-start gap-4 transition-colors group"
              >
                <div className="w-24 shrink-0">
                  <span className="text-xs font-bold text-[#17243A] block">{line.speaker}</span>
                  <span className="text-[10px] text-[#8E9BAE] block">({line.role})</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#17243A] font-semibold group-hover:text-[#176B52] transition-colors">
                    {line.de}
                  </div>
                  <div className="text-xs text-[#687386] mt-1">{line.en}</div>
                </div>
                <Volume2 className="w-4 h-4 text-[#8E9BAE] group-hover:text-[#176B52] shrink-0 mt-1" />
              </div>
            ))}
          </div>

          {/* Dialogue Comprehension Question (Inline feedback without alert) */}
          <div className="p-5 rounded-xl bg-[#F0F3EF] border border-[#E3E8E3] space-y-3">
            <h4 className="text-xs font-bold text-[#176B52] uppercase tracking-wider">
              Dialogue Comprehension Check:
            </h4>
            <p className="text-sm font-bold text-[#17243A]">
              {lesson.dialogue.comprehensionQuestion.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lesson.dialogue.comprehensionQuestion.options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setDialogueAnswerSelected(i);
                    const isCorr = i === lesson.dialogue.comprehensionQuestion.correctIndex;
                    setDialogueFeedback({
                      isCorrect: isCorr,
                      text: isCorr 
                        ? `Richtig! ${lesson.dialogue.comprehensionQuestion.explanation}`
                        : `Nicht ganz. ${lesson.dialogue.comprehensionQuestion.explanation}`
                    });
                  }}
                  className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                    dialogueAnswerSelected === i
                      ? 'bg-white border-[#176B52] text-[#17243A] shadow-sm font-semibold'
                      : 'bg-white border-[#E3E8E3] text-[#202B3C] hover:border-[#CCD4CB]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {dialogueFeedback && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                dialogueFeedback.isCorrect 
                  ? 'bg-[#E8F3ED] border border-[#C5DDD0] text-[#176B52]' 
                  : 'bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B]'
              }`}>
                {dialogueFeedback.text}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#ECEFEA] flex justify-end">
            <button 
              onClick={() => setActiveTab('practice')}
              className="px-5 py-2.5 rounded-xl bg-[#176B52] hover:bg-[#125742] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Go to Guided Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. GUIDED PRACTICE */}
      {activeTab === 'practice' && (
        <div className="bg-white border border-[#E3E8E3] rounded-2xl p-6 sm:p-8 shadow-sm">
          {!practiceCompleted ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#ECEFEA]">
                <span className="text-xs font-semibold text-[#687386]">
                  Exercise {currentExIndex + 1} of {lesson.exercises.length}
                </span>
                <span className="text-xs font-semibold text-[#176B52] bg-[#E8F3ED] px-2.5 py-0.5 rounded">
                  Score: {correctAnswersCount} / {lesson.exercises.length}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#17243A] leading-snug">
                  {currentExercise.prompt}
                </h3>
                {currentExercise.audioText && (
                  <div className="mt-3">
                    <button 
                      onClick={() => handleSpeak(currentExercise.audioText!)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#E8F3ED] hover:bg-[#D5EADB] text-[#176B52] text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" /> Listen to Audio
                    </button>
                  </div>
                )}
              </div>

              {/* Question Types */}
              {currentExercise.type === 'word_scramble' ? (
                <div className="space-y-3">
                  <p className="text-xs text-[#687386]">Click words or type the complete German sentence:</p>
                  <input 
                    type="text"
                    value={typeof userSelectedOption === 'string' ? userSelectedOption : ''}
                    onChange={(e) => handleSelectOption(e.target.value)}
                    placeholder="Type German sentence here..."
                    disabled={isAnswerSubmitted}
                    className="w-full p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E3E8E3] text-[#17243A] text-sm focus:outline-none focus:border-[#176B52] font-mono"
                  />
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.options?.map((w, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          const cur = typeof userSelectedOption === 'string' ? userSelectedOption : '';
                          handleSelectOption(cur ? `${cur} ${w}` : w);
                        }}
                        disabled={isAnswerSubmitted}
                        className="px-3 py-1.5 rounded-lg bg-[#F0F3EF] hover:bg-[#E2E8E0] text-[#17243A] text-xs font-medium border border-[#E3E8E3] transition-colors"
                      >
                        + {w}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {currentExercise.options?.map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-xl text-left text-sm transition-all border ${
                        userSelectedOption === idx 
                          ? 'bg-[#E8F3ED] border-[#176B52] text-[#17243A] font-semibold shadow-sm' 
                          : 'bg-white border-[#E3E8E3] text-[#202B3C] hover:border-[#CCD4CB]'
                      }`}
                    >
                      <span className="font-mono text-[#8E9BAE] mr-2.5 font-bold">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Feedback Box */}
              {exerciseFeedback && (
                <div className={`p-4 rounded-xl border leading-relaxed text-xs font-medium ${
                  exerciseFeedback.isCorrect 
                    ? 'bg-[#E8F3ED] border-[#C5DDD0] text-[#176B52]' 
                    : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                }`}>
                  {exerciseFeedback.text}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                {!isAnswerSubmitted ? (
                  <button 
                    onClick={handleSubmitAnswer}
                    disabled={userSelectedOption === null}
                    className="px-6 py-2.5 rounded-xl bg-[#176B52] hover:bg-[#125742] disabled:opacity-40 text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button 
                    onClick={handleNextExercise}
                    className="px-6 py-2.5 rounded-xl bg-[#17243A] hover:bg-[#0F1726] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                  >
                    <span>{currentExIndex + 1 < lesson.exercises.length ? 'Next Question' : 'Complete Practice'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-[#E8F3ED] text-[#176B52] flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#17243A] font-serif">Practice Completed!</h3>
              <p className="text-sm text-[#687386]">
                You scored <strong className="text-[#176B52]">{correctAnswersCount} / {lesson.exercises.length}</strong> ({Math.round((correctAnswersCount / lesson.exercises.length) * 100)}%).
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button 
                  onClick={() => {
                    setCurrentExIndex(0);
                    setUserSelectedOption(null);
                    setIsAnswerSubmitted(false);
                    setExerciseFeedback(null);
                    setCorrectAnswersCount(0);
                    setPracticeCompleted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-white border border-[#E3E8E3] text-xs font-semibold text-[#17243A] hover:bg-[#F7F8F5]"
                >
                  Retry Exercises
                </button>
                <button 
                  onClick={() => setActiveTab('mission')}
                  className="px-5 py-2 rounded-lg bg-[#176B52] hover:bg-[#125742] text-xs font-semibold text-white shadow-sm"
                >
                  Take Real-Life Mission →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 6. REAL-LIFE MISSION */}
      {activeTab === 'mission' && (
        <div className="bg-white border border-[#E3E8E3] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[#176B52] text-xs font-semibold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" /> Everyday Communication Mission
            </div>
            <h3 className="text-2xl font-bold text-[#17243A] font-serif">{lesson.realLifeMission.scenario}</h3>
            <p className="text-sm text-[#687386] mt-2 leading-relaxed">
              <strong>Your Challenge:</strong> {lesson.realLifeMission.task}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E3E8E3] space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#17243A]">Recommended German Phrases:</h4>
            <div className="flex flex-wrap gap-2">
              {lesson.realLifeMission.keyPhrases.map((phrase, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSpeak(phrase)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#E8F3ED] text-[#17243A] hover:text-[#176B52] text-xs font-medium flex items-center gap-1.5 border border-[#E3E8E3] transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#176B52]" /> {phrase}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#17243A] block">
              Type or speak your German response:
            </label>
            <textarea 
              rows={3}
              value={missionAnswer}
              onChange={(e) => setMissionAnswer(e.target.value)}
              placeholder="e.g. Hallo, ich möchte einen Kaffee und ein Wasser bitte..."
              className="w-full p-3.5 rounded-xl bg-[#F7F8F5] border border-[#E3E8E3] text-[#17243A] text-sm focus:outline-none focus:border-[#176B52]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button 
              onClick={() => setShowMissionModel(!showMissionModel)}
              className="text-xs font-semibold text-[#176B52] hover:text-[#125742] underline"
            >
              {showMissionModel ? 'Hide Model Answer' : '💡 Reveal Authentic Model Response'}
            </button>

            <button 
              onClick={handleFinishLesson}
              className="px-6 py-2.5 rounded-xl bg-[#176B52] hover:bg-[#125742] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Complete Unit & Save Mastery</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>

          {showMissionModel && (
            <div className="p-4 rounded-xl bg-[#E8F3ED] border border-[#C5DDD0] space-y-2 animate-fadeIn">
              <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider block">
                Model German Response:
              </span>
              <p className="text-sm font-bold text-[#17243A] font-serif">
                "{lesson.realLifeMission.modelAnswer}"
              </p>
              <button 
                onClick={() => handleSpeak(lesson.realLifeMission.modelAnswer)}
                className="text-xs font-semibold text-[#176B52] hover:text-[#125742] flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen to authentic pronunciation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
