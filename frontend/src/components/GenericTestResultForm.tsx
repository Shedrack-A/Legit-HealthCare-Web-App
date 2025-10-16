import React, { useState, useEffect, useCallback } from 'react';
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
  background-color: ${({ readOnly, theme }) => readOnly ? theme.cardBorder : 'inherit'};
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
  readOnly?: boolean;
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

const GenericTestResultForm: React.FC<GenericFormProps> = ({ patientId, formFields, apiEndpoint, fetchEndpoint, title, calculations }) => {
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

  const runCalculations = useCallback((data: any, changedField: string) => {
    if (!calculations) return data;

    let newData = { ...data };
    let needsRecalculating = true;

    // Loop to handle chained calculations (e.g., LDL depends on HDL, which depends on TCHO)
    while(needsRecalculating) {
        needsRecalculating = false;
        calculations.forEach(rule => {
            // Check if the changed field is a dependency of the current rule
            if (rule.dependencies.includes(changedField)) {
                const result = rule.calculate(newData);
                if (newData[rule.target] !== result) {
                    newData = { ...newData, [rule.target]: result };
                    // If this calculation updated a field, we need to check if that field is a dependency for another rule
                    changedField = rule.target;
                    needsRecalculating = true;
                }
            }
        });
    }
    return newData;
  }, [calculations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // For consultation, the patient_id might need to be in the body
      // For test results, it's in the URL. We'll handle both.
      const submissionData = { ...formData };
      if (apiEndpoint.includes('consultations')) {
        submissionData.staff_id = patientId; // patientId prop now holds the staff_id
      }

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
    const { name, label, type, options, readOnly } = field;
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
            <FormInput id={name} type={type} name={name} value={value} onChange={handleChange} readOnly={readOnly} />
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
