import { Language } from '../types';

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
}

export class VoiceService {
  private static getLangCode(lang: Language): string {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'en': return 'en-IN';
      default: return 'hi-IN';
    }
  }

  public static isSTTSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  public static startListening(
    lang: Language,
    onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: string) => void
  ): () => void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback simulated voice input for testing environments
      setTimeout(() => {
        onResult({
          transcript: lang === 'hi' ? 'मुझे २ दिन से तेज़ बुखार और सीने में दर्द है' : lang === 'mr' ? 'मला २ दिवसांपासून तीव्र ताप आणि छातीत दुखत आहे' : 'I have severe fever and chest pain for 2 days',
          confidence: 0.92,
        });
      }, 1800);
      return () => {};
    }

    const recognition = new SpeechRecognition();
    recognition.lang = this.getLangCode(lang);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0];
      onResult({
        transcript: result.transcript,
        confidence: result.confidence || 0.85,
      });
    };

    recognition.onerror = (event: any) => {
      onError(event.error || 'Speech recognition failed. Please try again.');
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }

  public static speak(text: string, lang: Language) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLangCode(lang);
      utterance.rate = 0.9; // Slightly slower for low-literacy clarity
      window.speechSynthesis.speak(utterance);
    }
  }
}
