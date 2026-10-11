export type Preposition = 'in' | 'on' | 'under' | 'behind' | 'next to';

export interface Hotspot {
  id: string;
  name: string;
  // Position percentages (0 - 100) relative to image container
  x: number;
  y: number;
  width: number;
  height: number;
  isTarget: boolean;
  hintHintText?: string;
  icon?: string;
}

export interface StoryScene {
  id: number;
  chapter: number;
  chapterTitle: string;
  chapterTitleKo?: string;
  locationName: string;
  storyText: string[]; // 1-2 sentences, <= 8 words each
  storyTextKo?: string[]; // Korean translation
  findSentence: string; // e.g. "The cat is under the bench."
  findSentenceKo?: string;
  preposition: Preposition;
  targetObjectName: string;
  targetObjectNameKo?: string;
  targetEmoji: string;
  bgImage: string;
  hotspots: Hotspot[]; // includes target and decoys
}

export interface ChoiceOption {
  id: 'A' | 'B';
  sentence: string;
  sentenceKo?: string;
  isCorrect: boolean;
  preposition: Preposition;
  deadEndTitle: string;
  deadEndExplanation: string;
  deadEndExplanationKo?: string;
  hintDirection: 'up' | 'down' | 'left' | 'right' | 'center';
}

export interface ChoicePoint {
  id: number;
  afterSceneId: number;
  title: string;
  titleKo?: string;
  situationPrompt: string;
  situationPromptKo?: string;
  bgImage: string;
  options: ChoiceOption[];
  pathOpeningStory: string;
  pathOpeningStoryKo?: string;
}

export interface SayItQuestion {
  id: number;
  title: string;
  prompt: string;
  targetSentence: string;
  subject: string;
  preposition: Preposition;
  object: string;
  illustrationType: 'dog_under_table' | 'cat_on_chair';
  modelVoiceSentence: string;
}

export interface LearnerProgress {
  foundObjects: {
    [sceneId: number]: {
      found: boolean;
      attempts: number;
      firstTry: boolean;
    };
  };
  choiceRecords: {
    [choiceId: number]: {
      firstChoiceCorrect: boolean;
      attempts: number;
      deadEndVisited: boolean;
      selectedOptionIds: string[];
    };
  };
  sayItRecordings: {
    [questionId: number]: {
      recorded: boolean;
      audioUrl: string | null;
      assembledWords: string[];
    };
  };
}
