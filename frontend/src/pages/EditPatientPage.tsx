import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DEPARTMENTS, CONTINENTS, COUNTRIES } from '../data/constants';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const FormContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
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

const EditPatientPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!staffId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patient-summary/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // The summary might have more fields than we need, but that's okay
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [staffId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/patient/${staffId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Patient updated successfully!');
      navigate('/view-patients');
    } catch (error) {
      console.error('Failed to update patient:', error);
      alert('Failed to update patient.');
    }
  };

  if (loading) {
    return <PageContainer><p>Loading patient data...</p></PageContainer>;
  }

  if (!formData) {
    return <PageContainer><p>Could not load patient data.</p></PageContainer>;
  }

  return (
    <PageContainer>
      <PageTitle>Edit Patient: {formData.first_name} {formData.last_name}</PageTitle>
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup><FormLabel>Staff ID</FormLabel><FormInput type="text" name="staff_id" value={formData.staff_id || ''} onChange={handleChange} required /></FormGroup>
        <FormGroup><FormLabel>First Name</FormLabel><FormInput type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} required /></FormGroup>
        <FormGroup><FormLabel>Middle Name</FormLabel><FormInput type="text" name="middle_name" value={formData.middle_name || ''} onChange={handleChange} /></FormGroup>
        <FormGroup><FormLabel>Last Name</FormLabel><FormInput type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} required /></FormGroup>
        <FormGroup><FormLabel>Department</FormLabel><FormSelect name="department" value={formData.department || ''} onChange={handleChange} required><option value="">Select...</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</FormSelect></FormGroup>
        <FormGroup><FormLabel>Gender</FormLabel><FormSelect name="gender" value={formData.gender || ''} onChange={handleChange} required><option value="">Select...</option><option>Male</option><option>Female</option></FormSelect></FormGroup>
        <FormGroup><FormLabel>Date of Birth</FormLabel><FormInput type="date" name="date_of_birth" value={formData.date_of_birth || ''} onChange={handleChange} required /></FormGroup>
        <FormGroup><FormLabel>Contact Phone</FormLabel><FormInput type="tel" name="contact_phone" value={formData.contact_phone || ''} onChange={handleChange} required /></FormGroup>
        <FormGroup><FormLabel>Email Address</FormLabel><FormInput type="email" name="email_address" value={formData.email_address || ''} onChange={handleChange} required /></FormGroup>
        <FormGroup><FormLabel>Race</FormLabel><FormSelect name="race" value={formData.race || ''} onChange={handleChange} required><option value="">Select...</option>{CONTINENTS.map(c => <option key={c}>{c}</option>)}</FormSelect></FormGroup>
        <FormGroup><FormLabel>Nationality</FormLabel><FormSelect name="nationality" value={formData.nationality || ''} onChange={handleChange} required><option value="">Select...</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</FormSelect></FormGroup>

        <SubmitButton type="submit">Update Patient</SubmitButton>
      </FormContainer>
    </PageContainer>
  );
};

export default EditPatientPage;
