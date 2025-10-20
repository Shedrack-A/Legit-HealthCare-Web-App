import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import SideNav from './SideNav';
import Header from './Header';

const AppLayout = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.background};
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 240px; // Same as SideNav width
  height: 100vh;
`;

const ContentContainer = styled.main`
  flex: 1;
  overflow-y: auto; // Allow content to scroll independently
`;

interface ProtectedLayoutProps {
  toggleTheme: () => void;
  theme: string;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  toggleTheme,
  theme,
}) => {
  return (
    <AppLayout>
      <SideNav />
      <MainWrapper>
        <Header toggleTheme={toggleTheme} theme={theme} />
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainWrapper>
    </AppLayout>
  );
};

export default ProtectedLayout;
