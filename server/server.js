import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase, isSupabaseConfigured } from './supabase.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Data Store (mirrored from verified Indian healthcare dataset)
const services = [
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM-JAY',
    nameHindi: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना',
    category: 'Insurance & Financial Aid',
    description: 'World’s largest government-funded healthcare assurance scheme offering up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization.',
    descriptionHindi: 'द्वितीयक और तृतीयक अस्पताल में भर्ती के लिए प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा।',
    eligibility: 'SECC 2011 deprivation criteria & citizens aged 70+ regardless of income under the Senior Citizen PM-JAY expansion.',
    requiredDocuments: ['Aadhaar Card', 'Ration Card / PM-JAY Family ID', 'Linked Mobile Number'],
    applicationSteps: [
      'Check eligibility on beneficiary.nha.gov.in',
      'Visit Ayushman Mitra at empanelled hospital for biometric e-KYC',
      'Receive Ayushman Golden Card for cashless admission'
    ],
    officialPortalUrl: 'https://beneficiary.nha.gov.in',
    helpline: '14555 / 1800-111-565',
    lastVerifiedDate: '2026-09-15',
    isVerified: true,
    coverageDetails: 'Covers over 1,949 medical procedures across 27,000+ empanelled hospitals.'
  },
  {
    id: 'esanjeevani',
    name: 'eSanjeevani National Telemedicine Service',
    nameHindi: 'ई-संजीवनी राष्ट्रीय टेलीकंसल्टेशन सेवा',
    category: 'Telemedicine',
    description: 'The National Teleconsultation Service by MoHFW connecting citizens to registered doctors and specialists from home.',
    descriptionHindi: 'घर बैठे सरकारी एवं पैनल के डॉक्टरों से निःशुल्क डिजिटल ओपीडी परामर्श प्राप्त करें।',
    eligibility: 'All Indian citizens with internet smartphone or computer.',
    requiredDocuments: ['Mobile number for OTP', 'Aadhaar / ABHA ID', 'Previous prescriptions (optional)'],
    applicationSteps: [
      'Log into esanjeevani.mohfw.gov.in',
      'Select state and OPD department',
      'Consult clinician via audio/video call and download signed prescription'
    ],
    officialPortalUrl: 'https://esanjeevani.mohfw.gov.in',
    helpline: '1075',
    lastVerifiedDate: '2026-10-01',
    isVerified: true,
    coverageDetails: 'Free government tele-OPD active in all states and union territories.'
  },
  {
    id: 'jan-aushadhi',
    name: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)',
    nameHindi: 'प्रधानमंत्री भारतीय जनऔषधि परियोजना',
    category: 'Medicine & Pharmacy',
    description: 'Quality generic medicines at 50% to 90% savings at Jan Aushadhi Kendras.',
    descriptionHindi: 'ब्रांडेड दवाओं की तुलना में 50% से 90% कम कीमत पर उच्च गुणवत्ता वाली जेनेरिक दवाएं।',
    eligibility: 'Open to all citizens.',
    requiredDocuments: ['Valid doctor prescription for scheduled drugs'],
    applicationSteps: ['Locate Jan Aushadhi Kendra', 'Present doctor prescription', 'Purchase quality generic medicines'],
    officialPortalUrl: 'https://janaushadhi.gov.in',
    helpline: '1800-180-8080',
    lastVerifiedDate: '2026-08-20',
    isVerified: true,
    coverageDetails: 'Over 2,047 medicines and 300 surgical items across 10,000+ Kendras.'
  },
  {
    id: 'tele-manas',
    name: 'Tele-MANAS (Mental Health Helpline)',
    nameHindi: 'टेली-मानस (राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन)',
    category: 'Mental Health',
    description: '24/7 free, confidential tele-mental health assistance in 20+ languages.',
    descriptionHindi: 'तनाव, चिंता, अवसाद एवं मानसिक स्वास्थ्य परामर्श हेतु 24x7 निःशुल्क हेल्पलाइन।',
    eligibility: 'Anyone in emotional distress or needing mental health counseling.',
    requiredDocuments: ['None. Completely anonymous and confidential.'],
    applicationSteps: ['Dial 14416 or 1800-891-4416', 'Select language', 'Connect with mental health counselor'],
    officialPortalUrl: 'https://telemanas.mohfw.gov.in',
    helpline: '14416',
    lastVerifiedDate: '2026-09-30',
    isVerified: true,
    coverageDetails: 'Tier-1 counseling with Tier-2 clinical psychiatric referrals.'
  }
];

let users = [
  {
    id: 'patient-sunita',
    name: 'Sunita Sharma',
    email: 'patient@demo.swasthyasetu.in',
    role: 'patient',
    phone: '+91 98765 43210',
    gender: 'female',
    age: 48,
    abhaId: '91-4820-1928-3841'
  },
  {
    id: 'doctor-ananya',
    name: 'Dr. Ananya Sharma',
    email: 'doctor@demo.swasthyasetu.in',
    role: 'doctor',
    phone: '+91 98111 22334',
    gender: 'female',
    age: 39,
    doctorProfile: {
      specialty: 'Internal Medicine & General Physician',
      registrationNumber: 'NMC-DL-2016-19382',
      qualifications: 'MBBS, MD (General Medicine - AIIMS Delhi)',
      experienceYears: 11,
      isVerified: true,
      hospitalOrClinic: 'SwasthyaSetu Empanelled Telehealth Unit',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      timeSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM'],
      languages: ['Hindi', 'English', 'Punjabi'],
      bio: 'Consultant physician specializing in chronic disease management (diabetes, hypertension) and preventive health.'
    }
  }
];

let appointments = [
  {
    id: 'apt-101',
    patientId: 'patient-sunita',
    patientName: 'Sunita Sharma',
    patientAge: 48,
    patientGender: 'Female',
    doctorId: 'doctor-ananya',
    doctorName: 'Dr. Ananya Sharma',
    doctorSpecialty: 'Internal Medicine & General Physician',
    date: '2026-10-26',
    timeSlot: '11:00 AM',
    status: 'pending',
    urgencyLevel: 'moderate',
    symptomsSummary: 'Persistent mild headache and recurring fatigue for 10 days, elevated home blood pressure readings (142/90 mmHg).',
    consultationId: 'cons-101',
    createdAt: '2026-10-24T10:15:00Z',
    notes: 'Patient prepared structured consultation draft.'
  },
  {
    id: 'apt-100',
    patientId: 'patient-sunita',
    patientName: 'Sunita Sharma',
    patientAge: 48,
    patientGender: 'Female',
    doctorId: 'doctor-ananya',
    doctorName: 'Dr. Ananya Sharma',
    doctorSpecialty: 'Internal Medicine & General Physician',
    date: '2026-10-14',
    timeSlot: '10:30 AM',
    status: 'completed',
    urgencyLevel: 'routine',
    symptomsSummary: 'Routine annual check-up and mild knee joint stiffness in mornings.',
    consultationId: 'cons-100',
    createdAt: '2026-10-12T09:00:00Z'
  }
];

let consultations = [
  {
    id: 'cons-101',
    appointmentId: 'apt-101',
    patientId: 'patient-sunita',
    patientName: 'Sunita Sharma',
    doctorId: 'doctor-ananya',
    doctorName: 'Dr. Ananya Sharma',
    patientInput: {
      symptoms: 'Mild occipital headache in late afternoons, fatigue and occasional blurred vision after screen time.',
      symptomDuration: '10-12 days',
      relevantMedicalHistory: 'Borderline hypertension diagnosed in 2024.',
      currentMedications: 'Amlodipine 5mg once daily.',
      allergies: 'Sulfa drugs',
      patientNotes: 'Home BP monitor read 142/90.'
    },
    aiDraftSummary: {
      chiefComplaint: 'Subacute occipital headache with fluctuating elevated blood pressure in patient with hypertension.',
      clinicalBrief: 'Patient Sunita Sharma (48F) presents with 10-12 days of afternoon occipital headache and fatigue. Home BP monitoring records systolic values up to 142 mmHg. Known sulfa allergy noted. Current regimen is Amlodipine 5mg OD.',
      suggestedQuestionsForDoctor: [
        'Could current dosage of Amlodipine require titration?',
        'Are there specific diagnostic blood tests indicated?',
        'Does the headache pattern suggest eye strain or hypertensive peaks?'
      ],
      observedFactors: ['Sulfa allergy', 'Reported BP above 140/90 mmHg threshold'],
      isDraft: true,
      generatedAt: '2026-10-24T10:16:00Z',
      disclaimer: 'Draft generated for clinical preparation. Not a medical diagnosis.'
    },
    clinicalNotes: '',
    doctorRecommendations: '',
    status: 'draft',
    updatedAt: '2026-10-24T10:16:00Z'
  }
];

let healthRecords = [
  {
    id: 'rec-001',
    patientId: 'patient-sunita',
    title: 'Lipid Profile & HbA1c Comprehensive Report',
    recordType: 'lab_report',
    date: '2026-09-18',
    doctorOrClinic: 'Dr. Lal PathLabs (Jaipur Centre)',
    fileSize: '1.4 MB',
    fileType: 'PDF',
    notes: 'HbA1c: 5.7%. Total Cholesterol: 198 mg/dL.'
  }
];

// Backend Safety Screening Helper
function checkEmergencyKeywords(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  const emergencyPatterns = [
    { words: ['chest pain', 'crushing chest', 'heart attack', 'radiating to arm'], title: 'Possible Cardiac Emergency', num: '108 / 112' },
    { words: ['face drooping', 'arm weakness', 'slurred speech', 'stroke'], title: 'Possible Stroke (FAST Signs)', num: '108 / 112' },
    { words: ['cannot breathe', 'gasping for air', 'severe shortness of breath', 'choking'], title: 'Severe Respiratory Distress', num: '108 / 112' },
    { words: ['suicide', 'kill myself', 'end my life'], title: 'Mental Health Crisis Support', num: '14416 (Tele-MANAS)' },
    { words: ['throat swelling', 'anaphylaxis'], title: 'Severe Allergic Reaction', num: '108 / 112' }
  ];

  for (const p of emergencyPatterns) {
    if (p.words.some(w => lower.includes(w))) {
      return p;
    }
  }
  return null;
}

// 1. POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase() && u.role === role) ||
               users.find(u => u.role === role);
  if (!user) {
    return res.status(404).json({ message: `No demo ${role} account found` });
  }
  const token = `jwt_token_${user.id}_${Date.now()}`;
  res.json({ user, token });
});

// 2. POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, role, phone, age, gender, abhaId, doctorProfile } = req.body;
  const newUser = {
    id: `user-${Date.now()}`,
    name: name || 'Demo User',
    email: email || `user_${Date.now()}@swasthyasetu.in`,
    role: role || 'patient',
    phone,
    age,
    gender,
    abhaId,
    doctorProfile: role === 'doctor' ? {
      ...doctorProfile,
      isVerified: false // Unverified until admin verification workflow
    } : undefined
  };
  users.push(newUser);
  res.status(201).json({ user: newUser, token: `jwt_token_${newUser.id}_${Date.now()}` });
});

// 3. GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  const user = users[0]; // Returns demo user
  res.json(user);
});

// 4. GET /api/patient/dashboard
app.get('/api/patient/dashboard', (req, res) => {
  const patientId = req.query.patientId || 'patient-sunita';
  const patient = users.find(u => u.id === patientId) || users[0];
  const userAppts = appointments.filter(a => a.patientId === patientId || a.patientId === 'patient-sunita');
  const userCons = consultations.filter(c => c.patientId === patientId || c.patientId === 'patient-sunita');
  const userRecords = healthRecords.filter(r => r.patientId === patientId || r.patientId === 'patient-sunita');

  res.json({
    patient,
    upcomingAppointments: userAppts.filter(a => a.status === 'confirmed' || a.status === 'pending'),
    recentConsultations: userCons,
    healthRecordsCount: userRecords.length,
    featuredServices: services.slice(0, 3)
  });
});

// 5. POST /api/assistant/chat
app.post('/api/assistant/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message text required' });

  // Dedicated Safety Layer
  const emergency = checkEmergencyKeywords(message);
  if (emergency) {
    return res.json({
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `⚠️ URGENT CLINICAL ALERT: ${emergency.title} symptoms detected.\n\nPlease call ${emergency.num} immediately. Do not delay seeking emergency care. AI assistants cannot provide emergency clinical triage.`,
      timestamp: new Date().toISOString(),
      isEmergencyAlert: true,
      emergencyType: 'general_urgent',
      citations: [
        {
          title: 'National Emergency Response System',
          organization: 'MoHFW / MHA',
          url: 'https://112.gov.in',
          verificationDate: '2026-10-01',
          sourceType: 'emergency_helpline'
        }
      ]
    });
  }

  // Routine guidance response
  res.json({
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: `SwasthyaSetu AI is here to help you access verified healthcare services and prepare for doctor consultations. All advice is general health guidance and does not replace in-person clinical diagnosis.\n\nHow can I assist you with healthcare schemes or appointment preparation today?`,
    timestamp: new Date().toISOString(),
    citations: [
      {
        title: 'Ministry of Health and Family Welfare Guidelines',
        organization: 'MoHFW India',
        url: 'https://mohfw.gov.in',
        verificationDate: '2026-10-01',
        sourceType: 'guideline'
      }
    ],
    suggestedPrompts: [
      'How do I prepare for a doctor consultation?',
      'Explain a verified healthcare service.',
      'Help me organize my symptoms for my doctor.'
    ]
  });
});

// 6. POST /api/assistant/prepare-consultation
app.post('/api/assistant/prepare-consultation', (req, res) => {
  const { symptoms, symptomDuration, relevantMedicalHistory, currentMedications, allergies, patientNotes } = req.body;

  const emergency = checkEmergencyKeywords(symptoms);
  if (emergency) {
    return res.status(400).json({
      message: `Emergency warning signs detected (${emergency.title}). Call ${emergency.num} immediately.`
    });
  }

  const draft = {
    chiefComplaint: `${symptoms.slice(0, 100)} (Duration: ${symptomDuration || 'Not stated'})`,
    clinicalBrief: `Patient reports: "${symptoms}". Duration: ${symptomDuration}. History: ${relevantMedicalHistory || 'None reported'}. Medications: ${currentMedications || 'None'}. Allergies: ${allergies || 'NKDA'}. Notes: ${patientNotes || 'None'}.`,
    suggestedQuestionsForDoctor: [
      'What are the most likely causes of these symptoms?',
      'Are specific diagnostic investigations or imaging recommended?',
      'Are there non-pharmacological or lifestyle changes I should start?'
    ],
    observedFactors: [
      `Duration reported: ${symptomDuration}`,
      `Allergies on record: ${allergies || 'None'}`
    ],
    isDraft: true,
    generatedAt: new Date().toISOString(),
    disclaimer: 'Draft generated for clinical preparation. Requires clinician review. Not a medical diagnosis.'
  };

  res.json(draft);
});

// 7. GET /api/services
app.get('/api/services', (req, res) => {
  const { search, category } = req.query;
  let filtered = [...services];
  if (category && category !== 'All') {
    filtered = filtered.filter(s => s.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }
  res.json(filtered);
});

// 8. GET /api/appointments
app.get('/api/appointments', (req, res) => {
  const { patientId } = req.query;
  if (patientId) {
    return res.json(appointments.filter(a => a.patientId === patientId || a.patientId === 'patient-sunita'));
  }
  res.json(appointments);
});

// 9. POST /api/appointments
app.post('/api/appointments', (req, res) => {
  const data = req.body;

  // Double-booking check
  const conflict = appointments.some(
    a => a.doctorId === data.doctorId &&
         a.date === data.date &&
         a.timeSlot === data.timeSlot &&
         a.status !== 'cancelled' &&
         a.status !== 'rejected'
  );

  if (conflict) {
    return res.status(409).json({ message: 'Selected time slot is already booked for this doctor.' });
  }

  const newAppt = {
    ...data,
    id: `apt-${Date.now()}`,
    status: 'pending',
    consultationId: `cons-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppt);
  res.status(201).json(newAppt);
});

// 10. PATCH /api/appointments/:id/status
app.patch('/api/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const appt = appointments.find(a => a.id === id);
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });

  appt.status = status;
  if (notes) appt.notes = notes;
  appt.updatedAt = new Date().toISOString();
  res.json(appt);
});

// 11. GET /api/doctor/appointments
app.get('/api/doctor/appointments', (req, res) => {
  const { doctorId } = req.query;
  const docAppts = appointments.filter(a => a.doctorId === doctorId || a.doctorId === 'doctor-ananya');
  const docCons = consultations.filter(c => c.doctorId === doctorId || c.doctorId === 'doctor-ananya');

  const today = new Date().toISOString().split('T')[0];
  res.json({
    doctor: users.find(u => u.id === doctorId) || users[1],
    todayAppointments: docAppts.filter(a => a.date === today && a.status === 'confirmed'),
    pendingRequests: docAppts.filter(a => a.status === 'pending'),
    completedCount: docAppts.filter(a => a.status === 'completed').length,
    upcomingCount: docAppts.filter(a => a.status === 'confirmed').length,
    recentConsultations: docCons
  });
});

// 12. GET /api/consultations/:id
app.get('/api/consultations/:id', (req, res) => {
  const { id } = req.params;
  const item = consultations.find(c => c.id === id || c.appointmentId === id);
  if (!item) return res.status(404).json({ message: 'Consultation record not found' });
  res.json(item);
});

// 13. POST /api/consultations/:id/notes
app.post('/api/consultations/:id/notes', (req, res) => {
  const { id } = req.params;
  const { clinicalNotes, doctorRecommendations, markCompleted } = req.body;
  const cons = consultations.find(c => c.id === id);
  if (!cons) return res.status(404).json({ message: 'Consultation not found' });

  cons.clinicalNotes = clinicalNotes;
  cons.doctorRecommendations = doctorRecommendations;
  if (markCompleted) {
    cons.status = 'completed';
    cons.completedAt = new Date().toISOString();
    const relatedAppt = appointments.find(a => a.id === cons.appointmentId);
    if (relatedAppt) relatedAppt.status = 'completed';
  }
  cons.updatedAt = new Date().toISOString();
  res.json(cons);
});

// 14. GET /api/health-records
app.get('/api/health-records', (req, res) => {
  const { patientId } = req.query;
  const records = healthRecords.filter(r => r.patientId === patientId || r.patientId === 'patient-sunita');
  res.json(records);
});

// 15. POST /api/health-records/upload
app.post('/api/health-records/upload', (req, res) => {
  const data = req.body;
  const newRecord = {
    ...data,
    id: `rec-${Date.now()}`
  };
  healthRecords.unshift(newRecord);
  res.status(201).json(newRecord);
});

// Health & Status Verification Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabaseConfigured: isSupabaseConfigured(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`SwasthyaSetu AI API server running on port ${PORT}`);
});
