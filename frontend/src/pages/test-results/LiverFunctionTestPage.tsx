import React from 'react';
import TestResultLayout from '../../components/TestResultLayout';
import GenericTestResultForm from '../../components/GenericTestResultForm';

const lftFields: { name: string, label: string, type: 'number' | 'textarea' }[] = [
    { name: 'ast', label: 'AST', type: 'number' },
    { name: 'alt', label: 'ALT', type: 'number' },
    { name: 'alp', label: 'ALP', type: 'number' },
    { name: 'tb', label: 'TB', type: 'number' },
    { name: 'cb', label: 'CB', type: 'number' },
    { name: 'lft_remark', label: 'LFT Remark', type: 'textarea' },
    { name: 'other_remarks', label: 'Other Remarks', type: 'textarea' },
];

const LiverFunctionTestPage: React.FC = () => {
  return (
    <TestResultLayout title="Liver Function Test">
      {(patient) => (
        <GenericTestResultForm
          patientId={patient.id}
          formFields={lftFields}
          apiEndpoint={`/api/test-results/liver-function-test/${patient.id}`}
          fetchEndpoint={`/api/test-results/liver-function-test/${patient.id}`}
          title="Liver Function Test"
        />
      )}
    </TestResultLayout>
  );
};

export default LiverFunctionTestPage;
