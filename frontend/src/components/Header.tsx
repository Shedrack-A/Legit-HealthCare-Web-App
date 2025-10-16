import React from 'react';
import styled from 'styled-components';
import { Sun, Moon } from 'react-feather';
import { useGlobalFilter, screeningYears } from '../contexts/GlobalFilterContext';

const HeaderContainer = styled.header`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;

const SelectorGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
`;

const ThemeButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};

  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

interface HeaderProps {
  toggleTheme: () => void;
  theme: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const { companySection, setCompanySection, screeningYear, setScreeningYear } = useGlobalFilter();

  return (
    <HeaderContainer>
      <SelectorGroup>
        <FormSelect
          value={companySection}
          onChange={(e) => setCompanySection(e.target.value)}
        >
          <option value="DCP">Dangote Cement - DCP</option>
          <option value="DCT">Dangote Transport - DCT</option>
        </FormSelect>
      </SelectorGroup>
      <SelectorGroup>
        <FormSelect
          value={screeningYear}
          onChange={(e) => setScreeningYear(parseInt(e.target.value))}
        >
          {screeningYears.map(year => <option key={year} value={year}>{year}</option>)}
        </FormSelect>
      </SelectorGroup>
      <ThemeButton onClick={toggleTheme}>
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </ThemeButton>
    </HeaderContainer>
  );
};

export default Header;
