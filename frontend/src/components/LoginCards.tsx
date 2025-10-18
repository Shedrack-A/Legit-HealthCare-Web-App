import React from 'react';
import styled from 'styled-components';
import { Briefcase, User } from 'react-feather';
import { PrimaryLinkButton, SecondaryLinkButton } from './common/Button';

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

const IconWrapper = styled.div`
  margin-bottom: 1rem;
`;

const LoginCards: React.FC = () => {
  return (
    <CardsContainer>
      <Card>
        <IconWrapper>
          <Briefcase size={40} />
        </IconWrapper>
        <CardTitle>Staff Portal</CardTitle>
        <p>Login or sign up to access the staff dashboard.</p>
        <ButtonWrapper>
          <PrimaryLinkButton to="/login">Login</PrimaryLinkButton>
          <SecondaryLinkButton to="/signup">Sign Up</SecondaryLinkButton>
        </ButtonWrapper>
      </Card>
      <Card>
        <IconWrapper>
          <User size={40} />
        </IconWrapper>
        <CardTitle>Patient Portal</CardTitle>
        <p>Claim your account to access your medical records.</p>
        <ButtonWrapper>
          <PrimaryLinkButton to="/claim-account">
            Claim Account
          </PrimaryLinkButton>
        </ButtonWrapper>
      </Card>
    </CardsContainer>
  );
};

export default LoginCards;
