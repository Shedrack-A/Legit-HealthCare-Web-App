import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Sun,
  Moon,
  ArrowLeft,
  Bell,
  User,
  LogOut,
  Settings,
  FileText,
} from 'react-feather';
import {
  useGlobalFilter,
  screeningYears,
} from '../contexts/GlobalFilterContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  height: 60px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
`;

const FormSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const HeaderButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  border-radius: ${({ theme }) => theme.borderRadius};
  height: 36px;
  min-width: 36px;

  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const BackButton = styled(HeaderButton)`
  color: ${({ theme }) => theme.main};
  border-color: transparent;
  &:hover {
    background-color: ${({ theme }) => theme.main}22;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  white-space: nowrap;
`;

const ProfileDropdownContainer = styled.div`
  position: relative;
`;

const ProfileButton = styled(HeaderButton)`
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.sm};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xs};
  width: 220px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: ${({ theme }) => theme.borderRadius};

  &:hover {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.main};
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.main};
  }
`;

interface HeaderProps {
  toggleTheme: () => void;
  theme: string;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const { companySection, setCompanySection, screeningYear, setScreeningYear } =
    useGlobalFilter();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/register-patient': 'Register Patient',
    '/consultation': 'Consultation',
    '/test-results': 'Test Results',
    '/director-review': "Director's Review",
    '/patient-report': 'Patient Report',
    '/view-patients': 'View Patients',
    '/view-records': 'View Records',
    '/messaging': 'Messaging',
    '/control-panel': 'Control Panel',
    '/manage-account': 'Manage Account',
    '/manage-account/profile': 'Update Profile',
    '/manage-account/change-password': 'Change Password',
    '/manage-account/2fa': 'Manage 2FA',
    '/control-panel/user-management': 'User Management',
    '/control-panel/role-management': 'Role Management',
    '/control-panel/temp-access-codes': 'Temporary Access Codes',
    '/control-panel/audit-log': 'Audit Log',
    '/control-panel/email-config': 'Email Configuration',
    '/control-panel/branding': 'Branding',
    '/control-panel/patient-upload': 'Patient Data Upload',
  };

  const getPageTitle = () => {
    const path = location.pathname;
    // Exact match first
    if (pageTitles[path]) {
      return pageTitles[path];
    }
    // Then check for dynamic paths
    if (path.startsWith('/edit-patient/')) return 'Edit Patient';
    if (path.startsWith('/consultation/form/')) return 'Consultation Form';
    if (path.startsWith('/test-results/')) return 'Test Result Form';
    if (path.startsWith('/director-review/form/'))
      return 'Director Review Form';
    if (path.startsWith('/patient-report/view/')) return 'View Patient Report';

    // Fallback for nested routes
    for (const key in pageTitles) {
      if (path.startsWith(key)) {
        return pageTitles[key];
      }
    }
    return '';
  };

  const showBackButton =
    location.pathname !== '/dashboard' && location.pathname !== '/';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <HeaderContainer>
      <HeaderLeft>
        {showBackButton && (
          <BackButton onClick={() => navigate(-1)} title="Go Back">
            <ArrowLeft size={20} />
          </BackButton>
        )}
        <PageTitle>{getPageTitle()}</PageTitle>
      </HeaderLeft>
      <HeaderRight>
        <FormSelect
          value={companySection}
          onChange={(e) => setCompanySection(e.target.value)}
        >
          <option value="DCP">DCP</option>
          <option value="DCT">DCT</option>
        </FormSelect>
        <FormSelect
          value={screeningYear}
          onChange={(e) => setScreeningYear(parseInt(e.target.value))}
        >
          {screeningYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </FormSelect>
        <HeaderButton onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </HeaderButton>
        <HeaderButton>
          <Bell size={18} />
        </HeaderButton>
        <ProfileDropdownContainer ref={dropdownRef}>
          <ProfileButton onClick={() => setDropdownOpen(!dropdownOpen)}>
            <User size={18} />
            <span>{user?.firstName}</span>
          </ProfileButton>
          {dropdownOpen && (
            <DropdownMenu>
              <DropdownItem to="/my-report">
                <FileText size={16} />
                <span>My Report</span>
              </DropdownItem>
              <DropdownItem to="/manage-account">
                <Settings size={16} />
                <span>Manage Account</span>
              </DropdownItem>
              <DropdownButton onClick={logout}>
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownButton>
            </DropdownMenu>
          )}
        </ProfileDropdownContainer>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
