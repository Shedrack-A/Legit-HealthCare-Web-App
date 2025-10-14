import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
`;

const SignUpForm = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const FormTitle = styled.h2`
  color: ${({ theme }) => theme.main};
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
  box-sizing: border-box;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    other_name: '',
    username: '',
    phone_number: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords don't match");
      return;
    }
    try {
      const response = await axios.post('/api/register', formData);
      console.log(response.data);
      // Handle successful registration (e.g., redirect to login)
    } catch (error) {
      console.error(error);
      // Handle registration error
    }
  };

  return (
    <SignUpContainer>
      <SignUpForm onSubmit={handleSubmit}>
        <FormTitle>Create Account</FormTitle>
        <FormGroup>
          <FormLabel htmlFor="first_name">First Name</FormLabel>
          <FormInput type="text" name="first_name" id="first_name" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="last_name">Last Name</FormLabel>
          <FormInput type="text" name="last_name" id="last_name" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="other_name">Other/Middle Name</FormLabel>
          <FormInput type="text" name="other_name" id="other_name" onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="username">Username</FormLabel>
          <FormInput type="text" name="username" id="username" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
          <FormInput type="tel" name="phone_number" id="phone_number" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="email">Email Address</FormLabel>
          <FormInput type="email" name="email" id="email" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="password">Password</FormLabel>
          <FormInput type="password" name="password" id="password" onChange={handleChange} required />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
          <FormInput type="password" name="confirm_password" id="confirm_password" onChange={handleChange} required />
        </FormGroup>
        <FormButton type="submit">Sign Up</FormButton>
      </SignUpForm>
    </SignUpContainer>
  );
};

export default SignUpPage;
