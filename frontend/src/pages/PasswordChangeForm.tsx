import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Key } from 'react-feather';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 500px;
  margin: auto;
  padding: ${({ theme }) => theme.cardPadding};
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.small};

  &.required::after {
    content: ' *';
    color: red;
  }
`;

const SubmitButton = styled(Button)`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PasswordChangeForm: React.FC = () => {
  const { showFlashMessage, setIsLoading } = useApp();
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      showFlashMessage('New passwords do not match.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/profile/change-password', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showFlashMessage('Password changed successfully!', 'success');
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      showFlashMessage(
        error.response?.data?.message || 'Failed to change password.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <FormLabel className="required">Current Password</FormLabel>
        <Input
          type="password"
          name="current_password"
          value={formData.current_password}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">New Password</FormLabel>
        <Input
          type="password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Confirm New Password</FormLabel>
        <Input
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <SubmitButton type="submit">
        <Key size={16} />
        Change Password
      </SubmitButton>
    </FormContainer>
  );
};

export default PasswordChangeForm;
