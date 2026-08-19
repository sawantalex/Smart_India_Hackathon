import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language, ScreenName } from '../types';
import { Globe, Volume2, CheckCircle2 } from 'lucide-react';
import { VoiceService } from '../services/voice';

interface LanguageSelectScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({ onNavigate }) => {
  const { language, setLanguage } = useLanguage();

  const languages: { id: Language; label: string; subLabel: string; sampleAudio: string }[] = [
    { id: 'hi', label: 'हिंदी (Hindi)', subLabel: 'उत्तर एवं मध्य भारत की मुख्य भाषा', sampleAudio: 'नमस्ते, आप अपनी भाषा में लक्षण बता सकते हैं' },
    { id: 'mr', label: 'मराठी (Marathi)', subLabel: 'महाराष्ट्र राज्याची राजभाषा', sampleAudio: 'नमस्कार, आपण आपल्या भाषेत लक्षणे सांगू शकता' },
    { id: 'en', label: 'English', subLabel: 'Indian English', sampleAudio: 'Hello, you can speak your symptoms naturally' },
  ];

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    VoiceService.speak(
      languages.find(l => l.id === lang)?.sampleAudio || 'Language updated',
      lang
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center mb-3">
          <Globe className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Select Voice & Interface Language</h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose your preferred regional language for speech recognition and audio guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {languages.map((item) => {
          const isSelected = language === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 border-teal-500 text-slate-100 shadow-xl'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-teal-400 bg-teal-400 text-slate-950' : 'border-slate-600'}`}>
                  {isSelected && <CheckCircle2 className="w-5 h-5 fill-current text-slate-950" />}
                </div>
                <div>
                  <h4 className="text-lg font-bold">{item.label}</h4>
                  <p className="text-xs text-slate-400">{item.subLabel}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  VoiceService.speak(item.sampleAudio, item.id);
                }}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-900 text-teal-400 rounded-xl border border-slate-700/60 flex items-center gap-1.5 text-xs font-semibold"
              >
                <Volume2 className="w-4 h-4" />
                Listen
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onNavigate('PATIENT_DASHBOARD')}
        className="w-full btn-large bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg mt-4"
      >
        Confirm Language & Continue
      </button>
    </div>
  );
};
