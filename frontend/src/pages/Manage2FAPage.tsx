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

const Section = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.cardBorder};
`;

const Manage2FAPage: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [otp, setOtp] = useState('');

  // Check current 2FA status on load
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/2fa/status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsEnabled(response.data.enabled);
      } catch (error) {
        console.error('Failed to fetch 2FA status', error);
      }
    };
    checkStatus();
  }, []);

  const handleEnable = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/2fa/enable', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQrCode(response.data.qr_code_url);
    } catch (error) {
      alert('Failed to start 2FA setup.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/2fa/verify', { otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('2FA enabled successfully!');
      setIsEnabled(true);
      setQrCode('');
    } catch (error) {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleDisable = async () => {
    if (window.confirm('Are you sure you want to disable 2FA?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/2fa/disable', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('2FA disabled successfully.');
        setIsEnabled(false);
      } catch (error) {
        alert('Failed to disable 2FA.');
      }
    }
  };

  return (
    <PageContainer>
      <PageTitle>2FA Authentication</PageTitle>
      {isEnabled ? (
        <div>
          <p>Two-factor authentication is currently <strong>enabled</strong>.</p>
          <button onClick={handleDisable}>Disable 2FA</button>
        </div>
      ) : (
        <div>
          <p>Two-factor authentication is currently <strong>disabled</strong>.</p>
          <button onClick={handleEnable}>Enable 2FA</button>

          {qrCode && (
            <Section>
              <h3>Scan this QR Code</h3>
              <p>Scan the image below with your authenticator app, then enter the code to verify.</p>
              <img src={qrCode} alt="QR Code" />
              <form onSubmit={handleVerify}>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" required />
                <button type="submit">Verify & Enable</button>
              </form>
            </Section>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default Manage2FAPage;