import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Briefcase, User } from 'react-feather';

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  padding: 2rem;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h2`
  color: ${({ theme }) => theme.main};
  margin-bottom: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the buttons */
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const CardButton = styled(Link)`
  display: block;
  width: 90%; /* Use a percentage to stay within the card */
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  text-align: center;
`;

const PrimaryButton = styled(CardButton)`
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: 1px solid ${({ theme }) => theme.main};

  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const SecondaryButton = styled(CardButton)`
  background-color: #A9A9A9;
  color: white;
  border: 1px solid #A9A9A9;

  &:hover {
    background-color: #8c8c8c;
  }
`;

const IconWrapper = styled.div`
  margin-bottom: 1rem;
`;

const LoginCards: React.FC = () => {
  return (
    <CardsContainer>
      <Card>
        <IconWrapper><Briefcase size={40} /></IconWrapper>
        <CardTitle>Staff Portal</CardTitle>
        <p>Login or sign up to access the staff dashboard.</p>
        <ButtonWrapper>
          <PrimaryButton to="/login">Login</PrimaryButton>
          <SecondaryButton to="/signup">Sign Up</SecondaryButton>
        </ButtonWrapper>
      </Card>
      <Card>
        <IconWrapper><User size={40} /></IconWrapper>
        <CardTitle>Patient Portal</CardTitle>
        <p>Claim your account to access your medical records.</p>
        <ButtonWrapper>
          <PrimaryButton to="/claim-account">Claim Account</PrimaryButton>
        </ButtonWrapper>
      </Card>
    </CardsContainer>
  );
};

export default LoginCards;
