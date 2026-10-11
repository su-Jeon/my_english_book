import React from 'react';
import { Play, Sparkles, Compass, Mic, BookOpen } from 'lucide-react';
import { COVER_IMAGE } from '../data/storyData';
import { soundFx, speechService } from '../services/audioService';

interface CoverScreenProps {
  onStart: () => void;
  audioRate: number;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onStart, audioRate }) => {
  const handleStart = () => {
    soundFx.playCorrect();
    onStart();
  };

  const handleReadTitle = () => {
    speechService.speak('The Lost Soccer Ball. Which Way, Mina?', { rate: audioRate });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-b from-amber-50/70 via-sky-50/40 to-emerald-50/60 overflow-y-auto">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-amber-200/90 overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Cover illustration (Left side) */}
        <div className="md:w-1/2 relative bg-amber-100 flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[440px]">
          <img
            src={COVER_IMAGE}
            alt="Mina looking for her soccer ball in the sunny park"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-amber-900 px-3 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 border border-amber-200">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Grade 5-6 English Reader</span>
          </div>
        </div>

        {/* Story details & CTA (Right side) */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-white to-amber-50/30">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-md">
                Interactive Storybook
              </span>
              <button
                onClick={handleReadTitle}
                className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 p-1"
                title="Hear Title Read Aloud"
              >
                <span>🔊 Listen</span>
              </button>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              The Lost Soccer Ball
            </h1>
            <p className="text-amber-800 font-extrabold text-base mt-1">
              Which Way, Mina? (미나의 잃어버린 축구공)
            </p>

            <p className="text-slate-600 text-sm mt-3 leading-relaxed">
              Mina lost her lucky soccer ball in town! Help her find it by reading English sentences, discovering hidden objects, and picking the right path!
            </p>
            <p className="text-amber-900/80 text-xs font-semibold mt-1">
              영어 문장을 읽고, 숨겨진 물건을 찾고, 올바른 길을 골라 미나와 함께 축구공을 찾아보세요!
            </p>

            {/* Target Prepositions Badges */}
            <div className="mt-5 pt-4 border-t border-amber-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                5 Location Words to Master:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['in', 'on', 'under', 'behind', 'next to'].map((word) => (
                  <span
                    key={word}
                    className="text-xs font-extrabold text-slate-800 bg-amber-100/70 border border-amber-300/80 px-2.5 py-1 rounded-md"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* 3 Steps */}
            <div className="grid grid-cols-3 gap-2 mt-5 text-center">
              <div className="p-2 rounded-xl bg-sky-50 border border-sky-100">
                <Compass className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-sky-900 block">1. Read & Pick</span>
                <span className="text-[10px] text-sky-700">Open the path</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                <Sparkles className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-amber-900 block">2. Look & Find</span>
                <span className="text-[10px] text-amber-700">12 hidden items</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <Mic className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-emerald-900 block">3. Say It!</span>
                <span className="text-[10px] text-emerald-700">Speak & record</span>
              </div>
            </div>
          </div>

          {/* Start CTA Button */}
          <div className="mt-6 pt-4">
            <button
              onClick={handleStart}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-display font-extrabold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>Start Adventure!</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
              Tablet landscape optimized · Audio narration included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
