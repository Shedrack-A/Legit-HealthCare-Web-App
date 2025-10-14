import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
`;

const SubmitButton = styled.button`
  grid-column: 4 / 5;
  justify-self: end;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  options?: string[];
}

interface GenericFormProps {
  patientId: string;
  formFields: FormField[];
  apiEndpoint: string;
  fetchEndpoint: string;
  title: string;
}

const GenericTestResultForm: React.FC<GenericFormProps> = ({ patientId, formFields, apiEndpoint, fetchEndpoint, title }) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId || !fetchEndpoint) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(fetchEndpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response.data || {});
      } catch (error) {
        console.log("No existing data found for this test/consultation.");
        setFormData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId, fetchEndpoint]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // For consultation, the patient_id must be in the body
      const submissionData = { ...formData, patient_id: patientId };

      await axios.post(apiEndpoint, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${title} data saved successfully!`);
    } catch (error: any) {
      console.error(`Failed to save ${title} data:`, error);
      const errorMessage = error.response?.data?.message || `Failed to save ${title} data.`;
      alert(errorMessage);
    }
  };

  const renderField = (field: FormField) => {
    const { name, label, type, options } = field;
    const value = formData[name] || '';

    switch (type) {
      case 'textarea':
        return (
          <FormGroup key={name} style={{ gridColumn: '1 / -1' }}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <FormTextArea id={name} name={name} value={value} onChange={handleChange} />
          </FormGroup>
        );
      case 'select':
        return (
          <FormGroup key={name}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <FormSelect id={name} name={name} value={value} onChange={handleChange}>
              <option value="">Select...</option>
              {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </FormSelect>
          </FormGroup>
        );
      default:
        return (
          <FormGroup key={name}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <FormInput id={name} type={type} name={name} value={value} onChange={handleChange} />
          </FormGroup>
        );
    }
  };

  if (loading) {
    return <p>Loading form data...</p>;
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      {formFields.map(renderField)}
      <SubmitButton type="submit">Save {title}</SubmitButton>
    </FormContainer>
  );
};

export default GenericTestResultForm;
