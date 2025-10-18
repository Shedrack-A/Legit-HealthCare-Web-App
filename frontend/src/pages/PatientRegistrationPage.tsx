import React, { useState } from 'react';
import styled from 'styled-components';
import PatientStats from '../components/PatientStats';
import PatientRegistrationForm from '../components/PatientRegistrationForm';
import { useGlobalFilter } from '../contexts/GlobalFilterContext';

const RegistrationContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PatientRegistrationPage: React.FC = () => {
  const { screeningYear, companySection } = useGlobalFilter();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRegistrationSuccess = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <RegistrationContainer>
      <PageTitle>Patient Registration</PageTitle>
      <PatientStats
        key={refreshKey}
        screeningYear={screeningYear}
        companySection={companySection}
      />
      <PatientRegistrationForm
        screeningYear={screeningYear}
        companySection={companySection}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </RegistrationContainer>
  );
};

export default PatientRegistrationPage;