import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  padding: ${({ theme }) => theme.cardPadding};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.inputPadding};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
`;

const CodeTable = styled.table`
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

const StatusBadge = styled.span<{ isActive: boolean }>`
  background-color: ${({ isActive, theme }) =>
    isActive ? '#28a745' : theme.disabled};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
`;

interface TempCode {
  id: number;
  code: string;
  permission: string;
  user: string;
  expiration: string;
  use_type: string;
  times_used: number;
  is_active: boolean;
}

interface Permission {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
}

const TempAccessCodePage: React.FC = () => {
  const { showFlashMessage, setIsLoading } = useApp();
  const [codes, setCodes] = useState<TempCode[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPermission, setSelectedPermission] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [duration, setDuration] = useState(60);
  const [useType, setUseType] = useState('single-use');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [codesResponse, permissionsResponse, usersResponse] =
        await Promise.all([
          axios.get('/api/temp-codes', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/permissions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
      setCodes(codesResponse.data);
      setPermissions(permissionsResponse.data);
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/temp-codes',
        {
          permission_id: selectedPermission,
          duration_minutes: duration,
          use_type: useType,
          user_id: selectedUser || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showFlashMessage('Code generated successfully!', 'success');
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to generate code:', error);
      showFlashMessage('Failed to generate code.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeCode = async (codeId: number) => {
    if (window.confirm('Are you sure you want to revoke this code?')) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `/api/temp-codes/${codeId}/revoke`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showFlashMessage('Code revoked successfully.', 'success');
        fetchData(); // Refresh list
      } catch (error) {
        console.error('Failed to revoke code:', error);
        showFlashMessage('Failed to revoke code.', 'error');
      } finally {
        setIsLoading(false);
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
      <PageTitle>Temporary Access Codes</PageTitle>

      <FormContainer onSubmit={handleGenerateCode}>
        <FormGroup>
          <Label>Permission</Label>
          <FormSelect
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(e.target.value)}
            required
          >
            <option value="">Select Permission</option>
            {permissions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <Label>Assign to User (Optional)</Label>
          <FormSelect
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Use Type</Label>
          <FormSelect
            value={useType}
            onChange={(e) => setUseType(e.target.value)}
          >
            <option value="single-use">Single Use</option>
            <option value="multi-use">Multi-Use</option>
          </FormSelect>
        </FormGroup>
        <Button type="submit">Generate Code</Button>
      </FormContainer>

      <CodeTable>
        <thead>
          <tr>
            <Th>Code</Th>
            <Th>Permission</Th>
            <Th>Assigned To</Th>
            <Th>Expires</Th>
            <Th>Use Type</Th>
            <Th>Used</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id}>
              <Td>{code.code}</Td>
              <Td>{code.permission}</Td>
              <Td>{code.user}</Td>
              <Td>{new Date(code.expiration).toLocaleString()}</Td>
              <Td>{code.use_type}</Td>
              <Td>{code.times_used}</Td>
              <Td>
                <StatusBadge isActive={code.is_active}>
                  {code.is_active ? 'Active' : 'Inactive'}
                </StatusBadge>
              </Td>
              <Td>
                {code.is_active && (
                  <Button
                    onClick={() => handleRevokeCode(code.id)}
                    style={{ backgroundColor: '#dc3545' }}
                  >
                    Revoke
                  </Button>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </CodeTable>
    </PageContainer>
  );
};

export default TempAccessCodePage;
