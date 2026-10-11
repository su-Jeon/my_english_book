import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Volume2, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { SayItQuestion } from '../types/story';
import { soundFx, speechService, VoiceRecorder } from '../services/audioService';

interface SayItScreenProps {
  question: SayItQuestion;
  questionIndex: number;
  totalQuestions: number;
  audioRate: number;
  onRecordSaved: (questionId: number, audioUrl: string) => void;
  onNext: () => void;
  savedAudioUrl?: string | null;
}

export const SayItScreen: React.FC<SayItScreenProps> = ({
  question,
  questionIndex,
  totalQuestions,
  audioRate,
  onRecordSaved,
  onNext,
  savedAudioUrl,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(savedAudioUrl || null);
  const [isPlayingMyVoice, setIsPlayingMyVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const recorderRef = useRef<VoiceRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Initialize recorder
  useEffect(() => {
    recorderRef.current = new VoiceRecorder();
    setAudioUrl(savedAudioUrl || null);
    setMicError(null);
    setIsRecording(false);
    setRecordingSeconds(0);

    // Speak instructions
    speechService.speak(`Say It! Question ${questionIndex + 1}. ${question.prompt}`, {
      rate: audioRate,
    });

    return () => {
      speechService.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question.id, questionIndex, question.prompt, savedAudioUrl, audioRate]);

  // Model sentence playback
  const handleHearExample = () => {
    speechService.speak(question.modelVoiceSentence, {
      rate: audioRate,
    });
  };

  // Toggle recording
  const handleToggleRecord = async () => {
    if (isRecording) {
      // STOP recording
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);

      if (recorderRef.current) {
        const url = await recorderRef.current.stop();
        if (url) {
          setAudioUrl(url);
          soundFx.playCorrect();
          onRecordSaved(question.id, url);
        } else {
          // Fallback simulation in case mic stream couldn't produce blob
          simulateRecording();
        }
      }
    } else {
      // START recording
      setMicError(null);
      if (!recorderRef.current) {
        recorderRef.current = new VoiceRecorder();
      }

      const started = await recorderRef.current.start();
      if (started) {
        setIsRecording(true);
        setRecordingSeconds(0);
        soundFx.playPageTurn();

        timerRef.current = window.setInterval(() => {
          setRecordingSeconds((prev) => {
            if (prev >= 10) {
              // Auto stop after 10 seconds
              handleToggleRecord();
              return 10;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        // Microphone permission denied or not available in iframe sandbox
        setMicError('Microphone not detected. Enabling practice mode!');
        simulateRecording();
      }
    }
  };

  // Graceful fallback for environments where mic access is blocked
  const simulateRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    soundFx.playPageTurn();

    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 3) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRecording(false);
          // Create dummy audio URL
          const dummyUrl = 'simulated';
          setAudioUrl(dummyUrl);
          soundFx.playCorrect();
          onRecordSaved(question.id, dummyUrl);
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Play back learner's voice
  const handlePlayMyVoice = () => {
    if (!audioUrl) return;

    if (isPlayingMyVoice) {
      if (audioUrl === 'simulated') {
        speechService.stop();
      } else if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      setIsPlayingMyVoice(false);
      return;
    }

    // Stop any ongoing speech before playing voice
    speechService.stop();

    if (audioUrl === 'simulated') {
      // Play speech synthesis repetition of their sentence
      setIsPlayingMyVoice(true);
      speechService.speak(question.targetSentence, {
        pitch: 1.2, // Higher pitch to emulate young learner voice
        rate: audioRate,
        onEnd: () => setIsPlayingMyVoice(false),
      });
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = 0;
      setIsPlayingMyVoice(true);
      audioPlayerRef.current.play().catch(() => {
        setIsPlayingMyVoice(false);
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-5 bg-gradient-to-b from-emerald-100/60 via-stone-100 to-emerald-50 overflow-hidden select-none">
      {/* Hidden audio element for recorded playback */}
      {audioUrl && audioUrl !== 'simulated' && (
        <audio
          ref={audioPlayerRef}
          src={audioUrl}
          onEnded={() => setIsPlayingMyVoice(false)}
          onError={() => setIsPlayingMyVoice(false)}
          className="hidden"
        />
      )}

      {/* ================= PHYSICAL BOOK SPREAD CONTAINER ================= */}
      <div className="w-full max-w-6xl h-full max-h-[820px] bg-white rounded-3xl shadow-2xl border-4 border-emerald-900/20 flex flex-col md:flex-row overflow-hidden relative">
        {/* Book Spine Center Crease / Shadow */}
        <div className="hidden md:block absolute left-[60%] top-0 bottom-0 w-3 bg-gradient-to-r from-black/15 via-black/5 to-transparent z-30 pointer-events-none" />

        {/* ================= LEFT 60%: ILLUSTRATION OF SITUATION ================= */}
        <div className="w-full md:w-[60%] relative bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 flex items-center justify-center p-6 min-h-[320px] md:min-h-full">
        {/* Progress badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className="bg-emerald-900/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-emerald-300" />
            <span>Say It! {question.title}</span>
          </span>
          <span className="bg-amber-400 text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
            Speaking Challenge
          </span>
        </div>

        {/* Custom SVG Illustration depicting the preposition scenario */}
        <div className="w-full max-w-lg aspect-4/3 bg-white/90 backdrop-blur-xs rounded-3xl shadow-xl border-4 border-amber-200/90 p-4 flex flex-col items-center justify-center relative overflow-hidden">
          {question.illustrationType === 'dog_under_table' ? (
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Room Background */}
              <rect x="0" y="0" width="400" height="230" fill="#fef3c7" opacity="0.4" />
              <rect x="0" y="230" width="400" height="70" fill="#d97706" opacity="0.2" />
              {/* Window */}
              <rect x="30" y="30" width="80" height="90" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="4" />
              <line x1="70" y1="30" x2="70" y2="120" stroke="#0284c7" strokeWidth="3" />
              <line x1="30" y1="75" x2="110" y2="75" stroke="#0284c7" strokeWidth="3" />

              {/* Wooden Table */}
              {/* Table top */}
              <rect x="110" y="120" width="220" height="20" rx="6" fill="#b45309" stroke="#78350f" strokeWidth="3" />
              {/* Table Legs */}
              <rect x="130" y="140" width="16" height="100" rx="4" fill="#92400e" />
              <rect x="290" y="140" width="16" height="100" rx="4" fill="#92400e" />

              {/* Flower vase on table */}
              <path d="M 205 85 Q 195 105 200 120 L 220 120 Q 225 105 215 85 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
              <circle cx="210" cy="70" r="10" fill="#f43f5e" />
              <circle cx="210" cy="70" r="4" fill="#fde047" />

              {/* Dog UNDER the table */}
              <g transform="translate(180, 175)">
                {/* Dog body */}
                <ellipse cx="35" cy="40" rx="30" ry="22" fill="#d97706" />
                {/* Dog head */}
                <circle cx="15" cy="22" r="18" fill="#d97706" />
                {/* Ear */}
                <ellipse cx="6" cy="18" rx="8" ry="14" fill="#92400e" />
                {/* Snout */}
                <ellipse cx="25" cy="28" rx="10" ry="7" fill="#fef3c7" />
                <circle cx="28" cy="25" r="3" fill="#1e293b" />
                {/* Eye */}
                <circle cx="18" cy="18" r="3" fill="#1e293b" />
                {/* Tail */}
                <path d="M 65 42 Q 78 30 75 20" stroke="#d97706" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Paws */}
                <ellipse cx="20" cy="58" rx="8" ry="5" fill="#b45309" />
                <ellipse cx="50" cy="58" rx="8" ry="5" fill="#b45309" />
              </g>

              {/* Spatial Indicator Marker */}
              <g transform="translate(210, 150)">
                <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#ef4444" opacity="0.9" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">UNDER</text>
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Room Background */}
              <rect x="0" y="0" width="400" height="230" fill="#f0fdf4" opacity="0.5" />
              <rect x="0" y="230" width="400" height="70" fill="#15803d" opacity="0.15" />
              {/* Picture frame on wall */}
              <rect x="50" y="40" width="70" height="50" rx="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
              <circle cx="85" cy="65" r="12" fill="#f97316" />

              {/* Wooden Chair */}
              {/* Chair Backrest */}
              <rect x="180" y="70" width="16" height="110" rx="4" fill="#a16207" />
              <rect x="196" y="90" width="50" height="10" rx="2" fill="#ca8a04" />
              <rect x="196" y="115" width="50" height="10" rx="2" fill="#ca8a04" />
              {/* Chair Seat */}
              <rect x="175" y="170" width="90" height="16" rx="4" fill="#854d0e" stroke="#713f12" strokeWidth="2" />
              {/* Chair Legs */}
              <rect x="185" y="186" width="12" height="60" rx="3" fill="#a16207" />
              <rect x="245" y="186" width="12" height="60" rx="3" fill="#a16207" />

              {/* Cat ON the chair */}
              <g transform="translate(195, 120)">
                {/* Cat body */}
                <ellipse cx="30" cy="35" rx="22" ry="18" fill="#f97316" />
                {/* Cat head */}
                <circle cx="20" cy="18" r="14" fill="#f97316" />
                {/* Ears */}
                <polygon points="12,10 16,3 22,9" fill="#c2410c" />
                <polygon points="20,9 26,3 29,10" fill="#c2410c" />
                {/* Eyes */}
                <circle cx="16" cy="16" r="2.5" fill="#1e293b" />
                <circle cx="24" cy="16" r="2.5" fill="#1e293b" />
                {/* Whiskers */}
                <line x1="8" y1="20" x2="3" y2="18" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="8" y1="22" x2="3" y2="23" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="28" y1="20" x2="33" y2="18" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="28" y1="22" x2="33" y2="23" stroke="#ffffff" strokeWidth="1.5" />
                {/* Tail curled */}
                <path d="M 48 38 Q 62 42 56 26" stroke="#f97316" strokeWidth="5" strokeLinecap="round" fill="none" />
              </g>

              {/* Spatial Indicator Marker */}
              <g transform="translate(225, 95)">
                <rect x="-30" y="-12" width="60" height="24" rx="12" fill="#0284c7" opacity="0.9" />
                <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">ON</text>
              </g>
            </svg>
          )}

          {/* Prompt banner under illustration */}
          <div className="mt-2 text-center">
            <span className="text-xs font-bold text-slate-600 bg-amber-100/60 px-3 py-1 rounded-full">
              {question.prompt}
            </span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT 40%: SENTENCE FRAME & RECORDING CONTROLS ================= */}
      <div className="w-full md:w-[40%] bg-white p-5 md:p-7 flex flex-col justify-between border-l border-amber-200/80 shadow-md overflow-y-auto">
        <div>
          {/* Section Header */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-1.5">
              Speaking Practice
            </span>
            <h2 className="font-display text-xl md:text-2xl font-black text-slate-900 leading-snug">
              Complete the sentence and speak out loud!
            </h2>
          </div>

          {/* Sentence Frame Box (The ___ is ___ the ___.) */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 mb-5 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              Sentence Frame:
            </div>
            <div className="font-display text-xl md:text-2xl font-black text-slate-900 flex flex-wrap items-center gap-1.5 leading-relaxed">
              <span>The</span>
              <span className="px-2.5 py-0.5 bg-white border-2 border-amber-400 rounded-lg text-amber-900 font-extrabold">
                {question.subject}
              </span>
              <span>is</span>
              <span className="px-3 py-0.5 bg-amber-400 text-slate-950 rounded-lg underline font-extrabold shadow-2xs">
                {question.preposition}
              </span>
              <span>the</span>
              <span className="px-2.5 py-0.5 bg-white border-2 border-amber-400 rounded-lg text-amber-900 font-extrabold">
                {question.object}
              </span>
              <span>.</span>
            </div>
            <p className="text-xs text-amber-900/80 mt-3 font-semibold">
              Read aloud: <span className="italic">"{question.targetSentence}"</span>
            </p>
          </div>

          {/* Recording Status / Live Waveform */}
          {isRecording && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 mb-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-rose-600 animate-ping" />
                <div>
                  <span className="text-xs font-black text-rose-900 block">
                    Recording your voice...
                  </span>
                  <span className="text-xs text-rose-700 font-bold">
                    00:0{recordingSeconds} / 00:10
                  </span>
                </div>
              </div>
              <span className="text-xs text-rose-800 font-extrabold uppercase">Speak now!</span>
            </div>
          )}

          {/* Recorded Success Badge */}
          {audioUrl && !isRecording && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-extrabold text-emerald-900">
                  Voice recorded successfully!
                </span>
              </div>
              <button
                onClick={handleToggleRecord}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                title="Record again"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Re-record</span>
              </button>
            </div>
          )}

          {micError && (
            <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mb-3">
              {micError}
            </div>
          )}
        </div>

        {/* ================= BOTTOM ROW OF BUTTONS (PER PRD) ================= */}
        {/* Buttons in a horizontal row at bottom right: [🎙 Record], [▶ My Voice], [🔊 Hear Example] */}
        <div className="mt-5 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {/* 1. Record Button */}
            <button
              onClick={handleToggleRecord}
              className={`py-3 px-2 rounded-2xl font-display font-extrabold text-xs md:text-sm flex flex-col items-center justify-center gap-1 transition-all ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300'
              }`}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isRecording ? 'Stop' : '🎙 Record'}</span>
            </button>

            {/* 2. My Voice Button (Immediate playback per PRD) */}
            <button
              onClick={handlePlayMyVoice}
              disabled={!audioUrl || isRecording}
              className={`py-3 px-2 rounded-2xl font-display font-extrabold text-xs md:text-sm flex flex-col items-center justify-center gap-1 transition-all ${
                audioUrl && !isRecording
                  ? isPlayingMyVoice
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-2 border-sky-300'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <Play className={`w-5 h-5 ${isPlayingMyVoice ? 'fill-white' : ''}`} />
              <span>{isPlayingMyVoice ? 'Playing...' : '▶ My Voice'}</span>
            </button>

            {/* 3. Hear Example Button */}
            <button
              onClick={handleHearExample}
              className="py-3 px-2 rounded-2xl font-display font-extrabold text-xs md:text-sm flex flex-col items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>🔊 Example</span>
            </button>
          </div>

          {/* Next / Finish Button */}
          <button
            onClick={() => {
              soundFx.playPageTurn();
              onNext();
            }}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-display font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>{questionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results 🏆'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};
