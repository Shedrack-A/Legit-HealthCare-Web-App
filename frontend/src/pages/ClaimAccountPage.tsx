import React, { useState, useEffect } from 'react';
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
    content: ' *';
    color: red;
  }
`;

const ClaimAccountPage: React.FC = () => {
  const { showFlashMessage, setIsLoading, isLoading } = useApp();
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    password: '',
    confirm_password: '',
  });
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      if (staffId.length < 3) {
        setIsPrefilled(false);
        setPatientInfo({ first_name: '', last_name: '', email: '' });
        return;
      }
      try {
        const response = await axios.get(
          `/api/patients/claim-info?staff_id=${staffId}`
        );
        setPatientInfo(response.data);
        setIsPrefilled(true);
      } catch (error) {
        setIsPrefilled(false);
        setPatientInfo({ first_name: '', last_name: '', email: '' });
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchPatientInfo();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [staffId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirm_password) {
      showFlashMessage("Passwords don't match", 'error');
      return;
    }
    if (!isPrefilled) {
      showFlashMessage(
        'Please enter a valid Staff ID to find your details.',
        'error'
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/patients/claim-account', {
        staff_id: staffId,
        email: patientInfo.email,
        password: passwords.password,
      });
      showFlashMessage(response.data.message, 'success');
      navigate('/login');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to claim account.';
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
          Enter your Staff ID to find your registration details and create your
          portal account.
        </p>
        <FormGroup>
          <FormLabel htmlFor="staff_id" className="required">
            Staff/Patient ID
          </FormLabel>
          <Input
            type="text"
            name="staff_id"
            id="staff_id"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          />
        </FormGroup>

        {isPrefilled && (
          <>
            <FormGroup>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={`${patientInfo.first_name} ${patientInfo.last_name}`}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Email Address</FormLabel>
              <Input type="email" value={patientInfo.email} readOnly />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="password" className="required">
                Create Password
              </FormLabel>
              <Input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
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
            </FormGroup>
          </>
        )}

        <Button
          type="submit"
          style={{ width: '100%' }}
          disabled={isLoading || !isPrefilled}
        >
          {isLoading ? 'Claiming...' : 'Claim Account'}
        </Button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </ClaimAccountFormContainer>
    </ClaimAccountContainer>
  );
};

export default ClaimAccountPage;
