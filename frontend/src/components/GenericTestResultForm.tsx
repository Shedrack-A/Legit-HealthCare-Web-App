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

const FormTextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
  min-height: 80px;
  grid-column: 1 / -1;
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

interface GenericTestResultFormProps {
  patient: any;
  fields: { name: string, label: string, type: 'text' | 'number' | 'textarea' }[];
  apiUrl: string;
  onFormChange?: (data: any) => void;
  initialValues?: any;
}

const GenericTestResultForm: React.FC<GenericTestResultFormProps> = ({ patient, fields, apiUrl, onFormChange, initialValues }) => {
  const [formData, setFormData] = useState<any>(initialValues || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/${apiUrl}/${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({ ...initialValues, ...response.data });
      } catch (error) {
        console.log("No existing data found.");
      }
    };
    fetchData();
  }, [patient.id, apiUrl, initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    if (onFormChange) {
      onFormChange(newData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/${apiUrl}/${patient.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Test result saved successfully!');
    } catch (error) {
      console.error('Failed to save test result:', error);
      alert('Failed to save test result.');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {fields.map(field => (
        field.type === 'textarea' ? (
          <FormGroup key={field.name} style={{ gridColumn: '1 / -1' }}>
            <FormLabel>{field.label}</FormLabel>
            <FormTextArea name={field.name} value={formData[field.name] || ''} onChange={handleChange} />
          </FormGroup>
        ) : (
          <FormGroup key={field.name}>
            <FormLabel>{field.label}</FormLabel>
            <FormInput
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              readOnly={!!initialValues[field.name]}
            />
          </FormGroup>
        )
      ))}
      <SubmitButton type="submit">Save Results</SubmitButton>
    </FormContainer>
  );
};

export default GenericTestResultForm;
