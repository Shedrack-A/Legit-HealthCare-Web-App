import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2 } from 'react-feather';
import { useGlobalFilter } from '../contexts/GlobalFilterContext';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/common/Button';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RecordTable = styled.table`
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

interface ScreenedPatient {
  record_id: number;
  patient_id: string;
  staff_id: string;
  first_name: string;
  last_name: string;
  department: string;
  gender: string;
  contact_phone: string;
}

const ViewRecordsPage: React.FC = () => {
  const { companySection, screeningYear } = useGlobalFilter();
  const [records, setRecords] = useState<ScreenedPatient[]>([]);
  const { showFlashMessage, setIsLoading, isLoading } = useApp();
  const navigate = useNavigate();

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/screening/records', {
        headers: { Authorization: `Bearer ${token}` },
        params: { screening_year: screeningYear, company_section: companySection },
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      showFlashMessage('Failed to fetch records.', 'error');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [screeningYear, companySection]);

  const handleDelete = async (recordId: number) => {
    if (window.confirm('Are you sure you want to remove this patient from this screening year?')) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/screening/record/${recordId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showFlashMessage('Record deleted successfully.', 'success');
        fetchRecords(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete record:', error);
        showFlashMessage('Failed to delete record.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (staffId: string) => {
    navigate(`/edit-patient/${staffId}`);
  };

  if (isLoading && records.length === 0) {
    return <PageContainer><p>Loading records...</p></PageContainer>;
  }

  return (
    <PageContainer>
      <PageTitle>View Screening Records</PageTitle>

      <RecordTable>
        <thead>
          <tr>
            <Th>Patient ID</Th>
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
            {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.record_id}>
                    <Td>{record.patient_id}</Td>
                    <Td>{record.staff_id}</Td>
                    <Td>{record.first_name}</Td>
                    <Td>{record.last_name}</Td>
                    <Td>{record.department}</Td>
                    <Td>{record.gender}</Td>
                    <Td>{record.contact_phone}</Td>
                    <Td>
                      <ActionContainer>
                        <Button onClick={() => handleEdit(record.staff_id)}><Edit size={16} /></Button>
                        <Button onClick={() => handleDelete(record.record_id)} style={{backgroundColor: '#dc3545'}}><Trash2 size={16} /></Button>
                      </ActionContainer>
                    </Td>
                  </tr>
                ))
            ) : (
                <tr>
                    <Td colSpan={8} style={{ textAlign: 'center' }}>No records found for the selected year and company.</Td>
                </tr>
            )}
        </tbody>
      </RecordTable>
    </PageContainer>
  );
};

export default ViewRecordsPage;