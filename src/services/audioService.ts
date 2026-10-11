// Speech synthesis helper with German voice selection and speed control
class AudioPlayerService {
  private synth: SpeechSynthesis | null = null;
  private germanVoice: SpeechSynthesisVoice | null = null;
  private isLoaded = false;
  private rate: number = 0.9; // clear, learner-friendly pace

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize high-quality German voices (Google Deutsch, de-DE, etc.)
    const deVoice = voices.find(v => v.lang.startsWith('de') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Katja') || v.name.includes('Stefan')))
      || voices.find(v => v.lang === 'de-DE')
      || voices.find(v => v.lang.startsWith('de'));
    
    if (deVoice) {
      this.germanVoice = deVoice;
      this.isLoaded = true;
    }
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(1.5, rate));
  }

  public getRate(): number {
    return this.rate;
  }

  public speak(text: string, customRate?: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('Speech synthesis not supported in this browser.');
        resolve();
        return;
      }

      this.synth.cancel(); // Stop any pending speech

      const cleanText = text.replace(/💡|🔊|⚠️|🎉|❌|—|\*/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';
      if (this.germanVoice) {
        utterance.voice = this.germanVoice;
      }
      utterance.rate = customRate || this.rate;
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const audioService = new AudioPlayerService();
