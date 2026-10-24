import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Activity, 
  Menu, 
  X, 
  UserCheck, 
  Stethoscope, 
  LogOut, 
  Globe, 
  ChevronDown,
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, role } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M3.22 12H9.5l1.5-3 3 6 1.5-3h5.28" stroke="#A7F3D0" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-teal-900">
                  SwasthyaSetu <span className="text-teal-600 font-bold text-lg sm:text-xl">AI</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                Healthcare Access Assistant • MoHFW eSanjeevani Inspired
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-slate-700">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>

            <Link
              to="/services"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/services') ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              {t('services')}
            </Link>

            <Link
              to="/#how-it-works"
              className="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-slate-50 transition-colors"
            >
              {t('howItWorks')}
            </Link>

            <Link
              to="/#about-prototype"
              className="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-slate-50 transition-colors"
            >
              {t('about')}
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Selector */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-white text-teal-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'hi' ? 'bg-white text-teal-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* User Profile or Portal Links */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-teal-950 leading-tight">{user.name}</p>
                    <p className="text-[11px] text-teal-700 capitalize font-medium">{user.role} Portal</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.role === 'doctor' ? <Stethoscope className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-teal-700 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fadeIn text-sm"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>

                    <Link
                      to={role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                    >
                      <Activity className="w-4 h-4 text-teal-600" />
                      <span>{role === 'doctor' ? 'Doctor Dashboard' : 'Patient Dashboard'}</span>
                    </Link>

                    {role === 'patient' && (
                      <>
                        <Link
                          to="/patient/assistant"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                        >
                          <Activity className="w-4 h-4 text-teal-600" />
                          <span>AI Health Assistant</span>
                        </Link>
                        <Link
                          to="/patient/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                        >
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span>My Appointments</span>
                        </Link>
                        <Link
                          to="/patient/records"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                        >
                          <FileText className="w-4 h-4 text-teal-600" />
                          <span>Health Records</span>
                        </Link>
                      </>
                    )}

                    {role === 'doctor' && (
                      <Link
                        to="/doctor/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        <span>Doctor Profile & Status</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/patient/dashboard"
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all"
                >
                  {t('patientPortal')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-1.5 text-xs font-bold border border-slate-300 rounded text-teal-800 bg-slate-50"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-teal-50 text-slate-800"
            >
              {t('home')}
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-teal-50 text-slate-800"
            >
              {t('services')}
            </Link>
            <Link
              to="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-teal-50 text-slate-800"
            >
              {t('howItWorks')}
            </Link>
            <Link
              to="/#about-prototype"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-teal-50 text-slate-800"
            >
              {t('about')}
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <div className="p-2 bg-teal-50 rounded-lg">
                  <p className="text-xs font-bold text-teal-900">{user.name}</p>
                  <p className="text-xs text-teal-700 capitalize">{user.role} Account</p>
                </div>
                <Link
                  to={role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold bg-slate-100 text-slate-800 rounded-lg"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/patient/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold bg-teal-600 text-white rounded-lg"
                >
                  {t('patientPortal')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
