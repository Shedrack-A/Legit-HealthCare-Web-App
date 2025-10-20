import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EditRoleModal from '../components/EditRoleModal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Edit, Trash2 } from 'react-feather';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RoleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
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

const ActionContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CreateRoleForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

interface Role {
  id: number;
  name: string;
  permissions: number[];
}

interface Permission {
  id: number;
  name: string;
}

const RoleManagementPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRoleName, setNewRoleName] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [rolesResponse, permissionsResponse] = await Promise.all([
        axios.get('/api/roles', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('/api/permissions', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const rolesData = rolesResponse.data;
      const permsData = permissionsResponse.data;
      setPermissions(permsData);

      const rolesWithPermissions = await Promise.all(
        rolesData.map(async (role: Role) => {
          const roleDetailsResponse = await axios.get(`/api/roles/${role.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return roleDetailsResponse.data;
        })
      );

      setRoles(rolesWithPermissions);
    } catch (error) {
      console.error('Failed to fetch role management data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const permissionMap = new Map(permissions.map((p) => [p.id, p.name]));

  const handleSavePermissions = async (
    roleId: number,
    permissionIds: number[]
  ) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/roles/${roleId}`,
        { permission_ids: permissionIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Permissions updated successfully!');
      fetchAllData();
      setEditingRole(null);
    } catch (error) {
      console.error('Failed to update permissions:', error);
      alert('Failed to update permissions.');
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/roles',
        { name: newRoleName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Assuming the backend returns the new role with an empty permissions list
      const newRole = { ...response.data, permissions: [] };
      setRoles([...roles, newRole]);
      setNewRoleName('');
    } catch (error) {
      console.error('Failed to create role:', error);
      alert('Failed to create role.');
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/roles/${roleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(roles.filter((r) => r.id !== roleId));
      } catch (error: any) {
        console.error('Failed to delete role:', error);
        alert(error.response?.data?.message || 'Failed to delete role.');
      }
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Role & Permission Management</PageTitle>

      <Card>
        <CreateRoleForm onSubmit={handleCreateRole}>
          <Input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="New role name"
            style={{ flexGrow: 1 }}
          />
          <Button type="submit">Create Role</Button>
        </CreateRoleForm>
      </Card>

      <Card>
        <RoleTable>
          <thead>
            <tr>
              <Th>Role</Th>
              <Th>Permissions</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <Td>{role.name}</Td>
                <Td>
                  {role.permissions
                    .map((pId) => permissionMap.get(pId))
                    .join(', ') || 'N/A'}
                </Td>
                <Td>
                  <ActionContainer>
                    <Button onClick={() => setEditingRole(role)}>
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteRole(role.id)}
                      variant="danger"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </ActionContainer>
                </Td>
              </tr>
            ))}
          </tbody>
        </RoleTable>
      </Card>

      {editingRole && (
        <EditRoleModal
          role={editingRole}
          allPermissions={permissions}
          onClose={() => setEditingRole(null)}
          onSave={handleSavePermissions}
        />
      )}
    </PageContainer>
  );
};

export default RoleManagementPage;
