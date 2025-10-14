import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const SelectorsContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const SelectorGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectorLabel = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const FormSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
  min-width: 200px;
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
  patient_id: number;
  staff_id: string;
  first_name: string;
  last_name: string;
}

const ViewRecordsPage: React.FC = () => {
  const [screeningYear, setScreeningYear] = useState(new Date().getFullYear());
  const [companySection, setCompanySection] = useState('DCP');
  const [records, setRecords] = useState<ScreenedPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const years = generateYears();

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

  const handleEdit = (patientId: number) => {
    navigate(`/edit-patient/${patientId}`);
  };

  return (
    <PageContainer>
      <PageTitle>View Screening Records</PageTitle>

      <SelectorsContainer>
        <SelectorGroup>
          <SelectorLabel htmlFor="screening_year">Screening Year</SelectorLabel>
          <FormSelect id="screening_year" value={screeningYear} onChange={(e) => setScreeningYear(parseInt(e.target.value))}>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </FormSelect>
        </SelectorGroup>
        <SelectorGroup>
          <SelectorLabel htmlFor="company_section">Company Section</SelectorLabel>
          <FormSelect id="company_section" value={companySection} onChange={(e) => setCompanySection(e.target.value)}>
            <option value="DCP">Dangote Cement - DCP</option>
            <option value="DCT">Dangote Transport - DCT</option>
          </FormSelect>
        </SelectorGroup>
      </SelectorsContainer>

      {loading ? <p>Loading records...</p> : (
        <RecordTable>
          <thead>
            <tr>
              <Th>Staff ID</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.record_id}>
                <Td>{record.staff_id}</Td>
                <Td>{record.first_name}</Td>
                <Td>{record.last_name}</Td>
                <Td>
                  <EditButton onClick={() => handleEdit(record.patient_id)}>Edit</EditButton>
                  <DeleteButton onClick={() => handleDelete(record.record_id)}>Delete</DeleteButton>
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
