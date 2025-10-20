import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useGlobalFilter } from '../../contexts/GlobalFilterContext';
import QueueCard from '../../components/common/QueueCard';
import { Activity, Wind, Heart } from 'react-feather';

const SearchContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const PatientList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PatientListItem = styled.li`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }
`;

const QueueStatsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const TestResultSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [queueStats, setQueueStats] = useState<any>(null);
  const { screeningYear, companySection } = useGlobalFilter();
  const { testType } = useParams<{ testType: string }>();

  const testConfig: { [key: string]: { name: string, icon: React.ReactNode } } = {
    audiometry: { name: 'Audiometry', icon: <Activity size={24} /> },
    spirometry: { name: 'Spirometry', icon: <Wind size={24} /> },
    ecg: { name: 'ECG', icon: <Heart size={24} /> },
  };

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

  useEffect(() => {
    const searchPatients = async () => {
      if (searchTerm.length > 2) {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/screening/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: { screeningYear, companySection, searchTerm },
        });
        setPatients(response.data);
      } else {
        setPatients([]);
      }
    };
    const debounceTimer = setTimeout(() => {
      searchPatients();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, screeningYear, companySection]);

  return (
    <div>
      {queueStats && testType && testConfig[testType] && (
        <QueueStatsContainer>
          <QueueCard
            title={`Patients in ${testConfig[testType].name} Queue`}
            count={queueStats[testType]}
            icon={testConfig[testType].icon}
          />
        </QueueStatsContainer>
      )}
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search for patient by Staff ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      <PatientList>
        {patients.map((patient) => (
          <PatientListItem key={patient.staff_id}>
            <Link to={`/test-results/${testType}/form/${patient.staff_id}`}>
              {patient.first_name} {patient.last_name} ({patient.staff_id})
            </Link>
          </PatientListItem>
        ))}
      </PatientList>
    </div>
  );
};

export default TestResultSearchPage;
