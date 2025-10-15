import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginCards from '../components/LoginCards';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const WelcomeText = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.main};
`;

const WelcomeTextLine = styled.span`
  display: block;
`;

interface HomePageProps {
  toggleTheme: () => void;
  theme: string;
}

const HomePage: React.FC<HomePageProps> = ({ toggleTheme, theme }) => {
  return (
    <HomePageContainer>
      <Header toggleTheme={toggleTheme} theme={theme} />
      <MainContent>
        <WelcomeText>
          <WelcomeTextLine>Welcome to</WelcomeTextLine>
          <WelcomeTextLine>Legit HealthCare Service Ltd</WelcomeTextLine>
        </WelcomeText>
        <LoginCards />
      </MainContent>
      <Footer />
    </HomePageContainer>
  );
};

export default HomePage;
