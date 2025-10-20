import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
`;

const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
`;

const FormTextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
  min-height: 80px;
  grid-column: 1 / -1;
`;

const SubmitButton = styled.button`
  grid-column: 3 / 4;
  justify-self: end;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface ConsultationFormProps {
  patient: any;
  onSuccess?: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ patient, onSuccess }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/consultations/${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data);
      } catch (error) {
        console.log('No existing consultation data found.');
      }
    };
    fetchData();
  }, [patient.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/consultations',
        { ...formData, patient_id: patient.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Consultation saved successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to save consultation:', error);
      alert('Failed to save consultation.');
    }
  };

  const renderSelect = (name: string, options: string[], label: string) => (
    <FormGroup>
      <FormLabel>{label}</FormLabel>
      <FormSelect
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </FormSelect>
    </FormGroup>
  );

  const renderInput = (name: string, label: string, type: string = 'text') => (
    <FormGroup>
      <FormLabel>{label}</FormLabel>
      <FormInput
        type={type}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
      />
    </FormGroup>
  );

  const renderTextArea = (name: string, label: string) => (
    <FormGroup style={{ gridColumn: '1 / -1' }}>
      <FormLabel>{label}</FormLabel>
      <FormTextArea
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
      />
    </FormGroup>
  );

  return (
    <FormContainer onSubmit={handleSubmit}>
      {renderSelect('luts', ['Yes', 'No'], 'LUTS')}
      {renderSelect('chronic_cough', ['Yes', 'No'], 'Chronic Cough')}
      {renderSelect('chronic_chest_pain', ['Yes', 'No'], 'Chronic Chest Pain')}
      {renderSelect('chest_infection', ['Yes', 'No'], 'Chest Infection')}
      {renderSelect('heart_dx', ['Yes', 'No'], 'Heart DX')}
      {renderSelect('palor', ['Yes', 'No'], 'Palor')}
      {renderSelect('jaundice', ['Yes', 'No'], 'Jaundice')}
      {renderSelect('murmur', ['Yes', 'No'], 'Murmur')}
      {renderSelect('chest', ['Clinically Clear', 'Not Clear'], 'Chest')}
      {renderSelect(
        'prostrate_specific_antigen',
        ['Negative', 'Positive', 'Not Applicable'],
        'Prostrate-Specific Antigen - PSA'
      )}
      {renderInput('psa_remark', 'PSA Remark')}
      {renderSelect('fbs', ['Not Applicable'], 'FBS')}
      {renderSelect('rbs', ['Not Applicable'], 'RBS')}
      {renderSelect(
        'fbs_rbs_remark',
        ['Normal', 'Abnormal', 'Maybe Abnormal'],
        'FBS/RBS Remark'
      )}
      {renderSelect(
        'urine_analysis',
        [
          'No Abnormality',
          'Proteinuria',
          'Proteinuria+',
          'Proteinuria >+',
          'Glucosuria',
          'Glucosuria+',
          'Glucosuria >+',
          'Proteinuria/Glucosuria',
        ],
        'Urine Analysis'
      )}
      {renderSelect(
        'ua_remark',
        ['Normal', 'Abdormal', 'Maybe Abnormal'],
        'U/A Remark'
      )}
      {renderSelect(
        'diabetes_mellitus',
        [
          'Yes - On Regular Medication',
          'Yes - Not on Regular Medication',
          'Yes - Not on Medication',
          'No',
        ],
        'Diabetes Mellitus - DM'
      )}
      {renderSelect(
        'hypertension',
        [
          'Yes - On Regular Medication',
          'Yes - Not on Regular Medication',
          'Yes - Not on Medication',
          'No',
        ],
        'Hypertension - HTM'
      )}
      {renderInput('bp', 'B.P')}
      {renderInput('pulse', 'PULSE - b/m')}
      {renderInput('spo2', 'SPO2%')}
      {renderSelect('hs', ['Present', 'S3 Present', 'S4 Present'], 'HS: 1&2')}
      {renderSelect(
        'breast_exam',
        ['Not Applicable', 'Normal', 'Abdormal'],
        'Breast Exam'
      )}
      {renderSelect(
        'breast_exam_remark',
        ['Normal', 'Not Applicable'],
        'Breast Exam Remark'
      )}
      {renderSelect('abdomen', ['Normal', 'Abnormal'], 'Abdomen')}
      {renderSelect(
        'assessment_hx_pe',
        [
          'Satisfactory',
          'Elevated BP',
          'Poorly Controled HTN',
          'Known DM',
          'Bladder Outlet Obstruction',
        ],
        'Assessment - HX/PE'
      )}

      {renderTextArea('other_assessments', 'Other Assessments')}
      {renderTextArea('overall_lab_remark', 'Overall Lab Remark')}
      {renderTextArea('other_remarks', 'Other Remarks')}
      {renderTextArea('overall_assessment', 'Overall Assessment(s)')}

      <SubmitButton type="submit">Save Consultation</SubmitButton>
    </FormContainer>
  );
};

export default ConsultationForm;
