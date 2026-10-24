import { EmergencyScreeningResult } from '../types';

interface EmergencyRule {
  category: 'cardiac' | 'stroke' | 'respiratory' | 'trauma' | 'mental_health' | 'anaphylaxis';
  keywords: string[];
  title: string;
  emergencyNumber: string;
  guidance: string;
}

const EMERGENCY_RULES: EmergencyRule[] = [
  {
    category: 'cardiac',
    keywords: [
      'chest pain', 'chest pressure', 'crushing chest', 'heart attack',
      'pain radiating to arm', 'pain radiating to left arm', 'pain radiating to jaw',
      'chest tightness with sweating', 'severe chest ache'
    ],
    title: 'Possible Cardiac Emergency (Heart Warning Signs)',
    emergencyNumber: '108 / 112',
    guidance: 'Chest pain or pressure radiating to the arm, neck, or jaw can indicate a life-threatening cardiac event. Call 108 or 112 immediately. Keep calm, sit or lie comfortably, and do not attempt to drive yourself to the hospital.'
  },
  {
    category: 'stroke',
    keywords: [
      'face drooping', 'facial droop', 'arm weakness', 'slurred speech',
      'cannot speak properly', 'sudden numbness', 'loss of vision suddenly',
      'sudden paralysis', 'stroke'
    ],
    title: 'Possible Stroke (FAST Warning Signs)',
    emergencyNumber: '108 / 112',
    guidance: 'Sudden weakness on one side of the body, facial drooping, or difficulty speaking requires immediate medical intervention within the golden hour. Dial 108 or 112 now.'
  },
  {
    category: 'respiratory',
    keywords: [
      'cannot breathe', 'severe shortness of breath', 'gasping for air',
      'struggling to breathe', 'blue lips', 'choking', 'asthma attack severe',
      'severe breathlessness'
    ],
    title: 'Severe Respiratory Distress',
    emergencyNumber: '108 / 112',
    guidance: 'Severe difficulty breathing or gasping for air is a medical emergency. Sit upright, loosen tight clothing, and call emergency services (108 / 112) immediately.'
  },
  {
    category: 'trauma',
    keywords: [
      'uncontrolled bleeding', 'profuse bleeding', 'head trauma unconscious',
      'major accident', 'deep cut spurting', 'severe burn large area', 'poisoning'
    ],
    title: 'Severe Trauma or Hemorrhage',
    emergencyNumber: '108 / 112',
    guidance: 'Apply firm direct pressure to bleeding wounds using a clean cloth. For poisoning or severe trauma, call 108 or 112 without delay.'
  },
  {
    category: 'mental_health',
    keywords: [
      'suicide', 'kill myself', 'want to end my life', 'ending it all',
      'self harm', 'hurt myself', 'dont want to live'
    ],
    title: 'Urgent Mental Health Support (Tele-MANAS)',
    emergencyNumber: '14416 / 1800-891-4416',
    guidance: 'You are not alone, and compassionate, confidential help is available 24/7. Please call the National Tele-MANAS Helpline at 14416 or 1800-891-4416 right now to speak with a trained counselor.'
  },
  {
    category: 'anaphylaxis',
    keywords: [
      'throat swelling', 'throat closing', 'swollen tongue difficulty breathing',
      'severe allergic reaction', 'anaphylaxis', 'bee sting cannot breathe'
    ],
    title: 'Possible Severe Allergic Reaction (Anaphylaxis)',
    emergencyNumber: '108 / 112',
    guidance: 'Rapid swelling of the throat or tongue with breathing difficulty is life-threatening. Administer an EpiPen if prescribed and dial 108 or 112 immediately.'
  }
];

/**
 * Deterministic safety screening function.
 * Evaluates user input against clinical emergency keywords before any AI interaction.
 */
export function screenForEmergencies(text: string): EmergencyScreeningResult {
  const normalized = text.toLowerCase();
  
  for (const rule of EMERGENCY_RULES) {
    const matched = rule.keywords.filter(keyword => normalized.includes(keyword));
    if (matched.length > 0) {
      return {
        isUrgent: true,
        matchedKeywords: matched,
        primaryConcern: rule.title,
        emergencyNumber: rule.emergencyNumber,
        guidanceText: rule.guidance
      };
    }
  }

  return {
    isUrgent: false,
    matchedKeywords: [],
    emergencyNumber: '112 / 108',
    guidanceText: ''
  };
}

/**
 * Sanitizes and adds standard clinical disclaimers to AI assistant responses.
 */
export const CLINICAL_DISCLAIMER_TEXT = 
  'Important Notice: SwasthyaSetu AI is an informational tool and does not provide medical diagnoses, treatment plans, or prescriptions. All consultation drafts are unverified until reviewed and signed off by a licensed medical practitioner.';
