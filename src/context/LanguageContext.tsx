import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  appName: {
    en: 'SwasthyaSetu AI',
    hi: 'स्वास्थ्यसेतु AI'
  },
  appTagline: {
    en: 'Healthcare Access Assistant & Consultation Preparation',
    hi: 'स्वास्थ्य सेवा सहायक एवं परामर्श तैयारी पोर्टल'
  },
  home: {
    en: 'Home',
    hi: 'मुख्य पृष्ठ'
  },
  services: {
    en: 'Verified Services',
    hi: 'सत्यापित योजनाएं'
  },
  howItWorks: {
    en: 'How It Works',
    hi: 'यह कैसे काम करता है'
  },
  about: {
    en: 'About Prototype',
    hi: 'प्रोटोटाइप के बारे में'
  },
  login: {
    en: 'Login / Sign In',
    hi: 'लॉग इन / प्रवेश'
  },
  logout: {
    en: 'Sign Out',
    hi: 'लॉग आउट'
  },
  patientPortal: {
    en: 'Patient Portal',
    hi: 'मरीज़ पोर्टल'
  },
  doctorPortal: {
    en: 'Doctor Portal',
    hi: 'डॉक्टर पोर्टल'
  },
  emergencyEscalation: {
    en: 'Emergency Help: Dial 108 / 112',
    hi: 'आपातकालीन सहायता: 108 / 112 डायल करें'
  },
  aiAssistant: {
    en: 'AI Healthcare Assistant',
    hi: 'AI स्वास्थ्य सहायक'
  },
  consultationPrep: {
    en: 'Consultation Preparation',
    hi: 'परामर्श की तैयारी'
  },
  appointments: {
    en: 'Appointments',
    hi: 'नियुक्तियाँ'
  },
  healthRecords: {
    en: 'Health Records',
    hi: 'स्वास्थ्य रिकॉर्ड'
  },
  disclaimerNote: {
    en: 'Independent Educational Prototype — Not an official government portal. AI provides general health information and does not replace certified medical practitioners.',
    hi: 'स्वतंत्र शैक्षणिक प्रोटोटाइप — यह कोई आधिकारिक सरकारी सेवा नहीं है। AI केवल सामान्य जानकारी देता है और प्रमाणित चिकित्सक का विकल्प नहीं है।'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('swasthya_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swasthya_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
