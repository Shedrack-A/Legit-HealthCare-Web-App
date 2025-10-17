import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AnnualMedicalReport from '../components/reports/AnnualMedicalReport';
import { AppContext } from '../contexts/AppContext';
import { GlobalFilterContext } from '../contexts/GlobalFilterContext';

const PageContainer = styled.div`
  padding: 2rem;
  background-color: #f0f2f5; // A neutral background for the page
`;

const Controls = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 1000;
`;

const ActionButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DownloadButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.main};
   &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
`;

const EmailButton = styled(ActionButton)`
  background-color: #34A853; // Google Green
   &:hover {
    background-color: #4285F4; // Google Blue
  }
`;

const MyReportPage: React.FC = () => {
  const { screeningYear, companySection } = useContext(GlobalFilterContext);
  const { showFlashMessage, setIsLoading } = useContext(AppContext);

  const [summary, setSummary] = useState<any>(null);
  const [branding, setBranding] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        const [summaryRes, brandingRes] = await Promise.all([
          axios.get(`/api/me/report-summary`, authHeaders),
          axios.get('/api/branding', authHeaders)
        ]);

        setSummary(summaryRes.data);
        setBranding(brandingRes.data);

      } catch (error) {
        console.error('Failed to fetch report data:', error);
        showFlashMessage('error', 'Could not load your report data.');
        setSummary(null);
        setBranding(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [setIsLoading, showFlashMessage]);

  const handleDownload = async () => {
    const page1 = document.getElementById('report-page-1');
    const page2 = document.getElementById('report-page-2');

    if (page1 && page2) {
        setIsLoading(true);
        try {
            const canvas1 = await html2canvas(page1, { scale: 2, useCORS: true });
            const canvas2 = await html2canvas(page2, { scale: 2, useCORS: true });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const addImageToPdf = (canvas: HTMLCanvasElement, pdfInstance: jsPDF) => {
                const imgData = canvas.toDataURL('image/png');
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                const imgWidth = pdfWidth;
                const imgHeight = imgWidth / ratio;

                if (imgHeight > pdfHeight) {
                    console.warn("Content is taller than page, scaling might occur.");
                }

                pdfInstance.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            };

            addImageToPdf(canvas1, pdf);
            pdf.addPage();
            addImageToPdf(canvas2, pdf);

            pdf.save(`my-medical-report.pdf`);

        } catch (err) {
            console.error("PDF generation failed:", err);
            showFlashMessage('error', 'PDF generation failed.');
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleEmail = async () => {
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      // The backend endpoint uses the token to identify the user and their staff_id
      await axios.post(`/api/patient-report/email`, { staff_id: summary.staff_id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showFlashMessage('success', 'Report has been sent successfully!');
    } catch (error) {
      console.error('Failed to email report:', error);
      showFlashMessage('error', 'There was an error sending the report.');
    } finally {
      setIsSending(false);
    }
  };

  if (!summary || !branding) {
    return null; // Loading is handled by global context
  }

  return (
    <PageContainer>
      <AnnualMedicalReport
        patientData={summary}
        branding={branding}
        screeningYear={screeningYear}
        companySection={companySection}
      />
      <Controls>
        <EmailButton onClick={handleEmail} disabled={isSending}>
          {isSending ? 'Sending...' : 'Email My Report'}
        </EmailButton>
        <DownloadButton onClick={handleDownload} disabled={isSending}>
          Download My Report
        </DownloadButton>
      </Controls>
    </PageContainer>
  );
};

export default MyReportPage;