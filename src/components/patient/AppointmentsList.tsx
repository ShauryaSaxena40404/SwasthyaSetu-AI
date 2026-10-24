import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Appointment, User, Consultation, AppointmentStatus, UrgencyLevel } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../services/mockData';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ChevronRight,
  Stethoscope,
  RefreshCw,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { DisclaimerBadge } from '../common/DisclaimerBadge';
import { Link, useSearchParams } from 'react-router-dom';

export const AppointmentsList: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(searchParams.get('action') === 'book');
  
  // Selected consultation viewer modal
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [isConsultationLoading, setIsConsultationLoading] = useState(false);

  // Booking Form State
  const availableDoctors = DEMO_USERS.filter(u => u.role === 'doctor');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(availableDoctors[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>('routine');
  const [symptomsSummary, setSymptomsSummary] = useState<string>('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if draft was passed from ConsultationPrep
  useEffect(() => {
    const draftRaw = sessionStorage.getItem('swasthya_pending_consultation_draft');
    if (draftRaw) {
      try {
        const parsed = JSON.parse(draftRaw);
        setSymptomsSummary(parsed.formData?.symptoms || '');
      } catch (e) {
        console.error('Failed to parse saved draft', e);
      }
    }
  }, []);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAppointments(user?.id);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const selectedDoctor = availableDoctors.find(d => d.id === selectedDoctorId) || availableDoctors[0];

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsSummary.trim()) {
      setBookingError('Please provide a brief summary of symptoms for the doctor.');
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      // Check for attached draft
      const draftRaw = sessionStorage.getItem('swasthya_pending_consultation_draft');
      const consultationData = draftRaw ? JSON.parse(draftRaw).formData : undefined;

      await api.createAppointment({
        patientId: user?.id || 'patient-sunita',
        patientName: user?.name || 'Sunita Sharma',
        patientAge: user?.age || 48,
        patientGender: user?.gender || 'Female',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.doctorProfile?.specialty || 'General Physician',
        date: appointmentDate,
        timeSlot: selectedTimeSlot,
        urgencyLevel,
        symptomsSummary,
        consultationData
      });

      // Clear pending draft after booking
      sessionStorage.removeItem('swasthya_pending_consultation_draft');
      setSuccessMessage('Appointment request submitted successfully! Awaiting doctor review.');
      setShowBookingModal(false);
      await loadAppointments();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to book appointment';
      setBookingError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewConsultation = async (consultationId?: string) => {
    if (!consultationId) return;
    setIsConsultationLoading(true);
    try {
      const cons = await api.getConsultation(consultationId);
      setActiveConsultation(cons);
    } catch (err) {
      console.error('Failed to load consultation record', err);
    } finally {
      setIsConsultationLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending Doctor Review</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Consultation Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            Schedule telemedicine and in-person consultations with empanelled demo practitioners. Manage request statuses and follow-up guidance.
          </p>
        </div>

        <button
          onClick={() => {
            setShowBookingModal(true);
            setBookingError(null);
            setSuccessMessage(null);
          }}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Request New Appointment</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <p className="font-semibold">{successMessage}</p>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-xs text-emerald-700 underline">Dismiss</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['all', 'pending', 'confirmed', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
              statusFilter === tab
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {tab === 'all' ? 'All Appointments' : tab}
          </button>
        ))}
      </div>

      {/* Appointments Grid / List */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading appointment records...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No appointments found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no {statusFilter !== 'all' ? statusFilter : ''} appointments. Click "Request New Appointment" to schedule one with our demo doctors.
          </p>
          <button
            onClick={() => setShowBookingModal(true)}
            className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700"
          >
            Schedule Consultation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle hover:border-teal-200 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{appt.doctorName}</h3>
                  <span className="text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-200">
                    {appt.doctorSpecialty}
                  </span>
                  {getStatusBadge(appt.status)}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {appt.date}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {appt.timeSlot}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">
                    Urgency: <strong className="capitalize">{appt.urgencyLevel}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong>Symptoms:</strong> {appt.symptomsSummary}
                </p>

                {appt.notes && (
                  <p className="text-xs text-teal-900 bg-teal-50/70 p-2 rounded border border-teal-100">
                    <strong>Doctor Note:</strong> {appt.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                {appt.consultationId && (
                  <button
                    onClick={() => handleViewConsultation(appt.consultationId)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    <span>View Notes & Draft</span>
                  </button>
                )}

                {appt.status === 'pending' && (
                  <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 text-center">
                    Doctor will review slot
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Request Consultation Slot</h3>
                <p className="text-xs text-slate-500">Available Demo Doctors & Verified Schedules</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            {bookingError && (
              <div className="my-4 p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="py-4 space-y-4">
              {/* Doctor Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Select Doctor & Specialty
                </label>
                <div className="space-y-2">
                  {availableDoctors.map((doc) => (
                    <label
                      key={doc.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedDoctorId === doc.id
                          ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="doctor"
                        checked={selectedDoctorId === doc.id}
                        onChange={() => setSelectedDoctorId(doc.id)}
                        className="mt-1 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{doc.name}</p>
                          <DisclaimerBadge variant="demo" size="sm" />
                        </div>
                        <p className="text-xs text-teal-800 font-medium">{doc.doctorProfile?.specialty}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.doctorProfile?.qualifications} • Reg: {doc.doctorProfile?.registrationNumber}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Available Demo Slot
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                  >
                    {selectedDoctor.doctorProfile?.timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['routine', 'moderate', 'urgent'] as UrgencyLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgencyLevel(level)}
                      className={`py-2 text-xs font-semibold rounded-lg capitalize border transition-all ${
                        urgencyLevel === level
                          ? level === 'urgent'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms summary */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Summary of Health Concern / Symptoms
                </label>
                <textarea
                  rows={2}
                  required
                  value={symptomsSummary}
                  onChange={(e) => setSymptomsSummary(e.target.value)}
                  placeholder="e.g. Follow-up regarding persistent headaches and BP readings..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              </div>

              {/* Note on Real Availability */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                <strong>Simulated Schedule Notice:</strong> Double-booking protection is enabled. The system will prevent conflicting bookings for the same doctor and slot.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {isSubmitting ? 'Checking Slot Availability...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Consultation Record Detail Viewer Modal */}
      {activeConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Consultation Record: {activeConsultation.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Clinician: {activeConsultation.doctorName} • Patient: {activeConsultation.patientName}
                </p>
              </div>
              <button
                onClick={() => setActiveConsultation(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            {/* AI Draft Summary */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-bold text-teal-900">AI-Generated Consultation Preparation Draft</p>
                <DisclaimerBadge variant="draft" size="sm" />
              </div>
              <p className="text-slate-800">
                <strong>Chief Complaint:</strong> {activeConsultation.aiDraftSummary?.chiefComplaint}
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>Clinical Synthesis:</strong> {activeConsultation.aiDraftSummary?.clinicalBrief}
              </p>
            </div>

            {/* Doctor Clinical Notes */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-slate-900 text-sm">Doctor's Clinical Notes</p>
              {activeConsultation.clinicalNotes ? (
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {activeConsultation.clinicalNotes}
                </p>
              ) : (
                <p className="text-slate-400 italic">No clinical notes recorded yet for this appointment.</p>
              )}
            </div>

            {/* Doctor Recommendations & Follow-up */}
            {activeConsultation.doctorRecommendations && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-950">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Doctor Recommendations & Follow-Up Advice</span>
                </p>
                <p className="whitespace-pre-wrap leading-relaxed">{activeConsultation.doctorRecommendations}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveConsultation(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
