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

const LipidProfilePage: React.FC = () => {
    const [hdl, setHdl] = useState<number | string>('');
    const [ldl, setLdl] = useState<number | string>('');

    const handleFormChange = (data: any) => {
        const { tcho, tg } = data;
        let calculatedHdl: number | null = null;

        if (tcho) {
            calculatedHdl = parseFloat(tcho) * 0.35;
            setHdl(calculatedHdl.toFixed(2));
        }

        const hdlForLdl = calculatedHdl !== null ? calculatedHdl : parseFloat(hdl as string);

        if (tcho && tg && hdlForLdl) {
            const calculatedLdl = parseFloat(tcho) + parseFloat(tg) / 5 + hdlForLdl;
            setLdl(calculatedLdl.toFixed(2));
        }
    };

  return (
    <TestResultLayout title="Lipid Profile">
      {(patient) => (
        <GenericTestResultForm
          patient={patient}
          fields={lpFields}
          apiUrl="test-results/lipid-profile"
          onFormChange={handleFormChange}
          initialValues={{ hdl: hdl, ldl: ldl }}
        />
      )}
    </TestResultLayout>
  );
};

export default LipidProfilePage;
