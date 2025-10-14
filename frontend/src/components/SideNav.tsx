import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const NavContainer = styled.nav`
  background-color: ${({ theme }) => theme.cardBg};
  border-right: 1px solid ${({ theme }) => theme.cardBorder};
  width: 240px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 2rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 1.1rem;

  &.active {
    background-color: ${({ theme }) => theme.main};
    color: white;
  }

  &:hover:not(.active) {
    background-color: ${({ theme }) => theme.background};
  }
`;

const SideNav: React.FC = () => {
  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <StyledNavLink to="/dashboard">
            Dashboard
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/register-patient">
            Register Patient
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/consultation">
            Consultation
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/test-results">
            Test Results
          </StyledNavLink>
        </NavItem>
      </NavList>
    </NavContainer>
  );
};

export default SideNav;
