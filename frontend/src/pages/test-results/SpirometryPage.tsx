import React from 'react';
import TestResultLayout from '../../components/TestResultLayout';
import GenericTestResultForm from '../../components/GenericTestResultForm';

const spirometryFields: { name: string, label: string, type: 'textarea' }[] = [
    { name: 'spirometry_result', label: 'Spirometry Result', type: 'textarea' },
    { name: 'spirometry_remark', label: 'Spirometry Remark', type: 'textarea' },
];

const SpirometryPage: React.FC = () => {
  return (
    <TestResultLayout title="Spirometry">
      {(patient) => (
        <GenericTestResultForm
          patientId={patient.staff_id}
          formFields={spirometryFields}
          apiEndpoint={`/api/test-results/spirometry/${patient.staff_id}`}
          fetchEndpoint={`/api/test-results/spirometry/${patient.staff_id}`}
          title="Spirometry"
        />
      )}
    </TestResultLayout>
  );
};

export default SpirometryPage;
