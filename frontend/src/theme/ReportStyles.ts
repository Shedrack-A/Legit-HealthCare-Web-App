import styled, { css } from 'styled-components';

export const ReportContainer = styled.div`
  padding: 2rem;
  background-color: #f0f2f5; // A neutral background for the page
`;

export const A4Page = styled.div`
  background: white;
  width: 210mm;
  height: 297mm;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
  padding: 2cm;
  box-sizing: border-box;

  // CSS for printing
  @media print {
    background: white;
    box-shadow: none;
    margin: 0;
    width: auto;
    height: auto;
  }
`;

export const ReportHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 4px solid ${({ theme }) => theme.main};
  padding-bottom: 1rem;
`;

export const ReportTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin: 0;
`;

export const ReportSection = styled.section`
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.main};
  border-bottom: 2px solid ${({ theme }) => theme.accent};
  padding-bottom: 0.5rem;
  margin-top: 0;
`;

export const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

export const DataItem = styled.div`
  font-size: 11pt;
`;

export const DataLabel = styled.strong`
  display: block;
  color: #555;
`;

export const DataValue = styled.span`
  display: block;
`;
