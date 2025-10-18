import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../contexts/AppContext';
import axios from 'axios';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const ClaimAccountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

const ClaimAccountFormContainer = styled.form`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
`;

const FormTitle = styled.h2`
  color: ${({ theme }) => theme.main};
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;

  &.required::after {
    content: " *";
    color: red;
  }
`;

const ClaimAccountPage: React.FC = () => {
    const { showFlashMessage, setIsLoading } = useApp();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        staff_id: '',
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
            const response = await axios.post('/api/patients/claim-account', formData);
            showFlashMessage(response.data.message, 'success');
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to claim account.';
            showFlashMessage(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ClaimAccountContainer>
            <ClaimAccountFormContainer onSubmit={handleSubmit}>
                <FormTitle>Claim Your Patient Account</FormTitle>
                <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Enter your Staff/Patient ID and the email address you provided during registration to create your portal account.
                </p>
                <FormGroup>
                    <FormLabel htmlFor="staff_id" className="required">Staff/Patient ID</FormLabel>
                    <Input type="text" name="staff_id" id="staff_id" onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="email" className="required">Email Address</FormLabel>
                    <Input type="email" name="email" id="email" onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="password" className="required">Create Password</FormLabel>
                    <Input type="password" name="password" id="password" onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <FormLabel htmlFor="confirm_password" className="required">Confirm Password</FormLabel>
                    <Input type="password" name="confirm_password" id="confirm_password" onChange={handleChange} required />
                </FormGroup>
                <Button type="submit" style={{ width: '100%' }}>Claim Account</Button>
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </ClaimAccountFormContainer>
        </ClaimAccountContainer>
    );
};

export default ClaimAccountPage;