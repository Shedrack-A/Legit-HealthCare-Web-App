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

const AppDescription = styled.p`
  text-align: center;
  max-width: 600px;
  margin-top: 1rem;
  font-size: 1.1rem;
  line-height: 1.6;
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
        <AppDescription>
          This application is a comprehensive platform for managing patient data, medical screenings, and reports.
          Staff can manage patient records and workflows, while the patient portal allows users to securely access their medical reports.
        </AppDescription>
        <LoginCards />
      </MainContent>
      <Footer />
    </HomePageContainer>
  );
};

export default HomePage;
