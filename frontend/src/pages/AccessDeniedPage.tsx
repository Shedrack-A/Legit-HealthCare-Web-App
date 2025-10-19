import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useApp } from '../contexts/AppContext';
import { Shield } from 'react-feather';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const AccessDeniedCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.error};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Section = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
`;

const ActivationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const AccessDeniedPage: React.FC = () => {
  const [code, setCode] = useState('');
  const location = useLocation();
  const { showFlashMessage, setIsLoading, isLoading } = useApp();
  const permissionNeeded = location.state?.requiredPermission || 'unknown';

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/temp-codes/activate',
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showFlashMessage(response.data.message, 'success');
      // Go back to the previous page on success
      window.history.back();
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to activate code.';
      showFlashMessage(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/request-access',
        { permission: permissionNeeded },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showFlashMessage(response.data.message, 'info');
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to request access.';
      showFlashMessage(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <AccessDeniedCard>
        <IconWrapper>
          <Shield size={48} />
        </IconWrapper>
        <PageTitle>Access Denied</PageTitle>
        <p>
          You do not have the required permission (<b>{permissionNeeded}</b>) to
          view this page.
        </p>

        <Section>
          <p>
            If you have been given a temporary access code, you can activate it
            here.
          </p>
          <ActivationForm onSubmit={handleActivate}>
            <Input
              type="text"
              placeholder="Enter code..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Activating...' : 'Activate Code'}
            </Button>
          </ActivationForm>
        </Section>

        <Section>
          <p>
            Alternatively, you can request temporary access from an
            administrator.
          </p>
          <Button
            onClick={handleRequestAccess}
            disabled={isLoading}
            style={{ marginTop: '1rem' }}
          >
            {isLoading ? 'Requesting...' : 'Request Access'}
          </Button>
        </Section>
      </AccessDeniedCard>
    </PageContainer>
  );
};

export default AccessDeniedPage;
