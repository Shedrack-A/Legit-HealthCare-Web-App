import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

interface HeaderProps {
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
  return (
    <HeaderContainer>
      <button onClick={toggleTheme}>Theme</button> {/* Placeholder for icon */}
    </HeaderContainer>
  );
};

export default Header;
