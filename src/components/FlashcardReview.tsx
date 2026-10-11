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
      <div className="p-8 text-center rounded-xl bg-neutral-900 border border-neutral-800">
        <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Queue is All Caught Up!</h3>
        <p className="text-xs text-neutral-400 mb-6">
          You have reviewed all due vocabulary items. Check back tomorrow or learn new units to expand your deck!
        </p>
        <button 
          onClick={onFinish}
          className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
        <span>Card {currentIndex + 1} of {sessionCards.length}</span>
        <span>Interval: {currentCard.interval} days</span>
      </div>

      {/* Flashcard Body */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[280px] p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 cursor-pointer transition-all flex flex-col justify-between text-center shadow-xl"
      >
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
            {currentCard.level} • {currentCard.article ? `${currentCard.article.toUpperCase()}` : 'Vocabulary'}
          </span>
          <button 
            onClick={(e) => handleSpeak(currentCard.word, e)}
            className="p-2 rounded-full bg-neutral-800 hover:bg-orange-600 text-neutral-300 hover:text-white transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="py-6">
          <h2 className="text-3xl font-extrabold text-white font-serif mb-2">
            {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
          </h2>
          {currentCard.plural && (
            <span className="text-xs text-neutral-400 font-mono">Plural: {currentCard.plural}</span>
          )}

          {isFlipped ? (
            <div className="mt-4 pt-4 border-t border-neutral-800 animate-fadeIn">
              <p className="text-lg font-bold text-orange-400">{currentCard.meaning}</p>
              <div className="mt-3 text-xs text-neutral-300 italic">
                "{currentCard.exampleDe}"
              </div>
              <div className="text-[11px] text-neutral-500">
                {currentCard.exampleEn}
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 mt-4">Tap to reveal English meaning & sentence</p>
          )}
        </div>

        <div className="text-[11px] text-neutral-500">
          {isFlipped ? 'Rate your recall memory below' : 'Click card to flip'}
        </div>
      </div>

      {/* Rating Buttons */}
      {isFlipped ? (
        <div className="grid grid-cols-4 gap-2">
          <button 
            onClick={() => handleGrade(1)}
            className="p-3 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-800 text-xs font-semibold text-red-200 transition-colors"
          >
            Forgot (1)
          </button>
          <button 
            onClick={() => handleGrade(3)}
            className="p-3 rounded-lg bg-yellow-950/40 hover:bg-yellow-900 border border-yellow-800 text-xs font-semibold text-yellow-200 transition-colors"
          >
            Hard (3)
          </button>
          <button 
            onClick={() => handleGrade(4)}
            className="p-3 rounded-lg bg-blue-950/40 hover:bg-blue-900 border border-blue-800 text-xs font-semibold text-blue-200 transition-colors"
          >
            Good (4)
          </button>
          <button 
            onClick={() => handleGrade(5)}
            className="p-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900 border border-emerald-800 text-xs font-semibold text-emerald-200 transition-colors"
          >
            Easy (5)
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsFlipped(true)}
          className="w-full py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
        >
          Show Answer
        </button>
      )}
    </div>
  );
};
