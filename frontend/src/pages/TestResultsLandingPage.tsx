import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LandingContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const TestMenu = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const TestLinkCard = styled(Link)`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const testTypes = [
  { name: 'Full Blood Count', path: '/test-results/full-blood-count' },
  { name: 'Kidney Function Test', path: '/test-results/kidney-function-test' },
  { name: 'Lipid Profile', path: '/test-results/lipid-profile' },
  { name: 'Liver Function Test', path: '/test-results/liver-function-test' },
  { name: 'ECG', path: '/test-results/ecg' },
  { name: 'Spirometry', path: '/test-results/spirometry' },
  { name: 'Audiometry', path: '/test-results/audiometry' },
];

const TestResultsLandingPage: React.FC = () => {
  return (
    <LandingContainer>
      <PageTitle>Select Test Result to Enter</PageTitle>
      <TestMenu>
        {testTypes.map(test => (
          <TestLinkCard key={test.path} to={test.path}>
            <h3>{test.name}</h3>
          </TestLinkCard>
        ))}
      </TestMenu>
    </LandingContainer>
  );
};

export default TestResultsLandingPage;
