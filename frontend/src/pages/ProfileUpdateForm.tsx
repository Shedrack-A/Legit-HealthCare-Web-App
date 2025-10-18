import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Save } from 'react-feather';

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
    content: " *";
    color: red;
  }
`;

const SubmitButton = styled(Button)`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProfileUpdateForm: React.FC = () => {
  const { showFlashMessage, setIsLoading } = useApp();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    current_password: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(prev => ({...prev, ...response.data}));
      } catch (error) {
        console.error('Failed to fetch profile', error);
        showFlashMessage('Failed to load profile data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [setIsLoading, showFlashMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showFlashMessage('Profile updated successfully!', 'success');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      showFlashMessage(error.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel className="required">First Name</FormLabel>
          <Input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel className="required">Last Name</FormLabel>
          <Input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel className="required">Username</FormLabel>
          <Input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel className="required">Email</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel className="required">Current Password (to confirm changes)</FormLabel>
          <Input type="password" name="current_password" value={formData.current_password} onChange={handleChange} required />
        </FormGroup>
        <SubmitButton type="submit">
            <Save size={16} />
            Save Changes
        </SubmitButton>
      </FormContainer>
  );
};

export default ProfileUpdateForm;