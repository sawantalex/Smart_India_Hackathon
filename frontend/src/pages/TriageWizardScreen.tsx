import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { ScreenName, SymptomInput, TriageAssessment } from '../types';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { AlertTriangle, ShieldAlert, PhoneCall, Building2, Activity, Stethoscope, CheckCircle } from 'lucide-react';
import { VoiceService } from '../services/voice';

interface TriageWizardScreenProps {
  onNavigate: (screen: ScreenName) => void;
  activeScreen: 'VOICE_ASSISTANT' | 'SYMPTOM_QUESTIONNAIRE' | 'ASSESSMENT_RESULT' | 'EMERGENCY_WARNING';
  onSetResult?: (result: TriageAssessment) => void;
}

export const TriageWizardScreen: React.FC<TriageWizardScreenProps> = ({ onNavigate, activeScreen }) => {
  const { t, language } = useLanguage();

  const [symptomText, setSymptomText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState('1-2 days');
  const [severity, setSeverity] = useState('MODERATE');
  const [ageGroup, setAgeGroup] = useState('18-59');
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<TriageAssessment | null>(null);

  const commonSymptoms = [
    { id: 'fever', label: 'High Fever (तेज़ बुखार)' },
    { id: 'chest_pain', label: 'Severe Chest Pain (सीने में दर्द)' },
    { id: 'breathing_difficulty', label: 'Breathing Difficulty (सांस लेने में तकलीफ)' },
    { id: 'headache', label: 'Severe Headache (तेज़ सिरदर्द)' },
    { id: 'cough', label: 'Persistent Cough (लगातार खांसी)' },
    { id: 'abdominal_pain', label: 'Severe Abdominal Pain (पेट में तेज़ दर्द)' },
    { id: 'dizziness', label: 'Dizziness or Fainting (चक्कर आना / बेहोशी)' },
  ];

  const handleSymptomToggle = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleEvaluate = async (customTranscript?: string, customConfidence?: number) => {
    setLoading(true);
    const symptomsToSubmit = customTranscript ? [customTranscript] : selectedSymptoms.length > 0 ? selectedSymptoms : [symptomText || 'unspecified symptoms'];
    
    // Auto-detect severity from transcript or selected symptoms text
    let detectedSeverity = severity;
    const lowerText = (customTranscript || symptomText || selectedSymptoms.join(' ')).toLowerCase();
    
    if (
      lowerText.includes('chest') || lowerText.includes('breath') || lowerText.includes('unconscious') || 
      lowerText.includes('सीने') || lowerText.includes('सांस') || lowerText.includes('छातीत') || lowerText.includes('बेहोश')
    ) {
      detectedSeverity = 'UNBEARABLE';
    } else if (
      lowerText.includes('tez') || lowerText.includes('high') || lowerText.includes('severe') || 
      lowerText.includes('तेज़') || lowerText.includes('तीव्र') || lowerText.includes('बहुत') || lowerText.includes('जास्त')
    ) {
      detectedSeverity = 'SEVERE';
    } else if (
      lowerText.includes('mild') || lowerText.includes('halka') || lowerText.includes('thoda') || 
      lowerText.includes('हल्का') || lowerText.includes('थोड़ा') || lowerText.includes('मामुली')
    ) {
      detectedSeverity = 'MILD';
    }

    const input: SymptomInput = {
      symptoms: symptomsToSubmit,
      raw_transcript: customTranscript || symptomText,
      duration,
      severity: detectedSeverity,
      age_group: ageGroup,
      associated_symptoms: [],
      red_flags: [],
      language,
      confidence: customConfidence || 0.85,
    };

    try {
      const res = await ApiService.evaluateTriage(input);
      setAssessmentResult(res);

      if (res.risk_category === 'EMERGENCY') {
        VoiceService.speak('Warning! Emergency detected. Please seek immediate medical help.', language);
        onNavigate('EMERGENCY_WARNING');
      } else {
        VoiceService.speak(`Urgency Level: ${res.risk_category}. ${res.recommended_next_step}`, language);
        onNavigate('ASSESSMENT_RESULT');
      }
    } catch (e: any) {
      alert(`Error running triage: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Screen 9: Emergency Takeover Display
  if (activeScreen === 'EMERGENCY_WARNING') {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="bg-red-600/20 border-2 border-red-500 rounded-3xl p-6 sm:p-8 text-center space-y-6 emergency-pulse shadow-2xl">
          <div className="w-20 h-20 bg-red-600 text-white rounded-full mx-auto flex items-center justify-center shadow-lg shadow-red-600/40 animate-bounce">
            <AlertTriangle className="w-12 h-12" />
          </div>

          <div>
            <span className="bg-red-500/20 border border-red-500/40 text-red-300 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
              CRITICAL EMERGENCY ESCALATION DETECTED
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-red-100 mt-2">
              IMMEDIATE MEDICAL CARE REQUIRED
            </h2>
            <p className="text-sm sm:text-base text-red-200 mt-2 max-w-lg mx-auto leading-relaxed font-medium">
              Deterministic red-flag safety rule triggered for potential life-threatening emergency (e.g. chest pain / severe respiratory distress).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href="tel:108"
              className="w-full btn-large bg-red-600 hover:bg-red-500 text-white text-xl font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-600/40"
            >
              <PhoneCall className="w-7 h-7 animate-bounce" />
              CALL NATIONAL AMBULANCE 108 NOW
            </a>

            <button
              onClick={() => onNavigate('NEARBY_FACILITIES')}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm"
            >
              <Building2 className="w-5 h-5 text-red-400" />
              View Emergency Trauma Hospitals Near Pune
            </button>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-red-500/30 text-left text-xs text-red-200">
            <h4 className="font-bold text-red-300 mb-1">What to do while waiting for 108 ambulance:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Keep the patient calm, seated, or resting comfortably.</li>
              <li>Loosen tight clothing around the neck and chest.</li>
              <li>Do NOT offer heavy solid food or unverified medicines.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Screen 8: Assessment Result Screen
  if (activeScreen === 'ASSESSMENT_RESULT' && assessmentResult) {
    const isEmergency = assessmentResult.risk_category === 'EMERGENCY';
    const isHigh = assessmentResult.risk_category === 'HIGH';
    const isModerate = assessmentResult.risk_category === 'MODERATE';

    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header Badge */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preliminary Triage Result</span>
              <h2 className="text-2xl font-bold text-slate-100">Symptom Evaluation Complete</h2>
            </div>
            <div className={`px-4 py-2 rounded-2xl font-extrabold text-sm flex items-center gap-2 ${
              isEmergency ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
              isHigh ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              isModerate ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' :
              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              <Activity className="w-5 h-5" />
              {assessmentResult.risk_category} RISK
            </div>
          </div>

          {/* Reasoning & Explanation */}
          <div className="space-y-4">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80">
              <h4 className="text-xs font-bold text-teal-400 uppercase mb-1">Rule-Based Clinical Reasoning</h4>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {assessmentResult.explanation}
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80">
              <h4 className="text-xs font-bold text-emerald-400 uppercase mb-1">Recommended Next Action</h4>
              <p className="text-base text-slate-100 font-bold">
                {assessmentResult.recommended_next_step}
              </p>
            </div>

            {/* Non-diagnostic Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5">Non-Diagnostic Safety Disclaimer:</strong>
                {t('disclaimer')} All outputs must be evaluated by a certified healthcare professional.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('NEARBY_FACILITIES')}
              className="flex-1 btn-large bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm"
            >
              <Building2 className="w-5 h-5" />
              View Nearest PHC Clinics
            </button>
            <button
              onClick={() => onNavigate('REFERRAL_REQUEST')}
              className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-5 h-5 text-teal-400" />
              Request ASHA Worker Referral
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen 6: Voice Assistant Entry
  if (activeScreen === 'VOICE_ASSISTANT') {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <VoiceAssistant
          onTranscriptComplete={(transcript, confidence) => {
            setSymptomText(transcript);
            handleEvaluate(transcript, confidence);
          }}
        />

        <div className="text-center text-xs text-slate-400">
          Prefer using text inputs?{' '}
          <button
            onClick={() => onNavigate('SYMPTOM_QUESTIONNAIRE')}
            className="text-teal-400 font-bold hover:underline"
          >
            Switch to Text Symptom Questionnaire
          </button>
        </div>
      </div>
    );
  }

  // Screen 7: Symptom Questionnaire Screen
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Symptom Questionnaire</h2>
          <p className="text-xs text-slate-400 mt-1">Select symptoms, duration, and severity for preliminary triage.</p>
        </div>

        {/* Checkbox Symptoms */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
            Common Symptoms (Select all that apply)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {commonSymptoms.map((s) => {
              const isChecked = selectedSymptoms.includes(s.id);
              return (
                <div
                  key={s.id}
                  onClick={() => handleSymptomToggle(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center justify-between transition-all ${
                    isChecked
                      ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{s.label}</span>
                  {isChecked && <CheckCircle className="w-4 h-4 text-teal-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Text Area Backup */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Or Describe in detail</label>
          <textarea
            value={symptomText}
            onChange={(e) => setSymptomText(e.target.value)}
            placeholder={t('symptom_placeholder')}
            rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Duration & Severity Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Symptom Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
            >
              <option value="< 24 hours">&lt; 24 hours</option>
              <option value="1-2 days">1-2 days</option>
              <option value="3-7 days">3-7 days</option>
              <option value="> 1 week">&gt; 1 week</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Severity Level</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
            >
              <option value="MILD">MILD (Mild discomfort)</option>
              <option value="MODERATE">MODERATE (Interferes with work)</option>
              <option value="SEVERE">SEVERE (Severe pain/distress)</option>
              <option value="UNBEARABLE">UNBEARABLE (Emergency distress)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => handleEvaluate()}
          disabled={loading}
          className="w-full btn-large bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg"
        >
          {loading ? 'Evaluating Triage Rules...' : t('assess_symptoms')}
        </button>
      </div>
    </div>
  );
};
