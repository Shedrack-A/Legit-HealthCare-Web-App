import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUserPlus, FaNotesMedical, FaVial, FaUserTie, FaFileMedicalAlt } from 'react-icons/fa';

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

const IconWrapper = styled.span`
  margin-right: 1rem;
`;

const SideNav: React.FC = () => {
  return (
    <NavContainer>
      <NavList>
        <NavItem>
          <StyledNavLink to="/dashboard">
            <IconWrapper><FaTachometerAlt /></IconWrapper>
            <span>Dashboard</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/register-patient">
            <IconWrapper><FaUserPlus /></IconWrapper>
            <span>Register Patient</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/consultation">
            <IconWrapper><FaNotesMedical /></IconWrapper>
            <span>Consultation</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/test-results">
            <IconWrapper><FaVial /></IconWrapper>
            <span>Test Results</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/director-review/search">
            <IconWrapper><FaUserTie /></IconWrapper>
            <span>Director's Review</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/patient-report/search">
            <IconWrapper><FaFileMedicalAlt /></IconWrapper>
            <span>Patient Report</span>
          </StyledNavLink>
        </NavItem>
      </NavList>
    </NavContainer>
  );
};

export default SideNav;
