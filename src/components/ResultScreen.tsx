import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, RotateCcw, Home, Sparkles, MapPin, AlertTriangle } from 'lucide-react';
import { LearnerProgress } from '../types/story';
import { CHOICE_POINTS, STORY_SCENES } from '../data/storyData';
import { soundFx, speechService } from '../services/audioService';
import { MinaAvatar } from './MinaAvatar';
import { PrepositionDiagram } from './PrepositionDiagram';
import { renderSpriteForScene } from './StorySprites';
import { StickerBookModal } from './StickerBookModal';

interface ResultScreenProps {
  progress: LearnerProgress;
  onPlayAgain: () => void;
  onGoHome: () => void;
  audioRate: number;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  progress,
  onPlayAgain,
  onGoHome,
  audioRate,
}) => {
  const [showStickerModal, setShowStickerModal] = useState(false);

  // Calculate first-try choice accuracy
  const totalChoices = 4;
  let firstTryChoicesCount = 0;
  for (let i = 1; i <= totalChoices; i++) {
    if (progress.choiceRecords[i]?.firstChoiceCorrect) {
      firstTryChoicesCount++;
    }
  }

  // Calculate first-try objects found
  const totalObjects = 12;
  let firstTryObjectsCount = 0;
  let totalObjectsFound = 0;
  for (let i = 1; i <= totalObjects; i++) {
    if (progress.foundObjects[i]?.found) {
      totalObjectsFound++;
    }
    if (progress.foundObjects[i]?.firstTry) {
      firstTryObjectsCount++;
    }
  }

  // Calculate Say-It count
  const sayItRecordedCount = Object.keys(progress.sayItRecordings).length;

  // Can-do statement achievements
  const canDoChoiceMet = firstTryChoicesCount >= 3;
  const canDoObjectsMet = firstTryObjectsCount >= 10;
  const canDoSpeakingMet = sayItRecordedCount >= 2;

  // On mount fanfare
  useEffect(() => {
    soundFx.playTrophyFanfare();
    speechService.speak(
      `You found the ball! Awesome job! Choices correct: ${firstTryChoicesCount} out of 4. Objects found: ${firstTryObjectsCount} out of 12.`,
      { rate: audioRate }
    );

    return () => {
      speechService.stop();
    };
  }, [firstTryChoicesCount, firstTryObjectsCount, audioRate]);

  // Identify missed choices for review
  const missedChoices = CHOICE_POINTS.filter((choice) => {
    const record = progress.choiceRecords[choice.id];
    return record && (!record.firstChoiceCorrect || record.deadEndVisited);
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 bg-gradient-to-b from-amber-50/80 via-sky-50/40 to-emerald-50/60 overflow-y-auto select-none">
      {/* Modal for full sticker inspection */}
      <StickerBookModal
        isOpen={showStickerModal}
        onClose={() => setShowStickerModal(false)}
        foundObjects={progress.foundObjects}
      />

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-amber-200/90 p-6 md:p-8 flex flex-col items-center">
        {/* ================= MINA AVATAR & TROPHY ================= */}
        <div className="flex items-center gap-4 mb-2">
          <MinaAvatar mood="proud" size="lg" />
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center shadow-lg border-2 border-amber-300">
              <Trophy className="w-12 h-12 text-amber-900" />
            </div>
            <span className="absolute -top-1 -right-1 text-2xl animate-bounce">⚽</span>
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center mt-2">
          You found the ball!
        </h1>
        <p className="text-amber-800 font-extrabold text-sm md:text-base text-center mt-1">
          Mina scored the winning goal thanks to your great English reading!
        </p>

        {/* ================= FIRST-TRY SCORES (PER PRD FORMAT) ================= */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg my-6">
          {/* Choices Correct */}
          <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-4 text-center shadow-xs">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 block mb-1">
              Choices Correct
            </span>
            <div className="font-display text-3xl md:text-4xl font-black text-indigo-950">
              {firstTryChoicesCount} / {totalChoices}
            </div>
            <span className="text-[11px] font-semibold text-indigo-700/80 mt-1 block">
              {firstTryChoicesCount >= 3 ? '🌟 Can-Do Target Met!' : 'Good Effort!'}
            </span>
          </div>

          {/* Objects Found */}
          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 text-center shadow-xs">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 block mb-1">
              Objects Found
            </span>
            <div className="font-display text-3xl md:text-4xl font-black text-amber-950">
              {firstTryObjectsCount} / {totalObjects}
            </div>
            <span className="text-[11px] font-semibold text-amber-800/80 mt-1 block">
              {firstTryObjectsCount >= 10 ? '🌟 Can-Do Target Met!' : 'Keep Practicing!'}
            </span>
          </div>
        </div>

        {/* ================= CAN-DO STATEMENTS BADGES ================= */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
          <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-500 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Grade 5-6 Can-Do Learning Objectives:
          </h3>
          <div className="space-y-2 text-xs md:text-sm font-semibold">
            <div className="flex items-center gap-2 text-slate-800">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  canDoChoiceMet ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              <span>
                1. Read sentences with prepositions & choose correct path (3+ on first try):
              </span>
              <strong className={canDoChoiceMet ? 'text-emerald-700 ml-auto' : 'text-slate-500 ml-auto'}>
                {firstTryChoicesCount} / 4
              </strong>
            </div>
            <div className="flex items-center gap-2 text-slate-800">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  canDoObjectsMet ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              <span>
                2. Listen to location sentences & find hidden objects (10+ on first try):
              </span>
              <strong className={canDoObjectsMet ? 'text-emerald-700 ml-auto' : 'text-slate-500 ml-auto'}>
                {firstTryObjectsCount} / 12
              </strong>
            </div>
            <div className="flex items-center gap-2 text-slate-800">
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  canDoSpeakingMet ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              <span>
                3. Look at pictures & say "The ___ is (preposition) the ___" sentences:
              </span>
              <strong className={canDoSpeakingMet ? 'text-emerald-700 ml-auto' : 'text-slate-500 ml-auto'}>
                {sayItRecordedCount} / 2
              </strong>
            </div>
          </div>
        </div>

        {/* ================= STICKER ALBUM PREVIEW (ITEM 6) ================= */}
        <div className="w-full bg-gradient-to-r from-amber-50 via-orange-50/30 to-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <h3 className="text-xs uppercase tracking-wider font-black text-amber-950">
                  Mina's Sticker Collection ({totalObjectsFound} / 12)
                </h3>
                <span className="text-[11px] text-amber-800 font-semibold">
                  모은 동화 스티커들을 확인해보세요!
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowStickerModal(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition-colors shadow-2xs"
            >
              스티커 북 전체보기
            </button>
          </div>

          {/* Quick horizontal sticker strip */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {STORY_SCENES.map((scene) => {
              const isUnlocked = Boolean(progress.foundObjects[scene.id]?.found);
              return (
                <div
                  key={scene.id}
                  onClick={() => setShowStickerModal(true)}
                  className={`w-14 h-14 shrink-0 rounded-2xl p-1 flex items-center justify-center border-2 cursor-pointer transition-transform hover:scale-105 ${
                    isUnlocked
                      ? 'bg-white border-amber-400 shadow-xs'
                      : 'bg-amber-100/40 border-dashed border-amber-200 opacity-40'
                  }`}
                  title={`${scene.targetObjectName} (${isUnlocked ? '획득' : '미발견'})`}
                >
                  {isUnlocked ? (
                    <div className="w-full h-full relative">
                      {renderSpriteForScene(scene.id, true)}
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400 font-bold">#{scene.id}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= PATH MAP ================= */}
        <div className="w-full bg-white border border-indigo-200 rounded-2xl p-5 mb-6 shadow-xs">
          <h3 className="text-xs uppercase tracking-wider font-extrabold text-indigo-800 mb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            Your Adventure Journey Map:
          </h3>

          <div className="relative overflow-x-auto py-2">
            <div className="min-w-[620px] flex items-center justify-between relative">
              {/* Connecting path line */}
              <div className="absolute top-1/2 left-6 right-6 h-1.5 bg-gradient-to-r from-emerald-300 via-indigo-300 to-amber-300 -translate-y-1/2 z-0" />

              {/* Waypoints */}
              {[
                { title: 'Park Trail', sub: 'Scenes 1-3', icon: '🌳' },
                { title: 'Choice 1', sub: progress.choiceRecords[1]?.deadEndVisited ? 'Visited Dead End' : 'First Try!', icon: '🔀', isChoice: 1 },
                { title: 'Oakwood School', sub: 'Scenes 4-6', icon: '🏫' },
                { title: 'Choice 2', sub: progress.choiceRecords[2]?.deadEndVisited ? 'Visited Dead End' : 'First Try!', icon: '🔀', isChoice: 2 },
                { title: 'Market Street', sub: 'Scenes 7-9', icon: '🍎' },
                { title: 'Choice 3', sub: progress.choiceRecords[3]?.deadEndVisited ? 'Visited Dead End' : 'First Try!', icon: '🔀', isChoice: 3 },
                { title: 'Soccer Field', sub: 'Scenes 10-12', icon: '⚽' },
                { title: 'Choice 4', sub: 'Goal Scored!', icon: '🏆', isChoice: 4 },
              ].map((node, i) => {
                const isDeadEnd = node.isChoice && progress.choiceRecords[node.isChoice]?.deadEndVisited;
                return (
                  <div key={i} className="flex flex-col items-center relative z-10 px-1">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-base font-bold shadow-md transition-transform border-2 ${
                        isDeadEnd
                          ? 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-white border-emerald-400 text-slate-800'
                      }`}
                    >
                      {node.icon}
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-800 mt-1 whitespace-nowrap">
                      {node.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold whitespace-nowrap ${
                        isDeadEnd ? 'text-rose-600' : 'text-slate-500'
                      }`}
                    >
                      {node.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= REVIEW OF MISSED CHOICE POINTS WITH PREPOSITION DIAGRAMS ================= */}
        {missedChoices.length > 0 && (
          <div className="w-full bg-rose-50/70 border border-rose-200 rounded-2xl p-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-rose-800 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Preposition Review (Mistakes Explored):
            </h3>
            <p className="text-xs text-rose-900/80 mb-3">
              Review what happened at the dead ends to solidify preposition understanding:
            </p>

            <div className="space-y-3">
              {missedChoices.map((choice) => {
                const correctOpt = choice.options.find((o) => o.isCorrect);
                const wrongOpt = choice.options.find((o) => !o.isCorrect);
                return (
                  <div
                    key={choice.id}
                    className="bg-white rounded-xl p-3 border border-rose-200 text-xs text-slate-800 shadow-2xs"
                  >
                    <div className="font-extrabold text-indigo-900 mb-1">
                      {choice.title}: {choice.situationPrompt}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-rose-700 uppercase block">
                              🚧 Dead End Selected:
                            </span>
                            {wrongOpt && <PrepositionDiagram preposition={wrongOpt.preposition} size="sm" />}
                          </div>
                          <p className="font-bold text-rose-950 mt-0.5">"{wrongOpt?.sentence}"</p>
                          <p className="text-[11px] text-rose-800 mt-1">{wrongOpt?.deadEndExplanation}</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black text-emerald-700 uppercase block">
                              ✅ Correct Path Sentence:
                            </span>
                            {correctOpt && <PrepositionDiagram preposition={correctOpt.preposition} size="sm" />}
                          </div>
                          <p className="font-bold text-emerald-950 mt-0.5">"{correctOpt?.sentence}"</p>
                          <p className="text-[11px] text-emerald-800 mt-1">
                            Uses preposition: <strong className="text-emerald-900 font-extrabold">"{correctOpt?.preposition}"</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= ACTION BUTTONS (PLAY AGAIN & HOME) ================= */}
        <div className="flex items-center gap-4 w-full max-w-md pt-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-display font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onGoHome}
            className="flex-1 py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-display font-extrabold text-base rounded-2xl border border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
