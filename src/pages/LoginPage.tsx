import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  UserCheck, 
  Stethoscope, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { DisclaimerBadge } from '../components/common/DisclaimerBadge';

export const LoginPage: React.FC = () => {
  const { login, loginDemoUser, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState<UserRole>(
    (searchParams.get('role') as UserRole) || 'patient'
  );
  const [email, setEmail] = useState(
    role === 'doctor' ? 'doctor@demo.swasthyasetu.in' : 'patient@demo.swasthyasetu.in'
  );
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleTabChange = (newRole: UserRole) => {
    setRole(newRole);
    setEmail(newRole === 'doctor' ? 'doctor@demo.swasthyasetu.in' : 'patient@demo.swasthyasetu.in');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(email, role, password);
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      await loginDemoUser(targetRole);
      navigate(targetRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50/70">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-8 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-sm">
            {role === 'doctor' ? <Stethoscope className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            SwasthyaSetu Portal Sign In
          </h1>
          <p className="text-xs text-slate-500">
            Access your healthcare dashboard, appointments, and consultation records
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => handleRoleTabChange('patient')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'patient'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>Patient Portal</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('doctor')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'doctor'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Doctor Portal</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registered Email ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Signing In...' : `Sign In to ${role === 'doctor' ? 'Doctor' : 'Patient'} Portal`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Evaluation Box */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Instant Demo Sign-In
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('patient')}
              className="p-2.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-left transition-colors"
            >
              <p className="text-xs font-bold text-teal-950">Patient Demo</p>
              <p className="text-[10px] text-teal-700 truncate">Sunita Sharma (48F)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('doctor')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-left transition-colors"
            >
              <p className="text-xs font-bold text-slate-900">Doctor Demo</p>
              <p className="text-[10px] text-slate-600 truncate">Dr. Ananya Sharma (MD)</p>
            </button>
          </div>
        </div>

        {/* Registration Link */}
        <div className="text-center text-xs text-slate-500 pt-1">
          Don't have an account yet?{' '}
          <Link to={`/register?role=${role}`} className="text-teal-700 font-bold hover:underline">
            Register new {role} profile
          </Link>
        </div>
      </div>
    </div>
  );
};
