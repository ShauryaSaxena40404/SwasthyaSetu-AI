import { 
  User, 
  HealthcareService, 
  Appointment, 
  Consultation, 
  HealthRecord 
} from '../types';

export const INITIAL_SERVICES: HealthcareService[] = [
  {
    id: 'pm-jay',
    name: 'Ayushman Bharat PM-JAY',
    nameHindi: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना',
    category: 'Insurance & Financial Aid',
    description: 'World’s largest government-funded healthcare assurance scheme offering up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization to over 12 crore vulnerable families.',
    descriptionHindi: 'द्वितीयक और तृतीयक अस्पताल में भर्ती के लिए प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा।',
    eligibility: 'Families identified based on deprivation and occupational criteria of Socio-Economic Caste Census 2011 (SECC 2011) and enrolled under RSBY. Citizens aged 70+ now eligible regardless of income under the Senior Citizen PM-JAY expansion.',
    requiredDocuments: [
      'Aadhaar Card (or valid Government photo ID)',
      'Ration Card / PM-JAY Family ID',
      'Mobile number linked to Aadhaar'
    ],
    applicationSteps: [
      'Check eligibility on the official Mera PM-JAY portal (beneficiary.nha.gov.in) using your mobile number and Aadhaar.',
      'Visit nearest Ayushman Mitra kiosk at any empanelled public or private hospital.',
      'Complete biometric e-KYC to generate your Ayushman Golden Card.',
      'Present the card at empanelled hospitals for cashless admission and treatment.'
    ],
    officialPortalUrl: 'https://beneficiary.nha.gov.in',
    helpline: '14555 / 1800-111-565',
    lastVerifiedDate: '2026-09-15',
    isVerified: true,
    coverageDetails: 'Covers over 1,949 medical procedures including cardiac surgeries, oncology treatments, orthopedic implants, and ICU care across 27,000+ empanelled hospitals.'
  },
  {
    id: 'esanjeevani',
    name: 'eSanjeevani National Telemedicine Service',
    nameHindi: 'ई-संजीवनी राष्ट्रीय टेलीकंसल्टेशन सेवा',
    category: 'Telemedicine',
    description: 'The National Teleconsultation Service by the Ministry of Health & Family Welfare (MoHFW), Government of India, connecting patients directly to registered medical practitioners and specialists from home.',
    descriptionHindi: 'घर बैठे सरकारी एवं पैनल के डॉक्टरों से निःशुल्क डिजिटल ओपीडी परामर्श प्राप्त करें।',
    eligibility: 'All Indian citizens with an internet-enabled smartphone, tablet, or desktop with a webcam and microphone.',
    requiredDocuments: [
      'Valid mobile phone number for OTP verification',
      'Aadhaar or ABHA ID (recommended for syncing prescription records)',
      'Previous prescriptions or diagnostic lab reports (optional upload)'
    ],
    applicationSteps: [
      'Open the eSanjeevani portal (esanjeevani.mohfw.gov.in) or mobile app.',
      'Verify mobile number via OTP and enter basic demographic details.',
      'Select your state and preferred OPD specialty (General Medicine, Gynecology, Pediatrics, etc.).',
      'Wait in digital waiting room queue for clinician connection.',
      'Download digitally signed electronic prescription post-consultation.'
    ],
    officialPortalUrl: 'https://esanjeevani.mohfw.gov.in',
    helpline: '011-23978046 / 1075',
    lastVerifiedDate: '2026-10-01',
    isVerified: true,
    coverageDetails: 'Free government tele-OPD service active across all 28 states and 8 union territories.'
  },
  {
    id: 'jan-aushadhi',
    name: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)',
    nameHindi: 'प्रधानमंत्री भारतीय जनऔषधि परियोजना',
    category: 'Medicine & Pharmacy',
    description: 'Government initiative ensuring access to high-quality unbranded generic medicines at 50% to 90% lower prices compared to branded market alternatives through dedicated Jan Aushadhi Kendras.',
    descriptionHindi: 'ब्रांडेड दवाओं की तुलना में 50% से 90% कम कीमत पर उच्च गुणवत्ता वाली जेनेरिक दवाएं।',
    eligibility: 'Open to all citizens without any income or residency restrictions.',
    requiredDocuments: [
      'Valid medical prescription from a registered MBBS/AYUSH doctor (for prescription-only drugs)',
      'No documents required for OTC items, sanitary pads, or supplements'
    ],
    applicationSteps: [
      'Locate the nearest Jan Aushadhi Kendra using the Jan Aushadhi Sugam App or official website.',
      'Bring your valid doctor prescription.',
      'Pharmacist dispenses equivalent therapeutic generic formulation tested by NABL accredited labs.'
    ],
    officialPortalUrl: 'https://janaushadhi.gov.in',
    helpline: '1800-180-8080',
    lastVerifiedDate: '2026-08-20',
    isVerified: true,
    coverageDetails: 'Product basket includes 2,047 medicines and 300 surgical devices across 10,000+ Kendras nationwide.'
  },
  {
    id: 'tele-manas',
    name: 'Tele-MANAS (Mental Health Helpline)',
    nameHindi: 'टेली-मानस (राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन)',
    category: 'Mental Health',
    description: '24/7 round-the-clock free tele-mental health assistance helpline providing psychological first-aid, stress counseling, and clinical psychiatric triage in 20+ regional Indian languages.',
    descriptionHindi: 'तनाव, चिंता, अवसाद एवं मानसिक स्वास्थ्य परामर्श हेतु 24x7 निःशुल्क एवं गोपनीय हेल्पलाइन।',
    eligibility: 'Any person experiencing anxiety, depression, exam stress, grief, trauma, or emotional distress across India.',
    requiredDocuments: ['None required. Completely anonymous and confidential.'],
    applicationSteps: [
      'Dial toll-free 14416 or 1800-891-4416 from any mobile or landline.',
      'Select preferred language from IVR prompts.',
      'Connect instantly with a certified mental health counselor or clinical psychologist.'
    ],
    officialPortalUrl: 'https://telemanas.mohfw.gov.in',
    helpline: '14416 / 1800-891-4416',
    lastVerifiedDate: '2026-09-30',
    isVerified: true,
    coverageDetails: 'Tier-1 counseling followed by Tier-2 clinical referral to District Mental Health Programme (DMHP) or NIMHANS when required.'
  },
  {
    id: 'abha-abdm',
    name: 'Ayushman Bharat Health Account (ABHA ID)',
    nameHindi: 'आयुष्मान भारत स्वास्थ्य खाता (आभा आईडी)',
    category: 'Telemedicine',
    description: 'A 14-digit unique digital health identifier under the Ayushman Bharat Digital Mission (ABDM) enabling citizens to securely store, access, and share medical history with doctors across India.',
    descriptionHindi: 'डिजिटल स्वास्थ्य रिकॉर्ड को सुरक्षित रखने और डॉक्टरों के साथ साझा करने हेतु 14 अंकों की डिजिटल पहचान।',
    eligibility: 'All Indian citizens with Aadhaar or driving license.',
    requiredDocuments: [
      'Aadhaar card with linked mobile number for OTP',
      'Basic demographic information'
    ],
    applicationSteps: [
      'Visit abha.abdm.gov.in or use the ABHA mobile app.',
      'Authenticate with Aadhaar OTP.',
      'Create custom ABHA address (e.g. yourname@abdm).',
      'Link your ABHA with labs, hospitals, and telemedicine apps to consolidate health records.'
    ],
    officialPortalUrl: 'https://abha.abdm.gov.in',
    helpline: '1800-11-4477',
    lastVerifiedDate: '2026-10-10',
    isVerified: true,
    coverageDetails: 'Consents are granular and patient-controlled. Citizens can revoke sharing permissions anytime.'
  },
  {
    id: 'mission-indradhanush',
    name: 'Mission Indradhanush (Universal Immunization)',
    nameHindi: 'मिशन इन्द्रधनुष (सार्वभौमिक टीकाकरण कार्यक्रम)',
    category: 'Maternal & Child',
    description: 'National immunization campaign providing free vaccines protecting infants, children under 5, and pregnant women against 12 vaccine-preventable life-threatening diseases.',
    descriptionHindi: 'शिशुओं, 5 वर्ष तक के बच्चों और गर्भवती महिलाओं के लिए 12 जानलेवा बीमारियों से बचाव हेतु निःशुल्क टीके।',
    eligibility: 'All pregnant women and children aged 0 to 5 years residing in India.',
    requiredDocuments: [
      'Mother and Child Protection (MCP) card (Mamta Card) if available; otherwise Aadhaar of parents.'
    ],
    applicationSteps: [
      'Visit local Primary Health Centre (PHC), Community Health Centre (CHC), or Anganwadi during Village Health and Nutrition Days (VHND).',
      'Health worker checks previous vaccination record and administers due doses.',
      'Vaccination status updated on the U-WIN portal (uwin.mohfw.gov.in).'
    ],
    officialPortalUrl: 'https://uwin.mohfw.gov.in',
    helpline: '1075',
    lastVerifiedDate: '2026-07-18',
    isVerified: true,
    coverageDetails: 'Protects against Tuberculosis, Diphtheria, Pertussis, Tetanus, Polio, Hepatitis B, Pneumonia, Meningitis, Measles, Rubella, and Rotavirus.'
  }
];

export const DEMO_USERS: User[] = [
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
      bio: 'Consultant physician specializing in chronic disease management (diabetes, hypertension), preventive health, and remote consultation triage.'
    }
  },
  {
    id: 'doctor-rajesh',
    name: 'Dr. Rajesh Kumar Verma',
    email: 'rajesh.verma@demo.swasthyasetu.in',
    role: 'doctor',
    phone: '+91 98222 33445',
    gender: 'male',
    age: 46,
    doctorProfile: {
      specialty: 'Cardiology',
      registrationNumber: 'NMC-MH-2012-48291',
      qualifications: 'MBBS, MD, DM (Cardiology - KEM Mumbai)',
      experienceYears: 16,
      isVerified: true,
      hospitalOrClinic: 'Apollo Cardiovascular Telehealth Clinic',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlots: ['10:00 AM', '12:00 PM', '03:00 PM'],
      languages: ['Hindi', 'English', 'Marathi'],
      bio: 'Senior cardiologist focusing on ischemic heart disease prevention, cardiac risk assessments, and lifestyle cardiology.'
    }
  },
  {
    id: 'doctor-priya',
    name: 'Dr. Priya Nambiar',
    email: 'priya.nambiar@demo.swasthyasetu.in',
    role: 'doctor',
    phone: '+91 98333 44556',
    gender: 'female',
    age: 36,
    doctorProfile: {
      specialty: 'Pediatrics & Child Health',
      registrationNumber: 'NMC-KA-2017-31049',
      qualifications: 'MBBS, DNB (Pediatrics - Manipal Hospital)',
      experienceYears: 8,
      isVerified: true,
      hospitalOrClinic: 'Mother & Child Community Wellness Center',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlots: ['11:30 AM', '02:00 PM', '04:30 PM'],
      languages: ['English', 'Hindi', 'Malayalam', 'Kannada'],
      bio: 'Pediatrician dedicated to early childhood developmental milestones, universal immunization, and pediatric nutrition.'
    }
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
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
    notes: 'Patient prepared structured consultation draft with current medication history.'
  },
  {
    id: 'apt-102',
    patientId: 'patient-sunita',
    patientName: 'Sunita Sharma',
    patientAge: 48,
    patientGender: 'Female',
    doctorId: 'doctor-ananya',
    doctorName: 'Dr. Ananya Sharma',
    doctorSpecialty: 'Internal Medicine & General Physician',
    date: '2026-10-28',
    timeSlot: '04:00 PM',
    status: 'confirmed',
    urgencyLevel: 'routine',
    symptomsSummary: 'Follow-up for seasonal allergy and review of recent lipid profile report.',
    createdAt: '2026-10-23T14:20:00Z'
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

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'cons-101',
    appointmentId: 'apt-101',
    patientId: 'patient-sunita',
    patientName: 'Sunita Sharma',
    doctorId: 'doctor-ananya',
    doctorName: 'Dr. Ananya Sharma',
    patientInput: {
      symptoms: 'Mild occipital headache mostly in late afternoons, accompanied by fatigue and occasional blurred vision after screen time.',
      symptomDuration: '10-12 days',
      relevantMedicalHistory: 'Borderline hypertension diagnosed in 2024, controlled primarily through dietary restriction. Family history of Type 2 Diabetes.',
      currentMedications: 'Amlodipine 5mg once daily (morning); Multivitamin tablet daily.',
      allergies: 'Sulfa drugs (causes cutaneous rash)',
      patientNotes: 'Home BP monitor read 142/90 and 138/88 over the past three days.'
    },
    aiDraftSummary: {
      chiefComplaint: 'Subacute occipital headache with fluctuating elevated blood pressure in a patient with known borderline hypertension.',
      clinicalBrief: 'Patient Sunita Sharma (48F) presents with 10-12 days of afternoon occipital headache and fatigue. Home BP monitoring records systolic values up to 142 mmHg. Known sulfa allergy noted. Current regimen is Amlodipine 5mg OD.',
      suggestedQuestionsForDoctor: [
        'Could the current dosage of Amlodipine require titration or combination therapy?',
        'Are there specific diagnostic blood tests (serum creatinine, electrolytes, lipid panel) indicated?',
        'Does the afternoon headache pattern suggest eye strain, hypertensive peaks, or cervical tension?'
      ],
      observedFactors: [
        'Documented allergy: Sulfa drugs',
        'Reported BP above standard ambulatory target (140/90 mmHg threshold)',
        'No reported red-flag focal neurological deficits (speech, motor, or sudden explosive onset)'
      ],
      isDraft: true,
      generatedAt: '2026-10-24T10:16:00Z',
      disclaimer: 'Draft generated for clinical preparation. Not a medical diagnosis.'
    },
    clinicalNotes: '',
    doctorRecommendations: '',
    status: 'draft',
    updatedAt: '2026-10-24T10:16:00Z'
  },
  {
    id: 'cons-100',
    appointmentId: 'apt-100',
    patientId: 'patient-sunita',
    patientName: 'Sunita Sharma',
    doctorId: 'doctor-ananya',
    doctorName: 'Dr. Ananya Sharma',
    patientInput: {
      symptoms: 'Morning knee stiffness lasting approx 15 minutes, improving with movement.',
      symptomDuration: '3 months',
      relevantMedicalHistory: 'Hypertension',
      currentMedications: 'Amlodipine 5mg',
      allergies: 'Sulfa drugs',
      patientNotes: 'Enquired about exercise recommendations.'
    },
    aiDraftSummary: {
      chiefComplaint: 'Mild bilateral knee stiffness on waking, lasting under 30 minutes.',
      clinicalBrief: '48-year-old female presents with subacute morning knee stiffness resolving with activity. Clinical picture consistent with early degenerative osteoarthritic changes vs activity strain.',
      suggestedQuestionsForDoctor: [
        'Would quadriceps strengthening exercises or low-impact swimming help?',
        'Is Vitamin D3 / Calcium screening recommended?'
      ],
      observedFactors: [
        'Stiffness duration < 30 mins (typical non-inflammatory pattern)',
        'Sulfa allergy on file'
      ],
      isDraft: true,
      generatedAt: '2026-10-14T10:20:00Z',
      disclaimer: 'Draft summary for clinician review.'
    },
    clinicalNotes: 'Vitals recorded: BP 128/82 mmHg, Pulse 74 bpm. Physical exam reveals no joint effusion, stable ligaments, mild retropatellar crepitus on left knee. Advised conservative lifestyle modifications and quadriceps isometric exercises. Ordered Serum 25-OH Vitamin D and serum uric acid to rule out metabolic confounders.',
    doctorRecommendations: '1. Continue Amlodipine 5mg OD.\n2. Isometric knee strengthening exercises 15 mins twice daily.\n3. Avoid deep squatting and cross-legged sitting for 4 weeks.\n4. Follow up after Vitamin D report.',
    status: 'completed',
    completedAt: '2026-10-14T10:55:00Z',
    updatedAt: '2026-10-14T10:55:00Z'
  }
];

export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'rec-001',
    patientId: 'patient-sunita',
    title: 'Lipid Profile & HbA1c Comprehensive Report',
    recordType: 'lab_report',
    date: '2026-09-18',
    doctorOrClinic: 'Dr. Lal PathLabs (Jaipur Centre)',
    fileSize: '1.4 MB',
    fileType: 'PDF',
    notes: 'HbA1c: 5.7% (Pre-diabetes threshold normal). Total Cholesterol: 198 mg/dL.',
    isDemoUploaded: true
  },
  {
    id: 'rec-002',
    patientId: 'patient-sunita',
    title: 'Clinical Consultation Summary — Knee Evaluation',
    recordType: 'consultation_summary',
    date: '2026-10-14',
    doctorOrClinic: 'Dr. Ananya Sharma (Telehealth Unit)',
    fileSize: '340 KB',
    fileType: 'PDF',
    notes: 'Includes exercise regimen and Vitamin D investigation requisition.',
    isDemoUploaded: false
  },
  {
    id: 'rec-003',
    patientId: 'patient-sunita',
    title: 'COVID-19 Precautionary Dose Certificate',
    recordType: 'vaccination_record',
    date: '2024-03-12',
    doctorOrClinic: 'CoWIN / Ministry of Health & Family Welfare',
    fileSize: '210 KB',
    fileType: 'PDF',
    notes: 'Corbevax Booster dose administered at Urban PHC Jaipur.',
    isDemoUploaded: true
  }
];
