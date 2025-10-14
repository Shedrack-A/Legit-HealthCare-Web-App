import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const StatTitle = styled.h3`
  margin-top: 0;
  color: ${({ theme }) => theme.main};
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0;
`;

// Placeholder data
const stats = {
  total: 125,
  today: 8,
  males: 75,
  females: 50,
  over40: 60,
  under40: 65,
};

const PatientStats: React.FC = () => {
  return (
    <StatsContainer>
      <StatCard>
        <StatTitle>Total Patients</StatTitle>
        <StatValue>{stats.total}</StatValue>
      </StatCard>
      <StatCard>
        <StatTitle>Registered Today</StatTitle>
        <StatValue>{stats.today}</StatValue>
      </StatCard>
      <StatCard>
        <StatTitle>Males / Females</StatTitle>
        <StatValue>{stats.males} / {stats.females}</StatValue>
      </StatCard>
      <StatCard>
        <StatTitle>Age {'>='} 40</StatTitle>
        <StatValue>{stats.over40}</StatValue>
      </StatCard>
      <StatCard>
        <StatTitle>Age {'<'} 40</StatTitle>
        <StatValue>{stats.under40}</StatValue>
      </StatCard>
    </StatsContainer>
  );
};

export default PatientStats;
