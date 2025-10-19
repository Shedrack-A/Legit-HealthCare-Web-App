import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  DIRECTOR_REVIEW_FIELDS,
  FULL_BLOOD_COUNT_FIELDS,
  KIDNEY_FUNCTION_TEST_FIELDS,
  LIPID_PROFILE_FIELDS,
  LIVER_FUNCTION_TEST_FIELDS,
  ECG_FIELDS,
  SPIROMETRY_FIELDS,
  AUDIOMETRY_FIELDS,
} from '../data/constants';
import Accordion from '../components/common/Accordion';
import { Button } from '../components/common/Button';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/common/Input';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PatientHeader = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: ${({ theme }) => theme.cardPadding};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
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

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

const DirectorReviewFormPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [patientData, setPatientData] = useState<any>(null);
  const { showFlashMessage, setIsLoading, isLoading } = useApp();

  useEffect(() => {
    const fetchPatientSummary = async () => {
      if (!staffId) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patient-summary/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatientData(response.data);
      } catch (error) {
        console.error('Could not fetch patient summary', error);
        setPatientData(null);
        showFlashMessage('Failed to load patient data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatientSummary();
  }, [staffId, setIsLoading, showFlashMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/save-director-review/${staffId}`, patientData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showFlashMessage("Director's review saved successfully!", 'success');
    } catch (error) {
      console.error('Failed to save director review:', error);
      showFlashMessage('Failed to save review.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading patient data...</p>;
  }

  if (!patientData) {
    return <p>Could not load patient data.</p>;
  }

  const renderFormFields = (fields: any[]) => (
    <FormGrid>
      {fields.map((field) => (
        <FormGroup key={field.name}>
          <FormLabel>{field.label}</FormLabel>
          <Input
            type={field.type}
            name={field.name}
            value={patientData[field.name] || ''}
            onChange={handleChange}
          />
        </FormGroup>
      ))}
    </FormGrid>
  );

  return (
    <PageContainer>
      <PageTitle>Director's Review</PageTitle>

      <PatientHeader>
        <h2>
          {patientData.first_name} {patientData.last_name}
        </h2>
        <p>
          Staff ID: {patientData.staff_id} | Department:{' '}
          {patientData.department} | Age: {patientData.age}
        </p>
      </PatientHeader>

      <Accordion title="Full Blood Count">
        {renderFormFields(FULL_BLOOD_COUNT_FIELDS)}
      </Accordion>
      <Accordion title="Kidney Function Test">
        {renderFormFields(KIDNEY_FUNCTION_TEST_FIELDS)}
      </Accordion>
      <Accordion title="Lipid Profile">
        {renderFormFields(LIPID_PROFILE_FIELDS)}
      </Accordion>
      <Accordion title="Liver Function Test">
        {renderFormFields(LIVER_FUNCTION_TEST_FIELDS)}
      </Accordion>
      <Accordion title="ECG">{renderFormFields(ECG_FIELDS)}</Accordion>
      <Accordion title="Spirometry">
        {renderFormFields(SPIROMETRY_FIELDS)}
      </Accordion>
      <Accordion title="Audiometry">
        {renderFormFields(AUDIOMETRY_FIELDS)}
      </Accordion>
      <Accordion title="Director's Review">
        {renderFormFields(DIRECTOR_REVIEW_FIELDS)}
      </Accordion>

      <SubmitButton onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save All Reviews'}
      </SubmitButton>
    </PageContainer>
  );
};

export default DirectorReviewFormPage;
