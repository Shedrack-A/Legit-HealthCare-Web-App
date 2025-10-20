import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useGlobalFilter } from '../contexts/GlobalFilterContext';
import QueueCard from '../components/common/QueueCard';
import { Activity, Wind, Heart } from 'react-feather';

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

const QueueStatsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const TEST_TYPES = [
  { key: 'full-blood-count', name: 'Full Blood Count', icon: null },
  { key: 'kidney-function-test', name: 'Kidney Function Test', icon: null },
  { key: 'lipid-profile', name: 'Lipid Profile', icon: null },
  { key: 'liver-function-test', name: 'Liver Function Test', icon: null },
  { key: 'ecg', name: 'ECG', icon: <Heart size={24} /> },
  { key: 'spirometry', name: 'Spirometry', icon: <Wind size={24} /> },
  { key: 'audiometry', name: 'Audiometry', icon: <Activity size={24} /> },
];

const TestResultsLandingPage: React.FC = () => {
  const [queueStats, setQueueStats] = useState<any>(null);
  const { screeningYear, companySection } = useGlobalFilter();

  useEffect(() => {
    const fetchQueueStats = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/queue/stats', {
        headers: { Authorization: `Bearer ${token}` },
        params: { screeningYear, companySection },
      });
      setQueueStats(response.data);
    };
    fetchQueueStats();
  }, [screeningYear, companySection]);

  return (
    <PageContainer>
      <PageTitle>Test Results</PageTitle>
      {queueStats && (
        <QueueStatsContainer>
          <QueueCard
            title="Audiometry Queue"
            count={queueStats.audiometry}
            icon={<Activity size={24} />}
          />
          <QueueCard
            title="Spirometry Queue"
            count={queueStats.spirometry}
            icon={<Wind size={24} />}
          />
          <QueueCard
            title="ECG Queue"
            count={queueStats.ecg}
            icon={<Heart size={24} />}
          />
        </QueueStatsContainer>
      )}
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
