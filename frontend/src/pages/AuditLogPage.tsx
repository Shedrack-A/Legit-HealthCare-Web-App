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

const LogTable = styled.table`
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

interface AuditLog {
  id: number;
  username: string;
  action: string;
  timestamp: string;
  details: string;
}

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/audit-logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <PageContainer><p>Loading audit logs...</p></PageContainer>;
  }

  return (
    <PageContainer>
      <PageTitle>Audit Log</PageTitle>
      <LogTable>
        <thead>
          <tr>
            <Th>Timestamp</Th>
            <Th>User</Th>
            <Th>Action</Th>
            <Th>Details</Th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <Td>{new Date(log.timestamp).toLocaleString()}</Td>
              <Td>{log.username}</Td>
              <Td>{log.action}</Td>
              <Td>{log.details}</Td>
            </tr>
          ))}
        </tbody>
      </LogTable>
    </PageContainer>
  );
};

export default AuditLogPage;
