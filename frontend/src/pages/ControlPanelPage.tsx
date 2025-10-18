import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Key, Clipboard, Mail, Image, Upload } from 'react-feather';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AdminDashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const AdminCard = styled(Link)`
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
    text-decoration: none;
`;

const ControlPanelPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Control Panel</PageTitle>
      <AdminDashboard>
        <AdminCard to="/control-panel/user-management">
          <CardIcon><Users /></CardIcon>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Assign roles and manage user accounts.</CardDescription>
        </AdminCard>
        <AdminCard to="/control-panel/role-management">
          <CardIcon><UserCheck /></CardIcon>
          <CardTitle>Role & Permission Management</CardTitle>
          <CardDescription>Create, edit, and define roles and their permissions.</CardDescription>
        </AdminCard>
        <AdminCard to="/control-panel/temp-access-codes">
          <CardIcon><Key /></CardIcon>
          <CardTitle>Temporary Access Codes</CardTitle>
          <CardDescription>Generate and manage temporary, permission-granting codes.</CardDescription>
        </AdminCard>
        <AdminCard to="/control-panel/audit-log">
          <CardIcon><Clipboard /></CardIcon>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>View a log of all significant user actions.</CardDescription>
        </AdminCard>
        <AdminCard to="/control-panel/email-config">
          <CardIcon><Mail /></CardIcon>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>Configure the system's email settings.</CardDescription>
        </AdminCard>
        <AdminCard to="/control-panel/branding">
          <CardIcon><Image /></CardIcon>
          <CardTitle>Branding</CardTitle>
          <CardDescription>Manage clinic name and logos.</CardDescription>
        </AdminCard>
        <AdminCard to="/control-panel/patient-upload">
          <CardIcon><Upload /></CardIcon>
          <CardTitle>Patient Data Upload</CardTitle>
          <CardDescription>Upload patient bio-data from an Excel file.</CardDescription>
        </AdminCard>
      </AdminDashboard>
    </PageContainer>
  );
};

export default ControlPanelPage;