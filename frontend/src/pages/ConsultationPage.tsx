import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useGlobalFilter } from '../contexts/GlobalFilterContext';
import { Search } from 'react-feather';

const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.textSecondary};
`;

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  border: none;
  background-color: transparent;
  width: 100%;
  font-size: 1.2rem;

  &:focus {
    outline: none;
  }
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ResultItem = styled.li`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ResultLink = styled(Link)`
  display: block;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.cardHover};
  }
`;

const PatientInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PatientName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.main};
`;

interface PatientSearchResult {
  id: number;
  staff_id: string;
  first_name: string;
  last_name: string;
  department: string;
  age: number;
}

const ConsultationPage: React.FC = () => {
  const { companySection, screeningYear } = useGlobalFilter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PatientSearchResult[]>([]);

  useEffect(() => {
    const searchPatients = async () => {
      if (searchTerm.trim() === '') {
        setResults([]);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/screening/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            screening_year: screeningYear,
            company_section: companySection,
            searchTerm: searchTerm,
          },
        });
        setResults(response.data);
      } catch (error) {
        console.error('Failed to search for patients:', error);
        setResults([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchPatients();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, screeningYear, companySection]);

  return (
    <PageContainer>
      <PageTitle>Consultation</PageTitle>

      <SearchInputContainer>
        <SearchIcon size={20} />
        <SearchInput
          type="text"
          placeholder="Search by Staff ID to begin consultation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchInputContainer>

      <ResultsList>
        {results.map((patient) => (
          <ResultItem key={patient.id}>
            <ResultLink to={`/consultation/form/${patient.staff_id}`}>
              <PatientInfo>
                <div>
                  <PatientName>
                    {patient.first_name} {patient.last_name}
                  </PatientName>
                  <p>
                    Staff ID: {patient.staff_id} | Department:{' '}
                    {patient.department}
                  </p>
                </div>
                <div>
                  <p>Age: {patient.age}</p>
                </div>
              </PatientInfo>
            </ResultLink>
          </ResultItem>
        ))}
      </ResultsList>
    </PageContainer>
  );
};

export default ConsultationPage;
