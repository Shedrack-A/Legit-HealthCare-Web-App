import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  Users,
  UserPlus,
  TrendingUp,
  TrendingDown,
  UserCheck,
} from 'react-feather';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  padding: ${({ theme }) => theme.cardPadding};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.main};
`;

const StatInfo = styled.div``;

const StatTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
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
        <IconWrapper>
          <Users />
        </IconWrapper>
        <StatInfo>
          <StatTitle>Total Patients</StatTitle>
          <StatValue>{stats.total_registered}</StatValue>
        </StatInfo>
      </StatCard>
      <StatCard>
        <IconWrapper>
          <UserPlus />
        </IconWrapper>
        <StatInfo>
          <StatTitle>Registered Today</StatTitle>
          <StatValue>{stats.registered_today}</StatValue>
        </StatInfo>
      </StatCard>
      <StatCard>
        <IconWrapper>
          <UserCheck />
        </IconWrapper>
        <StatInfo>
          <StatTitle>Males / Females</StatTitle>
          <StatValue>
            {stats.male_count} / {stats.female_count}
          </StatValue>
        </StatInfo>
      </StatCard>
      <StatCard>
        <IconWrapper>
          <TrendingUp />
        </IconWrapper>
        <StatInfo>
          <StatTitle>Age {'>='} 40</StatTitle>
          <StatValue>{stats.over_40_count}</StatValue>
        </StatInfo>
      </StatCard>
      <StatCard>
        <IconWrapper>
          <TrendingDown />
        </IconWrapper>
        <StatInfo>
          <StatTitle>Age {'<'} 40</StatTitle>
          <StatValue>{stats.under_40_count}</StatValue>
        </StatInfo>
      </StatCard>
    </StatsContainer>
  );
};

export default PatientStats;
