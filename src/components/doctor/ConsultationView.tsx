import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Consultation } from '../../types';
import { 
  ArrowLeft, 
  Stethoscope, 
  FileText, 
  CheckCircle2, 
  Save, 
  AlertTriangle, 
  ShieldAlert, 
  User as UserIcon,
  Clock,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { DisclaimerBadge } from '../common/DisclaimerBadge';

export const ConsultationView: React.FC = () => {
  const { consultationId } = useParams<{ consultationId: string }>();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [doctorRecommendations, setDoctorRecommendations] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!consultationId) return;
      setIsLoading(true);
      try {
        const data = await api.getConsultation(consultationId);
        setConsultation(data);
        setClinicalNotes(data.clinicalNotes || '');
        setDoctorRecommendations(data.doctorRecommendations || '');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Consultation record not found';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [consultationId]);

  const handleSaveNotes = async (markComplete: boolean = false) => {
    if (!consultationId) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await api.saveConsultationNotes(
        consultationId,
        clinicalNotes,
        doctorRecommendations,
        markComplete
      );
      setConsultation(updated);
      setSaveSuccess(true);
      if (markComplete) {
        setTimeout(() => {
          navigate('/doctor/dashboard');
        }, 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save clinical notes';
      alert(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">Retrieving authorized consultation records...</p>
      </div>
    );
  }

  if (errorMessage || !consultation) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-slate-800 text-base">Record Access Restricted</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {errorMessage || 'You are only authorized to access consultation records explicitly assigned to your practitioner profile.'}
        </p>
        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
        >
          Return to Queue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Appointment Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Record ID: <strong className="font-mono text-slate-800">{consultation.id}</strong></span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
            consultation.status === 'completed' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {consultation.status}
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Clinical notes and recommendations successfully saved and synced to patient file.</span>
        </div>
      )}

      {/* Grid: Left Column = Patient Info & AI Draft, Right Column = Doctor Notes & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Intake & AI Draft */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Patient Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{consultation.patientName}</h3>
                <p className="text-xs text-slate-500">Consultation ID: {consultation.appointmentId}</p>
              </div>
            </div>

            {/* Self-reported inputs */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Patient-Reported History & Intake:
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-slate-700">
                <p><strong>Primary Symptoms:</strong> {consultation.patientInput.symptoms}</p>
                <p><strong>Duration:</strong> {consultation.patientInput.symptomDuration}</p>
                <p><strong>Medical History:</strong> {consultation.patientInput.relevantMedicalHistory || 'None noted'}</p>
                <p><strong>Current Medications:</strong> {consultation.patientInput.currentMedications || 'None'}</p>
                <p className="text-red-700"><strong>Allergies:</strong> {consultation.patientInput.allergies || 'NKDA'}</p>
                {consultation.patientInput.patientNotes && (
                  <p><strong>Patient Note:</strong> "{consultation.patientInput.patientNotes}"</p>
                )}
              </div>
            </div>
          </div>

          {/* AI Generated Clinical Draft */}
          <div className="bg-gradient-to-br from-teal-50/70 to-white rounded-2xl border-2 border-teal-200 p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h4 className="font-extrabold text-teal-950 text-sm">AI Consultation Draft</h4>
              </div>
              <DisclaimerBadge variant="draft" size="sm" />
            </div>

            <div className="text-xs text-slate-700 space-y-3">
              <div>
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                  Draft Chief Complaint:
                </span>
                <p className="font-medium text-slate-800 mt-0.5">{consultation.aiDraftSummary?.chiefComplaint}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                  Clinical Synthesis:
                </span>
                <p className="bg-white p-3 rounded-xl border border-teal-100 text-slate-800 leading-relaxed mt-0.5">
                  {consultation.aiDraftSummary?.clinicalBrief}
                </p>
              </div>

              {consultation.aiDraftSummary?.suggestedQuestionsForDoctor && (
                <div>
                  <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-1">
                    Questions Patient Intends to Clarify:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    {consultation.aiDraftSummary.suggestedQuestionsForDoctor.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety Disclaimers */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>Safety Requirement:</strong> AI draft content is unverified and cannot automatically generate a diagnosis or prescription. Clinician discretion required.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Doctor's Clinical Notes & Follow-up */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <span>Licensed Clinician Documentation</span>
                </h3>
                <p className="text-xs text-slate-500">Official medical notes recorded by {consultation.doctorName}</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                NMC Verified Workflow
              </span>
            </div>

            {/* Clinical Examination Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Clinical Examination & Findings
              </label>
              <textarea
                rows={5}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Record recorded vital signs (BP, Pulse, SpO2), examination findings, and clinical impression..."
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none transition-all leading-relaxed"
              />
            </div>

            {/* Doctor Recommendations & Follow-up Advice */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Doctor Recommendations, Investigations & Follow-Up Advice
              </label>
              <textarea
                rows={4}
                value={doctorRecommendations}
                onChange={(e) => setDoctorRecommendations(e.target.value)}
                placeholder="1. Advised laboratory blood tests / diagnostic imaging&#10;2. Dietary and lifestyle recommendations&#10;3. Follow-up consultation in 2 weeks..."
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none transition-all leading-relaxed"
              />
              <p className="text-[11px] text-slate-400">
                This advice will be made visible in the patient's appointment and health record dashboard.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleSaveNotes(false)}
                disabled={isSaving}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 text-slate-600" />
                <span>{isSaving ? 'Saving...' : 'Save Draft Notes'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveNotes(true)}
                disabled={isSaving || !clinicalNotes.trim()}
                className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign & Mark Consultation Completed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
