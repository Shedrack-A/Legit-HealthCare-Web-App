import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TestResultLayout from '../../components/TestResultLayout';
import GenericTestResultForm from '../../components/GenericTestResultForm';

const kftFields: { name: string, label: string, type: 'number' | 'textarea' }[] = [
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

const KidneyFunctionTestPage: React.FC = () => {
    const [hco3, setHco3] = useState<number | string>('');

    const handleFormChange = (data: any) => {
        const { k, na, cl } = data;
        if (k && na && cl) {
            const calculatedHco3 = parseFloat(k) + parseFloat(na) - parseFloat(cl) - 16;
            setHco3(calculatedHco3.toFixed(2));
        }
    };

  return (
    <TestResultLayout title="Kidney Function Test">
      {(patient) => (
        <GenericTestResultForm
          patient={patient}
          fields={kftFields}
          apiUrl="test-results/kidney-function-test"
          onFormChange={handleFormChange}
          initialValues={{ hc03: hco3 }}
        />
      )}
    </TestResultLayout>
  );
};

export default KidneyFunctionTestPage;
