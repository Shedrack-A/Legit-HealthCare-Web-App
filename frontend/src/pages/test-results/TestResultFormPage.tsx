import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TEST_TYPE_CONFIG } from '../../data/constants';
import GenericTestResultForm from '../../components/GenericTestResultForm';

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
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
`;

interface PatientData {
  id: number;
  staff_id: string;
  first_name: string;
  last_name: string;
  department: string;
  age: number;
}

const TestResultFormPage: React.FC = () => {
  const { testType, patientId } = useParams<{ testType: string; patientId: string }>();
  const testConfig = testType ? TEST_TYPE_CONFIG[testType] : null;

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!patientId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatient(response.data);
      } catch (error) {
        console.error("Could not fetch patient details", error);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [patientId]);

  if (!testConfig) {
    return (
      <PageContainer>
        <PageTitle>Error</PageTitle>
        <p>Invalid test type specified.</p>
      </PageContainer>
    );
  }

  const getCalculations = () => {
    if (testType === 'kidney-function-test') {
      return [{
        target: 'hc03',
        dependencies: ['k', 'na', 'cl'],
        calculate: (data: any) => (parseFloat(data.k || 0) + parseFloat(data.na || 0)) - parseFloat(data.cl || 0) - 16,
      }];
    }
    if (testType === 'lipid-profile') {
      return [
        {
          target: 'hdl',
          dependencies: ['tcho'],
          calculate: (data: any) => parseFloat(data.tcho || 0) * 0.35,
        },
        {
          target: 'ldl',
          dependencies: ['tcho', 'tg', 'hdl'],
          calculate: (data: any) => parseFloat(data.tcho || 0) + (parseFloat(data.tg || 0) / 5) + parseFloat(data.hdl || 0),
        }
      ];
    }
    return [];
  };

  if (loading) {
    return <p>Loading patient details...</p>;
  }

  if (!patient) {
    return <p>Could not load patient details.</p>;
  }

  const apiEndpoint = `/api/test-results/${testType}/${patientId}`;

  return (
    <PageContainer>
      <PageTitle>{testConfig.name}</PageTitle>

      <PatientHeader>
        <h2>{patient.first_name} {patient.last_name}</h2>
        <p>Staff ID: {patient.staff_id} | Department: {patient.department} | Age: {patient.age}</p>
      </PatientHeader>

      <GenericTestResultForm
        patientId={patientId || ''}
        formFields={testConfig.fields}
        apiEndpoint={apiEndpoint}
        fetchEndpoint={apiEndpoint}
        title={testConfig.name}
        calculations={getCalculations()}
      />
    </PageContainer>
  );
};

export default TestResultFormPage;
