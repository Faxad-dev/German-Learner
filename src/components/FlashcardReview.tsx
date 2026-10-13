import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard } from '../types/curriculum';
import { progressService } from '../services/progressService';
import { audioService } from '../services/audioService';
import { Volume2, RotateCcw, Check, Sparkles, ArrowRight, Gauge } from 'lucide-react';

interface FlashcardReviewProps {
  cards: Flashcard[];
  onFinish: () => void;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({ cards, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCards] = useState<Flashcard[]>(cards);
  const [sessionStats, setSessionStats] = useState<{ reviewedCount: number; passedCount: number; failedCount: number }>({
    reviewedCount: 0,
    passedCount: 0,
    failedCount: 0
  });
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(() => audioService.getRate());

  const currentCard = sessionCards[currentIndex];

  const handleSpeak = useCallback((text: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    audioService.speak(text, audioSpeed);
  }, [audioSpeed]);

  const toggleSpeed = () => {
    const nextSpeed = audioSpeed >= 1.0 ? 0.75 : audioSpeed === 0.75 ? 0.9 : 1.0;
    setAudioSpeed(nextSpeed);
    audioService.setRate(nextSpeed);
  };

  const handleGrade = useCallback((grade: 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard) return;
    progressService.reviewCard(currentCard.id, grade);

    const isPass = grade >= 3;
    setSessionStats(prev => ({
      reviewedCount: prev.reviewedCount + 1,
      passedCount: prev.passedCount + (isPass ? 1 : 0),
      failedCount: prev.failedCount + (isPass ? 0 : 1)
    }));

    setIsFlipped(false);
    if (currentIndex + 1 < sessionCards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsSessionComplete(true);
    }
  }, [currentCard, currentIndex, sessionCards.length]);

  // Keyboard accessibility listeners (Space/Enter to flip, 1-4 to grade, V to listen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key.toLowerCase() === 'v' && currentCard) {
        e.preventDefault();
        handleSpeak(currentCard.word);
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleGrade(1);
        } else if (e.key === '2') {
          e.preventDefault();
          handleGrade(3);
        } else if (e.key === '3') {
          e.preventDefault();
          handleGrade(4);
        } else if (e.key === '4') {
          e.preventDefault();
          handleGrade(5);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentCard, handleGrade, handleSpeak]);

  // If session finished, show summary
  if (isSessionComplete || !currentCard) {
    return (
      <div className="max-w-xl mx-auto p-8 sm:p-10 text-center rounded-2xl bg-white border border-[#E3E8E3] shadow-sm space-y-5 animate-fadeIn">
        <div className="w-14 h-14 rounded-full bg-[#E8F3ED] text-[#176B52] flex items-center justify-center mx-auto">
          <Sparkles className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#176B52] uppercase tracking-wider block">
            Session Completed
          </span>
          <h3 className="text-2xl font-bold text-[#17243A] font-serif mt-1">
            Retention Queue Up to Date!
          </h3>
          <p className="text-xs sm:text-sm text-[#687386] max-w-sm mx-auto leading-relaxed mt-1">
            You reviewed <strong>{sessionStats.reviewedCount} cards</strong> with the SM-2 Spaced Repetition algorithm.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs">
          <div className="p-3 rounded-xl bg-[#E8F3ED] border border-[#C5DDD0] text-[#176B52]">
            <span className="block text-xl font-bold font-serif">{sessionStats.passedCount}</span>
            <span className="font-semibold">Recalled (Good/Easy)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]">
            <span className="block text-xl font-bold font-serif">{sessionStats.failedCount}</span>
            <span className="font-semibold">Repeating Soon</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
              setIsSessionComplete(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E3E8E3] hover:bg-[#F7F8F5] text-[#17243A] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#687386]" />
            <span>Practice Deck Again</span>
          </button>

          <button 
            onClick={onFinish}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#176B52] hover:bg-[#125742] text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Return to Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between text-xs text-[#687386]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#17243A]">
            Card {currentIndex + 1} of {sessionCards.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>Next Interval: {currentCard.interval} {currentCard.interval === 1 ? 'day' : 'days'}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio speed pill */}
          <button
            onClick={toggleSpeed}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F0F3EF] hover:bg-[#E3E8E3] text-[11px] font-mono text-[#17243A] transition-colors"
            title="Toggle speech pace"
            aria-label={`Speech rate: ${audioSpeed}x. Click to change.`}
          >
            <Gauge className="w-3 h-3 text-[#687386]" />
            <span>{audioSpeed}x</span>
          </button>

          <div className="w-20 h-1.5 rounded-full bg-[#E3E8E3] overflow-hidden" aria-label="Progress bar">
            <div 
              className="h-full bg-[#176B52] rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / sessionCards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Flashcard Body */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
        aria-label={`Flashcard: ${currentCard.word}. Press Space or Enter to reveal definition.`}
        className="min-h-[300px] p-8 rounded-2xl bg-white border border-[#E3E8E3] hover:border-[#176B52] focus-visible:ring-2 focus-visible:ring-[#176B52] cursor-pointer transition-all duration-200 flex flex-col justify-between text-center shadow-[0_4px_16px_rgba(23,36,58,0.04)] group select-none outline-none"
      >
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#F0F3EF] text-[#687386]">
            {currentCard.level} · {currentCard.article ? currentCard.article.toUpperCase() : 'Vocabulary'}
          </span>
          <button 
            onClick={(e) => handleSpeak(currentCard.word, e)}
            className="p-2 rounded-full bg-[#F0F3EF] group-hover:bg-[#E8F3ED] text-[#687386] group-hover:text-[#176B52] transition-colors focus-visible:ring-2 focus-visible:ring-[#176B52]"
            title="Listen to pronunciation (Hotkey: V)"
            aria-label={`Listen to pronunciation of ${currentCard.word}`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="py-6 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17243A] font-serif tracking-tight">
            {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
          </h2>
          
          {currentCard.plural && (
            <div className="text-xs text-[#687386] font-mono">
              Plural: {currentCard.plural}
            </div>
          )}

          {isFlipped ? (
            <div className="mt-4 pt-4 border-t border-[#ECEFEA] space-y-2 animate-fadeIn" aria-live="polite">
              <p className="text-xl font-bold text-[#176B52] font-serif">
                {currentCard.meaning}
              </p>
              <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#ECEFEA] text-xs text-left">
                <div className="text-[#17243A] font-semibold italic flex items-center justify-between">
                  <span>"{currentCard.exampleDe}"</span>
                  <button 
                    onClick={(e) => handleSpeak(currentCard.exampleDe, e)}
                    className="p-1 text-[#687386] hover:text-[#176B52]"
                    title="Listen to example"
                    aria-label="Listen to example sentence"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[#687386] mt-0.5">{currentCard.exampleEn}</div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8E9BAE] pt-4">
              Click anywhere or press <strong>Space</strong> to reveal English translation & example
            </p>
          )}
        </div>

        <div className="text-[11px] text-[#8E9BAE]">
          {isFlipped ? 'Rate your recall confidence below (Keys 1–4)' : 'Tap or Space to flip'}
        </div>
      </div>

      {/* Rating Buttons */}
      {isFlipped ? (
        <div className="space-y-2" aria-live="polite">
          <span className="text-xs text-[#687386] block text-center font-medium">
            How well did you remember this word?
          </span>
          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => handleGrade(1)}
              className="p-3 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-xs font-semibold text-[#991B1B] transition-colors text-center focus-visible:ring-2 focus-visible:ring-[#991B1B]"
              title="Forgot completely (Key 1)"
            >
              <span className="block font-bold">Again (1)</span>
              <span className="text-[10px] text-[#B91C1C]/80 block font-normal">&lt; 10 min</span>
            </button>
            <button 
              onClick={() => handleGrade(3)}
              className="p-3 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#92400E] transition-colors text-center focus-visible:ring-2 focus-visible:ring-[#92400E]"
              title="Remembered with difficulty (Key 2)"
            >
              <span className="block font-bold">Hard (2)</span>
              <span className="text-[10px] text-[#B45309]/80 block font-normal">1 day</span>
            </button>
            <button 
              onClick={() => handleGrade(4)}
              className="p-3 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-xs font-semibold text-[#1D4ED8] transition-colors text-center focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              title="Good recall (Key 3)"
            >
              <span className="block font-bold">Good (3)</span>
              <span className="text-[10px] text-[#2563EB]/80 block font-normal">3 days</span>
            </button>
            <button 
              onClick={() => handleGrade(5)}
              className="p-3 rounded-xl bg-[#E8F3ED] hover:bg-[#D5EADB] border border-[#C5DDD0] text-xs font-semibold text-[#176B52] transition-colors text-center focus-visible:ring-2 focus-visible:ring-[#176B52]"
              title="Perfect recall (Key 4)"
            >
              <span className="block font-bold">Easy (4)</span>
              <span className="text-[10px] text-[#176B52]/80 block font-normal">7 days</span>
            </button>
          </div>
          <p className="text-[11px] text-[#8E9BAE] text-center pt-1">
            Keyboard shortcuts: <strong>Space</strong> (Flip) · <strong>1–4</strong> (Rate) · <strong>V</strong> (Audio)
          </p>
        </div>
      ) : (
        <button 
          onClick={() => setIsFlipped(true)}
          className="w-full py-3.5 rounded-xl bg-[#17243A] hover:bg-[#0F1726] text-white text-xs font-semibold transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#17243A]"
        >
          Reveal Meaning & Answer (Space)
        </button>
      )}
    </div>
  );
};
