import React from 'react';
import TestResultLayout from '../../components/TestResultLayout';
import GenericTestResultForm from '../../components/GenericTestResultForm';

const fbcFields: { name: string, label: string, type: 'number' | 'textarea' }[] = [
    { name: 'hct', label: 'HCT', type: 'number' },
    { name: 'wbc', label: 'WBC', type: 'number' },
    { name: 'plt', label: 'PLT', type: 'number' },
    { name: 'lymp_percent', label: 'LYMP(%)', type: 'number' },
    { name: 'lymp', label: 'LYMP', type: 'number' },
    { name: 'gra_percent', label: 'GRA(%)', type: 'number' },
    { name: 'gra', label: 'GRA', type: 'number' },
    { name: 'mid_percent', label: 'MID(%)', type: 'number' },
    { name: 'mid', label: 'MID', type: 'number' },
    { name: 'rbc', label: 'RBC', type: 'number' },
    { name: 'mcv', label: 'MCV(fl)', type: 'number' },
    { name: 'mch', label: 'MCH(pg)', type: 'number' },
    { name: 'mchc', label: 'MCHC(g/dl)', type: 'number' },
    { name: 'rdw', label: 'RDW(%)', type: 'number' },
    { name: 'pdw', label: 'PDW(%)', type: 'number' },
    { name: 'hgb', label: 'HGB', type: 'number' },
    { name: 'fbc_remark', label: 'FBC Remark', type: 'textarea' },
    { name: 'other_remarks', label: 'Other Remarks', type: 'textarea' },
];

const FullBloodCountPage: React.FC = () => {
  return (
    <TestResultLayout title="Full Blood Count">
      {(patient) => (
        <GenericTestResultForm
          patientId={patient.staff_id}
          formFields={fbcFields}
          apiEndpoint={`/api/test-results/full-blood-count/${patient.staff_id}`}
          fetchEndpoint={`/api/test-results/full-blood-count/${patient.staff_id}`}
          title="Full Blood Count"
        />
      )}
    </TestResultLayout>
  );
};

export default FullBloodCountPage;
