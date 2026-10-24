import React from 'react';
import { PhoneCall, AlertTriangle, X, ShieldAlert, Heart, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  primaryConcern?: string;
}

export const EmergencyModal: React.FC<Props> = ({ isOpen, onClose, primaryConcern }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-dialog-title"
      >
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-700/80 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 id="emergency-dialog-title" className="text-xl font-bold tracking-tight">
                Emergency Healthcare Escalation Protocol
              </h2>
              <p className="text-red-100 text-xs">
                Do not continue routine chatbot interaction for potential life-threatening symptoms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-red-100 hover:text-white hover:bg-red-700 rounded-lg transition-colors"
            aria-label="Close emergency modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {primaryConcern && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-red-800">Trigger Identified</p>
              <p className="text-sm font-bold text-red-900 mt-0.5">{primaryConcern}</p>
            </div>
          )}

          {/* Quick Dial Helplines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:108"
              className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border-2 border-red-300 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold shadow-md">
                  <PhoneCall className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-700">Ambulance & Medical Emergency</p>
                  <p className="text-2xl font-black text-red-900">108</p>
                </div>
              </div>
              <span className="text-xs font-bold text-red-600 bg-white px-2 py-1 rounded shadow-sm">Dial Now</span>
            </a>

            <a
              href="tel:112"
              className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border-2 border-red-300 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold shadow-md">
                  <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-700">All-in-One National Emergency</p>
                  <p className="text-2xl font-black text-red-900">112</p>
                </div>
              </div>
              <span className="text-xs font-bold text-red-600 bg-white px-2 py-1 rounded shadow-sm">Dial Now</span>
            </a>

            <a
              href="tel:14416"
              className="flex items-center justify-between p-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-teal-700">Tele-MANAS (Mental Health 24/7)</p>
                  <p className="text-xl font-black text-teal-900">14416</p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-white px-2 py-1 rounded shadow-sm">Free Call</span>
            </a>

            <a
              href="tel:1075"
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold shadow-md">
                  <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">National Health Helpline</p>
                  <p className="text-xl font-black text-slate-900">1075</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded shadow-sm">MoHFW</span>
            </a>
          </div>

          {/* Red Flag Warning Reference */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              Immediate Actions for Bystanders / Patients:
            </h4>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Severe chest tightness or radiating arm pain:</strong> Have the patient sit comfortably, stay calm, loosen tight clothing, and call 108 immediately. Do not allow driving.</li>
              <li><strong>Sudden facial drooping, arm weakness, or slurred speech (FAST):</strong> Note the exact time symptoms started and rush to the nearest stroke-ready hospital within the 4.5-hour thrombolysis window.</li>
              <li><strong>Severe respiratory distress:</strong> Keep the patient seated upright. Never lay someone flat who is struggling to breathe.</li>
              <li><strong>Severe bleeding:</strong> Apply steady, direct pressure with a clean cloth or bandage. Keep the injured area elevated if possible.</li>
            </ul>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Mandatory Safety Disclaimer:</strong> SwasthyaSetu AI is an artificial intelligence prototype designed for routine appointment preparation and healthcare scheme explanation. It has no diagnostic authority and cannot replace physical evaluation by qualified clinicians.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">Government of India Emergency Directory</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            I Understand — Close Guidance
          </button>
        </div>
      </div>
    </div>
  );
};
