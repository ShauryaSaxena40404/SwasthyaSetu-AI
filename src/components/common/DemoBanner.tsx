import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Stethoscope, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  const { user, isDemoMode, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  if (!isDemoMode && !user) return null;

  return (
    <div 
      className="bg-slate-900 text-slate-200 border-b border-slate-800 px-3 py-1.5 text-xs"
      role="status"
      aria-label="Demo Mode Indicator"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
            <Sparkles className="w-3 h-3" />
            <span>Interactive Demo Mode</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Active: <strong className="text-white">{user ? `${user.name} (${user.role.toUpperCase()})` : 'Not Logged In'}</strong>
          </span>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            • Synthetic data only. No real doctor availability or clinical diagnosis implied.
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Quick Role Switch:</span>
          
          <button
            onClick={async () => {
              await loginDemoUser('patient');
              navigate('/patient/dashboard');
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              user?.role === 'patient'
                ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Switch to Demo Patient Sunita Sharma"
          >
            <UserCheck className="w-3 h-3" />
            <span>Patient View</span>
          </button>

          <button
            onClick={async () => {
              await loginDemoUser('doctor');
              navigate('/doctor/dashboard');
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              user?.role === 'doctor'
                ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Switch to Demo Doctor Dr. Ananya Sharma"
          >
            <Stethoscope className="w-3 h-3" />
            <span>Doctor View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
