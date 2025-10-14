import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
`;

const CodeInput = styled.input`
  padding: 0.75rem;
  width: 300px;
`;

const AccessDeniedPage: React.FC = () => {
  const [code, setCode] = useState('');

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/temp-codes/activate', { code }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      // On success, redirect the user back to the page they were trying to access.
      // A full implementation would use `react-router`'s state to know the previous page.
      window.history.back();
    } catch (error: any) {
      console.error('Failed to activate code:', error);
      alert(error.response?.data?.message || 'Failed to activate code.');
    }
  };

  return (
    <PageContainer>
      <PageTitle>Access Denied</PageTitle>
      <p>You do not have the required permissions to view this page.</p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Have a Temporary Access Code?</h3>
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
    </PageContainer>
  );
};

export default AccessDeniedPage;
