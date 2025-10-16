import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2 } from 'react-feather';
import { useGlobalFilter } from '../contexts/GlobalFilterContext';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const RecordTable = styled.table`
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

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 5; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
};

interface ScreenedPatient {
  record_id: number;
  patient_id: string; // This is the patient_id_for_year
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/screening/records', {
        headers: { Authorization: `Bearer ${token}` },
        params: { screening_year: screeningYear, company_section: companySection },
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [screeningYear, companySection]);

  const handleDelete = async (recordId: number) => {
    if (window.confirm('Are you sure you want to remove this patient from this screening year?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/screening/record/${recordId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Record deleted successfully.');
        fetchRecords(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete record:', error);
        alert('Failed to delete record.');
      }
    }
  };

  // Edit now navigates using the staff_id, as the patient_id is year-specific and not the comprehensive ID
  const handleEdit = (staffId: string) => {
    navigate(`/edit-patient/${staffId}`);
  };

  return (
    <PageContainer>
      <PageTitle>View Screening Records</PageTitle>

      {loading ? <p>Loading records...</p> : (
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
            {records.map((record) => (
              <tr key={record.record_id}>
                <Td>{record.patient_id}</Td>
                <Td>{record.staff_id}</Td>
                <Td>{record.first_name}</Td>
                <Td>{record.last_name}</Td>
                <Td>{record.department}</Td>
                <Td>{record.gender}</Td>
                <Td>{record.contact_phone}</Td>
                <Td>
                  <EditButton onClick={() => handleEdit(record.staff_id)}><Edit size={16} /><span>Edit</span></EditButton>
                  <DeleteButton onClick={() => handleDelete(record.record_id)}><Trash2 size={16} /><span>Delete</span></DeleteButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </RecordTable>
      )}
    </PageContainer>
  );
};

export default ViewRecordsPage;
