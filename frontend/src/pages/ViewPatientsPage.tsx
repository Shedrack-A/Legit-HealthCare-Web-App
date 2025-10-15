import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2 } from 'react-feather';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const PatientTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border-bottom: 2px solid ${({ theme }) => theme.cardBorder};
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const EditButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.main};
  color: white;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
  color: white;
`;

interface Patient {
  staff_id: string;
  first_name: string;
  last_name: string;
  department: string;
  gender: string;
  contact_phone: string;
}

const ViewPatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (staffId: string) => {
    if (window.confirm('Are you sure you want to delete this patient and all their records?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/patient/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Patient deleted successfully.');
        fetchPatients(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete patient:', error);
        alert('Failed to delete patient.');
      }
    }
  };

  const handleEdit = (staffId: string) => {
    navigate(`/edit-patient/${staffId}`);
  };

  if (loading) {
    return <PageContainer><p>Loading patients...</p></PageContainer>;
  }

  return (
    <PageContainer>
      <PageTitle>View All Patients</PageTitle>
      <PatientTable>
        <thead>
          <tr>
            <Th>Staff ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Department</Th>
            <Th>Gender</Th>
            <Th>Contact Phone</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.staff_id}>
              <Td>{patient.staff_id}</Td>
              <Td>{patient.first_name}</Td>
              <Td>{patient.last_name}</Td>
              <Td>{patient.department}</Td>
              <Td>{patient.gender}</Td>
              <Td>{patient.contact_phone}</Td>
              <Td>
                <EditButton onClick={() => handleEdit(patient.staff_id)}><Edit size={16} /><span>Edit</span></EditButton>
                <DeleteButton onClick={() => handleDelete(patient.staff_id)}><Trash2 size={16} /><span>Delete</span></DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </PatientTable>
    </PageContainer>
  );
};

export default ViewPatientsPage;
