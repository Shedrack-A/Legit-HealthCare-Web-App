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

import { Search } from 'react-feather';

const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.textSecondary};
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.sm};
  max-width: 400px;
`;

const SearchInput = styled.input`
  border: none;
  background-color: transparent;
  width: 100%;
  &:focus {
    outline: none;
  }
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

const TestResultLayout: React.FC<TestResultFormProps> = ({
  children,
  title,
}) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchId = e.target.value;
    if (searchId.length > 2) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `/api/patients/search?staff_id=${searchId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
          <h3>
            {selectedPatient.first_name} {selectedPatient.last_name}
          </h3>
          <p>
            Staff ID: {selectedPatient.staff_id} | Department:{' '}
            {selectedPatient.department}
          </p>
        </PatientInfo>
        {children(selectedPatient)}
      </TestResultContainer>
    );
  }

  return (
    <TestResultContainer>
      <PageTitle>Find Patient for {title}</PageTitle>
      <SearchContainer>
        <SearchInputContainer>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search by Staff ID..."
            onChange={handleSearch}
          />
        </SearchInputContainer>
        {searchResults.length > 0 && (
          <SearchResults>
            {searchResults.map((patient) => (
              <SearchResultItem
                key={patient.staff_id}
                onClick={() => setSelectedPatient(patient)}
              >
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
