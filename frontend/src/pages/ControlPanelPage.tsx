import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUsersCog, FaUserShield, FaKey } from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const AdminDashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AdminCard = styled(Link)`
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

const ControlPanelPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Control Panel</PageTitle>
      <AdminDashboard>
        <AdminCard to="/control-panel/user-management">
          <CardIcon><FaUsersCog /></CardIcon>
          <CardTitle>User Management</CardTitle>
          <p>Assign roles and manage user accounts.</p>
        </AdminCard>
        <AdminCard to="/control-panel/role-management">
          <CardIcon><FaUserShield /></CardIcon>
          <CardTitle>Role & Permission Management</CardTitle>
          <p>Create, edit, and define roles and their permissions.</p>
        </AdminCard>
        <AdminCard to="/control-panel/temp-access-codes">
          <CardIcon><FaKey /></CardIcon>
          <CardTitle>Temporary Access Codes</CardTitle>
          <p>Generate and manage temporary, permission-granting codes.</p>
        </AdminCard>
      </AdminDashboard>
    </PageContainer>
  );
};

export default ControlPanelPage;
