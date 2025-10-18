import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Download } from 'react-feather';
import { useApp } from '../contexts/AppContext';
import { useGlobalFilter } from '../contexts/GlobalFilterContext';
import { Button } from '../components/common/Button';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DownloadSection = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

      <DownloadSection>
        <SectionTitle>Comprehensive Patient Data</SectionTitle>
        <Button
          onClick={() =>
            handleDownload(
              '/api/patients/download',
              'all_patients_biodata.xlsx'
            )
          }
        >
          <Download size={16} /> Download Bio-Data
        </Button>
      </DownloadSection>

      <DownloadSection>
        <SectionTitle>
          Screening Data for {screeningYear} ({companySection})
        </SectionTitle>
        <Button
          onClick={() =>
            handleDownload(
              '/api/screening/biodata/download',
              `screening_biodata_${screeningYear}_${companySection}.xlsx`,
              { screening_year: screeningYear, company_section: companySection }
            )
          }
          style={{ marginRight: '1rem' }}
        >
          <Download size={16} /> Download Screening Bio-Data
        </Button>
        <Button
          onClick={() =>
            handleDownload(
              '/api/screening/download',
              `screening_data_${screeningYear}_${companySection}.xlsx`,
              { screening_year: screeningYear, company_section: companySection }
            )
          }
        >
          <Download size={16} /> Download Full Screening Data
        </Button>
      </DownloadSection>
    </PageContainer>
  );
};

export default DownloadsPage;
