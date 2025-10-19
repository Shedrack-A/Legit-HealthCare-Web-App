import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DEPARTMENTS, CONTINENTS, COUNTRIES } from '../data/constants';
import axios from 'axios';
import { useApp } from '../contexts/AppContext';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { FormSelect } from './common/FormSelect';
import { Search } from 'react-feather';

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.cardBg};
  padding: ${({ theme }) => theme.cardPadding};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FormLabel = styled.label`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.small};

import { Search } from 'react-feather';

  &.required::after {
    content: ' *';
    color: red;
  }
`;

const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.main};
`;

const SearchContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  border: 1px solid ${({ theme }) => theme.main};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.cardBg};
`;

const SearchInput = styled(Input)`
  border: none;
  background-color: transparent;
  flex-grow: 1;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const SubmitButton = styled(Button)`
  grid-column: 1 / -1;
  justify-self: end;
  width: 200px;
`;

interface PatientRegistrationFormProps {
  screeningYear: number;
  companySection: string;
  onRegistrationSuccess: () => void;
}

const PatientRegistrationForm: React.FC<PatientRegistrationFormProps> = ({
  screeningYear,
  companySection,
  onRegistrationSuccess,
}) => {
  const { showFlashMessage, setIsLoading } = useApp();
  const [formData, setFormData] = useState({
    staff_id: '',
    patient_id_for_year: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    department: '',
    gender: '',
    date_of_birth: '',
    age: '',
    contact_phone: '',
    email_address: '',
    race: '',
    nationality: '',
  });

  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setFormData((prev) => ({ ...prev, age: calculatedAge.toString() }));
    }
  }, [formData.date_of_birth]);

  useEffect(() => {
    const search = async () => {
      if (searchId.trim() === '') return;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patients?staff_id=${searchId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { patient_id, ...patientData } = response.data;
        setFormData((prev) => ({ ...prev, ...patientData }));
      } catch (error) {
        console.error('Patient not found:', error);
      }
    };

    const debounceTimer = setTimeout(() => {
      search();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const submissionData = {
        ...formData,
        screening_year: screeningYear,
        company_section: companySection,
      };
      await axios.post('/api/screening/register', submissionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showFlashMessage('Patient registered successfully!', 'success');
      onRegistrationSuccess(); // Trigger refresh
      setFormData({
        staff_id: '',
        patient_id_for_year: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        department: '',
        gender: '',
        date_of_birth: '',
        age: '',
        contact_phone: '',
        email_address: '',
        race: '',
        nationality: '',
      });
      setSearchId('');
    } catch (error: any) {
      console.error('Failed to register patient:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to register patient.';
      showFlashMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <SearchContainer>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Search by Staff ID to pre-fill..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </SearchContainer>

      <FormGroup>
        <FormLabel className="required">Staff ID</FormLabel>
        <Input
          type="text"
          name="staff_id"
          value={formData.staff_id}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Patient ID</FormLabel>
        <Input
          type="text"
          name="patient_id_for_year"
          value={formData.patient_id_for_year}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">First Name</FormLabel>
        <Input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Middle Name</FormLabel>
        <Input
          type="text"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleChange}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Last Name</FormLabel>
        <Input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Department</FormLabel>
        <FormSelect
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        >
          <option value="">Select...</option>
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </FormSelect>
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Gender</FormLabel>
        <FormSelect
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select...</option>
          <option>Male</option>
          <option>Female</option>
        </FormSelect>
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Date of Birth</FormLabel>
        <Input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Age</FormLabel>
        <Input type="text" name="age" value={formData.age} readOnly />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Contact Phone</FormLabel>
        <Input
          type="tel"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Email Address</FormLabel>
        <Input
          type="email"
          name="email_address"
          value={formData.email_address}
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Race</FormLabel>
        <FormSelect
          name="race"
          value={formData.race}
          onChange={handleChange}
          required
        >
          <option value="">Select...</option>
          {CONTINENTS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </FormSelect>
      </FormGroup>
      <FormGroup>
        <FormLabel className="required">Nationality</FormLabel>
        <FormSelect
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        >
          <option value="">Select...</option>
          {COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </FormSelect>
      </FormGroup>

      <SubmitButton type="submit">Register Patient</SubmitButton>
    </FormContainer>
  );
};

export default PatientRegistrationForm;
