import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertOctagon, RotateCcw, ArrowRight, Volume2, Navigation, Languages } from 'lucide-react';
import { ChoicePoint, ChoiceOption } from '../types/story';
import { soundFx, speechService } from '../services/audioService';
import { MinaAvatar } from './MinaAvatar';
import { PrepositionDiagram } from './PrepositionDiagram';

interface ChoicePointScreenProps {
  choice: ChoicePoint;
  choiceIndex: number;
  totalChoices: number;
  audioRate: number;
  onChoiceResult: (choiceId: number, isFirstTryCorrect: boolean, attempts: number, deadEndVisited: boolean, selectedOptionId: string) => void;
  onContinue: () => void;
}

export const ChoicePointScreen: React.FC<ChoicePointScreenProps> = ({
  choice,
  choiceIndex,
  totalChoices,
  audioRate,
  onChoiceResult,
  onContinue,
}) => {
  const [selectedOption, setSelectedOption] = useState<ChoiceOption | null>(null);
  const [showDeadEndModal, setShowDeadEndModal] = useState(false);
  const [showPathOpenAnimation, setShowPathOpenAnimation] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [firstTryStatus, setFirstTryStatus] = useState<boolean | null>(null);
  const [deadEndVisited, setDeadEndVisited] = useState(false);
  const [showKorean, setShowKorean] = useState(false);

  // Auto-read prompt on mount
  useEffect(() => {
    setSelectedOption(null);
    setShowDeadEndModal(false);
    setShowPathOpenAnimation(false);
    setAttempts(0);
    setFirstTryStatus(null);
    setDeadEndVisited(false);

    speechService.speak(`${choice.title}. ${choice.situationPrompt}`, {
      rate: audioRate,
    });

    return () => {
      speechService.stop();
    };
  }, [choice.id, choice.title, choice.situationPrompt, audioRate]);

  // Handle choice selection
  const handleSelectOption = (option: ChoiceOption) => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setSelectedOption(option);

    if (option.isCorrect) {
      // Correct choice!
      const isFirstTry = nextAttempts === 1;
      if (firstTryStatus === null) {
        setFirstTryStatus(isFirstTry);
      }
      soundFx.playPathOpen();
      soundFx.playCorrect();
      setShowPathOpenAnimation(true);

      onChoiceResult(choice.id, isFirstTry, nextAttempts, deadEndVisited, option.id);

      speechService.speak(`Path unlocked! ${choice.pathOpeningStory}`, {
        rate: audioRate,
      });
    } else {
      // Wrong choice -> Dead End
      setDeadEndVisited(true);
      if (firstTryStatus === null) {
        setFirstTryStatus(false);
      }
      soundFx.playDeadEnd();
      setShowDeadEndModal(true);

      speechService.speak(`Dead End! ${option.deadEndExplanation}`, {
        rate: audioRate,
      });
    }
  };

  const handleReadOption = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speechService.speak(text, { rate: audioRate });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-5 bg-gradient-to-b from-indigo-100/60 via-stone-100 to-indigo-50 overflow-hidden select-none relative">
      {/* ================= 3D PHYSICAL BOOK SPREAD CONTAINER ================= */}
      <div
        key={choice.id}
        className="w-full max-w-6xl h-full max-h-[820px] bg-white rounded-3xl shadow-2xl border-4 border-indigo-900/20 flex flex-col md:flex-row overflow-hidden relative animate-page-flip"
      >
        {/* Book Spine Center Crease / Shadow */}
        <div className="hidden md:block absolute left-[60%] top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 via-black/5 to-transparent z-30 pointer-events-none" />

        {/* ================= LEFT 60%: SITUATION PICTURE ================= */}
        <div className="w-full md:w-[60%] relative bg-slate-900 flex items-center justify-center overflow-hidden min-h-[320px] md:min-h-full">
          <img
            src={choice.bgImage}
            alt={choice.title}
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />

          {/* Choice Point badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
            <span className="bg-indigo-950/90 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30 shadow-md flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-indigo-300" />
              <span>Choice {choiceIndex + 1} / {totalChoices}</span>
            </span>
            <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
              Fork in the Road
            </span>
          </div>

          {/* Path Opening Visual Effect */}
          {showPathOpenAnimation && (
            <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 z-40 animate-fadeIn">
              <div className="bg-white/95 rounded-3xl p-6 md:p-8 max-w-md shadow-2xl border-4 border-emerald-400 flex flex-col items-center animate-scaleUp">
                <div className="mb-2">
                  <MinaAvatar mood="excited" size="lg" />
                </div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Path Unlocked! (길이 열렸어요!)
                </span>
                <h3 className="font-display text-2xl font-black text-slate-900 mt-2 mb-1">
                  Great Reading!
                </h3>
                <p className="text-slate-700 text-sm font-bold leading-relaxed mb-1">
                  {choice.pathOpeningStory}
                </p>
                {showKorean && choice.pathOpeningStoryKo && (
                  <p className="text-xs text-emerald-800 font-bold mb-4">
                    {choice.pathOpeningStoryKo}
                  </p>
                )}
                <button
                  onClick={onContinue}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-display font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue Adventure ▶</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT 40%: CHOICES & DECISION ================= */}
        <div className="w-full md:w-[40%] bg-gradient-to-b from-indigo-50/40 via-white to-indigo-50/20 p-5 md:p-7 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Situation Header with Korean toggle & Mina Avatar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 inline-block">
                  Decision Point
                </span>
                <button
                  onClick={() => setShowKorean(!showKorean)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border ${
                    showKorean
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                  title="Toggle Korean translation"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{showKorean ? '한국어 ON' : '한국어 보기'}</span>
                </button>
              </div>

              {/* Mina Thinking Avatar with Prompt Speech Bubble */}
              <div className="flex items-start gap-3 my-2">
                <div className="flex flex-col items-center shrink-0">
                  <MinaAvatar mood="thinking" size="md" />
                  <span className="text-[11px] font-black text-indigo-950 mt-1">Mina</span>
                </div>
                <div className="flex-1 bg-white p-3.5 rounded-2xl rounded-tl-xs border-2 border-indigo-200 shadow-2xs">
                  <h2 className="font-display text-base md:text-lg font-black text-slate-900 leading-snug">
                    {choice.situationPrompt}
                  </h2>
                  {showKorean && choice.situationPromptKo && (
                    <p className="text-xs font-bold text-indigo-900 mt-1">
                      {choice.situationPromptKo}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-slate-500 text-xs mt-3 font-medium">
                Choose the English sentence that matches the picture to open the path:
              </p>
            </div>

            {/* 2 Sentence Choices with Preposition Diagram */}
            <div className="space-y-3.5 mt-3">
              {choice.options.map((option) => (
                <div key={option.id} className="relative group">
                  <button
                    onClick={() => handleSelectOption(option)}
                    className="w-full p-4 rounded-2xl text-left border-2 transition-all duration-200 bg-white hover:bg-indigo-50/60 hover:border-indigo-400 border-slate-200 shadow-xs hover:shadow-md active:scale-[0.99] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-900 font-display font-black text-sm flex items-center justify-center shrink-0 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {option.id}
                      </span>
                      <div>
                        <p className="font-display text-base md:text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-950">
                          {option.sentence}
                        </p>
                        {showKorean && option.sentenceKo && (
                          <p className="text-xs text-indigo-800 font-bold mt-0.5">
                            {option.sentenceKo}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <PrepositionDiagram preposition={option.preposition} size="sm" />
                          <span className="text-[11px] font-semibold text-slate-500">
                            Preposition: <strong className="text-indigo-700">"{option.preposition}"</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleReadOption(e, option.sentence)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-700 hover:bg-slate-100 transition-colors shrink-0"
                      title="Listen to this sentence"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Helper Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-semibold">
              Tip: Think about which spatial word matches where Mina needs to go!
            </p>
          </div>
        </div>
      </div>

      {/* ================= DEAD END POPUP MODAL ================= */}
      {showDeadEndModal && selectedOption && !selectedOption.isCorrect && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-2xl border-4 border-rose-500 flex flex-col items-center text-center animate-scaleUp">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-2 shadow-inner">
              <AlertOctagon className="w-10 h-10" />
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
              🚧 Dead End Ahead! (막다른 길)
            </span>

            <h3 className="font-display text-2xl font-black text-slate-900 mt-2 mb-1">
              {selectedOption.deadEndTitle}
            </h3>

            <div className="bg-slate-100 rounded-xl px-4 py-2 my-2 border border-slate-200 text-slate-800 font-bold text-sm">
              "{selectedOption.sentence}"
            </div>

            <div className="bg-amber-50 rounded-2xl p-4 my-2 border border-amber-300 w-full text-left">
              <div className="flex items-start gap-2.5">
                <PrepositionDiagram preposition={selectedOption.preposition} size="md" />
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block">
                    Spatial Clue (위치 힌트):
                  </span>
                  <p className="text-slate-800 text-sm font-semibold leading-relaxed mt-0.5">
                    {selectedOption.deadEndExplanation}
                  </p>
                  {selectedOption.deadEndExplanationKo && (
                    <p className="text-xs text-amber-900 font-bold mt-1.5 pt-1.5 border-t border-amber-200">
                      {selectedOption.deadEndExplanationKo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDeadEndModal(false)}
              className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Try Again (다시 고르기)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
