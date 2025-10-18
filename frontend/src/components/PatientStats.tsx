import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

interface PatientStatsProps {
  screeningYear: number;
  companySection: string;
}

interface StatsData {
  total_registered: number;
  registered_today: number;
  male_count: number;
  female_count: number;
  over_40_count: number;
  under_40_count: number;
}

const PatientStats: React.FC<PatientStatsProps> = ({
  screeningYear,
  companySection,
}) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!screeningYear || !companySection) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/screening/stats', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            screening_year: screeningYear,
            company_section: companySection,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [screeningYear, companySection]);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  if (!stats) {
    return <p>Could not load stats.</p>;
  }

  return (
    <StatsContainer>
      <StatCard>
        <StatTitle>Total Patients</StatTitle>
        <StatValue>{stats.total_registered}</StatValue>
      </StatCard>
      <StatCard>
        <StatTitle>Registered Today</StatTitle>
        <StatValue>{stats.registered_today}</StatValue>
      </StatCard>
      <StatCard>
        <StatTitle>Males / Females</StatTitle>
        <StatValue>
          {stats.male_count} / {stats.female_count}
        </StatValue>
      </StatCard>
      <StatCard>
        <StatTitle>Age {'>='} 40</StatTitle>
        <StatValue>{stats.over_40_count}</StatValue>
      </StatCard>
      <StatCard>
        <StatTitle>Age {'<'} 40</StatTitle>
        <StatValue>{stats.under_40_count}</StatValue>
      </StatCard>
    </StatsContainer>
  );
};

export default PatientStats;
