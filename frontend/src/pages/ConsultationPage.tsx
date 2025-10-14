import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  margin-bottom: 2rem;
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

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 5; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
};

interface PatientSearchResult {
  id: number;
  staff_id: string;
  first_name: string;
  last_name: string;
  department: string;
  age: number;
}

const ConsultationPage: React.FC = () => {
  const [screeningYear, setScreeningYear] = useState(new Date().getFullYear());
  const [companySection, setCompanySection] = useState('DCP');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PatientSearchResult[]>([]);
  const years = generateYears();

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

      <SelectorsContainer>
        <SelectorGroup>
          <SelectorLabel htmlFor="screening_year">Screening Year</SelectorLabel>
          <FormSelect
            id="screening_year"
            value={screeningYear}
            onChange={(e) => setScreeningYear(parseInt(e.target.value))}
          >
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </FormSelect>
        </SelectorGroup>
        <SelectorGroup>
          <SelectorLabel htmlFor="company_section">Company Section</SelectorLabel>
          <FormSelect
            id="company_section"
            value={companySection}
            onChange={(e) => setCompanySection(e.target.value)}
          >
            <option value="DCP">Dangote Cement - DCP</option>
            <option value="DCT">Dangote Transport - DCT</option>
          </FormSelect>
        </SelectorGroup>
      </SelectorsContainer>

      <SearchInput
        type="text"
        placeholder="Search by Staff ID to begin consultation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ResultsList>
        {results.map((patient) => (
          <ResultItem key={patient.id}>
            <ResultLink to={`/consultation/form/${patient.id}`}>
              <PatientInfo>
                <div>
                  <PatientName>{patient.first_name} {patient.last_name}</PatientName>
                  <p>Staff ID: {patient.staff_id} | Department: {patient.department}</p>
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
