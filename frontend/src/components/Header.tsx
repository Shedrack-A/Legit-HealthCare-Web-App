import React, { useState } from 'react';
import styled from 'styled-components';
import { Sun, Moon, ArrowLeft, Bell, User, LogOut } from 'react-feather';
import { useGlobalFilter, screeningYears } from '../contexts/GlobalFilterContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const HeaderContainer = styled.header`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
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
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const BackButton = styled(HeaderButton)`
  color: ${({ theme }) => theme.main};
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const ProfileDropdownContainer = styled.div`
  position: relative;
`;

const ProfileButton = styled(HeaderButton)`
  gap: 0.5rem;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
  padding: 0.5rem;
  width: 200px;
  z-index: 10;
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pageTitles: { [key: string]: string } = {
    '/manage-account/2fa': '2FA Authentication',
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
  };

  const getPageTitle = () => {
    const path = location.pathname;
    for (const key in pageTitles) {
      if (path.startsWith(key)) {
        return pageTitles[key];
      }
    }
    return '';
  };

  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

  return (
    <HeaderContainer>
      <HeaderLeft>
        {user && (
          <>
            {showBackButton && (
              <BackButton onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
              </BackButton>
            )}
            <PageTitle>{getPageTitle()}</PageTitle>
          </>
        )}
      </HeaderLeft>
      <HeaderRight>
        {user ? (
          <>
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
            <HeaderButton>
              <Bell size={20} />
            </HeaderButton>
            <ProfileDropdownContainer>
              <ProfileButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                <User size={20} />
                <span>{user.firstName}</span>
              </ProfileButton>
              {dropdownOpen && (
                <DropdownMenu>
                  <DropdownItem href="/manage-account">
                    <User size={16} />
                    <span>Manage Account</span>
                  </DropdownItem>
                  <DropdownItem as="button" onClick={logout}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </ProfileDropdownContainer>
          </>
        ) : null}
        <HeaderButton onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </HeaderButton>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;
