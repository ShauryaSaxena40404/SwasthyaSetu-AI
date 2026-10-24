import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { DemoBanner } from './components/common/DemoBanner';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ServicesPage } from './pages/ServicesPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Patient Pages
import { PatientDashboardPage } from './pages/patient/PatientDashboardPage';
import { AssistantPage } from './pages/patient/AssistantPage';
import { ConsultationPrepPage } from './pages/patient/ConsultationPrepPage';
import { PatientAppointmentsPage } from './pages/patient/PatientAppointmentsPage';
import { HealthRecordsPage } from './pages/patient/HealthRecordsPage';

// Doctor Pages
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage';
import { DoctorConsultationPage } from './pages/doctor/DoctorConsultationPage';
import { DoctorProfilePage } from './pages/doctor/DoctorProfilePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans">
            
            {/* Top Critical Notice Banners */}
            <EmergencyBanner />
            <DemoBanner />

            {/* Main Application Navbar */}
            <Navbar />

            {/* Routed View Body */}
            <div className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Patient Partition (Role Protected) */}
                <Route
                  path="/patient/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/assistant"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <AssistantPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/consultation-prep"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <ConsultationPrepPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientAppointmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/records"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <HealthRecordsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Doctor Partition (Role Protected) */}
                <Route
                  path="/doctor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/consultation/:consultationId"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorConsultationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/profile"
                  element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                      <DoctorProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallbacks */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>

            {/* Global Trustworthy Footer */}
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
