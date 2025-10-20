import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TestResultLayout from '../../components/TestResultLayout';
import GenericTestResultForm from '../../components/GenericTestResultForm';

const kftFields: {
  name: string;
  label: string;
  type: 'number' | 'textarea';
}[] = [
  { name: 'k', label: 'K', type: 'number' },
  { name: 'na', label: 'NA', type: 'number' },
  { name: 'cl', label: 'CL', type: 'number' },
  { name: 'ca', label: 'CA', type: 'number' },
  { name: 'hc03', label: 'HC03', type: 'number' },
  { name: 'urea', label: 'UREA', type: 'number' },
  { name: 'cre', label: 'CRE', type: 'number' },
  { name: 'kft_remark', label: 'KFT Remark', type: 'textarea' },
  { name: 'other_remarks', label: 'Other Remarks', type: 'textarea' },
];

const kftCalculations = [
  {
    target: 'hc03',
    dependencies: ['k', 'na', 'cl'],
    calculate: (data: any) => {
      const k = parseFloat(data.k);
      const na = parseFloat(data.na);
      const cl = parseFloat(data.cl);
      if (!isNaN(k) && !isNaN(na) && !isNaN(cl)) {
        return (k + na - cl - 16).toFixed(2);
      }
      return '';
    },
  },
];

const KidneyFunctionTestPage: React.FC = () => {
  return (
    <TestResultLayout title="Kidney Function Test">
      {(patient) => (
        <GenericTestResultForm
          patientId={patient.staff_id}
          formFields={kftFields}
          apiEndpoint={`/api/test-results/kidney-function-test/${patient.staff_id}`}
          fetchEndpoint={`/api/test-results/kidney-function-test/${patient.staff_id}`}
          title="Kidney Function Test"
          calculations={kftCalculations}
        />
      )}
    </TestResultLayout>
  );
};

export default KidneyFunctionTestPage;
