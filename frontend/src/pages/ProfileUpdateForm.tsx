import React, { useState, useEffect } from 'react';
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


const ProfileUpdateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    current_password: ''
  });

  useEffect(() => {
    // Fetch current user data to pre-fill the form
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(prev => ({...prev, ...response.data}));
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <PageContainer>
      <PageTitle>Update Profile</PageTitle>
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>First Name</FormLabel>
          <FormInput type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel>Last Name</FormLabel>
          <FormInput type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel>Username</FormLabel>
          <FormInput type="text" name="username" value={formData.username} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormInput type="email" name="email" value={formData.email} onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel>Current Password (to confirm changes)</FormLabel>
          <FormInput type="password" name="current_password" value={formData.current_password} onChange={handleChange} required />
        </FormGroup>
        <SubmitButton type="submit">Save Changes</SubmitButton>
      </FormContainer>
    </PageContainer>
  );
};

export default ProfileUpdateForm;