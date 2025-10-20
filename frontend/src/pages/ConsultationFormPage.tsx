import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CONSULTATION_FIELDS } from '../data/constants';
import GenericTestResultForm from '../components/GenericTestResultForm';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const PatientHeader = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

interface PatientData {
  id: number;
  staff_id: string;
  first_name: string;
  last_name: string;
  department: string;
  age: number;
}

const ConsultationFormPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!staffId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patient/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatient(response.data);
      } catch (error) {
        console.error('Could not fetch patient details', error);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [staffId]);

  if (loading) {
    return <p>Loading patient details...</p>;
  }

  if (!patient) {
    return <p>Could not load patient details.</p>;
  }

  return (
    <PageContainer>
      <PageTitle>Doctor's Consultation</PageTitle>

      <PatientHeader>
        <h2>
          {patient.first_name} {patient.last_name}
        </h2>
        <p>
          Staff ID: {patient.staff_id} | Department: {patient.department} | Age:{' '}
          {patient.age}
        </p>
      </PatientHeader>

      <GenericTestResultForm
        patientId={staffId || ''}
        formFields={CONSULTATION_FIELDS}
        apiEndpoint={`/api/consultations`}
        fetchEndpoint={`/api/consultations/${staffId}`}
        title="Consultation"
      />
    </PageContainer>
  );
};

export default ConsultationFormPage;
