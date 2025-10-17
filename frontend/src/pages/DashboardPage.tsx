import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Home, UserPlus, Clipboard, Droplet, UserCheck, FileText, Users, BookOpen, Settings, MessageSquare, User as UserIcon, Key, Shield, File, Mail, Image, Upload } from 'react-feather';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h2`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const CardDescription = styled.p`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled(Link)`
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.main};
  border: 1px solid ${({ theme }) => theme.main};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.main};
    color: white;
    transform: translateY(-2px);
  }
`;

const navLinks = [
  { to: '/register-patient', icon: <UserPlus />, label: 'Register Patient' },
  { to: '/consultation', icon: <Clipboard />, label: 'Consultation' },
  { to: '/test-results', icon: <Droplet />, label: 'Test Results' },
  { to: '/director-review/search', icon: <UserCheck />, label: "Director's Review" },
  { to: '/patient-report/search', icon: <FileText />, label: 'Patient Report' },
  { to: '/view-patients', icon: <Users />, label: 'View Patients' },
  { to: '/view-records', icon: <BookOpen />, label: 'View Records' },
  { to: '/messaging', icon: <MessageSquare />, label: 'Messaging' },
];

const controlPanelLinks = [
    { to: '/control-panel/user-management', icon: <UserIcon />, label: 'User Management' },
    { to: '/control-panel/role-management', icon: <Key />, label: 'Role Management' },
    { to: '/control-panel/temp-access-codes', icon: <Shield />, label: 'Temp Access Codes' },
    { to: '/control-panel/audit-log', icon: <File />, label: 'Audit Log' },
    { to: '/control-panel/email-config', icon: <Mail />, label: 'Email Config' },
    { to: '/control-panel/branding', icon: <Image />, label: 'Branding' },
    { to: '/control-panel/patient-upload', icon: <Upload />, label: 'Patient Upload' },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('admin');

  return (
    <DashboardContainer>
      <Card>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Select an action or option below to get started.</CardDescription>
        <QuickActionsGrid>
          {navLinks.map(link => (
            <ActionButton key={link.to} to={link.to}>
              {link.icon}
              <span>{link.label}</span>
            </ActionButton>
          ))}
        </QuickActionsGrid>
      </Card>

      {isAdmin && (
        <Card>
          <CardTitle>Control Panel</CardTitle>
          <CardDescription>Manage system settings and user access.</CardDescription>
          <QuickActionsGrid>
            {controlPanelLinks.map(link => (
              <ActionButton key={link.to} to={link.to}>
                {link.icon}
                <span>{link.label}</span>
              </ActionButton>
            ))}
          </QuickActionsGrid>
        </Card>
      )}
    </DashboardContainer>
  );
};

export default DashboardPage;