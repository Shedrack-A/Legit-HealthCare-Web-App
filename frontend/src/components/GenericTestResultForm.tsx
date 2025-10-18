import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Input } from './common/Input';
import { TextArea } from './common/TextArea';

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.cardBg};
  padding: ${({ theme }) => theme.cardPadding};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.inputPadding};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.medium};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.main}33;
  }
`;

const SubmitButton = styled.button`
  grid-column: 1 / -1;
  justify-self: end;
  padding: ${({ theme }) => theme.inputPadding};
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-weight: 600;
  width: 150px;

  &:hover {
    background-color: ${({ theme }) => theme.mainHover};
  }
`;

const FullWidthFormGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  options?: string[];
  readOnly?: boolean;
  fullWidth?: boolean;
}

interface CalculationRule {
  target: string;
  dependencies: string[];
  calculate: (data: any) => number | string;
}

interface GenericFormProps {
  patientId: string;
  formFields: FormField[];
  apiEndpoint: string;
  fetchEndpoint: string;
  title: string;
  calculations?: CalculationRule[];
}

const GenericTestResultForm: React.FC<GenericFormProps> = ({
  patientId,
  formFields,
  apiEndpoint,
  fetchEndpoint,
  title,
  calculations,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId || !fetchEndpoint) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(fetchEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(response.data || {});
      } catch (error) {
        console.log('No existing data found for this test/consultation.');
        setFormData({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId, fetchEndpoint]);

  const runCalculations = useCallback(
    (data: any, changedField: string) => {
      if (!calculations) return data;

      let newData = { ...data };
      let needsRecalculating = true;

      while (needsRecalculating) {
        needsRecalculating = false;
        calculations.forEach((rule) => {
          if (rule.dependencies.includes(changedField)) {
            const result = rule.calculate(newData);
            if (newData[rule.target] !== result) {
              newData = { ...newData, [rule.target]: result };
              changedField = rule.target;
              needsRecalculating = true;
            }
          }
        });
      }
      return newData;
    },
    [calculations]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const updatedData = { ...prev, [name]: value };
      return runCalculations(updatedData, name);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const submissionData = { ...formData };
      if (apiEndpoint.includes('consultations')) {
        submissionData.staff_id = patientId;
      }

      await axios.post(apiEndpoint, submissionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`${title} data saved successfully!`);
    } catch (error: any) {
      console.error(`Failed to save ${title} data:`, error);
      const errorMessage =
        error.response?.data?.message || `Failed to save ${title} data.`;
      alert(errorMessage);
    }
  };

  const renderField = (field: FormField) => {
    const { name, label, type, options, readOnly, fullWidth } = field;
    const value = formData[name] || '';
    const ComponentGroup = fullWidth ? FullWidthFormGroup : FormGroup;

    switch (type) {
      case 'textarea':
        return (
          <ComponentGroup key={name}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <TextArea
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
            />
          </ComponentGroup>
        );
      case 'select':
        return (
          <ComponentGroup key={name}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <FormSelect
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              {options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </FormSelect>
          </ComponentGroup>
        );
      default:
        return (
          <ComponentGroup key={name}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Input
              id={name}
              type={type}
              name={name}
              value={value}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </ComponentGroup>
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
