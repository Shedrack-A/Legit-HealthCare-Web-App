import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'react-feather';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/common/Button';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const Th = styled.th`
  border-bottom: 2px solid ${({ theme }) => theme.cardBorder};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-transform: uppercase;
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding: ${({ theme }) => theme.spacing.md};
`;

const RoleSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${({ theme }) => theme.main};

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface Role {
  id: number;
  name: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const { showFlashMessage, setIsLoading, isLoading } = useApp();
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [usersResponse, rolesResponse] = await Promise.all([
        axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/roles', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
    } catch (error) {
      console.error('Failed to fetch user management data:', error);
      showFlashMessage('Failed to fetch user data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId: number, roleId: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/user/${userId}/assign-role`,
        { role_id: roleId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showFlashMessage('Role assigned successfully!', 'success');
      fetchData(); // Refresh user data
    } catch (error) {
      console.error('Failed to assign role:', error);
      showFlashMessage('Failed to assign role.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (userId: number) => {
    navigate(`/control-panel/edit-user/${userId}`);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>User Management</PageTitle>
      <UserTable>
        <thead>
          <tr>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Current Roles</Th>
            <Th>Assign New Role</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{user.roles.join(', ')}</Td>
                <Td>
                  <RoleSelect
                    onChange={(e) =>
                      handleRoleChange(user.id, parseInt(e.target.value))
                    }
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a role...
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </RoleSelect>
                </Td>
                <Td>
                  <ActionButton
                    onClick={() => handleEdit(user.id)}
                    title="Edit User"
                  >
                    <Edit size={18} />
                  </ActionButton>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan={5} style={{ textAlign: 'center' }}>
                No users found.
              </Td>
            </tr>
          )}
        </tbody>
      </UserTable>
    </PageContainer>
  );
};

export default UserManagementPage;
