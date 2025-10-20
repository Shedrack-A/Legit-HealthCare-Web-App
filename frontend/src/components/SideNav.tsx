import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  Home,
  UserPlus,
  Clipboard,
  Droplet,
  UserCheck,
  FileText,
  Users,
  BookOpen,
  Settings,
  MessageSquare,
} from 'react-feather';

const NavContainer = styled.nav`
  background-color: ${({ theme }) => theme.cardBg};
  border-right: 1px solid ${({ theme }) => theme.cardBorder};
  width: 240px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  padding: 0 1rem 1rem 1rem;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  margin-bottom: 1rem;
`;

const Logo = styled.img`
  width: 90%;
  height: auto;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 1rem;

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

interface BrandingData {
  clinic_name: string;
  logo_light: string | null;
  logo_dark: string | null;
}

const SideNav: React.FC = () => {
  const [branding, setBranding] = useState<BrandingData | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const { data } = await axios.get('/api/branding');
        setBranding(data);
      } catch (error) {
        console.error('Failed to fetch branding:', error);
      }
    };
    fetchBranding();
  }, []);

  const currentLogo =
    theme.mode === 'dark' ? branding?.logo_dark : branding?.logo_light;

  return (
    <NavContainer>
      <LogoContainer>
        {currentLogo ? (
          <Logo src={`/api/uploads/${currentLogo}`} alt="Clinic Logo" />
        ) : (
          <h3>{branding?.clinic_name || 'Clinic'}</h3>
        )}
      </LogoContainer>
      <NavList>
        <NavItem>
          <StyledNavLink to="/dashboard">
            <IconWrapper>
              <Home />
            </IconWrapper>
            <span>Dashboard</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/register-patient">
            <IconWrapper>
              <UserPlus />
            </IconWrapper>
            <span>Register Patient</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/consultation">
            <IconWrapper>
              <Clipboard />
            </IconWrapper>
            <span>Consultation</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/test-results">
            <IconWrapper>
              <Droplet />
            </IconWrapper>
            <span>Test Results</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/director-review/search">
            <IconWrapper>
              <UserCheck />
            </IconWrapper>
            <span>Director's Review</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/patient-report/search">
            <IconWrapper>
              <FileText />
            </IconWrapper>
            <span>Patient Report</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/view-patients">
            <IconWrapper>
              <Users />
            </IconWrapper>
            <span>View Patients</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/view-records">
            <IconWrapper>
              <BookOpen />
            </IconWrapper>
            <span>View Records</span>
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/messaging">
            <IconWrapper>
              <MessageSquare />
            </IconWrapper>
            <span>Messaging</span>
          </StyledNavLink>
        </NavItem>
        {/* Admin Section */}
        <NavItem
          style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          <StyledNavLink to="/control-panel">
            <IconWrapper>
              <Settings />
            </IconWrapper>
            <span>Control Panel</span>
          </StyledNavLink>
        </NavItem>
      </NavList>
    </NavContainer>
  );
};

export default SideNav;
