import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2 } from 'react-feather';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/common/Button';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PatientTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const Th = styled.th`
  border-bottom: 2px solid ${({ theme }) => theme.cardBorder};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-size: ${({ theme }) => theme.fontSizes.small};
  text-transform: uppercase;
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ActionContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
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
  const { showFlashMessage, setIsLoading, isLoading } = useApp();
  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      showFlashMessage('Failed to fetch patients.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, showFlashMessage]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDelete = async (staffId: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this patient and all their records?'
      )
    ) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/patient/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showFlashMessage('Patient deleted successfully.', 'success');
        fetchPatients(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete patient:', error);
        showFlashMessage('Failed to delete patient.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (staffId: string) => {
    navigate(`/edit-patient/${staffId}`);
  };

  if (isLoading && patients.length === 0) {
    return (
      <PageContainer>
        <p>Loading patients...</p>
      </PageContainer>
    );
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
          {patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient.staff_id}>
                <Td>{patient.staff_id}</Td>
                <Td>{patient.first_name}</Td>
                <Td>{patient.last_name}</Td>
                <Td>{patient.department}</Td>
                <Td>{patient.gender}</Td>
                <Td>{patient.contact_phone}</Td>
                <Td>
                  <ActionContainer>
                    <Button onClick={() => handleEdit(patient.staff_id)}>
                      <Edit size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(patient.staff_id)}
                      style={{ backgroundColor: '#dc3545' }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </ActionContainer>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan={7} style={{ textAlign: 'center' }}>
                No patients found.
              </Td>
            </tr>
          )}
        </tbody>
      </PatientTable>
    </PageContainer>
  );
};

export default ViewPatientsPage;
