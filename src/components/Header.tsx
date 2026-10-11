import React from 'react';
import { Volume2, VolumeX, Home, RotateCcw } from 'lucide-react';
import { soundFx, speechService } from '../services/audioService';

interface HeaderProps {
  stage: 'cover' | 'story' | 'choice' | 'say_it' | 'result';
  sceneIndex: number;
  totalScenes: number;
  choiceIndex: number;
  totalChoices: number;
  sayItIndex: number;
  totalSayIt: number;
  audioRate: number;
  unlockedStickersCount?: number;
  onOpenStickerBook?: () => void;
  onToggleAudioRate: () => void;
  onGoHome: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stage,
  sceneIndex,
  totalScenes,
  choiceIndex,
  totalChoices,
  sayItIndex,
  totalSayIt,
  audioRate,
  unlockedStickersCount = 0,
  onOpenStickerBook,
  onToggleAudioRate,
  onGoHome,
  onRestart,
}) => {
  const [muted, setMuted] = React.useState(soundFx.getMuted());

  const handleToggleMute = () => {
    const nextMuted = !muted;
    soundFx.setMuted(nextMuted);
    setMuted(nextMuted);
    if (nextMuted) {
      speechService.stop();
    }
  };

  const renderBadge = () => {
    switch (stage) {
      case 'story':
        return (
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <span>📖</span>
            <span>Scene {sceneIndex + 1} / {totalScenes}</span>
          </div>
        );
      case 'choice':
        return (
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            <span>🔀</span>
            <span>Choice {choiceIndex + 1} / {totalChoices}</span>
          </div>
        );
      case 'say_it':
        return (
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span>🎙️</span>
            <span>Say It! {sayItIndex + 1} / {totalSayIt}</span>
          </div>
        );
      case 'result':
        return (
          <div className="flex items-center gap-2 text-sm font-semibold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            <span>🏆</span>
            <span>Adventure Complete</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between shadow-xs z-30 select-none">
      {/* Brand & Stage indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 text-left group hover:opacity-85 transition-opacity"
          title="Return to Cover"
        >
          <span className="text-xl">⚽</span>
          <div>
            <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight block leading-tight">
              Which Way, Mina?
            </span>
            <span className="text-xs text-amber-700 font-medium block leading-none">
              The Lost Soccer Ball
            </span>
          </div>
        </button>

        {renderBadge()}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Sticker Book button */}
        {onOpenStickerBook && stage !== 'cover' && (
          <button
            onClick={onOpenStickerBook}
            className="px-3 py-1.5 rounded-lg text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs transition-all flex items-center gap-1.5"
            title="스티커 북 보기"
          >
            <span>⭐</span>
            <span>스티커 ({unlockedStickersCount}/12)</span>
          </button>
        )}

        {/* Speed toggle */}
        <button
          onClick={onToggleAudioRate}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
            audioRate < 0.9
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Toggle narration speed (Normal vs Slow)"
        >
          <span>{audioRate < 0.9 ? '🐢' : '🐰'}</span>
          <span>{audioRate < 0.9 ? 'Slow Mode' : 'Normal Speed'}</span>
        </button>

        {/* Mute button */}
        <button
          onClick={handleToggleMute}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent"
          title={muted ? 'Unmute sounds' : 'Mute sounds'}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {stage !== 'cover' && (
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              onClick={onRestart}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Restart from Beginning"
              aria-label="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onGoHome}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Go to Cover Screen"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
