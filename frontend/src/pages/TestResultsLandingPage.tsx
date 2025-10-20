import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const TestList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TestCard = styled(Link)`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TestTitle = styled.h2`
  margin-top: 0;
  color: ${({ theme }) => theme.main};
`;

const TEST_TYPES = [
  { key: 'full-blood-count', name: 'Full Blood Count' },
  { key: 'kidney-function-test', name: 'Kidney Function Test' },
  { key: 'lipid-profile', name: 'Lipid Profile' },
  { key: 'liver-function-test', name: 'Liver Function Test' },
  { key: 'ecg', name: 'ECG' },
  { key: 'spirometry', name: 'Spirometry' },
  { key: 'audiometry', name: 'Audiometry' },
];

const TestResultsLandingPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Select a Test to Record Results</PageTitle>
      <TestList>
        {TEST_TYPES.map((test) => (
          <TestCard key={test.key} to={`/test-results/${test.key}/search`}>
            <TestTitle>{test.name}</TestTitle>
          </TestCard>
        ))}
      </TestList>
    </PageContainer>
  );
};

export default TestResultsLandingPage;
