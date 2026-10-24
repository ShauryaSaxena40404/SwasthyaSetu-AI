export type UserRole = 'patient' | 'doctor';

export interface DoctorDetails {
  specialty: string;
  registrationNumber: string; // Medical Council Registration (e.g., NMC-MH-2018-8472)
  qualifications: string;
  experienceYears: number;
  isVerified: boolean; // Must be administrator or workflow verified, distinguished from demo
  hospitalOrClinic: string;
  availableDays: string[];
  timeSlots: string[];
  languages: string[];
  bio?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  abhaId?: string; // Optional Ayushman Bharat Health Account ID
  doctorProfile?: DoctorDetails;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
export type UrgencyLevel = 'routine' | 'moderate' | 'urgent';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  urgencyLevel: UrgencyLevel;
  symptomsSummary: string;
  consultationId?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface ConsultationPreparationInput {
  symptoms: string;
  symptomDuration: string;
  relevantMedicalHistory: string;
  currentMedications: string;
  allergies: string;
  patientNotes?: string;
}

export interface AIGeneratedDraft {
  chiefComplaint: string;
  clinicalBrief: string;
  suggestedQuestionsForDoctor: string[];
  observedFactors: string[];
  isDraft: true;
  generatedAt: string;
  disclaimer: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  patientInput: ConsultationPreparationInput;
  aiDraftSummary: AIGeneratedDraft;
  clinicalNotes?: string;
  doctorRecommendations?: string;
  status: 'draft' | 'in_progress' | 'completed';
  completedAt?: string;
  updatedAt?: string;
}

export interface ChatCitation {
  title: string;
  organization: string;
  url?: string;
  verificationDate?: string;
  sourceType: 'official_scheme' | 'guideline' | 'emergency_helpline';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  emergencyType?: 'cardiac' | 'stroke' | 'respiratory' | 'trauma' | 'mental_health' | 'general_urgent';
  citations?: ChatCitation[];
  suggestedPrompts?: string[];
  actionPrompt?: {
    label: string;
    path: string;
  };
}

export interface HealthcareService {
  id: string;
  name: string;
  nameHindi: string;
  category: 'Telemedicine' | 'Insurance & Financial Aid' | 'Medicine & Pharmacy' | 'Maternal & Child' | 'Mental Health' | 'Emergency';
  description: string;
  descriptionHindi: string;
  eligibility: string;
  requiredDocuments: string[];
  applicationSteps: string[];
  officialPortalUrl: string;
  helpline: string;
  lastVerifiedDate: string;
  isVerified: boolean;
  coverageDetails: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  title: string;
  recordType: 'prescription' | 'lab_report' | 'consultation_summary' | 'vaccination_record';
  date: string;
  doctorOrClinic: string;
  fileSize?: string;
  fileType?: string;
  fileUrl?: string;
  notes?: string;
  isDemoUploaded?: boolean;
}

export interface PatientDashboardData {
  patient: User;
  upcomingAppointments: Appointment[];
  recentConsultations: Consultation[];
  healthRecordsCount: number;
  featuredServices: HealthcareService[];
}

export interface DoctorDashboardData {
  doctor: User;
  todayAppointments: Appointment[];
  pendingRequests: Appointment[];
  completedCount: number;
  upcomingCount: number;
  recentConsultations: Consultation[];
}

export interface EmergencyScreeningResult {
  isUrgent: boolean;
  matchedKeywords: string[];
  primaryConcern?: string;
  emergencyNumber: string;
  guidanceText: string;
}
