import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PageContainer = styled.div`
  padding: 2rem;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        // This endpoint doesn't exist yet, we'll need to create it.
        const response = await axios.get(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({ ...response.data, new_password: '' });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // This endpoint also needs to be created/updated.
      await axios.put(`/api/user/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User updated successfully!');
      navigate('/control-panel/user-management');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user.');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Loading user data...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h2>Edit User: {userData.username}</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>First Name</FormLabel>
          <FormInput
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Last Name</FormLabel>
          <FormInput
            type="text"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Username</FormLabel>
          <FormInput
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormInput
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>New Password (optional)</FormLabel>
          <FormInput
            type="password"
            name="new_password"
            value={userData.new_password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </FormGroup>
        <SubmitButton type="submit">Update User</SubmitButton>
      </Form>
    </PageContainer>
  );
};

export default EditUserPage;
