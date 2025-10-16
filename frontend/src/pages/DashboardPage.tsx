import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Home, UserPlus, Clipboard, Droplet, UserCheck, FileText, Users, BookOpen, Settings, MessageSquare, User as UserIcon, Key, Shield, File, Mail } from 'react-feather';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const CardTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  margin-top: 0;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
`;

const ActionButton = styled(Link)`
  background-color: ${({ theme }) => theme.main};
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.mainHover};
  }
`;

const navLinks = [
  { to: '/register-patient', icon: <UserPlus />, label: 'Register Patient' },
  { to: '/consultation', icon: <Clipboard />, label: 'Consultation' },
  { to: '/test-results', icon: <Droplet />, label: 'Test Results' },
  { to: '/director-review/search', icon: <UserCheck />, label: "Director's Review" },
  { to: '/patient-report/search', icon: <FileText />, label: 'Patient Report' },
  { to: '/view-patients', icon: <Users />, label: 'View Patients' },
  { to:
'/view-records', icon: <BookOpen />, label: 'View Records' },
  { to: '/messaging', icon: <MessageSquare />, label: 'Messaging' },
];

const controlPanelLinks = [
    { to: '/control-panel/user-management', icon: <UserIcon />, label: 'User Management' },
    { to: '/control-panel/role-management', icon: <Key />, label: 'Role Management' },
    { to: '/control-panel/temp-access-codes', icon: <Shield />, label: 'Temp Access Codes' },
    { to: '/control-panel/audit-log', icon: <File />, label: 'Audit Log' },
    { to: '/control-panel/email-config', icon: <Mail />, label: 'Email Config' },
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