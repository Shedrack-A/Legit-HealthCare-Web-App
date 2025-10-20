import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormCard = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  font-weight: 600;
`;

const EditUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    new_password: '',
  });
  const { showFlashMessage, setIsLoading, isLoading } = useApp();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({ ...response.data, new_password: '' });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        showFlashMessage('Failed to load user data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userId, setIsLoading, showFlashMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/user/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showFlashMessage('User updated successfully!', 'success');
      navigate('/control-panel/user-management');
    } catch (error: any) {
      console.error('Failed to update user:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update user.';
      showFlashMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <p>Loading user data...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Edit User: {userData.username}</PageTitle>
      <FormCard onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>New Password (optional)</FormLabel>
          <Input
            type="password"
            name="new_password"
            value={userData.new_password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update User'}
        </Button>
      </FormCard>
    </PageContainer>
  );
};

export default EditUserPage;
