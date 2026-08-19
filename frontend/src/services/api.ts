import { SymptomInput, TriageAssessment, Facility, Referral, UserRole } from '../types';
import { queueOfflineEvent, getOfflineQueue, clearOfflineQueue } from '../offline/db';

const API_BASE = '/api/v1';

export class ApiService {
  private static getToken(): string | null {
    return localStorage.getItem('his_access_token');
  }

  public static setTokens(access_token: string, refresh_token: string) {
    localStorage.setItem('his_access_token', access_token);
    localStorage.setItem('his_refresh_token', refresh_token);
  }

  public static clearTokens() {
    localStorage.removeItem('his_access_token');
    localStorage.removeItem('his_refresh_token');
  }

  private static async ensureAuthenticated() {
    if (!this.getToken()) {
      await this.login('patient_demo', 'password123');
    }
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token = this.getToken();
    if (!token && !endpoint.includes('/auth/login')) {
      await this.ensureAuthenticated();
      token = this.getToken();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        // Auto retry after re-authenticating as guest
        await this.login('patient_demo', 'password123');
        const newToken = this.getToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          const retryRes = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
          if (retryRes.ok) return await retryRes.json();
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
        throw new Error(errorData.detail || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      if (!navigator.onLine || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.warn('Network unavailable. Storing operation for offline sync.');
        throw new Error('OFFLINE');
      }
      throw err;
    }
  }

  public static async login(username: string, password: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    this.setTokens(data.access_token, data.refresh_token);
    return data;
  }

  public static async register(username: string, password: string, role: UserRole): Promise<any> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });
  }

  public static async evaluateTriage(symptomInput: SymptomInput): Promise<TriageAssessment> {
    try {
      return await this.request<TriageAssessment>('/triage/evaluate', {
        method: 'POST',
        body: JSON.stringify(symptomInput),
      });
    } catch (err: any) {
      if (err.message === 'OFFLINE') {
        await queueOfflineEvent('Assessment', 'CREATE', symptomInput);
        
        const isEmergency = symptomInput.symptoms.some(s => 
          s.toLowerCase().includes('chest') || 
          s.toLowerCase().includes('breath') || 
          s.toLowerCase().includes('unconscious') || 
          s.toLowerCase().includes('सीने') || 
          s.toLowerCase().includes('सांस')
        );

        return {
          id: Date.now(),
          patient_id: 1,
          risk_category: isEmergency ? 'EMERGENCY' : 'MODERATE',
          explanation: 'Rule engine triage note: Preliminary evaluation processed safely offline.',
          recommended_next_step: isEmergency ? 'SEEK IMMEDIATE EMERGENCY MEDICAL CARE (CALL 108)' : 'Visit nearest Primary Health Centre (PHC) OPD.',
          detected_symptoms: symptomInput.symptoms,
          detected_red_flags: isEmergency ? ['acute_offline_symptom'] : [],
          confidence_score: 0.88,
          model_version: 'rule_redflag_offline_v1',
          is_worker_overridden: false,
          created_at: new Date().toISOString(),
        };
      }
      throw err;
    }
  }

  public static async getFacilities(): Promise<Facility[]> {
    return this.request<Facility[]>('/facilities');
  }

  public static async createReferral(referralData: any): Promise<Referral> {
    return this.request<Referral>('/referrals', {
      method: 'POST',
      body: JSON.stringify(referralData),
    });
  }

  public static async overrideAssessment(assessmentId: number, overrideCategory: string, notes: string): Promise<TriageAssessment> {
    return this.request<TriageAssessment>(`/triage/${assessmentId}/override`, {
      method: 'POST',
      body: JSON.stringify({ worker_override_category: overrideCategory, worker_notes: notes }),
    });
  }

  public static async syncQueue(): Promise<any> {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return { message: 'Queue is empty' };

    const payload = {
      device_id: 'WEB-CLIENT-' + (localStorage.getItem('his_device_id') || 'DEFAULT'),
      events: queue,
    };

    const res = await this.request<any>('/sync/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    await clearOfflineQueue();
    return res;
  }
}
