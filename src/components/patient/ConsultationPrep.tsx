import React, { useState } from 'react';
import { api } from '../../services/api';
import { ConsultationPreparationInput, AIGeneratedDraft } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  ClipboardCheck, 
  Sparkles, 
  Edit3, 
  CheckCircle, 
  HelpCircle, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  RefreshCw,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DisclaimerBadge } from '../common/DisclaimerBadge';
import { useNavigate } from 'react-router-dom';

export const ConsultationPrep: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ConsultationPreparationInput>({
    symptoms: 'Occasional dizziness when standing up quickly and mild late-afternoon headache.',
    symptomDuration: 'Approx 2 weeks, getting slightly more frequent',
    relevantMedicalHistory: 'Borderline hypertension (monitored at home); no prior surgeries.',
    currentMedications: 'Amlodipine 5mg once daily in morning; Vitamin D3 60k once monthly.',
    allergies: 'Sulfa antibiotics (causes itchy skin rash)',
    patientNotes: 'I want to ask the doctor if my morning blood pressure pills need adjusting.'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftResult, setDraftResult] = useState<AIGeneratedDraft | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editableQuestions, setEditableQuestions] = useState<string[]>([]);
  const [editableBrief, setEditableBrief] = useState('');
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symptoms.trim()) {
      setErrorMessage('Please describe your symptoms to prepare your consultation summary.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const draft = await api.prepareConsultation(formData);
      setDraftResult(draft);
      setEditableBrief(draft.clinicalBrief);
      setEditableQuestions([...draft.suggestedQuestionsForDoctor]);
      setIsEditingDraft(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate consultation summary';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndProceedToBooking = () => {
    // Save draft in temporary session for booking attachment
    sessionStorage.setItem('swasthya_pending_consultation_draft', JSON.stringify({
      formData,
      draftResult: {
        ...draftResult,
        clinicalBrief: editableBrief,
        suggestedQuestionsForDoctor: editableQuestions
      }
    }));
    navigate('/patient/appointments?action=book');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Doctor Consultation Preparation
            </h1>
            <DisclaimerBadge variant="draft" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Structure your symptoms, medical history, and current medications beforehand. The assistant prepares a clinical draft so your consultation with the doctor is focused and thorough.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-2 rounded-xl text-teal-800 text-xs">
          <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>Average prep time: <strong>3 mins</strong></span>
        </div>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-3 text-red-900 text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Notice / Safety Screening Alert</p>
            <p className="text-xs mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Preparation Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-teal-600" />
            <span>Step 1: Clinical Symptom & History Intake</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Provide as much detail as you can. Do not include unnecessary private identifiers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Symptoms */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Primary Symptoms <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="e.g. Mild throbbing headache behind the eyes, dizziness when getting up from bed..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none transition-all"
            />
          </div>

          {/* Duration & Medical History Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Symptom Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.symptomDuration}
                onChange={(e) => setFormData({ ...formData, symptomDuration: e.target.value })}
                placeholder="e.g. 5 days, 2 weeks, intermittent..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Relevant Medical History
              </label>
              <input
                type="text"
                value={formData.relevantMedicalHistory}
                onChange={(e) => setFormData({ ...formData, relevantMedicalHistory: e.target.value })}
                placeholder="e.g. Diabetes, Thyroid, Hypertension, none..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Current Medications & Allergies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Current Medications & Supplements
              </label>
              <input
                type="text"
                value={formData.currentMedications}
                onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                placeholder="e.g. Metformin 500mg, Multivitamin, None..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Known Drug Allergies
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Sulfa, None known..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Specific Concerns or Questions for Doctor (Optional)
            </label>
            <input
              type="text"
              value={formData.patientNotes}
              onChange={(e) => setFormData({ ...formData, patientNotes: e.target.value })}
              placeholder="e.g. Does my recent eye test relate to these headaches?"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Information is sent to the backend preparation engine for clinical structuring.
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Structuring Draft Summary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Consultation Draft</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Step 2: Generated Clinical Draft Review & Edit */}
      {draftResult && (
        <div className="bg-white rounded-2xl border-2 border-teal-500 shadow-elevated overflow-hidden animate-fadeIn">
          <div className="p-5 bg-gradient-to-r from-teal-50 via-teal-100/60 to-white border-b border-teal-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Step 2: AI Clinical Draft Summary (Review & Edit)
                </h3>
                <DisclaimerBadge variant="draft" />
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Review and make adjustments before presenting or saving for clinician evaluation.
              </p>
            </div>

            <button
              onClick={() => setIsEditingDraft(!isEditingDraft)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-teal-600" />
              <span>{isEditingDraft ? 'Done Editing' : 'Edit Draft'}</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Chief Complaint */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Chief Complaint Formulation
              </span>
              <p className="font-semibold text-slate-900 text-sm">{draftResult.chiefComplaint}</p>
            </div>

            {/* Clinical Brief */}
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Synthesized Clinical Brief for Doctor
              </span>
              {isEditingDraft ? (
                <textarea
                  rows={4}
                  value={editableBrief}
                  onChange={(e) => setEditableBrief(e.target.value)}
                  className="w-full p-3 bg-white border-2 border-teal-400 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none"
                />
              ) : (
                <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {editableBrief}
                </div>
              )}
            </div>

            {/* Questions to Ask Doctor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Suggested Questions to Ask Your Doctor</span>
                </span>
                <span className="text-[11px] text-slate-500">Helps guide discussion</span>
              </div>

              <div className="space-y-2">
                {editableQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {isEditingDraft ? (
                      <input
                        type="text"
                        value={q}
                        onChange={(e) => {
                          const updated = [...editableQuestions];
                          updated[idx] = e.target.value;
                          setEditableQuestions(updated);
                        }}
                        className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    ) : (
                      <p className="text-slate-800">{q}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Clinician Review Disclaimer Callout */}
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Clinician Review Mandatory</span>
              </p>
              <p className="leading-relaxed">
                {draftResult.disclaimer}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Generated at: {new Date(draftResult.generatedAt).toLocaleString()}
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveAndProceedToBooking}
                  className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment with this Draft</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
