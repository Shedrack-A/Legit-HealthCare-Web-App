import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const FormContainer = styled.form`
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

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const PasswordChangeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      alert("New passwords do not match.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/profile/change-password', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Password changed successfully!');
      setFormData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      alert(error.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <PageContainer>
      <PageTitle>Change Password</PageTitle>
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Current Password</FormLabel>
          <FormInput type="password" name="current_password" value={formData.current_password} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel>New Password</FormLabel>
          <FormInput type="password" name="new_password" value={formData.new_password} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel>Confirm New Password</FormLabel>
          <FormInput type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
        </FormGroup>
        <SubmitButton type="submit">Change Password</SubmitButton>
      </FormContainer>
    </PageContainer>
  );
};

export default PasswordChangeForm;