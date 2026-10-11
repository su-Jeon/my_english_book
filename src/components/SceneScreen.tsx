import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, ChevronRight, HelpCircle, CheckCircle2, Languages } from 'lucide-react';
import { StoryScene } from '../types/story';
import { soundFx, speechService } from '../services/audioService';
import { renderSpriteForScene } from './StorySprites';
import { MinaAvatar } from './MinaAvatar';
import { PrepositionDiagram } from './PrepositionDiagram';

interface SceneScreenProps {
  scene: StoryScene;
  sceneIndex: number;
  totalScenes: number;
  audioRate: number;
  onToggleAudioRate: () => void;
  onObjectFound: (sceneId: number, firstTry: boolean, attempts: number) => void;
  onNext: () => void;
  hasFoundObjectAlready: boolean;
  onOpenStickerBook?: () => void;
}

export const SceneScreen: React.FC<SceneScreenProps> = ({
  scene,
  sceneIndex,
  totalScenes,
  audioRate,
  onToggleAudioRate,
  onObjectFound,
  onNext,
  hasFoundObjectAlready,
  onOpenStickerBook,
}) => {
  const [isFound, setIsFound] = useState(hasFoundObjectAlready);
  const [attempts, setAttempts] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [sparkleCoords, setSparkleCoords] = useState<{ x: number; y: number } | null>(null);
  const [wrongFeedback, setWrongFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showKorean, setShowKorean] = useState(false);

  // Default Detective Magnifying Lens Cursor
  const [lensPos, setLensPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const imageStageRef = useRef<HTMLDivElement | null>(null);

  const audioRateRef = useRef(audioRate);
  audioRateRef.current = audioRate;
  const findTimeoutRef = useRef<number | null>(null);

  // Reset or initialize state when scene changes
  useEffect(() => {
    setIsFound(hasFoundObjectAlready);
    setAttempts(0);
    setShowSparkles(false);
    setSparkleCoords(null);
    setWrongFeedback(null);

    if (findTimeoutRef.current) {
      clearTimeout(findTimeoutRef.current);
      findTimeoutRef.current = null;
    }

    // Auto-read the story narration, then read the find challenge
    const fullStory = scene.storyText.join(' ');
    speechService.speak(fullStory, {
      rate: audioRateRef.current,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        // Play the find sentence so student knows what to search for
        findTimeoutRef.current = window.setTimeout(() => {
          speechService.speak(scene.findSentence, {
            rate: audioRateRef.current,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
          });
        }, 500);
      },
    });

    return () => {
      speechService.stop();
      if (findTimeoutRef.current) {
        clearTimeout(findTimeoutRef.current);
        findTimeoutRef.current = null;
      }
    };
  }, [scene.id, hasFoundObjectAlready]);

  // Read story text again
  const handleListenStory = useCallback(() => {
    speechService.speak(scene.storyText.join(' '), {
      rate: audioRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, [scene.storyText, audioRate]);

  // Read the find sentence
  const handleListenFindSentence = useCallback(() => {
    speechService.speak(scene.findSentence, {
      rate: audioRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }, [scene.findSentence, audioRate]);

  // Handle hotspot tap
  const handleHotspotClick = (hotspot: StoryScene['hotspots'][0], e: React.MouseEvent) => {
    e.stopPropagation();

    if (hotspot.isTarget) {
      if (!isFound) {
        const isFirstTry = attempts === 0;
        setIsFound(true);
        setShowSparkles(true);
        setSparkleCoords({ x: hotspot.x + hotspot.width / 2, y: hotspot.y + hotspot.height / 2 });
        soundFx.playSparkle();
        soundFx.playCorrect();

        onObjectFound(scene.id, isFirstTry, attempts + 1);

        // Read praise & the target sentence
        speechService.speak(`Great job! ${scene.findSentence}`, {
          rate: audioRate,
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
        });
      }
    } else {
      // Wrong tap
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      soundFx.playDeadEnd();
      setWrongFeedback(`That's the ${hotspot.name}. Look for: ${scene.targetObjectName}!`);
      setTimeout(() => setWrongFeedback(null), 2500);
    }
  };

  // Handle background miss tap
  const handleBackgroundClick = () => {
    if (isFound) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setWrongFeedback('Not here! Keep searching around the picture!');
    setTimeout(() => setWrongFeedback(null), 2000);
  };

  // Lens tracking coordinates
  const updateLensFromClientCoords = (clientX: number, clientY: number) => {
    if (!imageStageRef.current) return;
    const rect = imageStageRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateLensFromClientCoords(e.clientX, e.clientY);
  };

  const handleStageTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches && e.touches[0]) {
      updateLensFromClientCoords(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Target hotspot for hint animation
  const targetHotspot = scene.hotspots.find((h) => h.isTarget);
  // Show hint if 2 or more wrong taps
  const showBlinkingHint = !isFound && attempts >= 2 && targetHotspot;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-5 bg-gradient-to-b from-amber-100/60 via-stone-100 to-amber-50 overflow-hidden select-none">
      {/* ================= 3D PHYSICAL BOOK SPREAD CONTAINER (0.88s Coverline) ================= */}
      <div
        key={scene.id}
        className="w-full max-w-6xl h-full max-h-[820px] bg-white rounded-3xl shadow-2xl border-4 border-amber-800/20 flex flex-col md:flex-row overflow-hidden relative animate-page-flip"
      >
        {/* Book Spine Center Crease / Shadow (Desktop) */}
        <div className="hidden md:block absolute left-[60%] top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 via-black/5 to-transparent z-30 pointer-events-none" />

        {/* ================= LEFT 60%: STORY ILLUSTRATION PAGE ================= */}
        <div
          ref={imageStageRef}
          className="w-full md:w-[60%] relative bg-slate-900 flex items-center justify-center overflow-hidden min-h-[340px] md:min-h-full cursor-none"
          onClick={handleBackgroundClick}
          onMouseMove={handleStageMouseMove}
          onMouseEnter={() => setIsHoveringImage(true)}
          onMouseLeave={() => setIsHoveringImage(false)}
          onTouchStart={(e) => {
            setIsHoveringImage(true);
            if (e.touches && e.touches[0]) {
              updateLensFromClientCoords(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={handleStageTouchMove}
          onTouchEnd={() => setIsHoveringImage(false)}
        >
          {/* Background Scene Image */}
          <img
            src={scene.bgImage}
            alt={scene.locationName}
            className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Picture Book Page Corner Tag & Controls */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
            <span className="bg-amber-900/90 text-amber-100 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-amber-700/50">
              📖 Scene {sceneIndex + 1} / {totalScenes}
            </span>
            <span className="bg-white/95 text-slate-800 text-xs font-extrabold px-3 py-1 rounded-full shadow-md border border-slate-200">
              {scene.locationName}
            </span>
          </div>

          {/* Quick Access Sticker Book Badge (Top Right) */}
          {onOpenStickerBook && (
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStickerBook();
                }}
                className="px-3 py-1 rounded-full text-xs font-black bg-white/95 backdrop-blur-xs text-amber-900 border border-amber-300 hover:bg-white shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
                title="스티커 북 열기"
              >
                <span>⭐</span>
                <span>스티커 북</span>
              </button>
            </div>
          )}

          {/* ALWAYS ACTIVE DEFAULT DETECTIVE MAGNIFYING GLASS CURSOR */}
          {isHoveringImage && (
            <div
              style={{
                left: `${lensPos.x}%`,
                top: `${lensPos.y}%`,
              }}
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-35 animate-lens"
            >
              {/* Brass Magnifying Glass Frame */}
              <div className="w-24 h-24 rounded-full border-4 border-amber-500 bg-amber-200/20 backdrop-blur-[0.5px] shadow-2xl relative flex items-center justify-center ring-2 ring-amber-300">
                {/* Glass reflection highlight */}
                <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-white/40 transform -rotate-45 pointer-events-none" />
                {/* Crosshair focus point */}
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 ring-2 ring-white/90" />
                {/* Magnifier Wooden Handle */}
                <div className="absolute -bottom-6 -right-6 w-8 h-3.5 bg-amber-900 rounded-sm transform rotate-45 border border-amber-950 shadow-lg" />
              </div>
            </div>
          )}

          {/* Hotspots layer & SPRITE RENDERING */}
          {scene.hotspots.map((hotspot) => {
            const isThisTarget = hotspot.isTarget;
            return (
              <button
                key={hotspot.id}
                onClick={(e) => handleHotspotClick(hotspot, e)}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  width: `${hotspot.width}%`,
                  height: `${hotspot.height}%`,
                }}
                className={`absolute rounded-2xl transition-all duration-300 focus:outline-none flex items-center justify-center ${
                  isFound && isThisTarget
                    ? 'ring-4 ring-emerald-400 bg-emerald-400/20 z-20 shadow-xl'
                    : showBlinkingHint && isThisTarget
                    ? 'ring-4 ring-amber-400 bg-amber-400/30 animate-hint-blink z-20'
                    : 'hover:brightness-110 active:scale-95'
                }`}
                title={isThisTarget ? scene.targetObjectName : hotspot.name}
              >
                {/* RENDER THE ACTUAL ADORABLE ILLUSTRATED SPRITE */}
                {isThisTarget && (
                  <div className="w-full h-full flex items-center justify-center p-0.5 pointer-events-none">
                    {renderSpriteForScene(scene.id, isFound)}
                  </div>
                )}

                {/* Success checkmark badge when found */}
                {isFound && isThisTarget && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg animate-bounce">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </button>
            );
          })}

          {/* Sparkles Particle Animation Overlay */}
          {showSparkles && sparkleCoords && (
            <div
              style={{ left: `${sparkleCoords.x}%`, top: `${sparkleCoords.y}%` }}
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-40"
            >
              <div className="relative text-3xl">
                <span className="animate-ping absolute -top-4 -left-4">✨</span>
                <span className="animate-bounce absolute top-2 left-6">⭐</span>
                <span className="animate-pulse absolute -top-6 left-2">🌟</span>
                <span className="animate-ping absolute -top-2 -left-2 text-yellow-300">🎉</span>
              </div>
            </div>
          )}

          {/* Floating Mission Banner on bottom of picture with Preposition Diagram */}
          <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-md bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border-2 border-amber-300 z-20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Visual Preposition Diagram */}
              <PrepositionDiagram preposition={scene.preposition} size="md" />

              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 block leading-tight">
                  Find in Picture ({scene.preposition}):
                </span>
                <span className="text-xs md:text-sm font-bold text-slate-900">
                  {scene.targetObjectName}
                </span>
                {showKorean && scene.targetObjectNameKo && (
                  <span className="text-[11px] text-amber-800 font-semibold block">
                    ({scene.targetObjectNameKo})
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleListenFindSentence();
              }}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 shrink-0 shadow-xs"
              title="Hear location clue"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear clue</span>
            </button>
          </div>

          {/* Wrong tap feedback banner */}
          {wrongFeedback && (
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-rose-600 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full shadow-xl border-2 border-rose-300 z-40 flex items-center gap-2 animate-bounce">
              <span>{wrongFeedback}</span>
            </div>
          )}

          {/* Blinking hint banner after 2 wrong taps */}
          {showBlinkingHint && (
            <div className="absolute top-14 right-3 bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg border-2 border-amber-600 z-30 flex items-center gap-1.5 animate-pulse">
              <HelpCircle className="w-4 h-4 text-amber-900" />
              <span>Hint: Look where the glowing circle pulses!</span>
            </div>
          )}
        </div>

        {/* ================= RIGHT 40%: MINA CHARACTER & STORYBOOK SPEECH BUBBLE ================= */}
        <div className="w-full md:w-[40%] bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 p-5 md:p-7 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top: Chapter title and Korean helper toggle */}
            <div className="flex items-center justify-between mb-3 border-b border-amber-200/80 pb-2">
              <div>
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block">
                  {scene.chapterTitle}
                </span>
                {showKorean && scene.chapterTitleKo && (
                  <span className="text-[11px] text-amber-700 font-semibold">
                    {scene.chapterTitleKo}
                  </span>
                )}
              </div>

              {/* Korean Translation Toggle */}
              <button
                onClick={() => setShowKorean(!showKorean)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border ${
                  showKorean
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
                title="Toggle Korean translation"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{showKorean ? '한국어 ON' : '한국어 보기'}</span>
              </button>
            </div>

            {/* MINA CHARACTER AVATAR & DIALOGUE SPEECH BUBBLE */}
            <div className="flex items-start gap-3 my-3">
              <div className="flex flex-col items-center shrink-0">
                <MinaAvatar
                  mood={isFound ? 'excited' : attempts >= 2 ? 'thinking' : 'searching'}
                  size="md"
                />
                <span className="text-[11px] font-black text-amber-900 mt-1">Mina</span>
              </div>

              {/* Story Speech Bubble with speech tail */}
              <div className="flex-1 bg-amber-100/60 rounded-2xl rounded-tl-xs p-4 border-2 border-amber-300/80 relative shadow-2xs">
                <div className="space-y-1.5">
                  {scene.storyText.map((sentence, idx) => (
                    <p
                      key={idx}
                      className="font-display text-lg md:text-xl font-black text-slate-900 leading-snug tracking-tight"
                    >
                      {sentence}
                    </p>
                  ))}
                </div>

                {/* Korean translation of story */}
                {showKorean && scene.storyTextKo && (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-200 space-y-0.5">
                    {scene.storyTextKo.map((ko, idx) => (
                      <p key={idx} className="text-xs font-bold text-amber-900">
                        {ko}
                      </p>
                    ))}
                  </div>
                )}

                {/* Reading audio indicator */}
                {isSpeaking && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-amber-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-[10px] font-bold">Reading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Look & Find Mission Result Box with Preposition Pictogram */}
            <div className="mt-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span>Location Mission:</span>
                <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded text-[10px] font-black">
                  "{scene.preposition}"
                </span>
              </span>

              {isFound ? (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 shadow-sm animate-scaleUp">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-black uppercase">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Found! Location Sentence:</span>
                    </div>
                    <PrepositionDiagram preposition={scene.preposition} size="sm" />
                  </div>

                  <p className="font-display text-lg md:text-xl font-black text-emerald-950">
                    {scene.findSentence.split(scene.preposition).map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="bg-yellow-300 text-slate-950 px-2 py-0.5 rounded-md underline underline-offset-2 decoration-2 decoration-amber-600 font-black shadow-2xs mx-1">
                            {scene.preposition}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </p>
                  {showKorean && scene.findSentenceKo && (
                    <p className="text-xs font-bold text-emerald-800 mt-1.5">
                      {scene.findSentenceKo}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-white border-2 border-amber-200/80 rounded-2xl p-4 text-slate-700 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-relaxed">
                      Tap the <strong className="text-amber-800">{scene.targetObjectName}</strong> in the picture!
                    </p>
                    <PrepositionDiagram preposition={scene.preposition} size="sm" />
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleListenFindSentence}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Hear Clue</span>
                    </button>
                    <span className="text-xs font-bold text-slate-600">
                      Preposition: <strong className="text-amber-900 font-black">"{scene.preposition}"</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls Row & Next button */}
          <div className="mt-6 pt-4 border-t border-amber-200/80">
            {/* Audio action buttons */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleListenStory}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-amber-50 border-2 border-amber-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>Listen Again</span>
              </button>

              <button
                onClick={onToggleAudioRate}
                className={`py-2.5 px-3 border-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs ${
                  audioRate < 0.9
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200'
                }`}
              >
                <span>{audioRate < 0.9 ? '🐢' : '🐰'}</span>
                <span>{audioRate < 0.9 ? 'Slow' : 'Normal'}</span>
              </button>
            </div>

            {/* NEXT BUTTON: Enabled ONLY after hidden object is found per PRD */}
            <button
              onClick={() => {
                if (isFound) {
                  soundFx.playPageTurn();
                  onNext();
                }
              }}
              disabled={!isFound}
              className={`w-full py-4 px-5 rounded-2xl font-display font-black text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                isFound
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 cursor-pointer animate-pulse'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <span>{isFound ? 'Turn Page ▶ (Next Scene)' : 'Tap the object to continue'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            {!isFound && (
              <p className="text-center text-[11px] text-amber-900/80 mt-1.5 font-bold">
                {showKorean
                  ? `💡 힌트: 그림 속 ${scene.targetObjectNameKo || scene.targetObjectName}을(를) 터치하세요!`
                  : `💡 Tip: ${targetHotspot?.hintHintText || `Find the ${scene.targetObjectName} in the picture!`}`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
