import React from 'react';
import { DoctorSidebar } from '../../components/doctor/DoctorSidebar';
import { ConsultationView } from '../../components/doctor/ConsultationView';

export const DoctorConsultationPage: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-slate-50/60">
      <DoctorSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <ConsultationView />
      </main>
    </div>
  );
};
