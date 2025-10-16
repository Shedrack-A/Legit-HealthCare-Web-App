import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  ReportContainer,
  A4Page,
  ReportHeader,
  ReportTitle,
  ReportSection,
  SectionTitle,
  DataGrid,
  DataItem,
  DataLabel,
  DataValue,
} from '../theme/ReportStyles';

const PageContainer = styled.div`
  padding: 2rem;
`;

const ActionButton = styled.button`
  position: fixed;
  bottom: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

const DownloadButton = styled(ActionButton)`
  right: 2rem;
  background-color: ${({ theme }) => theme.main};
`;

const EmailButton = styled(ActionButton)`
  right: 15rem;
  background-color: ${({ theme }) => theme.accent};
`;

const PatientReportPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!staffId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patient-summary/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(response.data);
      } catch (error) {
        console.error('Failed to fetch patient summary:', error);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [staffId]);

  if (loading) {
    return <PageContainer><p>Loading patient report...</p></PageContainer>;
  }

  if (!summary) {
    return <PageContainer><p>Could not load patient report.</p></PageContainer>;
  }

  const handleDownload = () => {
    const reportElement = document.getElementById('report-to-download');
    if (reportElement) {
      html2canvas(reportElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`patient-report-${summary.staff_id}.pdf`);
      });
    }
  };

  const handleEmail = async () => {
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/patient-report/email`, { staff_id: staffId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Report has been sent successfully!');
    } catch (error) {
      console.error('Failed to email report:', error);
      alert('There was an error sending the report. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <ReportContainer id="report-to-download">
        <A4Page>
          <ReportHeader>
          <ReportTitle>Annual Medical Screening Report</ReportTitle>
          <p>Legit HealthCare Services Ltd</p>
        </ReportHeader>

        <ReportSection>
          <SectionTitle>Bio-Data</SectionTitle>
          <DataGrid>
            <DataItem><DataLabel>First Name:</DataLabel><DataValue>{summary.first_name}</DataValue></DataItem>
            <DataItem><DataLabel>Last Name:</DataLabel><DataValue>{summary.last_name}</DataValue></DataItem>
            <DataItem><DataLabel>Staff ID:</DataLabel><DataValue>{summary.staff_id}</DataValue></DataItem>
            <DataItem><DataLabel>Age:</DataLabel><DataValue>{summary.age}</DataValue></DataItem>
            <DataItem><DataLabel>Department:</DataLabel><DataValue>{summary.department}</DataValue></DataItem>
            <DataItem><DataLabel>Gender:</DataLabel><DataValue>{summary.gender}</DataValue></DataItem>
          </DataGrid>
        </ReportSection>

        <ReportSection>
          <SectionTitle>Consultation Summary</SectionTitle>
          <DataGrid>
            <DataItem><DataLabel>Blood Pressure:</DataLabel><DataValue>{summary.bp}</DataValue></DataItem>
            <DataItem><DataLabel>Pulse:</DataLabel><DataValue>{summary.pulse}</DataValue></DataItem>
            <DataItem><DataLabel>Hypertension:</DataLabel><DataValue>{summary.hypertension}</DataValue></DataItem>
            <DataItem><DataLabel>Diabetes:</DataLabel><DataValue>{summary.diabetes_mellitus}</DataValue></DataItem>
          </DataGrid>
        </ReportSection>

        <ReportSection>
            <SectionTitle>Director's Comments</SectionTitle>
            <p>{summary.comment_one}</p>
        </ReportSection>

      </A4Page>
    </ReportContainer>
    <EmailButton onClick={handleEmail} disabled={isSending}>
      {isSending ? 'Sending...' : 'Email Report'}
    </EmailButton>
    <DownloadButton onClick={handleDownload}>Download as PDF</DownloadButton>
    </>
  );
};

export default PatientReportPage;
