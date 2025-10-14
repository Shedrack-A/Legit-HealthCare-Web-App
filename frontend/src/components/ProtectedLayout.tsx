import React from 'react';
import styled from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';
import SideNav from './SideNav';

const AppLayout = styled.div`
  display: flex;
`;

const ContentContainer = styled.main`
  flex: 1;
  padding-left: 240px; // Same as nav width
`;

const ProtectedLayout: React.FC = () => {
  const location = useLocation();
  const showNav = location.pathname !== '/dashboard';

  return (
    <AppLayout>
      {showNav && <SideNav />}
      <ContentContainer style={{ paddingLeft: showNav ? '240px' : '0' }}>
        <Outlet />
      </ContentContainer>
    </AppLayout>
  );
};

export default ProtectedLayout;
