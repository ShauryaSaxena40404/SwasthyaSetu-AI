import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Heart, 
  Stethoscope, 
  UserCheck, 
  ShieldCheck, 
  ClipboardCheck, 
  Languages, 
  AlertTriangle, 
  PhoneCall, 
  ChevronRight, 
  Search, 
  Bot, 
  Clock, 
  ArrowRight,
  ExternalLink,
  Activity,
  FileText
} from 'lucide-react';
import { DisclaimerBadge } from '../components/common/DisclaimerBadge';
import { EmergencyModal } from '../components/common/EmergencyModal';

export const LandingPage: React.FC = () => {
  const { loginDemoUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const handlePatientQuickAccess = async () => {
    await loginDemoUser('patient');
    navigate('/patient/dashboard');
  };

  const handleDoctorQuickAccess = async () => {
    await loginDemoUser('doctor');
    navigate('/doctor/dashboard');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-10 pb-16 border-b border-teal-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4">
            
            {/* National Healthcare Notice Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 text-teal-900 border border-teal-200/90 text-xs font-semibold shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span>Inspired by eSanjeevani • Verified Health Access Prototype</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              SwasthyaSetu <span className="text-teal-700">AI</span>
              <span className="block text-2xl sm:text-3xl font-bold text-slate-700 mt-2">
                Healthcare Access Assistant & Consultation Preparation
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Empowering citizens across India to discover verified public health schemes, organize medical symptoms into clinical drafts, and connect safely with registered clinicians.
            </p>

            {/* Prominent Safety Disclaimer Box */}
            <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs sm:text-sm text-amber-900 text-left max-w-2xl mx-auto space-y-1 shadow-subtle">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Mandatory Public Health Disclaimer</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                SwasthyaSetu AI provides verified general health information and consultation preparation. It does not provide medical diagnoses, treatment prescriptions, or replace qualified medical practitioners. Emergency symptoms trigger immediate escalation to 108 / 112.
              </p>
            </div>
          </div>

          {/* Two Prominent Entry Cards: Patient Portal and Doctor Portal */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Patient Portal Card */}
            <div className="bg-white rounded-2xl border-2 border-teal-200 hover:border-teal-500 p-6 sm:p-8 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-8 h-8" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Patient Portal</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                      For Citizens
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Chat with the AI Assistant, prepare your symptoms draft for your upcoming doctor consultation, track appointment slots, and search verified government health schemes.
                  </p>
                </div>

                <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                    <span>AI-Powered Symptom & History Preparation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                    <span>Ayushman Bharat PM-JAY & Jan Aushadhi Guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                    <span>Telemedicine Appointments & Health Records</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handlePatientQuickAccess}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 group-hover:bg-teal-700"
                >
                  <span>Enter Patient Portal (1-Click Demo)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Doctor Portal Card */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-600 p-6 sm:p-8 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-8 h-8 text-teal-200" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Doctor Portal</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      For Clinicians
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Review patient-prepared consultation drafts, manage scheduled telemedicine queues, record verified clinical notes, and provide authorized medical follow-up advice.
                  </p>
                </div>

                <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>
                    <span>Triaged Appointment Queue & Schedule Review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>
                    <span>Draft Review (Clearly Marked as Unverified)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span>
                    <span>NMC Registration & Follow-Up Regimen</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleDoctorQuickAccess}
                  className="w-full py-3 px-4 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Enter Doctor Portal (Dr. Sharma)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Core Safety & Access Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Designed for Trustworthy Healthcare Navigation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Built with rigorous clinical safety guardrails, official source verification, and patient privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-teal-300 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Verified Healthcare Information</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Source citations for every government healthcare scheme (Ayushman Bharat, Jan Aushadhi, eSanjeevani) with transparent verification timestamps.
              </p>
            </div>
            <Link to="/services" className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 pt-2">
              <span>Browse 6+ Verified Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-teal-300 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Consultation Preparation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structured forms capture symptoms, duration, current medications, and allergies, generating a clinician draft summary and clarifying questions.
              </p>
            </div>
            <Link to="/patient/consultation-prep" className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 pt-2">
              <span>Launch Preparation Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-teal-300 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Multilingual Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                English and Hindi language support with quick toggle UI. Connected with national mental health support Tele-MANAS in 20+ regional languages.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 pt-2">English & हिन्दी Active</span>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle hover:border-red-300 transition-all space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Emergency Safety Escalation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic rule-based screening prioritizes life-threatening signs (chest pain, stroke FAST, choking) with immediate 108/112 guidance over ordinary chat.
              </p>
            </div>
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="text-xs font-bold text-red-700 hover:text-red-900 inline-flex items-center gap-1 pt-2 text-left"
            >
              <span>View Emergency Protocol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step-by-Step Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              From Inquiry to Clinical Follow-Up
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A transparent, safe healthcare interaction workflow ensuring clinician oversight at every clinical decision point.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Citizen Asks AI Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                User enters health concerns or scheme questions. Safety screening checks for acute red-flag symptoms.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Consultation Draft Prepared</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The assistant structures symptoms, medication history, and suggested doctor questions into a clinician draft.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Slot Booked & Triaged</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Double-booking prevention validates available demo slots. Authorized doctor reviews incoming patient draft.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Doctor Documents & Advises</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Doctor conducts examination, records clinical notes, and signs follow-up advice visible in the patient portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Prototype & Governance Section */}
      <section id="about-prototype" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="px-3 py-1 bg-teal-700/60 text-teal-200 rounded-full text-xs font-semibold border border-teal-500/30">
              Governance & Clinical Ethics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              An Independent Academic & Technical Prototype
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
              SwasthyaSetu AI is an independent software prototype built to explore human-AI collaboration in public healthcare access, drawing visual and structural inspiration from India's landmark eSanjeevani platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs text-teal-200">
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1.5">
              <h4 className="font-bold text-white text-sm">No Government Affiliation</h4>
              <p className="leading-relaxed text-[11px]">
                This application is not an official portal of the Ministry of Health & Family Welfare (MoHFW) or the Government of India.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1.5">
              <h4 className="font-bold text-white text-sm">Zero Hallucinated Prescriptions</h4>
              <p className="leading-relaxed text-[11px]">
                Under no circumstances does the AI issue diagnoses or drug dosages. Clinical authority remains exclusively with licensed practitioners.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1.5">
              <h4 className="font-bold text-white text-sm">Isolated Patient Privacy</h4>
              <p className="leading-relaxed text-[11px]">
                Health records remain compartmentalized to authenticated user sessions. Doctors can only view records for active, permitted consultations.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={handlePatientQuickAccess}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors"
            >
              Test Patient Experience
            </button>
            <button
              onClick={handleDoctorQuickAccess}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-colors"
            >
              Test Doctor Experience
            </button>
          </div>
        </div>
      </section>

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
};
