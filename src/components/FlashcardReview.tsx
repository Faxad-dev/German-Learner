import React, { useState } from 'react';
import { Flashcard } from '../types/curriculum';
import { progressService } from '../services/progressService';
import { audioService } from '../services/audioService';
import { Volume2, RotateCcw, Check, Sparkles } from 'lucide-react';

interface FlashcardReviewProps {
  cards: Flashcard[];
  onFinish: () => void;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({ cards, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>(cards);

  const currentCard = sessionCards[currentIndex];

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioService.speak(text);
  };

  const handleGrade = (grade: 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard) return;
    progressService.reviewCard(currentCard.id, grade);

    setIsFlipped(false);
    if (currentIndex + 1 < sessionCards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  if (!currentCard) {
    return (
      <div className="max-w-xl mx-auto p-8 sm:p-12 text-center rounded-2xl bg-white border border-[#E3E8E3] shadow-sm space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#E8F3ED] text-[#176B52] flex items-center justify-center mx-auto">
          <Sparkles className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-[#17243A] font-serif">Queue is All Caught Up!</h3>
        <p className="text-xs sm:text-sm text-[#687386] max-w-sm mx-auto leading-relaxed">
          You have reviewed all scheduled vocabulary items. Continue learning new curriculum units to expand your retention deck.
        </p>
        <div className="pt-2">
          <button 
            onClick={onFinish}
            className="px-6 py-2.5 rounded-xl bg-[#176B52] hover:bg-[#125742] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Return to Curriculum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between text-xs text-[#687386]">
        <span className="font-semibold text-[#17243A]">
          Card {currentIndex + 1} of {sessionCards.length}
        </span>
        <div className="flex items-center gap-2">
          <span>Interval: {currentCard.interval} days</span>
          <div className="w-20 h-1.5 rounded-full bg-[#E3E8E3] overflow-hidden">
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
        className="min-h-[300px] p-8 rounded-2xl bg-white border border-[#E3E8E3] hover:border-[#176B52] cursor-pointer transition-all duration-200 flex flex-col justify-between text-center shadow-[0_4px_16px_rgba(23,36,58,0.04)] group"
      >
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-[#F0F3EF] text-[#687386]">
            {currentCard.level} · {currentCard.article ? currentCard.article.toUpperCase() : 'Vocabulary'}
          </span>
          <button 
            onClick={(e) => handleSpeak(currentCard.word, e)}
            className="p-2 rounded-full bg-[#F0F3EF] group-hover:bg-[#E8F3ED] text-[#687386] group-hover:text-[#176B52] transition-colors"
            title="Listen"
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
            <div className="mt-4 pt-4 border-t border-[#ECEFEA] space-y-2 animate-fadeIn">
              <p className="text-xl font-bold text-[#176B52] font-serif">
                {currentCard.meaning}
              </p>
              <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#ECEFEA] text-xs">
                <div className="text-[#17243A] font-semibold italic">"{currentCard.exampleDe}"</div>
                <div className="text-[#687386] mt-0.5">{currentCard.exampleEn}</div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8E9BAE] pt-4">
              Click anywhere on this card to reveal English meaning & example
            </p>
          )}
        </div>

        <div className="text-[11px] text-[#8E9BAE]">
          {isFlipped ? 'Rate your recall memory below' : 'Tap to flip'}
        </div>
      </div>

      {/* Rating Buttons */}
      {isFlipped ? (
        <div className="space-y-2">
          <span className="text-xs text-[#687386] block text-center font-medium">
            How well did you remember this word?
          </span>
          <div className="grid grid-cols-4 gap-2">
            <button 
              onClick={() => handleGrade(1)}
              className="p-3 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-xs font-semibold text-[#991B1B] transition-colors text-center"
            >
              <span className="block font-bold">Again</span>
              <span className="text-[10px] text-[#B91C1C]/80 block font-normal">&lt; 10 min</span>
            </button>
            <button 
              onClick={() => handleGrade(3)}
              className="p-3 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-xs font-semibold text-[#92400E] transition-colors text-center"
            >
              <span className="block font-bold">Hard</span>
              <span className="text-[10px] text-[#B45309]/80 block font-normal">1 day</span>
            </button>
            <button 
              onClick={() => handleGrade(4)}
              className="p-3 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-xs font-semibold text-[#1D4ED8] transition-colors text-center"
            >
              <span className="block font-bold">Good</span>
              <span className="text-[10px] text-[#2563EB]/80 block font-normal">3 days</span>
            </button>
            <button 
              onClick={() => handleGrade(5)}
              className="p-3 rounded-xl bg-[#E8F3ED] hover:bg-[#D5EADB] border border-[#C5DDD0] text-xs font-semibold text-[#176B52] transition-colors text-center"
            >
              <span className="block font-bold">Easy</span>
              <span className="text-[10px] text-[#176B52]/80 block font-normal">7 days</span>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsFlipped(true)}
          className="w-full py-3.5 rounded-xl bg-[#17243A] hover:bg-[#0F1726] text-white text-xs font-semibold transition-colors shadow-sm"
        >
          Reveal Meaning & Answer
        </button>
      )}
    </div>
  );
};
