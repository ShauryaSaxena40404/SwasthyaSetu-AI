import React, { useState } from 'react';
import { AlertCircle, PhoneCall, ChevronRight } from 'lucide-react';
import { EmergencyModal } from './EmergencyModal';

export const EmergencyBanner: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        className="bg-red-50 border-b border-red-200 text-red-900 px-4 py-2.5 text-xs sm:text-sm"
        role="region"
        aria-label="Emergency Medical Notice"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <p className="font-medium">
              <span className="font-bold text-red-700">Immediate Medical Emergency?</span> If experiencing severe chest pain, stroke symptoms, or choking, call emergency services immediately.
            </p>
          </div>

          <div className="flex items-center gap-2 font-semibold">
            <a 
              href="tel:108" 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs transition-colors shadow-sm"
              title="Call Ambulance Helpline 108"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Ambulance: 108</span>
            </a>

            <a 
              href="tel:112" 
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md text-xs transition-colors shadow-sm"
              title="Call All-in-One National Emergency 112"
            >
              <span>Police / Fire / Med: 112</span>
            </a>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1 text-red-800 hover:text-red-950 underline text-xs ml-1"
            >
              <span>Emergency Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <EmergencyModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};
