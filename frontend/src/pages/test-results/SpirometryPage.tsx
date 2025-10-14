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
          patient={patient}
          fields={spirometryFields}
          apiUrl="test-results/spirometry"
        />
      )}
    </TestResultLayout>
  );
};

export default SpirometryPage;
