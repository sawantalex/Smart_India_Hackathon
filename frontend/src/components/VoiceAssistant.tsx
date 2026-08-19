import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { VoiceService } from '../services/voice';
import { Mic, MicOff, Check, Volume2, Sparkles, AlertCircle } from 'lucide-react';

interface VoiceAssistantProps {
  onTranscriptComplete: (transcript: string, confidence: number) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscriptComplete }) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartListening = () => {
    setError(null);
    setIsListening(true);
    setTranscript('');
    setConfidence(null);

    VoiceService.startListening(
      language,
      (res) => {
        setIsListening(false);
        setTranscript(res.transcript);
        setConfidence(res.confidence);
        VoiceService.speak(
          language === 'hi' ? 'लक्षण दर्ज किए गए' : language === 'mr' ? 'लक्षणे नोंदवली गेली' : 'Symptoms recorded',
          language
        );
      },
      (err) => {
        setIsListening(false);
        setError(err);
      }
    );
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript, confidence || 0.85);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-full text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multilingual Voice AI ({language.toUpperCase()})</span>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2">
          {t('voice_assistant')}
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          {t('listening')}
        </p>

        {/* Recording Mic Button */}
        <div className="relative inline-block mb-6">
          {isListening && (
            <div className="absolute -inset-4 rounded-full bg-teal-500/30 animate-ping" />
          )}
          <button
            onClick={handleStartListening}
            disabled={isListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 scale-105'
                : 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 hover:scale-105 active:scale-95 shadow-teal-500/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>

        {isListening && (
          <div className="flex items-center justify-center gap-1.5 py-2 text-teal-400 text-sm font-semibold">
            <div className="w-2 h-4 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-6 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-8 bg-teal-400 rounded-full animate-bounce" />
            <div className="w-2 h-6 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-4 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="ml-2">{t('listening')}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2 mt-4 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Transcript & Confidence Monitor */}
        {transcript && (
          <div className="mt-6 text-left bg-slate-900/80 border border-slate-700/80 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-teal-400">Captured Speech Transcript</span>
              {confidence && (
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold">
                  Confidence: {Math.round(confidence * 100)}%
                </span>
              )}
            </div>
            <p className="text-base text-slate-100 font-medium mb-4 italic bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              "{transcript}"
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirm}
                className="btn-large flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Use Recorded Symptoms
              </button>
              <button
                onClick={() => VoiceService.speak(transcript, language)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                title="Play Audio Back"
              >
                <Volume2 className="w-5 h-5 text-teal-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
