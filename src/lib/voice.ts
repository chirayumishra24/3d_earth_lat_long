// Web Speech API Voice Synthesis helper for classroom audio narration

class VoiceNarrator {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Clear pedagogical speed
    utterance.pitch = 1.05;
    utterance.lang = 'en-US';

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    const englishVoice = voices.find(
      (v) => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingState = false;
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth ? this.synth.speaking : false);
  }
}

export const voiceNarrator = new VoiceNarrator();
