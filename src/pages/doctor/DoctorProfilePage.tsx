import React from 'react';
import { DoctorSidebar } from '../../components/doctor/DoctorSidebar';
import { DoctorProfile } from '../../components/doctor/DoctorProfile';

export const DoctorProfilePage: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-slate-50/60">
      <DoctorSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <DoctorProfile />
      </main>
    </div>
  );
};
