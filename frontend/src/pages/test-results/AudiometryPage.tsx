import React from 'react';
import TestResultLayout from '../../components/TestResultLayout';
import GenericTestResultForm from '../../components/GenericTestResultForm';

const audiometryFields: { name: string, label: string, type: 'textarea' }[] = [
    { name: 'audiometry_result', label: 'Audiometry Result', type: 'textarea' },
    { name: 'audiometry_remark', label: 'Audiometry Remark', type: 'textarea' },
];

const AudiometryPage: React.FC = () => {
  return (
    <TestResultLayout title="Audiometry">
      {(patient) => (
        <GenericTestResultForm
          patientId={patient.staff_id}
          formFields={audiometryFields}
          apiEndpoint={`/api/test-results/audiometry/${patient.staff_id}`}
          fetchEndpoint={`/api/test-results/audiometry/${patient.staff_id}`}
          title="Audiometry"
        />
      )}
    </TestResultLayout>
  );
};

export default AudiometryPage;
