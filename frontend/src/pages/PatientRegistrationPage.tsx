import React from 'react';
import styled from 'styled-components';
import PatientStats from '../components/PatientStats';
import PatientRegistrationForm from '../components/PatientRegistrationForm';

const RegistrationContainer = styled.div`
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

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 5; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
};

const PatientRegistrationPage: React.FC = () => {
  const [screeningYear, setScreeningYear] = React.useState(new Date().getFullYear());
  const [companySection, setCompanySection] = React.useState('DCP');
  const years = generateYears();

  return (
    <RegistrationContainer>
      <PageTitle>Patient Registration</PageTitle>

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

      <PatientStats screeningYear={screeningYear} companySection={companySection} />
      <PatientRegistrationForm screeningYear={screeningYear} companySection={companySection} />
    </RegistrationContainer>
  );
};

export default PatientRegistrationPage;
