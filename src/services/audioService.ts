/**
 * Audio Service for "Which Way, Mina?"
 * Provides:
 * 1. Web Audio API synthesized sound effects (instant, robust, no network dependencies)
 * 2. SpeechSynthesis API for native English read-aloud (Normal and Slow speed)
 * 3. MediaRecorder for learner voice recording and playback
 */

class SoundEffectManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      // AudioContext not supported
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sparkling bell chime when hidden object is found
   */
  public playSparkle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.5);
    });
  }

  /**
   * Correct answer cheerful two-tone chime
   */
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [587.33, 880.0]; // D5 -> A5

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.22, now + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.45);
    });
  }

  /**
   * Gentle dead end sound (gentle woodblock wobble)
   */
  public playDeadEnd() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.35);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Soft page turn sound
   */
  public playPageTurn() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(2.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
  }

  /**
   * Path Opening celebration fanfare
   */
  public playPathOpen() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = [
      { f: 440, t: 0.0, d: 0.12 }, // A4
      { f: 554.37, t: 0.12, d: 0.12 }, // C#5
      { f: 659.25, t: 0.24, d: 0.15 }, // E5
      { f: 880, t: 0.39, d: 0.45 }, // A5
    ];

    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0, now + note.t);
      gain.gain.linearRampToValueAtTime(0.2, now + note.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.05);
    });
  }

  /**
   * Trophy victory fanfare
   */
  public playTrophyFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const times = [0, 0.15, 0.3, 0.48, 0.7, 0.88];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = times[idx];

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + t);

      gain.gain.setValueAtTime(0, now + t);
      gain.gain.linearRampToValueAtTime(0.24, now + t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + (idx === 5 ? 0.7 : 0.2));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + t);
      osc.stop(now + t + (idx === 5 ? 0.75 : 0.25));
    });
  }
}

export const soundFx = new SoundEffectManager();

/**
 * Text-to-Speech Engine wrapper
 */
class SpeechManager {
  private isSpeakingState = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private cachedEnglishVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.findBestEnglishVoice();
      };
      this.findBestEnglishVoice();
    }
  }

  private findBestEnglishVoice(): SpeechSynthesisVoice | null {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prioritize natural English voices
    const enVoices = voices.filter((v) => v.lang.startsWith('en'));
    const preferred =
      enVoices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria')) ||
      enVoices.find((v) => v.lang === 'en-US') ||
      enVoices[0] ||
      voices[0];

    this.cachedEnglishVoice = preferred;
    return preferred;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  public speak(
    text: string,
    options?: {
      rate?: number; // 1.0 for normal, 0.72 for slow
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options?.onEnd?.();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.cachedEnglishVoice || this.findBestEnglishVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'en-US';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.05; // Slightly cheerful, friendly pitch for kids

    utterance.onstart = () => {
      this.isSpeakingState = true;
      options?.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const speechService = new SpeechManager();

/**
 * Microphone Recorder Manager
 */
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private stream: MediaStream | null = null;

  public async start(): Promise<boolean> {
    try {
      this.audioChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg')
        ? 'audio/ogg'
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      this.mediaRecorder = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      recorder.start();
      this.isRecording = true;
      return true;
    } catch {
      this.isRecording = false;
      return false;
    }
  }

  public stop(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecording) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.isRecording = false;

        // Clean up audio tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        resolve(audioUrl);
      };

      this.mediaRecorder.stop();
    });
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}
