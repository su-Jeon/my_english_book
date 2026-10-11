import React from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { STORY_SCENES } from '../data/storyData';
import { renderSpriteForScene } from './StorySprites';

interface StickerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  foundObjects: {
    [sceneId: number]: {
      found: boolean;
      attempts: number;
      firstTry: boolean;
    };
  };
}

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  onClose,
  foundObjects,
}) => {
  if (!isOpen) return null;

  const totalStickers = STORY_SCENES.length;
  let unlockedCount = 0;
  STORY_SCENES.forEach((scene) => {
    if (foundObjects[scene.id]?.found) unlockedCount++;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 z-50 animate-fadeIn select-none">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border-4 border-amber-400 flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 md:p-5 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner">
              ⭐
            </div>
            <div>
              <h2 className="font-display text-xl md:text-2xl font-black tracking-tight leading-tight">
                Mina's Adventure Sticker Book
              </h2>
              <p className="text-amber-100 text-xs font-semibold">
                미나의 모험 스티커 북 ({unlockedCount} / {totalStickers} 수집 완료)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Strip */}
        <div className="bg-amber-100/90 px-5 py-2.5 flex items-center justify-between border-b border-amber-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
              Collection Progress:
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-36 md:w-52 h-3 bg-white rounded-full overflow-hidden border border-amber-300">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(unlockedCount / totalStickers) * 100}%` }}
              />
            </div>
            <span className="text-xs font-black text-amber-950">
              {Math.round((unlockedCount / totalStickers) * 100)}%
            </span>
          </div>
        </div>

        {/* 12 Sticker Grid */}
        <div className="p-4 md:p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {STORY_SCENES.map((scene) => {
            const isUnlocked = Boolean(foundObjects[scene.id]?.found);
            const record = foundObjects[scene.id];

            return (
              <div
                key={scene.id}
                className={`rounded-2xl p-3 flex flex-col items-center justify-between text-center relative border-2 transition-all duration-200 ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-sm hover:shadow-md hover:scale-105'
                    : 'bg-amber-100/30 border-dashed border-amber-200 opacity-60'
                }`}
              >
                {/* Scene Number Tag */}
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mb-1">
                  Scene {scene.id}
                </span>

                {/* Sticker Visual */}
                <div className="w-16 h-16 my-1 relative flex items-center justify-center">
                  {isUnlocked ? (
                    <div className="w-full h-full relative">
                      {renderSpriteForScene(scene.id, true)}
                      <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 rounded-full p-0.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      </span>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-400">
                      <Lock className="w-6 h-6 text-amber-400" />
                    </div>
                  )}
                </div>

                {/* Sticker Title & Status */}
                <div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    {scene.targetObjectName}
                  </h4>
                  {isUnlocked ? (
                    <span className="text-[10px] text-emerald-700 font-extrabold block mt-0.5">
                      {record?.firstTry ? '⭐ 1차 시도 성공' : '✅ 획득 완료'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                      미발견
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-amber-200 text-center">
          <p className="text-xs text-amber-900 font-bold">
            💡 동화 속 숨겨진 물건을 터치하면 스티커가 모여요!
          </p>
        </div>
      </div>
    </div>
  );
};
