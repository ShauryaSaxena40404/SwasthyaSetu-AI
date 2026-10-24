import React, { useState } from 'react';
import { PatientSidebar } from '../../components/patient/PatientSidebar';
import { HealthRecords } from '../../components/patient/HealthRecords';
import { EmergencyModal } from '../../components/common/EmergencyModal';

export const HealthRecordsPage: React.FC = () => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)] bg-slate-50/60">
      <PatientSidebar onOpenEmergencyModal={() => setShowEmergencyModal(true)} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl">
        <HealthRecords />
      </main>
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
};
