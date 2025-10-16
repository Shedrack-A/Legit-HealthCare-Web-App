import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const PageTitle = styled.h1`
  color: #e74c3c;
  margin-bottom: 2rem;
`;

const ActivationForm = styled.form`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const CodeInput = styled.input`
  padding: 0.75rem;
  width: 300px;
`;

const AccessDeniedPage: React.FC = () => {
  const [code, setCode] = useState('');
  const location = useLocation();
  // Attempt to get the required permission from the navigation state
  const permissionNeeded = location.state?.requiredPermission || 'unknown';

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/temp-codes/activate', { code }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      window.history.back();
    } catch (error: any) {
      console.error('Failed to activate code:', error);
      alert(error.response?.data?.message || 'Failed to activate code.');
    }
  };

  const handleRequestAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/request-access', { permission: permissionNeeded }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
    } catch (error: any) {
      console.error('Failed to request access:', error);
      alert(error.response?.data?.message || 'Failed to request access.');
    }
  };

  return (
    <PageContainer>
      <PageTitle>Access Denied</PageTitle>
      <p>You do not have the required permission (<b>{permissionNeeded}</b>) to view this page.</p>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '2rem' }}>
        <p>If you have been given a temporary access code, you can activate it here.</p>
        <ActivationForm onSubmit={handleActivate}>
          <CodeInput
            type="text"
            placeholder="Enter code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Activate</button>
        </ActivationForm>
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '2rem' }}>
        <p>Alternatively, you can request temporary access from an administrator.</p>
        <button onClick={handleRequestAccess}>Request Access</button>
      </div>
    </PageContainer>
  );
};

export default AccessDeniedPage;
