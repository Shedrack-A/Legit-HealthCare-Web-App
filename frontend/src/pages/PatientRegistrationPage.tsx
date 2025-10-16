import React from 'react';
import styled from 'styled-components';
import PatientStats from '../components/PatientStats';
import PatientRegistrationForm from '../components/PatientRegistrationForm';
import { useGlobalFilter } from '../contexts/GlobalFilterContext';

const RegistrationContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const PatientRegistrationPage: React.FC = () => {
  const { screeningYear, companySection } = useGlobalFilter();

  return (
    <RegistrationContainer>
      <PageTitle>Patient Registration</PageTitle>
      <PatientStats screeningYear={screeningYear} companySection={companySection} />
      <PatientRegistrationForm screeningYear={screeningYear} companySection={companySection} />
    </RegistrationContainer>
  );
};

export default PatientRegistrationPage;
