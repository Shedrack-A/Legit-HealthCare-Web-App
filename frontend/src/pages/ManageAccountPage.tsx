import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { User, Lock, Key } from 'react-feather';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const SettingsDashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SettingsCard = styled(Link)`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.main};
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  margin-top: 0;
  text-align: center;
  color: ${({ theme }) => theme.main};
`;

const ManageAccountPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Manage Account</PageTitle>
      <SettingsDashboard>
        <SettingsCard to="/manage-account/profile">
          <CardIcon><User /></CardIcon>
          <CardTitle>Update Profile</CardTitle>
          <p>Change your personal information.</p>
        </SettingsCard>
        <SettingsCard to="/manage-account/change-password">
          <CardIcon><Lock /></CardIcon>
          <CardTitle>Change Password</CardTitle>
          <p>Update your account password.</p>
        </SettingsCard>
        <SettingsCard to="/manage-account/2fa">
          <CardIcon><Key /></CardIcon>
          <CardTitle>Manage 2FA</CardTitle>
          <p>Enable or disable two-factor authentication.</p>
        </SettingsCard>
      </SettingsDashboard>
    </PageContainer>
  );
};

export default ManageAccountPage;