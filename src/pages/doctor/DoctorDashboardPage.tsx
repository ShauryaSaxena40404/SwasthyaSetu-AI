import React from 'react';
import { DoctorSidebar } from '../../components/doctor/DoctorSidebar';
import { AppointmentQueue } from '../../components/doctor/AppointmentQueue';
import { useAuth } from '../../context/AuthContext';
import { DisclaimerBadge } from '../../components/common/DisclaimerBadge';
import { Stethoscope, ShieldCheck } from 'lucide-react';

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-slate-50/60">
      <DoctorSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Registered Clinician Portal
              </span>
              <DisclaimerBadge variant="demo" size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Clinical Workspace — {user?.name || 'Dr. Ananya Sharma'}
            </h1>
            <p className="text-teal-200 text-xs sm:text-sm">
              {user?.doctorProfile?.specialty} • Reg No: {user?.doctorProfile?.registrationNumber}
            </p>
          </div>

          <div className="px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-teal-100 space-y-0.5">
            <p className="font-semibold text-white">NMC Guideline Compliance</p>
            <p className="text-[11px] text-teal-300">Teleconsultation Practice Standards 2020</p>
          </div>
        </div>

        {/* Appointment Queue and Triage View */}
        <AppointmentQueue />
      </main>
    </div>
  );
};
