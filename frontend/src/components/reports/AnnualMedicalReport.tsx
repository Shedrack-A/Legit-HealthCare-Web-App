import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

// Helper function to format names
const formatName = (
  firstName: string,
  middleName: string | null,
  lastName: string
) => {
  if (middleName) {
    return `${firstName.toUpperCase()} ${middleName.charAt(0).toUpperCase()}. ${lastName.toUpperCase()}`;
  }
  return `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
};

// --- Styled Components ---

const ReportWrapper = styled.div`
  width: 210mm;
  margin: auto;
  font-family: Arial, sans-serif;
  color: #000;
`;

const Page = styled.div`
  width: 210mm;
  height: 297mm;
  padding: 15mm;
  background: white;
  box-sizing: border-box;
  page-break-after: always;
  position: relative;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: auto;
`;

const FooterImage = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
`;

const ReportTitle = styled.h2`
  text-align: center;
  color: #c00000;
  font-size: 12pt;
  font-weight: bold;
  margin: 10mm 0;
  border-bottom: 3px solid #000;
  padding-bottom: 5px;
`;

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 10pt;
  margin-bottom: 5mm;
`;

const PatientName = styled.p`
  grid-column: 1 / -1;
  font-weight: bold;
  font-size: 11pt;
  border-bottom: 1px solid #000;
  padding-bottom: 2px;
  margin-bottom: 2mm;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1mm;
`;

const InfoRow = styled.div`
  display: flex;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  width: 70px;
`;

const SectionTitle = styled.h3`
  background-color: #bfbfbf;
  color: #000;
  text-align: center;
  font-size: 10pt;
  font-weight: bold;
  padding: 2mm;
  margin: 5mm 0 2mm 0;
  border: 1px solid #000;
`;

const LabTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 9pt;

  th,
  td {
    border: 1px solid #000;
    padding: 1.5mm;
    text-align: left;
  }

  th {
    font-weight: bold;
    background-color: #f2f2f2;
  }
`;

const RemarksCell = styled.td<{ isDesirable?: boolean }>`
  color: ${(props) => (props.isDesirable ? 'green' : 'inherit')};
`;

const EndOfReport = styled.p`
  text-align: center;
  font-weight: bold;
  font-style: italic;
  margin-top: 10mm;
`;

const SignatureBlock = styled.div`
  margin-top: 20mm;
  text-align: right;
`;

const SignatureImage = styled.img`
  max-width: 150px;
  max-height: 60px;
`;

const SignatureName = styled.p`
  font-weight: bold;
  font-size: 10pt;
  margin: 0;
`;

const SignatureTitle = styled.p`
  font-size: 9pt;
  margin: 0;
`;

interface AnnualMedicalReportProps {
  patientData: any;
  branding: any;
  screeningYear: number;
  companySection: string;
}

const AnnualMedicalReport: React.FC<AnnualMedicalReportProps> = ({
  patientData,
  branding,
  screeningYear,
  companySection,
}) => {
  if (!patientData || !branding) {
    return <p>Loading report data...</p>;
  }

  const patientCompany = companySection === 'DCP' ? 'PLANT' : 'TRANSPORT';
  const reportTitleText = `${screeningYear} ANNUAL MEDICAL SCREENING FOR SUNU HEALTH ENROLLEES AT DANGOTE CEMENT ${patientCompany}, OBAJANA, KOGI STATE.`;

  const getAge = (dob: string) => {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  };

  return (
    <ReportWrapper id="report-to-download">
      {/* PAGE 1 */}
      <Page id="report-page-1">
        {branding.report_header && (
          <HeaderImage
            src={`/api/uploads/${branding.report_header}`}
            alt="Report Header"
          />
        )}

        <ReportTitle>{reportTitleText}</ReportTitle>

        <PatientName>
          {formatName(
            patientData.first_name,
            patientData.middle_name,
            patientData.last_name
          )}
        </PatientName>
        <PatientInfoGrid>
          <InfoColumn>
            <InfoRow>
              <InfoLabel>Staff ID:</InfoLabel> {patientData.staff_id}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Sex:</InfoLabel> {patientData.gender}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Ref:</InfoLabel> {patientData.patient_id_for_year}
            </InfoRow>
          </InfoColumn>
          <InfoColumn>
            <InfoRow>
              <InfoLabel>Dept:</InfoLabel> {patientData.department}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Age:</InfoLabel> {getAge(patientData.date_of_birth)}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Phone:</InfoLabel> {patientData.contact_phone}
            </InfoRow>
          </InfoColumn>
          <InfoColumn>
            <InfoRow>
              <InfoLabel>PID:</InfoLabel> {patientData.patient_id}
            </InfoRow>
            <InfoRow>
              <InfoLabel>DOB:</InfoLabel>{' '}
              {format(new Date(patientData.date_of_birth), 'dd/MM/yyyy')}
            </InfoRow>
          </InfoColumn>
          <InfoColumn>
            <InfoRow>
              <InfoLabel>Registered on:</InfoLabel>{' '}
              {format(
                new Date(patientData.date_registered),
                'hh:mm a, MMM dd, yy'
              )}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Reported on:</InfoLabel>{' '}
              {patientData.director_review_timestamp
                ? format(
                    new Date(patientData.director_review_timestamp),
                    'hh:mm a, MMM dd, yy'
                  )
                : 'N/A'}
            </InfoRow>
            <InfoRow>
              <InfoLabel>Generated on:</InfoLabel>{' '}
              {format(new Date(), 'hh:mm a, MMM dd, yy')}
            </InfoRow>
          </InfoColumn>
        </PatientInfoGrid>

        <SectionTitle>LAB FINDINGS/REPORT</SectionTitle>

        <LabTable>
          <thead>
            <tr>
              <th>Investigations</th>
              <th>Parameters</th>
              <th>Results</th>
              <th>Ref. Values</th>
              <th>Units</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={2}>
                <b>BLOOD SUGAR</b>
              </td>
              <td>FBS</td>
              <td>{patientData.fbs || 'NA'}</td>
              <td>70-99</td>
              <td>ml/dL</td>
              <td rowSpan={2}>{patientData.fbs_rbs_remark || 'Normal'}</td>
            </tr>
            <tr>
              <td>RBS</td>
              <td>{patientData.rbs || 'NA'}</td>
              <td>&lt;200</td>
              <td>ml/dL</td>
            </tr>
            <tr>
              <td rowSpan={5}>
                <b>FBC</b>
              </td>
              <td>PCV</td>
              <td>{patientData.hct || 'NA'}</td>
              <td>34-53.9</td>
              <td>%</td>
              <td rowSpan={5}>{patientData.fbc_remark || 'Normal'}</td>
            </tr>
            <tr>
              <td>WBC</td>
              <td>{patientData.wbc || 'NA'}</td>
              <td>3-11</td>
              <td>x109/L</td>
            </tr>
            <tr>
              <td>Lymphocyte</td>
              <td>{patientData.lymp || 'NA'}</td>
              <td>19.7-48</td>
              <td>%</td>
            </tr>
            <tr>
              <td>Neutrophil</td>
              <td>{patientData.gra || 'NA'}</td>
              <td>45.6-73.3</td>
              <td>%</td>
            </tr>
            <tr>
              <td>Platelets</td>
              <td>{patientData.plt || 'NA'}</td>
              <td>100-450</td>
              <td>x109/L</td>
            </tr>
            <tr>
              <td rowSpan={6}>
                <b>KIDNEY FUNCTION</b>
              </td>
              <td>Pottasium</td>
              <td>{patientData.k || 'NA'}</td>
              <td>3.5-5.0</td>
              <td>mmol/L</td>
              <td rowSpan={6}>{patientData.kft_remark || 'Normal'}</td>
            </tr>
            <tr>
              <td>Sodium</td>
              <td>{patientData.na || 'NA'}</td>
              <td>135-145</td>
              <td>mmol/L</td>
            </tr>
            <tr>
              <td>Chloride</td>
              <td>{patientData.cl || 'NA'}</td>
              <td>97-107</td>
              <td>mmol/L</td>
            </tr>
            <tr>
              <td>Bicarbonate</td>
              <td>{patientData.hc03 || 'NA'}</td>
              <td>20-28</td>
              <td>mmol/L</td>
            </tr>
            <tr>
              <td>Urea</td>
              <td>{patientData.urea || 'NA'}</td>
              <td>10-50</td>
              <td>mg/dL</td>
            </tr>
            <tr>
              <td>Cretinine</td>
              <td>{patientData.cre || 'NA'}</td>
              <td>
                Male: 0.7-1.4
                <br />
                Female: 0.6-1.2
              </td>
              <td>mg/dL</td>
            </tr>
            <tr>
              <td rowSpan={4}>
                <b>LIPID PROFILE</b>
              </td>
              <td>Total Cholesterol</td>
              <td>{patientData.tcho || 'NA'}</td>
              <td>150-220</td>
              <td>mg/dL</td>
              <RemarksCell isDesirable={true} rowSpan={4}>
                {patientData.lp_remark || 'Desirable'}
              </RemarksCell>
            </tr>
            <tr>
              <td>Triglycerides</td>
              <td>{patientData.tg || 'NA'}</td>
              <td>
                Male: 60-165
                <br />
                Female: 42-88
              </td>
              <td>mg/dL</td>
            </tr>
            <tr>
              <td>HDL-C</td>
              <td>{patientData.hdl || 'NA'}</td>
              <td>
                Male: 35-80
                <br />
                Female: 42-88
              </td>
              <td>mg/dL</td>
            </tr>
            <tr>
              <td>LDL-C</td>
              <td>{patientData.ldl || 'NA'}</td>
              <td>&lt;130</td>
              <td>mg/dL</td>
            </tr>
            <tr>
              <td rowSpan={5}>
                <b>LIVER FUNCTION</b>
              </td>
              <td>AST</td>
              <td>{patientData.ast || 'NA'}</td>
              <td>0-46</td>
              <td>U/L</td>
              <td rowSpan={5}>{patientData.lft_remark || 'Normal'}</td>
            </tr>
            <tr>
              <td>ALT</td>
              <td>{patientData.alt || 'NA'}</td>
              <td>0-49</td>
              <td>U/L</td>
            </tr>
            <tr>
              <td>ALP</td>
              <td>{patientData.alp || 'NA'}</td>
              <td>
                Male: 80-306
                <br />
                Female: 64-306
              </td>
              <td>U/L</td>
            </tr>
            <tr>
              <td>TB</td>
              <td>{patientData.tb || 'NA'}</td>
              <td>0-1.2</td>
              <td>mg/dL</td>
            </tr>
            <tr>
              <td>CB</td>
              <td>{patientData.cb || 'NA'}</td>
              <td>0-0.4</td>
              <td>mg/dL</td>
            </tr>
            <tr>
              <td>
                <b>URINE ANALYSIS</b>
              </td>
              <td>Sugar & Protein</td>
              <td>{patientData.urine_analysis || 'Normal'}</td>
              <td>NA</td>
              <td>NA</td>
              <td>{patientData.ua_remark || 'Normal'}</td>
            </tr>
            <tr>
              <td>
                <b>PSA</b>
              </td>
              <td>PSA</td>
              <td>
                {patientData.prostrate_specific_antigen || 'Not Applicable'}
              </td>
              <td>NA</td>
              <td>NA</td>
              <td>{patientData.psa_remark || 'Not Applicable'}</td>
            </tr>
          </tbody>
        </LabTable>

        <EndOfReport>***End of Report***</EndOfReport>

        <SignatureBlock>
          {branding.report_signature && (
            <SignatureImage
              src={`/api/uploads/${branding.report_signature}`}
              alt="Signature"
            />
          )}
          <SignatureName>
            {branding.doctor_name || 'Dr. Anyanwu Ugochukwu D. FMCPath'}
          </SignatureName>
          <SignatureTitle>
            {branding.doctor_title || 'Consultant in Charge'}
          </SignatureTitle>
        </SignatureBlock>

        {branding.report_footer && (
          <FooterImage
            src={`/api/uploads/${branding.report_footer}`}
            alt="Report Footer"
          />
        )}
      </Page>

      {/* PAGE 2 */}
      <Page id="report-page-2">
        {branding.report_header && (
          <HeaderImage
            src={`/api/uploads/${branding.report_header}`}
            alt="Report Header"
          />
        )}

        <SectionTitle>CLINICAL AND LABORATORY FINDINGS</SectionTitle>

        <LabTable>
          <thead>
            <tr>
              <th>S/N</th>
              <th>INVESTIGATIONS</th>
              <th>RESULTS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.</td>
              <td>Relevant History and Physical Exam:</td>
              <td>{patientData.assessment_hx_pe || 'Normal'}</td>
            </tr>
            <tr>
              <td>2.</td>
              <td>Relevant Laboratory Investigations:</td>
              <td>{patientData.overall_lab_remark || 'Essentially Normal'}</td>
            </tr>
            <tr>
              <td>3.</td>
              <td>Electrocardiogram (ECG) Findings:</td>
              <td>{patientData.ecg_result || 'Not Done'}</td>
            </tr>
            <tr>
              <td>4.</td>
              <td>Spirometry (Lung Function Test):</td>
              <td>{patientData.spirometry_result || 'Normal Lung Function'}</td>
            </tr>
            <tr>
              <td>5.</td>
              <td>Audiometry (Hearing Test):</td>
              <td>{patientData.audiometry_result || 'Normal Hearing'}</td>
            </tr>
            <tr>
              <td>6.</td>
              <td>Breast Examination (Females only):</td>
              <td>{patientData.breast_exam || 'Not Applicable'}</td>
            </tr>
          </tbody>
        </LabTable>

        <SectionTitle>PATIENT'S VITAL SIGNS</SectionTitle>
        <LabTable>
          <tbody>
            <tr>
              <td>
                <b>Blood Pressure:</b>
                <br />
                {patientData.bp} mm/hg
              </td>
              <td>
                <b>Pulse Rate:</b>
                <br />
                {patientData.pulse} b/m
              </td>
              <td>
                <b>SPO2:</b>
                <br />
                {patientData.spo2} %
              </td>
            </tr>
          </tbody>
        </LabTable>

        <SectionTitle>COMMENT/MEDICAL ADVICE:</SectionTitle>
        <p>{patientData.comment_one}</p>
        <p>{patientData.comment_two}</p>
        <p>{patientData.comment_three}</p>
        <p>{patientData.comment_four}</p>

        <SectionTitle>CERTIFICATION</SectionTitle>
        <p>
          I hereby certify that a comprehensive medical evaluation with relevant
          medical investigations were carried out on the above named staff, on
          the aforementioned date and time.
        </p>

        <SectionTitle>ACRONYMS AND INITIALISMS</SectionTitle>
        {/* This can be a static table or dynamic if needed */}
        <LabTable>
          <tbody>
            <tr>
              <td>FBC</td>
              <td>FULL BLOOD COUNT</td>
              <td>LDL-C</td>
              <td>LOW DENSITY LIPOPROTEIN CHOLESTEROL</td>
              <td>TB</td>
              <td>TOTAL BILIRUBIN</td>
            </tr>
            <tr>
              <td>TC</td>
              <td>TOTAL CHOLESTEROL</td>
              <td>AST</td>
              <td>APARTATE AMINOTRANSFERASE</td>
              <td>CB</td>
              <td>CONJUFATED BILIRUBIN</td>
            </tr>
            <tr>
              <td>TG</td>
              <td>TRIGLYCERIDE</td>
              <td>ALT</td>
              <td>ALANINE AMINOTRANSFERASE</td>
              <td>NAD</td>
              <td>NO ABNORMALITY DETECTED</td>
            </tr>
            <tr>
              <td>HDL-C</td>
              <td>HIGH DENSITY LIPOPROTEIN CHOLESTEROL</td>
              <td>ALP</td>
              <td>ALKALINE PHOSPHATASE</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </LabTable>

        <EndOfReport>***End of Report***</EndOfReport>

        <SignatureBlock>
          {branding.report_signature && (
            <SignatureImage
              src={`/api/uploads/${branding.report_signature}`}
              alt="Signature"
            />
          )}
          <SignatureName>
            {branding.doctor_name || 'Dr. Anyanwu Ugochukwu D. FMCPath'}
          </SignatureName>
          <SignatureTitle>
            {branding.doctor_title || 'Consultant in Charge'}
          </SignatureTitle>
        </SignatureBlock>

        {branding.report_footer && (
          <FooterImage
            src={`/api/uploads/${branding.report_footer}`}
            alt="Report Footer"
          />
        )}
      </Page>
    </ReportWrapper>
  );
};

export default AnnualMedicalReport;
