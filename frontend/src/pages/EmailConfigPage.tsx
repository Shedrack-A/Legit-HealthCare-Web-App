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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
`;

const EmailConfigPage: React.FC = () => {
  const [config, setConfig] = useState({
    sender_email: '',
    app_password: ''
  });

  useEffect(() => {
    // Fetch current config to display
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/config/email', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConfig({ sender_email: response.data.sender_email, app_password: '' });
      } catch (error) {
        console.error('Failed to fetch email config', error);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/config/email', config, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Email configuration saved successfully!');
      setConfig(prev => ({ ...prev, app_password: '' })); // Clear password field
    } catch (error) {
      console.error('Failed to save email config:', error);
      alert('Failed to save email configuration.');
    }
  };

  return (
    <PageContainer>
      <PageTitle>Email Service Configuration</PageTitle>
      <p>Configure the Gmail account that will be used to send patient reports and other notifications.</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Sender Email Address (Gmail)</FormLabel>
          <FormInput type="email" name="sender_email" value={config.sender_email} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel>App Password</FormLabel>
          <FormInput type="password" name="app_password" value={config.app_password} onChange={handleChange} required placeholder="Enter new app password" />
        </FormGroup>
        <SubmitButton type="submit">Save Configuration</SubmitButton>
      </Form>
    </PageContainer>
  );
};

export default EmailConfigPage;