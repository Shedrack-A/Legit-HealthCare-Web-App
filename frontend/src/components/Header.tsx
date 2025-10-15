import React from 'react';
import styled from 'styled-components';
import { Sun, Moon } from 'react-feather';

const HeaderContainer = styled.header`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
  return (
    <HeaderContainer>
      <ThemeButton onClick={toggleTheme}>
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </ThemeButton>
    </HeaderContainer>
  );
};

export default Header;
