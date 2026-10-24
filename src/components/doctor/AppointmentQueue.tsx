import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Appointment, DoctorDashboardData, AppointmentStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  RefreshCw, 
  FileText, 
  AlertCircle, 
  Stethoscope, 
  User as UserIcon,
  ChevronRight,
  Filter
} from 'lucide-react';
import { DisclaimerBadge } from '../common/DisclaimerBadge';
import { Link, useNavigate } from 'react-router-dom';

export const AppointmentQueue: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DoctorDashboardData | null>(null);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed' | 'all'>('pending');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDoctorAppointments(user?.id || 'doctor-ananya');
      setDashboardData(data);
      const appts = await api.getAppointments();
      // Filter for this doctor or demo doctor
      setAllAppointments(appts.filter(a => a.doctorId === (user?.id || 'doctor-ananya') || a.doctorId === 'doctor-ananya'));
    } catch (err) {
      console.error('Failed to load doctor dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
    setIsUpdatingId(appointmentId);
    try {
      await api.updateAppointmentStatus(appointmentId, newStatus);
      setActionSuccess(`Appointment successfully marked as ${newStatus}.`);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      alert(msg);
    } finally {
      setIsUpdatingId(null);
    }
  };

  const filteredAppointments = allAppointments.filter(a => {
    if (activeTab === 'all') return true;
    return a.status === activeTab;
  });

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Requests</span>
          <p className="text-2xl font-black text-slate-900">{dashboardData?.pendingRequests.length || 0}</p>
          <p className="text-[11px] text-slate-500">Awaiting clinical approval</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Today's Schedule</span>
          <p className="text-2xl font-black text-teal-900">{dashboardData?.todayAppointments.length || 0}</p>
          <p className="text-[11px] text-slate-500">Confirmed tele-OPD slots</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Upcoming Bookings</span>
          <p className="text-2xl font-black text-blue-900">{dashboardData?.upcomingCount || 0}</p>
          <p className="text-[11px] text-slate-500">Confirmed future appointments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Completed Reviews</span>
          <p className="text-2xl font-black text-emerald-900">{dashboardData?.completedCount || 0}</p>
          <p className="text-[11px] text-slate-500">With clinical notes signed</p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-900 text-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <p className="font-semibold">{actionSuccess}</p>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-xs text-emerald-700 underline">Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { key: 'pending', label: `Pending Requests (${dashboardData?.pendingRequests.length || 0})` },
            { key: 'confirmed', label: `Confirmed (${dashboardData?.upcomingCount || 0})` },
            { key: 'completed', label: `Completed (${dashboardData?.completedCount || 0})` },
            { key: 'all', label: 'All Queue Items' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={loadData}
          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors"
          title="Refresh Queue"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Queue List */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading clinician appointment queue...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Appointments in this Category</h3>
          <p className="text-xs text-slate-500">
            There are currently no {activeTab} patient requests assigned to your demo profile.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle hover:border-teal-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {appt.id}
                  </span>
                  <h3 className="font-black text-slate-900 text-base">{appt.patientName}</h3>
                  <span className="text-xs text-slate-500">
                    ({appt.patientAge || 48} yrs • {appt.patientGender || 'Female'})
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                    appt.urgencyLevel === 'urgent'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : appt.urgencyLevel === 'moderate'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}>
                    {appt.urgencyLevel} priority
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {appt.date}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {appt.timeSlot}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">Status: <strong className="capitalize">{appt.status}</strong></span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                  <strong>Patient Symptoms Summary:</strong> {appt.symptomsSummary}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                
                {/* Accept Button for pending */}
                {appt.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                      disabled={isUpdatingId === appt.id}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accept Request</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'rejected')}
                      disabled={isUpdatingId === appt.id}
                      className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </>
                )}

                {/* Open Consultation Button */}
                <button
                  onClick={() => navigate(`/doctor/consultation/${appt.consultationId || appt.id}`)}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-teal-200" />
                  <span>Open Clinical Notes & Summary</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
