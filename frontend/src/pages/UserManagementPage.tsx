import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'react-feather';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border-bottom: 2px solid ${({ theme }) => theme.cardBorder};
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding: 1rem;
`;

const RoleSelect = styled.select`
  padding: 0.5rem;
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [usersResponse, rolesResponse] = await Promise.all([
          axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/roles', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Failed to fetch user management data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId: number, roleId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/user/${userId}/assign-role`, { role_id: roleId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Role assigned successfully!');
      // Refresh user data
      const usersResponse = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Failed to assign role:', error);
      alert('Failed to assign role.');
    }
  };

  const handleEdit = (userId: number) => {
    navigate(`/control-panel/edit-user/${userId}`);
  };

  if (loading) {
      return <PageContainer><p>Loading...</p></PageContainer>;
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
          {users.map((user) => (
            <tr key={user.id}>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{user.roles.join(', ')}</Td>
              <Td>
                <RoleSelect onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}>
                  <option value="">Select a role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </RoleSelect>
              </Td>
              <Td>
                <ActionButton onClick={() => handleEdit(user.id)} title="Edit User">
                  <Edit size={18} />
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </UserTable>
    </PageContainer>
  );
};

export default UserManagementPage;
