import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const TestResultContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const PatientInfo = styled.div`
  margin-bottom: 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  padding: 1rem;
  border-radius: 8px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const SearchResults = styled.ul`
  list-style: none;
  padding: 0;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const SearchResultItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

interface TestResultFormProps {
  children: (patient: any) => ReactNode;
  title: string;
}

const TestResultLayout: React.FC<TestResultFormProps> = ({ children, title }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchId = e.target.value;
    if (searchId.length > 2) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patients/search?staff_id=${searchId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchResults([response.data]);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  if (selectedPatient) {
    return (
      <TestResultContainer>
        <PageTitle>{title}</PageTitle>
        <PatientInfo>
          <h3>{selectedPatient.first_name} {selectedPatient.last_name}</h3>
          <p>Staff ID: {selectedPatient.staff_id} | Department: {selectedPatient.department}</p>
        </PatientInfo>
        {children(selectedPatient)}
      </TestResultContainer>
    );
  }

  return (
    <TestResultContainer>
      <PageTitle>Find Patient for {title}</PageTitle>
      <SearchContainer>
        <SearchInput type="text" placeholder="Search by Staff ID..." onChange={handleSearch} />
        {searchResults.length > 0 && (
          <SearchResults>
            {searchResults.map(patient => (
              <SearchResultItem key={patient.staff_id} onClick={() => setSelectedPatient(patient)}>
                {patient.first_name} {patient.last_name} ({patient.staff_id})
              </SearchResultItem>
            ))}
          </SearchResults>
        )}
      </SearchContainer>
    </TestResultContainer>
  );
};

export default TestResultLayout;
