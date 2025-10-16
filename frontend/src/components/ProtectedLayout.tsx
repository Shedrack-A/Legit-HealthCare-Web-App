import React from 'react';
import styled from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';
import SideNav from './SideNav';
import Header from './Header';

const AppLayout = styled.div`
  display: flex;
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 2rem;
`;

interface ProtectedLayoutProps {
  toggleTheme: () => void;
  theme: string;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ toggleTheme, theme }) => {
  const location = useLocation();
  const showNav = location.pathname !== '/dashboard';

  return (
    <AppLayout>
      {showNav && <SideNav />}
      <MainWrapper style={{ paddingLeft: showNav ? '240px' : '0' }}>
        <Header toggleTheme={toggleTheme} theme={theme} />
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainWrapper>
    </AppLayout>
  );
};

export default ProtectedLayout;
