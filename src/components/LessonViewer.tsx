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
  Sparkles
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
        text: `🎉 Richtig! Excellent! ${currentExercise.explanation}`
      });
    } else {
      setExerciseFeedback({
        isCorrect: false,
        text: `❌ Nicht ganz! ${currentExercise.explanation}`
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
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div>
          <button 
            onClick={onBack}
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 mb-1 transition-colors"
          >
            ← Back to Curriculum
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-orange-950 text-orange-400 border border-orange-800">
              {lesson.level}
            </span>
            <h2 className="text-xl font-bold text-white font-serif">{lesson.title}</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">{lesson.subtitle} • ~{lesson.durationMinutes} min</p>
        </div>

        {/* Lesson Sub-Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-black/60 rounded-lg border border-neutral-800">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'overview' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('vocabulary')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'vocabulary' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Vocabulary ({lesson.essentialVocabulary.length})
          </button>
          <button 
            onClick={() => setActiveTab('grammar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'grammar' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Grammar
          </button>
          <button 
            onClick={() => setActiveTab('dialogue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'dialogue' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Dialogue
          </button>
          <button 
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'practice' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Practice ({lesson.exercises.length})
          </button>
          <button 
            onClick={() => setActiveTab('mission')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'mission' ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Mission 🎯
          </button>
        </div>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-400">Lesson Objective</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-3">What you will be able to do:</h3>
              <div className="p-4 rounded-lg bg-black/40 border border-neutral-800 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                  {lesson.objective}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white mb-2">Key Competencies in this unit:</h4>
                <ul className="space-y-2">
                  {lesson.summaryTakeaways.map((item, idx) => (
                    <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setActiveTab('vocabulary')}
                className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg transition-all"
              >
                Start Vocabulary Words <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">CEFR {lesson.level} Roadmap</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Every unit gives you practical verbal agility and listening comprehension.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. ESSENTIAL VOCABULARY */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Essential Lesson Vocabulary</h3>
              <p className="text-xs text-neutral-400">Click any card or the speaker icon to hear authentic German pronunciation.</p>
            </div>
            <button 
              onClick={() => setActiveTab('grammar')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            >
              Continue to Grammar →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson.essentialVocabulary.map((v) => (
              <div 
                key={v.id}
                onClick={() => handleSpeak(v.german + '. ' + v.exampleDe)}
                className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    {v.gender && (
                      <span className={`inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase mb-1 ${
                        v.gender === 'der' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                        v.gender === 'die' ? 'bg-red-950 text-red-400 border border-red-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {v.gender}
                      </span>
                    )}
                    <h4 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {v.german}
                    </h4>
                    <span className="text-xs text-neutral-400 font-mono">/{v.phonetic}/</span>
                  </div>
                  <button 
                    onClick={(e) => handleSpeak(v.german, e)}
                    className="p-2 rounded-full bg-neutral-800 group-hover:bg-orange-600 text-neutral-300 group-hover:text-white transition-all"
                    title="Listen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 text-xs text-neutral-300 font-medium">
                  {v.english}
                </div>

                <div className="mt-2 p-2 rounded bg-black/40 border border-neutral-800/80 text-[11px] text-neutral-400">
                  <div className="text-white font-medium italic">"{v.exampleDe}"</div>
                  <div className="text-neutral-500">{v.exampleEn}</div>
                </div>

                {v.notes && (
                  <div className="mt-2 text-[10px] text-yellow-400/90 font-mono flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 shrink-0" />
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
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-mono uppercase mb-1">
              <BookOpen className="w-4 h-4" /> Grammar in Action
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{lesson.grammarInContext.title}</h3>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
              {lesson.grammarInContext.explanation}
            </p>

            {/* Examples Grid */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">Model Sentences:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lesson.grammarInContext.examples.map((ex, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSpeak(ex.de)}
                    className="p-3.5 rounded-lg bg-black/40 border border-neutral-800 hover:border-orange-500/40 cursor-pointer flex items-start justify-between group transition-all"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
                        {ex.de}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">{ex.en}</div>
                    </div>
                    <Volume2 className="w-4 h-4 text-neutral-500 group-hover:text-white shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistake Callout */}
            <div className="mt-6 p-4 rounded-xl bg-red-950/20 border border-red-900/40">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase mb-2">
                <AlertTriangle className="w-4 h-4" /> Common Beginner Mistake:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-black/50 text-red-400 font-mono">
                  ❌ Falsch: {lesson.grammarInContext.commonMistake.wrong}
                </div>
                <div className="p-2 rounded bg-black/50 text-emerald-400 font-mono">
                  ✓ Richtig: {lesson.grammarInContext.commonMistake.right}
                </div>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                <strong>Why:</strong> {lesson.grammarInContext.commonMistake.reason}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setActiveTab('dialogue')}
                className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold flex items-center gap-2 transition-all"
              >
                Listen to Practical Dialogue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. REALISTIC DIALOGUE */}
      {activeTab === 'dialogue' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4 pb-3 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2 text-orange-400 text-xs font-mono uppercase">
                  <MessageSquare className="w-4 h-4" /> Level Dialogue
                </div>
                <h3 className="text-xl font-bold text-white mt-0.5">{lesson.dialogue.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">{lesson.dialogue.context}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const fullText = lesson.dialogue.lines.map(l => `${l.speaker}: ${l.de}`).join('. ');
                    audioService.speak(fullText);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Play Full Dialogue
                </button>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-3 my-6">
              {lesson.dialogue.lines.map((line, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSpeak(line.de)}
                  className="p-3.5 rounded-lg bg-black/40 border border-neutral-800 hover:border-neutral-700 cursor-pointer flex items-start gap-3 transition-colors group"
                >
                  <div className="w-24 shrink-0">
                    <span className="text-xs font-bold text-orange-400 block">{line.speaker}</span>
                    <span className="text-[10px] text-neutral-500 block">({line.role})</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-neutral-100 font-medium group-hover:text-orange-300 transition-colors">
                      {line.de}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">{line.en}</div>
                  </div>
                  <Volume2 className="w-4 h-4 text-neutral-500 group-hover:text-white shrink-0 mt-0.5" />
                </div>
              ))}
            </div>

            {/* Dialogue Comprehension Question */}
            <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-900/40">
              <h4 className="text-xs font-bold font-mono text-orange-400 uppercase mb-1">
                Comprehension Check:
              </h4>
              <p className="text-sm font-semibold text-white mb-3">
                {lesson.dialogue.comprehensionQuestion.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lesson.dialogue.comprehensionQuestion.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      if (i === lesson.dialogue.comprehensionQuestion.correctIndex) {
                        alert(`🎉 Richtig! ${lesson.dialogue.comprehensionQuestion.explanation}`);
                      } else {
                        alert(`❌ Not quite! ${lesson.dialogue.comprehensionQuestion.explanation}`);
                      }
                    }}
                    className="p-2.5 rounded-lg text-left text-xs bg-black/60 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setActiveTab('practice')}
                className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold flex items-center gap-2 transition-all"
              >
                Go to Guided Practice <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. GUIDED PRACTICE */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
            {!practiceCompleted ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-6">
                  <span className="text-xs font-mono text-neutral-400">
                    Exercise {currentExIndex + 1} of {lesson.exercises.length}
                  </span>
                  <span className="text-xs font-mono text-orange-400 font-bold">
                    Score: {correctAnswersCount} / {lesson.exercises.length}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">{currentExercise.prompt}</h3>
                  {currentExercise.audioText && (
                    <div className="my-3">
                      <button 
                        onClick={() => handleSpeak(currentExercise.audioText!)}
                        className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" /> Play German Audio
                      </button>
                    </div>
                  )}
                </div>

                {/* Question Types */}
                {currentExercise.type === 'word_scramble' ? (
                  <div className="space-y-4">
                    <p className="text-xs text-neutral-400">Type or arrange the correct German sentence:</p>
                    <input 
                      type="text"
                      value={typeof userSelectedOption === 'string' ? userSelectedOption : ''}
                      onChange={(e) => handleSelectOption(e.target.value)}
                      placeholder="Type German sentence here..."
                      disabled={isAnswerSubmitted}
                      className="w-full p-3 rounded-lg bg-black/60 border border-neutral-700 text-white text-sm focus:outline-none focus:border-orange-500 font-mono"
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
                          className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono border border-neutral-700"
                        >
                          + {w}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentExercise.options?.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3.5 rounded-lg text-left text-sm transition-all border ${
                          userSelectedOption === idx 
                            ? 'bg-orange-950/40 border-orange-500 text-white font-semibold' 
                            : 'bg-black/40 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-neutral-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Feedback Box */}
                {exerciseFeedback && (
                  <div className={`mt-6 p-4 rounded-xl border ${
                    exerciseFeedback.isCorrect 
                      ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' 
                      : 'bg-red-950/20 border-red-900/50 text-red-300'
                  }`}>
                    <p className="text-xs leading-relaxed font-medium">{exerciseFeedback.text}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                  {!isAnswerSubmitted ? (
                    <button 
                      onClick={handleSubmitAnswer}
                      disabled={userSelectedOption === null}
                      className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold transition-all"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <button 
                      onClick={handleNextExercise}
                      className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2 transition-all"
                    >
                      {currentExIndex + 1 < lesson.exercises.length ? 'Next Question →' : 'Complete Practice'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <Award className="w-16 h-16 text-yellow-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white font-serif">Practice Completed!</h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto">
                  You scored <strong className="text-orange-400">{correctAnswersCount} / {lesson.exercises.length}</strong> ({Math.round((correctAnswersCount / lesson.exercises.length) * 100)}%).
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
                    className="px-4 py-2 rounded-lg bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white"
                  >
                    Retry Exercises
                  </button>
                  <button 
                    onClick={() => setActiveTab('mission')}
                    className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-xs font-semibold text-white"
                  >
                    Take Real-Life Mission 🎯
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. REAL-LIFE MISSION */}
      {activeTab === 'mission' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-mono uppercase mb-1">
              <Award className="w-4 h-4" /> Real-Life Communication Mission
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{lesson.realLifeMission.scenario}</h3>
            <p className="text-sm text-neutral-300 mb-6">
              <strong>Your Task:</strong> {lesson.realLifeMission.task}
            </p>

            <div className="p-4 rounded-xl bg-black/40 border border-neutral-800 mb-6">
              <h4 className="text-xs font-mono uppercase text-neutral-400 mb-2">Key German Phrases to Use:</h4>
              <div className="flex flex-wrap gap-2">
                {lesson.realLifeMission.keyPhrases.map((phrase, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSpeak(phrase)}
                    className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1 border border-neutral-700 transition-colors"
                  >
                    <Volume2 className="w-3 h-3 text-orange-400" /> {phrase}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-neutral-300 block">
                Type or speak your German response:
              </label>
              <textarea 
                rows={3}
                value={missionAnswer}
                onChange={(e) => setMissionAnswer(e.target.value)}
                placeholder="Write your German response here..."
                className="w-full p-3 rounded-lg bg-black/60 border border-neutral-700 text-white text-sm focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button 
                onClick={() => setShowMissionModel(!showMissionModel)}
                className="text-xs text-orange-400 hover:underline"
              >
                {showMissionModel ? 'Hide Model Answer' : '💡 Reveal Model Answer'}
              </button>

              <button 
                onClick={handleFinishLesson}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-lg"
              >
                Complete Unit & Save Mastery <CheckCircle className="w-4 h-4" />
              </button>
            </div>

            {showMissionModel && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold block mb-1">
                  Model German Response:
                </span>
                <p className="text-sm font-bold text-white font-mono">
                  "{lesson.realLifeMission.modelAnswer}"
                </p>
                <button 
                  onClick={() => handleSpeak(lesson.realLifeMission.modelAnswer)}
                  className="mt-2 text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen to pronunciation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
