import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { DEPARTMENTS, CONTINENTS, COUNTRIES } from '../data/constants';
import axios from 'axios';

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
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

const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
`;

const SearchContainer = styled.div`
  grid-column: 1 / -1;
`;

const SubmitButton = styled.button`
  grid-column: 4 / 5;
  justify-self: end;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const PatientRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    staff_id: '',
    patient_id: '',
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

  // Real-time age calculation
  useEffect(() => {
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setFormData(prev => ({ ...prev, age: calculatedAge.toString() }));
    }
  }, [formData.date_of_birth]);

  // Debounced real-time search
  useEffect(() => {
    const search = async () => {
      if (searchId.trim() === '') {
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patients/search?staff_id=${searchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patientData = { ...formData, ...response.data };
        setFormData(patientData);
      } catch (error) {
        console.error('Patient not found:', error);
      }
    };

    const debounceTimer = setTimeout(() => {
      search();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/patients', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Patient registered successfully!');
      // Optionally clear form
      setFormData({
        staff_id: '', patient_id: '', first_name: '', middle_name: '', last_name: '',
        department: '', gender: '', date_of_birth: '', age: '', contact_phone: '',
        email_address: '', race: '', nationality: '',
      });
      setSearchId('');
    } catch (error) {
      console.error('Failed to register patient:', error);
      alert('Failed to register patient.');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <SearchContainer>
        <FormInput
          type="text"
          placeholder="Search by Staff ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </SearchContainer>

      {/* Form fields... */}
      <FormGroup><FormLabel>Staff ID</FormLabel><FormInput type="text" name="staff_id" value={formData.staff_id} onChange={handleChange} /></FormGroup>
      <FormGroup><FormLabel>Patient ID</FormLabel><FormInput type="text" name="patient_id" value={formData.patient_id} readOnly /></FormGroup>
      <FormGroup><FormLabel>First Name</FormLabel><FormInput type="text" name="first_name" value={formData.first_name} onChange={handleChange} /></FormGroup>
      <FormGroup><FormLabel>Middle Name</FormLabel><FormInput type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} /></FormGroup>
      <FormGroup><FormLabel>Last Name</FormLabel><FormInput type="text" name="last_name" value={formData.last_name} onChange={handleChange} /></FormGroup>
      <FormGroup><FormLabel>Department</FormLabel><FormSelect name="department" value={formData.department} onChange={handleChange}><option>Select...</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</FormSelect></FormGroup>
      <FormGroup><FormLabel>Gender</FormLabel><FormSelect name="gender" value={formData.gender} onChange={handleChange}><option>Select...</option><option>Male</option><option>Female</option></FormSelect></FormGroup>
      <FormGroup><FormLabel>Date of Birth</FormLabel><FormInput type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} /></FormGroup>
      <FormGroup><FormLabel>Age</FormLabel><FormInput type="text" name="age" value={formData.age} readOnly /></FormGroup>
      <FormGroup><FormLabel>Contact Phone</FormLabel><FormInput type="tel" name="contact_phone" value={formData.contact_phone} onChange={handleChange} /></FormGroup>
      <FormGroup><FormLabel>Email Address</FormLabel><FormInput type="email" name="email_address" value={formData.email_address} onChange={handleChange} /></FormGroup>
      <FormGroup><FormLabel>Race</FormLabel><FormSelect name="race" value={formData.race} onChange={handleChange}><option>Select...</option>{CONTINENTS.map(c => <option key={c}>{c}</option>)}</FormSelect></FormGroup>
      <FormGroup><FormLabel>Nationality</FormLabel><FormSelect name="nationality" value={formData.nationality} onChange={handleChange}><option>Select...</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</FormSelect></FormGroup>

      <SubmitButton type="submit">Register Patient</SubmitButton>
    </FormContainer>
  );
};

export default PatientRegistrationForm;
