import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Download } from 'react-feather';
import { useApp } from '../contexts/AppContext';
import { useGlobalFilter } from '../contexts/GlobalFilterContext';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DownloadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const DownloadCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.cardHover};
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CardTitle = styled.h2`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.text};
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.4;
  text-decoration: none;
`;

const DownloadsPage: React.FC = () => {
  const { showFlashMessage, setIsLoading } = useApp();
  const { companySection, screeningYear } = useGlobalFilter();

  const handleDownload = async (
    endpoint: string,
    filename: string,
    params: Record<string, any> = {}
  ) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showFlashMessage('Data downloaded successfully.', 'success');
    } catch (error) {
      console.error('Failed to download data:', error);
      showFlashMessage('Failed to download data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Downloads</PageTitle>
      <DownloadGrid>
        <DownloadCard
          onClick={() =>
            handleDownload(
              '/api/patients/download',
              'all_patients_biodata.xlsx'
            )
          }
        >
          <CardIcon>
            <Download />
          </CardIcon>
          <CardTitle>Patient Bio-Data</CardTitle>
          <CardDescription>
            Download bio-data for all patients in the comprehensive database.
          </CardDescription>
        </DownloadCard>

        <DownloadCard
          onClick={() =>
            handleDownload(
              '/api/screening/biodata/download',
              `screening_biodata_${screeningYear}_${companySection}.xlsx`,
              { screening_year: screeningYear, company_section: companySection }
            )
          }
        >
          <CardIcon>
            <Download />
          </CardIcon>
          <CardTitle>Screening Bio-Data</CardTitle>
          <CardDescription>
            Download bio-data for the {screeningYear} ({companySection})
            screening.
          </CardDescription>
        </DownloadCard>

        <DownloadCard
          onClick={() =>
            handleDownload(
              '/api/screening/download',
              `screening_data_${screeningYear}_${companySection}.xlsx`,
              { screening_year: screeningYear, company_section: companySection }
            )
          }
        >
          <CardIcon>
            <Download />
          </CardIcon>
          <CardTitle>Full Screening Data</CardTitle>
          <CardDescription>
            Download all data for the {screeningYear} ({companySection})
            screening.
          </CardDescription>
        </DownloadCard>
      </DownloadGrid>
    </PageContainer>
  );
};

export default DownloadsPage;
