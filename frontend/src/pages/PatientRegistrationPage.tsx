import React from 'react';
import styled from 'styled-components';
import PatientStats from '../components/PatientStats';
import PatientRegistrationForm from '../components/PatientRegistrationForm';

const RegistrationContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const PatientRegistrationPage: React.FC = () => {
  return (
    <RegistrationContainer>
      <PageTitle>Patient Registration</PageTitle>
      <PatientStats />
      <PatientRegistrationForm />
    </RegistrationContainer>
  );
};

export default PatientRegistrationPage;
