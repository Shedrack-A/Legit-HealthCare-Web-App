import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { User, Lock, Key } from 'react-feather';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SettingsDashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const SettingsCard = styled(Link)`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.cardHover};
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CardTitle = styled.h2`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.text};
`;

const CardDescription = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.4;
`;

const ManageAccountPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Manage Account</PageTitle>
      <SettingsDashboard>
        <SettingsCard to="/manage-account/profile">
          <CardIcon><User /></CardIcon>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Change your personal information.</CardDescription>
        </SettingsCard>
        <SettingsCard to="/manage-account/change-password">
          <CardIcon><Lock /></CardIcon>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </SettingsCard>
        <SettingsCard to="/manage-account/2fa">
          <CardIcon><Key /></CardIcon>
          <CardTitle>Manage 2FA</CardTitle>
          <CardDescription>Enable or disable two-factor authentication.</CardDescription>
        </SettingsCard>
      </SettingsDashboard>
    </PageContainer>
  );
};

export default ManageAccountPage;