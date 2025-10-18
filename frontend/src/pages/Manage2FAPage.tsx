import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  margin: auto;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const Section = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
`;

const QRForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  max-width: 300px;
`;

const Manage2FAPage: React.FC = () => {
  const { showFlashMessage, setIsLoading } = useApp();
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(true);

  const checkStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/2fa/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEnabled(response.data.enabled);
    } catch (error) {
      console.error('Failed to fetch 2FA status', error);
      showFlashMessage('Failed to fetch 2FA status.', 'error');
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/2fa/enable',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQrCode(response.data.qr_code_url);
      showFlashMessage('Scan the QR code with your authenticator app.', 'info');
    } catch (error) {
      showFlashMessage('Failed to start 2FA setup.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/2fa/verify',
        { otp },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showFlashMessage('2FA enabled successfully!', 'success');
      setIsEnabled(true);
      setQrCode('');
    } catch (error) {
      showFlashMessage('Invalid OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    if (window.confirm('Are you sure you want to disable 2FA?')) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          '/api/2fa/disable',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showFlashMessage('2FA disabled successfully.', 'success');
        setIsEnabled(false);
      } catch (error) {
        showFlashMessage('Failed to disable 2FA.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (loadingStatus) {
    return (
      <PageContainer>
        <p>Loading 2FA status...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {isEnabled ? (
        <div>
          <h3>Two-Factor Authentication is ON</h3>
          <p>Your account is secured with two-factor authentication.</p>
          <Button
            onClick={handleDisable}
            style={{ backgroundColor: '#dc3545' }}
          >
            Disable 2FA
          </Button>
        </div>
      ) : (
        <div>
          <h3>Two-Factor Authentication is OFF</h3>
          <p>Add an extra layer of security to your account.</p>
          <Button onClick={handleEnable}>Enable 2FA</Button>

          {qrCode && (
            <Section>
              <h4>Scan this QR Code</h4>
              <p>
                Scan the image below with your authenticator app, then enter the
                code to verify.
              </p>
              <img src={qrCode} alt="QR Code" />
              <QRForm onSubmit={handleVerify}>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
                <Button type="submit">Verify & Enable</Button>
              </QRForm>
            </Section>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default Manage2FAPage;
