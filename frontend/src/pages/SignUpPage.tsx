import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useApp } from '../contexts/AppContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

const SignUpFormContainer = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const FormTitle = styled.h2`
  color: ${({ theme }) => theme.main};
  text-align: center;
  margin-bottom: 1.5rem;
`;

const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.small};

  &.required::after {
    content: ' *';
    color: red;
  }
`;

const FullWidthFormGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

const LinksContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: ${({ theme }) => theme.fontSizes.small};

  p {
    margin-bottom: 0.5rem;
  }
`;

const SignUpPage: React.FC = () => {
  const { showFlashMessage, setIsLoading, isLoading } = useApp();
  const navigate = useNavigate();
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
      showFlashMessage("Passwords don't match", 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('/api/register', formData);
      showFlashMessage(response.data.message, 'success');
      navigate('/login');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to register.';
      showFlashMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpFormContainer onSubmit={handleSubmit}>
        <FormTitle>Create A Staff Account</FormTitle>
        <InputsGrid>
          <FormGroup>
            <FormLabel htmlFor="first_name" className="required">
              First Name
            </FormLabel>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="last_name" className="required">
              Last Name
            </FormLabel>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="other_name">Other/Middle Name</FormLabel>
            <Input
              type="text"
              name="other_name"
              id="other_name"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="username" className="required">
              Username
            </FormLabel>
            <Input
              type="text"
              name="username"
              id="username"
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="phone_number" className="required">
              Phone Number
            </FormLabel>
            <Input
              type="tel"
              name="phone_number"
              id="phone_number"
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="email" className="required">
              Email Address
            </FormLabel>
            <Input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FullWidthFormGroup>
            <FormLabel htmlFor="password" className="required">
              Password
            </FormLabel>
            <Input
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              required
            />
          </FullWidthFormGroup>
          <FullWidthFormGroup>
            <FormLabel htmlFor="confirm_password" className="required">
              Confirm Password
            </FormLabel>
            <Input
              type="password"
              name="confirm_password"
              id="confirm_password"
              onChange={handleChange}
              required
            />
          </FullWidthFormGroup>
        </InputsGrid>
        <Button
          type="submit"
          disabled={isLoading}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <LinksContainer>
          <p>
            Already have a staff account? <Link to="/login">Login here</Link>.
          </p>
          <p>
            Are you a patient?{' '}
            <Link to="/claim-account">Claim your account here</Link>.
          </p>
        </LinksContainer>
      </SignUpFormContainer>
    </SignUpContainer>
  );
};

export default SignUpPage;
