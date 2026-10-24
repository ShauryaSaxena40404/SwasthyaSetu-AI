import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, PhoneCall, ShieldAlert, ExternalLink, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm">
      {/* Emergency Strip */}
      <div className="bg-teal-950/80 border-b border-teal-900/60 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600/90 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <PhoneCall className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">National Emergency & Health Helplines (24/7)</p>
              <p className="text-teal-300 text-xs">Always call immediately for acute pain, severe trauma, or unconsciousness.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1.5 bg-red-900/40 text-red-200 border border-red-700/60 rounded-lg">
              Ambulance: <strong>108</strong>
            </span>
            <span className="px-3 py-1.5 bg-red-900/40 text-red-200 border border-red-700/60 rounded-lg">
              National Emergency: <strong>112</strong>
            </span>
            <span className="px-3 py-1.5 bg-teal-900/50 text-teal-200 border border-teal-700/60 rounded-lg">
              Tele-MANAS Mental Health: <strong>14416</strong>
            </span>
            <span className="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg">
              Ayushman PM-JAY: <strong>14555</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
                <Heart className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">SwasthyaSetu AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An intelligent, safe healthcare access assistant designed to explain verified schemes, organize symptoms, and prepare citizens for clinician consultations across India.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
              <span className="text-teal-400 font-semibold">Independent Prototype:</span> Built for educational demonstration inspired by eSanjeevani. Not an official government service.
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Portal Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-teal-300 transition-colors">Home Page</Link></li>
              <li><Link to="/services" className="hover:text-teal-300 transition-colors">Verified Healthcare Schemes</Link></li>
              <li><Link to="/patient/assistant" className="hover:text-teal-300 transition-colors">AI Health Assistant</Link></li>
              <li><Link to="/patient/consultation-prep" className="hover:text-teal-300 transition-colors">Consultation Preparation Form</Link></li>
              <li><Link to="/patient/appointments" className="hover:text-teal-300 transition-colors">Book / View Appointments</Link></li>
              <li><Link to="/doctor/dashboard" className="hover:text-teal-300 transition-colors">Doctor Clinical Queue</Link></li>
            </ul>
          </div>

          {/* Verified Resources */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Verified External Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://esanjeevani.mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 inline-flex items-center gap-1">
                  <span>eSanjeevani Teleconsultation</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://beneficiary.nha.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 inline-flex items-center gap-1">
                  <span>Ayushman Bharat PM-JAY</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://janaushadhi.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 inline-flex items-center gap-1">
                  <span>Jan Aushadhi Kendras (PMBJP)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://telemanas.mohfw.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 inline-flex items-center gap-1">
                  <span>Tele-MANAS Mental Health</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://abha.abdm.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-teal-300 inline-flex items-center gap-1">
                  <span>ABHA (Digital Health Account)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Safety Protocol */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Trust & Clinical Safety</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="leading-relaxed">
                <strong className="text-slate-200">Non-Diagnostic Guarantee:</strong> All outputs generated by SwasthyaSetu AI are unverified draft summaries intended solely to structure discussions between patient and clinician.
              </p>
              <p className="leading-relaxed">
                <strong className="text-slate-200">Privacy Safeguard:</strong> Demonstration records remain isolated per user session. No genuine PHI is gathered or processed.
              </p>
              <div className="pt-2 flex gap-4 text-[11px] text-teal-400">
                <Link to="/#about-prototype" className="hover:underline">Prototype Terms</Link>
                <Link to="/#about-prototype" className="hover:underline">Safety Architecture</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} SwasthyaSetu AI. Independent Health-Tech Accessibility Research Prototype.</p>
          <p className="text-slate-400">Designed with modern accessible web standards & Indian healthcare context.</p>
        </div>
      </div>
    </footer>
  );
};
