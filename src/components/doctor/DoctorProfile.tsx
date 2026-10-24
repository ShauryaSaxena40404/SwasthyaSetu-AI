import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Stethoscope, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Clock, 
  Languages, 
  Building2, 
  Phone, 
  Mail, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { DisclaimerBadge } from '../common/DisclaimerBadge';

export const DoctorProfile: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.doctorProfile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Clinician Profile & Verification Credentials
            </h1>
            <DisclaimerBadge variant="demo" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Professional registry records, National Medical Commission (NMC) registration details, and teleconsultation duty roster.
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Demo Practitioner Verified</span>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        
        {/* Cover / Profile Banner */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 border-2 border-white/40 flex items-center justify-center font-black text-2xl shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">{user?.name || 'Dr. Ananya Sharma'}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 border border-white/30 text-white">
                Teleconsultation Officer
              </span>
            </div>
            <p className="text-teal-200 text-xs sm:text-sm font-medium mt-0.5">
              {profile?.specialty || 'Internal Medicine & General Physician'}
            </p>
            <p className="text-[11px] text-teal-300/80 mt-1">
              {profile?.hospitalOrClinic || 'SwasthyaSetu Empanelled Telehealth Unit'}
            </p>
          </div>
        </div>

        {/* Content details */}
        <div className="p-6 space-y-6">
          
          {/* Statutory Registration Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              <span>Statutory Medical Council Registration</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 block">Registration Number:</span>
                <span className="font-mono font-bold text-slate-800">{profile?.registrationNumber || 'NMC-DL-2016-19382'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Qualifying Degrees:</span>
                <span className="font-semibold text-slate-800">{profile?.qualifications || 'MBBS, MD'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Clinical Experience:</span>
                <span className="font-semibold text-slate-800">{profile?.experienceYears || 11} Years</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile?.bio && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinical Bio & Focus</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Availability & Languages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>Available Consultation Days</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile?.availableDays.map((day) => (
                  <span key={day} className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg font-medium border border-teal-200">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Duty Time Slots</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile?.timeSlots.map((slot) => (
                  <span key={slot} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-medium border border-slate-200">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-teal-600" />
              <span>Languages Supported for Patient Consultations</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile?.languages.map((lang) => (
                <span key={lang} className="px-3 py-1 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 font-semibold">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Protocol Callout */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Identity Verification Notice</span>
            </p>
            <p className="leading-relaxed">
              In accordance with Ministry of Health teleconsultation practice regulations, practitioners can only be officially marked as "Verified" by state portal administrators following registry authentication. Demo credentials represent fictional practitioner personas for technical simulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
