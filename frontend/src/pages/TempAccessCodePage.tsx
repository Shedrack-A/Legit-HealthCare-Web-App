import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const FormContainer = styled.form`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const CodeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

// Re-using table styles
const Th = styled.th`
  border-bottom: 2px solid ${({ theme }) => theme.cardBorder};
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding: 1rem;
`;

interface TempCode {
  id: number;
  code: string;
  permission: string;
  expiration: string;
  use_type: string;
  times_used: number;
  is_active: boolean;
}

interface Permission {
  id: number;
  name: string;
}

const TempAccessCodePage: React.FC = () => {
  const [codes, setCodes] = useState<TempCode[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPermission, setSelectedPermission] = useState('');
  const [duration, setDuration] = useState(60);
  const [useType, setUseType] = useState('single-use');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [codesResponse, permissionsResponse] = await Promise.all([
        axios.get('/api/temp-codes', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/permissions', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCodes(codesResponse.data);
      setPermissions(permissionsResponse.data);
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
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/temp-codes', {
        permission_id: selectedPermission,
        duration_minutes: duration,
        use_type: useType,
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Code generated successfully!');
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to generate code:', error);
      alert('Failed to generate code.');
    }
  };

  const handleRevokeCode = async (codeId: number) => {
    if (window.confirm('Are you sure you want to revoke this code?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(`/api/temp-codes/${codeId}/revoke`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Code revoked successfully.');
        fetchData(); // Refresh list
      } catch (error) {
        console.error('Failed to revoke code:', error);
        alert('Failed to revoke code.');
      }
    }
  };

  if (loading) {
    return <PageContainer><p>Loading...</p></PageContainer>;
  }

  return (
    <PageContainer>
      <PageTitle>Temporary Access Codes</PageTitle>

      <FormContainer onSubmit={handleGenerateCode}>
        <div>
          <label>Permission</label>
          <select value={selectedPermission} onChange={(e) => setSelectedPermission(e.target.value)} required>
            <option value="">Select Permission</option>
            {permissions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label>Duration (minutes)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} required />
        </div>
        <div>
          <label>Use Type</label>
          <select value={useType} onChange={(e) => setUseType(e.target.value)}>
            <option value="single-use">Single Use</option>
            <option value="multi-use">Multi-Use</option>
          </select>
        </div>
        <button type="submit">Generate Code</button>
      </FormContainer>

      <CodeTable>
        <thead>
          <tr>
            <Th>Code</Th>
            <Th>Permission</Th>
            <Th>Expires</Th>
            <Th>Use Type</Th>
            <Th>Used</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {codes.map(code => (
            <tr key={code.id}>
              <Td>{code.code}</Td>
              <Td>{code.permission}</Td>
              <Td>{new Date(code.expiration).toLocaleString()}</Td>
              <Td>{code.use_type}</Td>
              <Td>{code.times_used}</Td>
              <Td>{code.is_active ? 'Active' : 'Inactive'}</Td>
              <Td>
                {code.is_active && <button onClick={() => handleRevokeCode(code.id)}>Revoke</button>}
              </Td>
            </tr>
          ))}
        </tbody>
      </CodeTable>
    </PageContainer>
  );
};

export default TempAccessCodePage;
