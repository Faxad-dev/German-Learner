// Speech synthesis helper with German voice selection, speed control, and error resilience
class AudioPlayerService {
  private synth: SpeechSynthesis | null = null;
  private germanVoice: SpeechSynthesisVoice | null = null;
  private isLoaded = false;
  private rate: number = 0.9; // learner-friendly default

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
    // Prioritize high-quality German voices (Google Deutsch, de-DE, Microsoft Stefan/Katja, Apple Anna/Martin)
    const deVoice = voices.find(v => v.lang.startsWith('de') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Katja') || v.name.includes('Stefan') || v.name.includes('Anna') || v.name.includes('Martin')))
      || voices.find(v => v.lang === 'de-DE')
      || voices.find(v => v.lang.startsWith('de'));
    
    if (deVoice) {
      this.germanVoice = deVoice;
      this.isLoaded = true;
    }
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.6, Math.min(1.5, rate));
  }

  public getRate(): number {
    return this.rate;
  }

  public getVoiceName(): string {
    return this.germanVoice ? this.germanVoice.name : 'System Standard (de-DE)';
  }

  public hasGermanVoice(): boolean {
    return this.germanVoice !== null;
  }

  public speak(text: string, customRate?: number): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.synth) {
        console.warn('Speech synthesis not supported in this browser.');
        resolve(false);
        return;
      }

      // Resume synthesis if browser paused it
      if (this.synth.paused) {
        this.synth.resume();
      }

      this.synth.cancel(); // Stop any pending speech

      // Clean markdown, emojis, asterisks, and punctuation symbols that sound awkward in TTS
      const cleanText = text
        .replace(/💡|🔊|⚠️|🎉|❌|✓|—|\*|★/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) {
        resolve(true);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';
      if (this.germanVoice) {
        utterance.voice = this.germanVoice;
      }
      utterance.rate = customRate || this.rate;
      utterance.pitch = 1.0;

      utterance.onend = () => resolve(true);
      utterance.onerror = (e) => {
        // 'interrupted' is normal when a user clicks another audio before the first completes
        if (e.error !== 'interrupted') {
          console.warn('Speech synthesis event:', e.error);
        }
        resolve(false);
      };

      try {
        this.synth.speak(utterance);
      } catch (err) {
        console.warn('Could not trigger speak:', err);
        resolve(false);
      }
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
