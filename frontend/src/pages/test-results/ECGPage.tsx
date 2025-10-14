import React from 'react';
import TestResultLayout from '../../components/TestResultLayout';
import GenericTestResultForm from '../../components/GenericTestResultForm';

const ecgFields: { name: string, label: string, type: 'textarea' }[] = [
    { name: 'ecg_result', label: 'ECG Result', type: 'textarea' },
    { name: 'remark', label: 'Remark', type: 'textarea' },
];

const ECGPage: React.FC = () => {
  return (
    <TestResultLayout title="ECG">
      {(patient) => (
        <GenericTestResultForm
          patientId={patient.id}
          formFields={ecgFields}
          apiEndpoint={`/api/test-results/ecg/${patient.id}`}
          fetchEndpoint={`/api/test-results/ecg/${patient.id}`}
          title="ECG"
        />
      )}
    </TestResultLayout>
  );
};

export default ECGPage;
