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
          patient={patient}
          fields={audiometryFields}
          apiUrl="test-results/audiometry"
        />
      )}
    </TestResultLayout>
  );
};

export default AudiometryPage;
