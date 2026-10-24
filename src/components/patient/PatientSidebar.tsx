import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  ClipboardList, 
  Calendar, 
  FileText, 
  Compass, 
  AlertOctagon,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onOpenEmergencyModal: () => void;
}

export const PatientSidebar: React.FC<Props> = ({ onOpenEmergencyModal }) => {
  const { user } = useAuth();

  const navItems = [
    { to: '/patient/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/patient/assistant', label: 'AI Health Assistant', icon: Bot, badge: 'Active' },
    { to: '/patient/consultation-prep', label: 'Prepare for Doctor', icon: ClipboardList },
    { to: '/patient/appointments', label: 'My Appointments', icon: Calendar },
    { to: '/patient/records', label: 'Health Records', icon: FileText },
    { to: '/services', label: 'Verified Schemes', icon: Compass },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 lg:min-h-[calc(100vh-5rem)] p-4 space-y-6">
      
      {/* Patient Profile Card */}
      <div className="p-3.5 bg-gradient-to-br from-teal-50 to-teal-100/60 rounded-xl border border-teal-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.name ? user.name.charAt(0) : 'P'}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-900 text-sm truncate">{user?.name || 'Patient'}</h3>
            <p className="text-xs text-teal-800 font-medium truncate">{user?.phone || '+91 98765 43210'}</p>
          </div>
        </div>
        {user?.abhaId && (
          <div className="mt-2.5 pt-2 border-t border-teal-200/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">ABHA ID:</span>
            <span className="font-mono font-semibold text-teal-900">{user.abhaId}</span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Patient Services
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/patient/dashboard'}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                ${isActive 
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-700/20' 
                  : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50/70'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !isActive && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-100 text-teal-800 font-bold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Emergency Quick Trigger */}
      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={onOpenEmergencyModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold transition-all shadow-subtle group"
        >
          <AlertOctagon className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
          <span>Emergency Assistance</span>
        </button>
        <p className="text-[10px] text-slate-400 text-center mt-1.5">
          Dial 108 (Ambulance) / 112 (National)
        </p>
      </div>
    </aside>
  );
};
