import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, Clipboard, Droplet, UserCheck, FileText, Users, BookOpen, Settings, MessageSquare } from 'react-feather';

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
            <IconWrapper><Home /></IconWrapper>
            <span>Dashboard</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/register-patient">
            <IconWrapper><UserPlus /></IconWrapper>
            <span>Register Patient</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/consultation">
            <IconWrapper><Clipboard /></IconWrapper>
            <span>Consultation</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/test-results">
            <IconWrapper><Droplet /></IconWrapper>
            <span>Test Results</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/director-review/search">
            <IconWrapper><UserCheck /></IconWrapper>
            <span>Director's Review</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/patient-report/search">
            <IconWrapper><FileText /></IconWrapper>
            <span>Patient Report</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/view-patients">
            <IconWrapper><Users /></IconWrapper>
            <span>View Patients</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/view-records">
            <IconWrapper><BookOpen /></IconWrapper>
            <span>View Records</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/messaging">
            <IconWrapper><MessageSquare /></IconWrapper>
            <span>Messaging</span>
          </StyledNavLink>
        </NavItem>
        {/* Admin Section */}
        <NavItem style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
          <StyledNavLink to="/control-panel">
            <IconWrapper><Settings /></IconWrapper>
            <span>Control Panel</span>
          </StyledNavLink>
        </NavItem>
      </NavList>
    </NavContainer>
  );
};

export default SideNav;
