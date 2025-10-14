import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TestResultLayout from '../../components/TestResultLayout';
import GenericTestResultForm from '../../components/GenericTestResultForm';

const lpFields: { name: string, label: string, type: 'number' | 'textarea' }[] = [
    { name: 'tcho', label: 'TCHO', type: 'number' },
    { name: 'tg', label: 'TG', type: 'number' },
    { name: 'hdl', label: 'HDL', type: 'number' },
    { name: 'ldl', label: 'LDL', type: 'number' },
    { name: 'lp_remark', label: 'LP Remark', type: 'textarea' },
    { name: 'other_remarks', label: 'Other Remarks', type: 'textarea' },
];

const lpCalculations = [
    {
        target: 'hdl',
        dependencies: ['tcho'],
        calculate: (data: any) => {
            const tcho = parseFloat(data.tcho);
            if (!isNaN(tcho)) {
                return (tcho * 0.35).toFixed(2);
            }
            return '';
        }
    },
    {
        target: 'ldl',
        dependencies: ['tcho', 'tg', 'hdl'],
        calculate: (data: any) => {
            const tcho = parseFloat(data.tcho);
            const tg = parseFloat(data.tg);
            const hdl = parseFloat(data.hdl);
            if (!isNaN(tcho) && !isNaN(tg) && !isNaN(hdl)) {
                return (tcho + tg / 5 + hdl).toFixed(2);
            }
            return '';
        }
    }
];

const LipidProfilePage: React.FC = () => {
  return (
    <TestResultLayout title="Lipid Profile">
      {(patient) => (
        <GenericTestResultForm
          patientId={patient.id}
          formFields={lpFields}
          apiEndpoint={`/api/test-results/lipid-profile/${patient.id}`}
          fetchEndpoint={`/api/test-results/lipid-profile/${patient.id}`}
          title="Lipid Profile"
          calculations={lpCalculations}
        />
      )}
    </TestResultLayout>
  );
};

export default LipidProfilePage;
