import React, { useState } from 'react';
import { Header } from './components/Header';
import { CoverScreen } from './components/CoverScreen';
import { SceneScreen } from './components/SceneScreen';
import { ChoicePointScreen } from './components/ChoicePointScreen';
import { SayItScreen } from './components/SayItScreen';
import { ResultScreen } from './components/ResultScreen';
import { StickerBookModal } from './components/StickerBookModal';
import { STORY_SCENES, CHOICE_POINTS, SAY_IT_QUESTIONS } from './data/storyData';
import { LearnerProgress } from './types/story';

export default function App() {
  const [stage, setStage] = useState<'cover' | 'story' | 'choice' | 'say_it' | 'result'>('cover');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [sayItIndex, setSayItIndex] = useState(0);
  const [audioRate, setAudioRate] = useState<number>(1.0); // 1.0 for normal, 0.75 for slow
  const [isStickerModalOpen, setIsStickerModalOpen] = useState(false);

  const [progress, setProgress] = useState<LearnerProgress>({
    foundObjects: {},
    choiceRecords: {},
    sayItRecordings: {},
  });

  const handleToggleAudioRate = () => {
    setAudioRate((prev) => (prev < 0.9 ? 1.0 : 0.75));
  };

  const handleStartAdventure = () => {
    setStage('story');
    setSceneIndex(0);
    setChoiceIndex(0);
    setSayItIndex(0);
    setProgress({
      foundObjects: {},
      choiceRecords: {},
      sayItRecordings: {},
    });
  };

  const handleRestart = () => {
    handleStartAdventure();
  };

  const handleGoHome = () => {
    setStage('cover');
  };

  // Callback when hidden object is found in a scene
  const handleObjectFound = (sceneId: number, firstTry: boolean, attempts: number) => {
    setProgress((prev) => ({
      ...prev,
      foundObjects: {
        ...prev.foundObjects,
        [sceneId]: {
          found: true,
          firstTry,
          attempts,
        },
      },
    }));
  };

  // Handle advancing from a scene
  const handleSceneNext = () => {
    const currentScene = STORY_SCENES[sceneIndex];
    // Check if this scene is followed by a choice point:
    // Choice point 1 after scene 3 (sceneIndex 2)
    // Choice point 2 after scene 6 (sceneIndex 5)
    // Choice point 3 after scene 9 (sceneIndex 8)
    // Choice point 4 after scene 12 (sceneIndex 11)
    const matchingChoice = CHOICE_POINTS.find((c) => c.afterSceneId === currentScene.id);

    if (matchingChoice) {
      setChoiceIndex(matchingChoice.id - 1);
      setStage('choice');
    } else {
      // Advance to next scene
      if (sceneIndex + 1 < STORY_SCENES.length) {
        setSceneIndex(sceneIndex + 1);
      } else {
        // If all scenes done, go to Say It!
        setStage('say_it');
        setSayItIndex(0);
      }
    }
  };

  // Callback when a choice point option is picked
  const handleChoiceResult = (
    choiceId: number,
    isFirstTryCorrect: boolean,
    attempts: number,
    deadEndVisited: boolean,
    selectedOptionId: string
  ) => {
    setProgress((prev) => {
      const existing = prev.choiceRecords[choiceId];
      return {
        ...prev,
        choiceRecords: {
          ...prev.choiceRecords,
          [choiceId]: {
            firstChoiceCorrect: existing ? existing.firstChoiceCorrect : isFirstTryCorrect,
            attempts,
            deadEndVisited: existing ? existing.deadEndVisited || deadEndVisited : deadEndVisited,
            selectedOptionIds: existing
              ? [...existing.selectedOptionIds, selectedOptionId]
              : [selectedOptionId],
          },
        },
      };
    });
  };

  // Callback to continue after opening the path in Choice Point
  const handleChoiceContinue = () => {
    const currentChoice = CHOICE_POINTS[choiceIndex];

    if (currentChoice.id === 4) {
      // Final choice point after scene 12 leads to Say It!
      setStage('say_it');
      setSayItIndex(0);
    } else {
      // Go to next scene (sceneIndex + 1)
      setSceneIndex(sceneIndex + 1);
      setStage('story');
    }
  };

  // Callback when voice recording is saved in Say It!
  const handleSayItRecordSaved = (questionId: number, audioUrl: string) => {
    setProgress((prev) => ({
      ...prev,
      sayItRecordings: {
        ...prev.sayItRecordings,
        [questionId]: {
          recorded: true,
          audioUrl,
          assembledWords: [],
        },
      },
    }));
  };

  // Advance in Say It!
  const handleSayItNext = () => {
    if (sayItIndex + 1 < SAY_IT_QUESTIONS.length) {
      setSayItIndex(sayItIndex + 1);
    } else {
      // Finished both questions -> Result screen!
      setStage('result');
    }
  };

  const currentScene = STORY_SCENES[sceneIndex];
  const currentChoice = CHOICE_POINTS[choiceIndex];
  const currentSayIt = SAY_IT_QUESTIONS[sayItIndex];

  // Count unlocked stickers
  let unlockedStickersCount = 0;
  STORY_SCENES.forEach((scene) => {
    if (progress.foundObjects[scene.id]?.found) unlockedStickersCount++;
  });

  return (
    <div className="w-full h-screen min-h-[600px] flex flex-col bg-slate-100 overflow-hidden text-slate-800">
      {/* Sticker Book Global Modal */}
      <StickerBookModal
        isOpen={isStickerModalOpen}
        onClose={() => setIsStickerModalOpen(false)}
        foundObjects={progress.foundObjects}
      />

      {/* Top Header */}
      <Header
        stage={stage}
        sceneIndex={sceneIndex}
        totalScenes={STORY_SCENES.length}
        choiceIndex={choiceIndex}
        totalChoices={CHOICE_POINTS.length}
        sayItIndex={sayItIndex}
        totalSayIt={SAY_IT_QUESTIONS.length}
        audioRate={audioRate}
        unlockedStickersCount={unlockedStickersCount}
        onOpenStickerBook={() => setIsStickerModalOpen(true)}
        onToggleAudioRate={handleToggleAudioRate}
        onGoHome={handleGoHome}
        onRestart={handleRestart}
      />

      {/* Main Screen Body */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {stage === 'cover' && (
          <CoverScreen onStart={handleStartAdventure} audioRate={audioRate} />
        )}

        {stage === 'story' && currentScene && (
          <SceneScreen
            key={currentScene.id}
            scene={currentScene}
            sceneIndex={sceneIndex}
            totalScenes={STORY_SCENES.length}
            audioRate={audioRate}
            onToggleAudioRate={handleToggleAudioRate}
            onObjectFound={handleObjectFound}
            onNext={handleSceneNext}
            hasFoundObjectAlready={Boolean(progress.foundObjects[currentScene.id]?.found)}
            onOpenStickerBook={() => setIsStickerModalOpen(true)}
          />
        )}

        {stage === 'choice' && currentChoice && (
          <ChoicePointScreen
            key={currentChoice.id}
            choice={currentChoice}
            choiceIndex={choiceIndex}
            totalChoices={CHOICE_POINTS.length}
            audioRate={audioRate}
            onChoiceResult={handleChoiceResult}
            onContinue={handleChoiceContinue}
          />
        )}

        {stage === 'say_it' && currentSayIt && (
          <SayItScreen
            key={currentSayIt.id}
            question={currentSayIt}
            questionIndex={sayItIndex}
            totalQuestions={SAY_IT_QUESTIONS.length}
            audioRate={audioRate}
            onRecordSaved={handleSayItRecordSaved}
            onNext={handleSayItNext}
            savedAudioUrl={progress.sayItRecordings[currentSayIt.id]?.audioUrl}
          />
        )}

        {stage === 'result' && (
          <ResultScreen
            progress={progress}
            onPlayAgain={handleStartAdventure}
            onGoHome={handleGoHome}
            audioRate={audioRate}
          />
        )}
      </main>
    </div>
  );
}
