import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileCheck2, 
  UserCheck, 
  ShieldCheck, 
  Stethoscope,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DisclaimerBadge } from '../common/DisclaimerBadge';

export const DoctorSidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/doctor/dashboard', label: 'Doctor Clinical Queue', icon: LayoutDashboard },
    { to: '/doctor/appointments', label: 'Manage Appointments', icon: CalendarCheck },
    { to: '/doctor/profile', label: 'Clinician Registration', icon: ShieldCheck },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 lg:min-h-[calc(100vh-5rem)] p-4 space-y-6">
      
      {/* Doctor Card */}
      <div className="p-3.5 bg-gradient-to-br from-teal-900 to-teal-950 text-white rounded-xl shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-teal-700 border border-teal-500/60 flex items-center justify-center font-bold text-sm shadow-inner">
            <Stethoscope className="w-5 h-5 text-teal-200" />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-sm truncate">{user?.name || 'Dr. Practitioner'}</h3>
            <p className="text-[11px] text-teal-300 font-medium truncate">
              {user?.doctorProfile?.specialty || 'General Medicine'}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-teal-800/80 flex items-center justify-between text-[11px]">
          <span className="text-teal-300">Council Reg:</span>
          <span className="font-mono font-bold text-white text-[10px]">
            {user?.doctorProfile?.registrationNumber || 'NMC-DL-2016-19382'}
          </span>
        </div>

        <div className="pt-1 flex items-center justify-between">
          <span className="text-[10px] text-teal-400">Status:</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {user?.doctorProfile?.isVerified ? 'Verified Practitioner' : 'Demo Account'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Clinical Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/doctor/dashboard'}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                ${isActive 
                  ? 'bg-teal-700 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-teal-900 hover:bg-slate-100'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* Safety & Compliance Notice */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px] text-slate-600">
        <p className="font-bold text-slate-800 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Clinical Autonomy Protocol</span>
        </p>
        <p className="leading-relaxed">
          AI draft summaries are non-binding reference notes. Prescriptions and diagnoses must originate strictly from licensed clinical evaluation.
        </p>
      </div>
    </aside>
  );
};
