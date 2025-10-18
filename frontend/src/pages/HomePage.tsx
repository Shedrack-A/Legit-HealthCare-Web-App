import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
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

const HomeLogo = styled.img`
  max-width: 250px;
  max-height: 150px;
  margin-bottom: 2rem;
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

interface BrandingData {
  clinic_name: string;
  logo_home: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ toggleTheme, theme }) => {
  const [branding, setBranding] = useState<BrandingData | null>(null);

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

  return (
    <HomePageContainer>
      <Header toggleTheme={toggleTheme} theme={theme} />
      <MainContent>
        {branding?.logo_home && (
          <HomeLogo
            src={`/api/uploads/${branding.logo_home}`}
            alt="Clinic Home Logo"
          />
        )}
        <WelcomeText>
          <WelcomeTextLine>Welcome to</WelcomeTextLine>
          <WelcomeTextLine>
            {branding?.clinic_name || 'Legit HealthCare Service Ltd'}
          </WelcomeTextLine>
        </WelcomeText>
        <AppDescription>
          This application is a comprehensive platform for managing patient
          data, medical screenings, and reports. Staff can manage patient
          records and workflows, while the patient portal allows users to
          securely access their medical reports.
        </AppDescription>
        <LoginCards />
      </MainContent>
      <Footer />
    </HomePageContainer>
  );
};

export default HomePage;
