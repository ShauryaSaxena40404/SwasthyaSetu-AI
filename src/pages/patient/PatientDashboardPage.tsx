import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { PatientDashboardData, Appointment, Consultation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { PatientSidebar } from '../../components/patient/PatientSidebar';
import { EmergencyModal } from '../../components/common/EmergencyModal';
import { 
  Activity, 
  Calendar, 
  FileText, 
  Bot, 
  ClipboardList, 
  Compass, 
  ArrowRight, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DisclaimerBadge } from '../../components/common/DisclaimerBadge';

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<PatientDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await api.getPatientDashboard(user?.id || 'patient-sunita');
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load patient dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-slate-50/60">
      
      {/* Sidebar Navigation */}
      <PatientSidebar onOpenEmergencyModal={() => setShowEmergencyModal(true)} />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Citizen Patient Portal
              </span>
              <DisclaimerBadge variant="demo" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {user?.name || 'Sunita Sharma'}
            </h1>
            <p className="text-teal-200 text-xs sm:text-sm leading-relaxed">
              Your personal healthcare navigation workspace. Explore verified government schemes, organize your symptom details into clinician drafts, and track telemedicine consultations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 w-full md:w-auto flex-shrink-0">
            <Link
              to="/patient/consultation-prep"
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Prepare Consultation</span>
            </Link>
            <Link
              to="/patient/assistant"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-teal-300" />
              <span>Ask AI Assistant</span>
            </Link>
          </div>
        </div>

        {/* Prominent Emergency Assistance Card */}
        <div className="p-4 sm:p-5 bg-red-50 border-2 border-red-300 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-red-950 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-red-900">
                Emergency Medical Escalation Directory
              </h2>
              <p className="text-xs text-red-800">
                If experiencing severe chest pain, breathing difficulty, or sudden weakness: Call <strong>108 (Ambulance)</strong> or <strong>112 (National Helpline)</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm whitespace-nowrap self-stretch md:self-auto text-center"
          >
            Emergency Guidance & Helplines
          </button>
        </div>

        {/* Quick Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/patient/assistant"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-5 shadow-subtle transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">AI Health Assistant</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ask about verified schemes, telemedicine steps, and general guidance.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 inline-flex items-center gap-1 pt-3">
              <span>Start Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/patient/consultation-prep"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-5 shadow-subtle transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">Consultation Prep</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate structured clinical draft summaries for your doctor review.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 inline-flex items-center gap-1 pt-3">
              <span>Create Draft</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/patient/appointments"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-5 shadow-subtle transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">Appointments</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Schedule demo slots and track pending/confirmed doctor appointments.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-700 inline-flex items-center gap-1 pt-3">
              <span>View Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/patient/records"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-5 shadow-subtle transition-all group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">Health Records</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Securely store private diagnostic lab tests and doctor prescriptions.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 inline-flex items-center gap-1 pt-3">
              <span>Browse Records ({dashboardData?.healthRecordsCount || 3})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* Split Section: Upcoming Appointments & Recent Consultations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <h2 className="font-bold text-slate-900 text-base">Upcoming Appointments</h2>
              </div>
              <Link to="/patient/appointments" className="text-xs font-semibold text-teal-700 hover:underline">
                View All
              </Link>
            </div>

            {dashboardData?.upcomingAppointments.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No active appointments scheduled. Click "Schedule Consultation" to book.
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.upcomingAppointments.slice(0, 2).map((appt) => (
                  <div key={appt.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">{appt.doctorName}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Calendar className="w-3 h-3 text-teal-600" /> {appt.date}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Clock className="w-3 h-3 text-teal-600" /> {appt.timeSlot}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{appt.symptomsSummary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Consultation Summaries */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h2 className="font-bold text-slate-900 text-base">Recent Consultations</h2>
              </div>
              <span className="text-xs text-slate-400">Doctor-Signed Records</span>
            </div>

            {dashboardData?.recentConsultations.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No previous consultations found.
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.recentConsultations.slice(0, 2).map((cons) => (
                  <div key={cons.id} className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 text-xs">{cons.doctorName}</p>
                      <span className="text-[10px] font-semibold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                        {cons.status === 'completed' ? 'Signed Off' : 'Draft Prepared'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-2">
                      <strong>Complaint:</strong> {cons.aiDraftSummary?.chiefComplaint}
                    </p>
                    {cons.doctorRecommendations && (
                      <p className="text-[11px] text-emerald-900 bg-white p-2 rounded border border-emerald-200 font-medium line-clamp-2">
                        <strong>Doctor Advice:</strong> {cons.doctorRecommendations}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured Government Healthcare Schemes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Verified Healthcare Initiatives (India)</h2>
              <p className="text-xs text-slate-500">Official information sources with updated eligibility requirements</p>
            </div>
            <Link to="/services" className="text-xs font-semibold text-teal-700 hover:underline">
              View All Schemes
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData?.featuredServices.map((svc) => (
              <div key={svc.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/60 px-1.5 py-0.5 rounded">
                    {svc.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{svc.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{svc.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Helpline: {svc.helpline}</span>
                  <Link to="/services" className="text-teal-700 font-bold hover:underline">Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
};
