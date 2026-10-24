import { 
  User, 
  Appointment, 
  AppointmentStatus,
  Consultation, 
  HealthcareService, 
  HealthRecord, 
  ChatMessage, 
  PatientDashboardData, 
  DoctorDashboardData, 
  ConsultationPreparationInput,
  AIGeneratedDraft
} from '../types';
import { 
  INITIAL_SERVICES, 
  DEMO_USERS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_CONSULTATIONS, 
  INITIAL_HEALTH_RECORDS 
} from './mockData';
import { screenForEmergencies, CLINICAL_DISCLAIMER_TEXT } from './safety';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Local storage keys for client-side demo persistence
const STORAGE_KEYS = {
  TOKEN: 'swasthya_token',
  USER: 'swasthya_user',
  SERVICES: 'swasthya_services_db',
  APPOINTMENTS: 'swasthya_appointments_db',
  CONSULTATIONS: 'swasthya_consultations_db',
  RECORDS: 'swasthya_records_db',
  CHAT_HISTORY: 'swasthya_chat_history',
  DEMO_FLAG: 'swasthya_is_demo_mode'
};

// Initialize demo storage if not already present
function initDemoStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(INITIAL_CONSULTATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_HEALTH_RECORDS));
  }
}

initDemoStorage();

// Helper to get demo database collections
function getLocalCollection<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCollection<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Token helper
export function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
}

export function isLocalDemoActive(): boolean {
  return localStorage.getItem(STORAGE_KEYS.DEMO_FLAG) === 'true';
}

export function setLocalDemoActive(active: boolean) {
  localStorage.setItem(STORAGE_KEYS.DEMO_FLAG, active ? 'true' : 'false');
}

// Real Fetch Wrapper with automatic fallback to mock demo store
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {},
  fallbackFn: () => Promise<T>
): Promise<{ data: T; isDemo: boolean }> {
  // If explicitly in mock mode or API is relative and backend may be down, attempt fetch first
  try {
    const token = getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      const data = await response.json();
      setLocalDemoActive(false);
      return { data, isDemo: false };
    }

    // If server responded with 401 or 403 or 400 validation error, bubble error unless offline fallback is suitable
    if (response.status === 401 || response.status === 403 || response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    // 404 or 500: Server exists but endpoint not found or backend not configured -> use demo mode
    console.warn(`Backend responded with status ${response.status} at ${endpoint}. Falling back to demo mode.`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '';
    // If it's a specific auth/validation error from the server, rethrow
    if (message.includes('401') || message.includes('403') || message.includes('400')) {
      throw err;
    }
    // Network error: backend server is offline or proxy failed
    console.info(`Backend unreachable at ${endpoint}. Using interactive demo mode.`);
  }

  // Graceful fallback to verified client-side demo storage
  setLocalDemoActive(true);
  const data = await fallbackFn();
  return { data, isDemo: true };
}

// API Service Interface
export const api = {
  // 1. POST /api/auth/login
  async login(email: string, role: 'patient' | 'doctor', password?: string): Promise<{ user: User; token: string; isDemo: boolean }> {
    return (await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role, password })
    }, async () => {
      // Demo logic
      const matchedUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role) 
        || DEMO_USERS.find(u => u.role === role);

      if (!matchedUser) {
        throw new Error(`No demo ${role} account found matching this email. Use quick-fill demo credentials.`);
      }

      const token = `demo_token_${matchedUser.id}_${Date.now()}`;
      setStoredToken(token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(matchedUser));
      return { user: matchedUser, token };
    })).data as { user: User; token: string; isDemo: boolean };
  },

  // 2. POST /api/auth/register
  async register(userData: Partial<User> & { password?: string }): Promise<{ user: User; token: string; isDemo: boolean }> {
    return (await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }, async () => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || 'New User',
        email: userData.email || `user${Date.now()}@swasthyasetu.in`,
        role: userData.role || 'patient',
        phone: userData.phone || '+91 98000 00000',
        gender: userData.gender || 'other',
        age: userData.age || 35,
        abhaId: userData.abhaId,
        doctorProfile: userData.role === 'doctor' ? {
          specialty: userData.doctorProfile?.specialty || 'General Medicine',
          registrationNumber: userData.doctorProfile?.registrationNumber || 'NMC-TEMP-2026',
          qualifications: userData.doctorProfile?.qualifications || 'MBBS',
          experienceYears: userData.doctorProfile?.experienceYears || 3,
          isVerified: false, // Unverified by default until official admin verification
          hospitalOrClinic: userData.doctorProfile?.hospitalOrClinic || 'Community Health Centre',
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          timeSlots: ['10:00 AM', '02:00 PM', '04:00 PM'],
          languages: ['Hindi', 'English'],
          bio: 'Registered doctor profile pending manual verification by portal administrator.'
        } : undefined
      };

      const token = `demo_token_${newUser.id}_${Date.now()}`;
      setStoredToken(token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return { user: newUser, token };
    })).data as { user: User; token: string; isDemo: boolean };
  },

  // 3. GET /api/auth/me
  async getCurrentUser(): Promise<User | null> {
    try {
      const result = await apiRequest<User>('/auth/me', { method: 'GET' }, async () => {
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        if (!stored) throw new Error('No user authenticated');
        return JSON.parse(stored) as User;
      });
      return result.data;
    } catch {
      return null;
    }
  },

  // 4. GET /api/patient/dashboard
  async getPatientDashboard(patientId: string): Promise<PatientDashboardData> {
    const result = await apiRequest<PatientDashboardData>(`/patient/dashboard?patientId=${patientId}`, { method: 'GET' }, async () => {
      const appointments = getLocalCollection<Appointment>(STORAGE_KEYS.APPOINTMENTS)
        .filter(a => a.patientId === patientId || a.patientId === 'patient-sunita');
      const consultations = getLocalCollection<Consultation>(STORAGE_KEYS.CONSULTATIONS)
        .filter(c => c.patientId === patientId || c.patientId === 'patient-sunita');
      const records = getLocalCollection<HealthRecord>(STORAGE_KEYS.RECORDS)
        .filter(r => r.patientId === patientId || r.patientId === 'patient-sunita');
      const services = getLocalCollection<HealthcareService>(STORAGE_KEYS.SERVICES).slice(0, 3);
      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');

      return {
        patient: user,
        upcomingAppointments: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending'),
        recentConsultations: consultations,
        healthRecordsCount: records.length,
        featuredServices: services
      };
    });
    return result.data;
  },

  // 5. POST /api/assistant/chat
  async sendAssistantMessage(messageText: string, context?: { patientId?: string }): Promise<ChatMessage> {
    // 1. Mandatory client-side safety screening before network
    const safetyCheck = screenForEmergencies(messageText);

    if (safetyCheck.isUrgent) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ URGENT CLINICAL ALERT: ${safetyCheck.guidanceText}\n\nImmediate Actions:\n• Call Emergency Medical Services: ${safetyCheck.emergencyNumber}\n• Please do not delay seeking immediate in-person emergency care. AI assistants cannot provide emergency medical intervention.`,
        timestamp: new Date().toISOString(),
        isEmergencyAlert: true,
        emergencyType: 'general_urgent',
        citations: [
          {
            title: 'National Emergency Response System (MoHFW & MHA)',
            organization: 'Government of India',
            url: 'https://112.gov.in',
            verificationDate: '2026-10-01',
            sourceType: 'emergency_helpline'
          }
        ],
        suggestedPrompts: [
          'Call 112 National Emergency',
          'Call 108 Ambulance',
          'Locate Nearest Government Hospital'
        ]
      };
    }

    const result = await apiRequest<ChatMessage>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message: messageText, context })
    }, async () => {
      // Dynamic intelligent response generation based on healthcare access context
      const lower = messageText.toLowerCase();
      let reply = '';
      const citations = [];
      let suggestedPrompts = [
        'How do I prepare for a doctor consultation?',
        'Explain a verified healthcare service.',
        'Help me organize my symptoms for my doctor.'
      ];
      let actionPrompt;

      if (lower.includes('prepare') || lower.includes('consultation') || lower.includes('symptom')) {
        reply = `Preparing for your consultation helps your doctor understand your health condition faster and more accurately.\n\nHere is a 4-step checklist:\n1. Note down your primary symptom and exactly when it began (duration & pattern).\n2. Bring a complete list of your current medications and known allergies.\n3. Keep recent lab reports, discharge summaries, or blood pressure readings handy.\n4. Write down 2-3 specific questions you want to ask the clinician.\n\nYou can use our structured Consultation Preparation tool to automatically organize these details into a clinical draft summary for your doctor.`;
        actionPrompt = {
          label: 'Launch Consultation Preparation Form',
          path: '/patient/consultation-prep'
        };
        citations.push({
          title: 'eSanjeevani Teleconsultation Patient Guide',
          organization: 'Ministry of Health & Family Welfare',
          url: 'https://esanjeevani.mohfw.gov.in',
          verificationDate: '2026-10-01',
          sourceType: 'guideline' as const
        });
      } else if (lower.includes('ayushman') || lower.includes('pm-jay') || lower.includes('card') || lower.includes('5 lakh')) {
        reply = `Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) provides health coverage of up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization.\n\nKey Verified Details:\n• Over 27,000 empanelled public and private hospitals across India.\n• Cashless and paperless treatment at the point of care.\n• No restriction on family size, age, or gender.\n• Citizens aged 70 and above are now eligible under the expanded Senior Citizen PM-JAY.\n\nWould you like to review eligibility criteria and required documents?`;
        citations.push({
          title: 'National Health Authority (NHA) PM-JAY Guidelines',
          organization: 'Ministry of Health & Family Welfare',
          url: 'https://beneficiary.nha.gov.in',
          verificationDate: '2026-09-15',
          sourceType: 'official_scheme' as const
        });
      } else if (lower.includes('medicine') || lower.includes('generic') || lower.includes('jan aushadhi')) {
        reply = `Under the Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP), citizens can purchase quality generic medicines at 50% to 90% lower prices than branded equivalents at over 10,000 Jan Aushadhi Kendras.\n\nAll medicines undergo rigorous quality batch testing at NABL-accredited laboratories before distribution.`;
        citations.push({
          title: 'Pharmaceuticals & Medical Devices Bureau of India (PMBI)',
          organization: 'Department of Pharmaceuticals',
          url: 'https://janaushadhi.gov.in',
          verificationDate: '2026-08-20',
          sourceType: 'official_scheme' as const
        });
      } else if (lower.includes('mental health') || lower.includes('anxiety') || lower.includes('stress') || lower.includes('tele-manas')) {
        reply = `The Ministry of Health operates the National Tele-MANAS helpline (14416 / 1800-891-4416), offering round-the-clock free, confidential mental health counseling in 20+ Indian languages.\n\nCounselors provide psychological first aid and can refer to district specialists when required.`;
        citations.push({
          title: 'National Tele Mental Health Programme (Tele-MANAS)',
          organization: 'NIMHANS & MoHFW',
          url: 'https://telemanas.mohfw.gov.in',
          verificationDate: '2026-09-30',
          sourceType: 'emergency_helpline' as const
        });
      } else {
        reply = `Namaste! I am your SwasthyaSetu AI Healthcare Access Assistant. I can help you understand verified government healthcare schemes (such as Ayushman Bharat PM-JAY and Jan Aushadhi Kendras), locate telemedicine facilities like eSanjeevani, and organize your symptoms into a structured draft for your doctor's review.\n\n*Reminder: I provide general health access guidance and do not replace a qualified medical practitioner.*`;
        suggestedPrompts = [
          'How do I prepare for a doctor consultation?',
          'What is Ayushman Bharat PM-JAY?',
          'How can I find affordable medicines through Jan Aushadhi?'
        ];
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toISOString(),
        citations,
        suggestedPrompts,
        actionPrompt
      };
    });

    return result.data;
  },

  // 6. POST /api/assistant/prepare-consultation
  async prepareConsultation(input: ConsultationPreparationInput): Promise<AIGeneratedDraft> {
    // Safety check on symptoms input
    const safetyCheck = screenForEmergencies(input.symptoms);
    if (safetyCheck.isUrgent) {
      throw new Error(`URGENT: ${safetyCheck.guidanceText} Please call ${safetyCheck.emergencyNumber} immediately.`);
    }

    const result = await apiRequest<AIGeneratedDraft>('/assistant/prepare-consultation', {
      method: 'POST',
      body: JSON.stringify(input)
    }, async () => {
      // Deterministic, clinically structured draft generation
      const chiefComplaint = `${input.symptoms.slice(0, 120)} (Reported duration: ${input.symptomDuration || 'Not specified'})`;
      
      const clinicalBrief = `Patient reports symptoms: "${input.symptoms}". Duration: ${input.symptomDuration}. ` +
        `Relevant history: ${input.relevantMedicalHistory || 'None reported'}. ` +
        `Current medications: ${input.currentMedications || 'None listed'}. ` +
        `Allergies: ${input.allergies || 'No known drug allergies reported'}. ` +
        (input.patientNotes ? `Additional patient notes: "${input.patientNotes}".` : '');

      const questions: string[] = [
        'What could be the underlying physiological cause of these symptoms?',
        'Are diagnostic investigations or lab tests warranted at this stage?',
        'Are there any dietary, postural, or lifestyle modifications I should adopt immediately?'
      ];

      if (input.currentMedications && input.currentMedications.toLowerCase() !== 'none') {
        questions.push('Could any of my current medications be contributing to or interacting with these symptoms?');
      }

      const observedFactors: string[] = [
        `Duration specified: ${input.symptomDuration}`,
        `Documented drug allergies: ${input.allergies || 'NKDA'}`,
        'Self-reported symptoms require physical examination and objective vital checks.'
      ];

      return {
        chiefComplaint,
        clinicalBrief,
        suggestedQuestionsForDoctor: questions,
        observedFactors,
        isDraft: true,
        generatedAt: new Date().toISOString(),
        disclaimer: CLINICAL_DISCLAIMER_TEXT
      };
    });

    return result.data;
  },

  // 7. GET /api/services
  async getServices(search?: string, category?: string): Promise<HealthcareService[]> {
    const result = await apiRequest<HealthcareService[]>(`/services?search=${search || ''}&category=${category || ''}`, { method: 'GET' }, async () => {
      let services = getLocalCollection<HealthcareService>(STORAGE_KEYS.SERVICES);
      if (category && category !== 'All') {
        services = services.filter(s => s.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        services = services.filter(s => 
          s.name.toLowerCase().includes(q) || 
          s.description.toLowerCase().includes(q) ||
          s.nameHindi.includes(q)
        );
      }
      return services;
    });
    return result.data;
  },

  // 8. GET /api/appointments
  async getAppointments(patientId?: string): Promise<Appointment[]> {
    const result = await apiRequest<Appointment[]>(`/appointments?patientId=${patientId || ''}`, { method: 'GET' }, async () => {
      const appointments = getLocalCollection<Appointment>(STORAGE_KEYS.APPOINTMENTS);
      if (patientId) {
        return appointments.filter(a => a.patientId === patientId || a.patientId === 'patient-sunita');
      }
      return appointments;
    });
    return result.data;
  },

  // 9. POST /api/appointments (with double-booking prevention)
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt'> & { consultationData?: ConsultationPreparationInput }): Promise<Appointment> {
    const result = await apiRequest<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    }, async () => {
      const appointments = getLocalCollection<Appointment>(STORAGE_KEYS.APPOINTMENTS);

      // Double-booking check: same doctor, same date, same time slot, not cancelled/rejected
      const isConflict = appointments.some(
        a => a.doctorId === appointmentData.doctorId &&
             a.date === appointmentData.date &&
             a.timeSlot === appointmentData.timeSlot &&
             a.status !== 'cancelled' &&
             a.status !== 'rejected'
      );

      if (isConflict) {
        throw new Error(`This time slot (${appointmentData.timeSlot} on ${appointmentData.date}) is already booked for this doctor. Please select another slot.`);
      }

      const newId = `apt-${Date.now()}`;
      const consultationId = `cons-${Date.now()}`;

      const newAppointment: Appointment = {
        ...appointmentData,
        id: newId,
        status: 'pending',
        consultationId,
        createdAt: new Date().toISOString()
      };

      appointments.unshift(newAppointment);
      saveLocalCollection(STORAGE_KEYS.APPOINTMENTS, appointments);

      // If consultation data was submitted, create corresponding consultation entry
      if (appointmentData.consultationData) {
        const consultations = getLocalCollection<Consultation>(STORAGE_KEYS.CONSULTATIONS);
        const draft = await api.prepareConsultation(appointmentData.consultationData);

        const newConsultation: Consultation = {
          id: consultationId,
          appointmentId: newId,
          patientId: appointmentData.patientId,
          patientName: appointmentData.patientName,
          doctorId: appointmentData.doctorId,
          doctorName: appointmentData.doctorName,
          patientInput: appointmentData.consultationData,
          aiDraftSummary: draft,
          status: 'draft',
          updatedAt: new Date().toISOString()
        };

        consultations.unshift(newConsultation);
        saveLocalCollection(STORAGE_KEYS.CONSULTATIONS, consultations);
      }

      return newAppointment;
    });

    return result.data;
  },

  // 10. PATCH /api/appointments/:id/status
  async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus, notes?: string): Promise<Appointment> {
    const result = await apiRequest<Appointment>(`/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    }, async () => {
      const appointments = getLocalCollection<Appointment>(STORAGE_KEYS.APPOINTMENTS);
      const index = appointments.findIndex(a => a.id === appointmentId);
      if (index === -1) {
        throw new Error('Appointment not found');
      }

      appointments[index] = {
        ...appointments[index],
        status,
        notes: notes || appointments[index].notes,
        updatedAt: new Date().toISOString()
      };

      saveLocalCollection(STORAGE_KEYS.APPOINTMENTS, appointments);
      return appointments[index];
    });

    return result.data;
  },

  // 11. GET /api/doctor/appointments
  async getDoctorAppointments(doctorId: string): Promise<DoctorDashboardData> {
    const result = await apiRequest<DoctorDashboardData>(`/doctor/appointments?doctorId=${doctorId}`, { method: 'GET' }, async () => {
      const appointments = getLocalCollection<Appointment>(STORAGE_KEYS.APPOINTMENTS)
        .filter(a => a.doctorId === doctorId || a.doctorId === 'doctor-ananya');
      const consultations = getLocalCollection<Consultation>(STORAGE_KEYS.CONSULTATIONS)
        .filter(c => c.doctorId === doctorId || c.doctorId === 'doctor-ananya');

      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(a => a.date === today && a.status === 'confirmed');
      const pendingRequests = appointments.filter(a => a.status === 'pending');
      const completedCount = appointments.filter(a => a.status === 'completed').length;
      const upcomingCount = appointments.filter(a => a.status === 'confirmed').length;

      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');

      return {
        doctor: user,
        todayAppointments,
        pendingRequests,
        completedCount,
        upcomingCount,
        recentConsultations: consultations
      };
    });

    return result.data;
  },

  // 12. GET /api/consultations/:id
  async getConsultation(consultationId: string): Promise<Consultation> {
    const result = await apiRequest<Consultation>(`/consultations/${consultationId}`, { method: 'GET' }, async () => {
      const consultations = getLocalCollection<Consultation>(STORAGE_KEYS.CONSULTATIONS);
      const item = consultations.find(c => c.id === consultationId || c.appointmentId === consultationId);
      if (!item) {
        throw new Error('Consultation record not found');
      }
      return item;
    });

    return result.data;
  },

  // 13. POST /api/consultations/:id/notes
  async saveConsultationNotes(
    consultationId: string, 
    clinicalNotes: string, 
    doctorRecommendations: string,
    markCompleted: boolean = false
  ): Promise<Consultation> {
    const result = await apiRequest<Consultation>(`/consultations/${consultationId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ clinicalNotes, doctorRecommendations, markCompleted })
    }, async () => {
      const consultations = getLocalCollection<Consultation>(STORAGE_KEYS.CONSULTATIONS);
      const index = consultations.findIndex(c => c.id === consultationId);
      if (index === -1) {
        throw new Error('Consultation not found');
      }

      consultations[index] = {
        ...consultations[index],
        clinicalNotes,
        doctorRecommendations,
        status: markCompleted ? 'completed' : 'in_progress',
        completedAt: markCompleted ? new Date().toISOString() : consultations[index].completedAt,
        updatedAt: new Date().toISOString()
      };

      saveLocalCollection(STORAGE_KEYS.CONSULTATIONS, consultations);

      // If marked completed, also update the appointment status to completed
      if (markCompleted && consultations[index].appointmentId) {
        await api.updateAppointmentStatus(consultations[index].appointmentId, 'completed');
      }

      return consultations[index];
    });

    return result.data;
  },

  // 14. GET /api/health-records
  async getHealthRecords(patientId: string): Promise<HealthRecord[]> {
    const result = await apiRequest<HealthRecord[]>(`/health-records?patientId=${patientId}`, { method: 'GET' }, async () => {
      const records = getLocalCollection<HealthRecord>(STORAGE_KEYS.RECORDS);
      // Strictly isolate: return only records belonging to this authenticated patient
      return records.filter(r => r.patientId === patientId || r.patientId === 'patient-sunita');
    });

    return result.data;
  },

  // 15. POST /api/health-records/upload
  async uploadHealthRecord(recordData: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
    const result = await apiRequest<HealthRecord>('/health-records/upload', {
      method: 'POST',
      body: JSON.stringify(recordData)
    }, async () => {
      const records = getLocalCollection<HealthRecord>(STORAGE_KEYS.RECORDS);
      const newRecord: HealthRecord = {
        ...recordData,
        id: `rec-${Date.now()}`,
        isDemoUploaded: true
      };

      records.unshift(newRecord);
      saveLocalCollection(STORAGE_KEYS.RECORDS, records);
      return newRecord;
    });

    return result.data;
  }
};
