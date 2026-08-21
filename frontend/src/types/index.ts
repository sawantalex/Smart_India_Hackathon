export type Language = 'hi' | 'mr' | 'en';

export type UserRole = 'PATIENT' | 'HEALTH_WORKER' | 'ADMIN';

export type UrgencyLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EMERGENCY';

export type ReferralStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export type ScreenName =
  | 'LANDING'
  | 'LOGIN'
  | 'REGISTER'
  | 'LANGUAGE_SELECT'
  | 'PATIENT_DASHBOARD'
  | 'VOICE_ASSISTANT'
  | 'SYMPTOM_QUESTIONNAIRE'
  | 'ASSESSMENT_RESULT'
  | 'EMERGENCY_WARNING'
  | 'NEARBY_FACILITIES'
  | 'REFERRAL_REQUEST'
  | 'PATIENT_HISTORY'
  | 'CONSENT_PRIVACY'
  | 'NOTIFICATIONS'
  | 'WORKER_LOGIN'
  | 'ADMIN_LOGIN'
  | 'WORKER_DASHBOARD'
  | 'PATIENT_CASES'
  | 'PATIENT_DETAILS'
  | 'REFERRAL_MANAGEMENT'
  | 'FOLLOWUP_MANAGEMENT'
  | 'ANALYTICS'
  | 'ADMIN_SETTINGS'
  | 'PROFILE'
  | 'OFFLINE_SYNC_STATUS'
  // Extended integrated healthcare screens
  | 'PATIENT_TIMELINE'
  | 'APPOINTMENT_BOOKING'
  | 'QUEUE_MANAGEMENT'
  | 'TELECONSULTATION'
  | 'DIAGNOSTIC_TRACKER'
  | 'MEDICINE_SEARCH'
  | 'HIGH_RISK_WORKFLOWS'
  | 'QUALITY_DASHBOARD';

export interface Patient {
  id: number;
  user_id: number;
  patient_code: string;
  full_name: string;
  age_group: string;
  gender?: string;
  preferred_language: Language;
  district?: string;
  village_or_town?: string;
  emergency_contact_phone?: string;
  created_at: string;
}

export interface SymptomInput {
  symptoms: string[];
  duration: string;
  severity: string;
  age_group: string;
  associated_symptoms: string[];
  red_flags: string[];
  language: Language;
  confidence: number;
  voice_input_used?: boolean;
  raw_transcript?: string;
  district?: string;
}

export interface TriageAssessment {
  id: number;
  patient_id: number;
  risk_category: UrgencyLevel;
  explanation: string;
  recommended_next_step: string;
  detected_symptoms: string[];
  detected_red_flags: string[];
  confidence_score: number;
  model_version: string;
  is_worker_overridden: boolean;
  worker_override_category?: UrgencyLevel;
  worker_notes?: string;
  created_at: string;
}

export interface Facility {
  id: number;
  name: string;
  facility_type: string;
  services: string;
  district: string;
  village_or_town: string;
  latitude?: number;
  longitude?: number;
  emergency_capable: boolean;
  is_verified: boolean;
  contact_phone: string;
  operating_hours: string;
}

export interface Referral {
  id: number;
  referral_code: string;
  patient_id: number;
  assessment_id?: number;
  facility_id: number;
  assigned_worker_id?: number;
  urgency: UrgencyLevel;
  reason: string;
  status: ReferralStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Encounter {
  id: number;
  encounter_code: string;
  patient_id: number;
  facility_id?: number;
  facility_name?: string;
  worker_id?: number;
  encounter_type: string;
  title: string;
  summary: string;
  clinical_notes?: string;
  urgency: UrgencyLevel;
  created_at: string;
}

export interface Appointment {
  id: number;
  appointment_code: string;
  patient_id: number;
  facility_id: number;
  facility_name?: string;
  department: string;
  appointment_date: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface QueueToken {
  id: number;
  token_number: string;
  facility_id: number;
  facility_name?: string;
  department: string;
  priority: string;
  status: string;
  position: number;
  estimated_wait_minutes: number;
  created_at: string;
}

export interface ConsultationSession {
  id: number;
  session_code: string;
  patient_id: number;
  facility_id: number;
  facility_name?: string;
  specialty: string;
  status: string;
  reason: string;
  clinical_summary: string;
  is_ai_generated_summary: string;
  clinician_notes?: string;
  created_at: string;
}

export interface DiagnosticOrder {
  id: number;
  order_code: string;
  patient_id: number;
  facility_id: number;
  facility_name?: string;
  test_name: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface MedicineSearchItem {
  id: number;
  name: string;
  generic_name: string;
  category: string;
  dosage_form: string;
  facility_id: number;
  facility_name: string;
  facility_district: string;
  status: string;
  last_updated: string;
}

export interface HighRiskFollowUp {
  id: number;
  followup_code: string;
  patient_id: number;
  category: string;
  priority: string;
  scheduled_date: string;
  reason: string;
  status: string;
  contact_method: string;
  notes?: string;
  created_at: string;
}
