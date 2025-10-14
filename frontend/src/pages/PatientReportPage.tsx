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

const DownloadButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

const PatientReportPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!patientId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/patient-summary/${patientId}`, {
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
  }, [patientId]);

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
    <DownloadButton onClick={handleDownload}>Download as PDF</DownloadButton>
    </>
  );
};

export default PatientReportPage;
