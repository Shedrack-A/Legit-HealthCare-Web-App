import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useApp } from '../contexts/AppContext';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
`;

const CardTitle = styled.h2`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FileInput = styled.input`
  /* Basic styling, can be improved */
`;

const PreviewImage = styled.img`
  max-width: 200px;
  max-height: 100px;
  margin-top: 1rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const BrandingPage: React.FC = () => {
  const [clinicName, setClinicName] = useState('');
  const [logoLight, setLogoLight] = useState<File | null>(null);
  const [logoDark, setLogoDark] = useState<File | null>(null);
  const [logoHome, setLogoHome] = useState<File | null>(null);
  const [reportHeader, setReportHeader] = useState<File | null>(null);
  const [reportSignature, setReportSignature] = useState<File | null>(null);
  const [reportFooter, setReportFooter] = useState<File | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [doctorTitle, setDoctorTitle] = useState('');
  const [previews, setPreviews] = useState({
    logo_light: '',
    logo_dark: '',
    logo_home: '',
    report_header: '',
    report_signature: '',
    report_footer: '',
  });
  const { showFlashMessage, setIsLoading, isLoading } = useApp();

  useEffect(() => {
    const fetchBranding = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/branding');
        setClinicName(data.clinic_name);
        setPreviews({
          logo_light: data.logo_light ? `/api/uploads/${data.logo_light}` : '',
          logo_dark: data.logo_dark ? `/api/uploads/${data.logo_dark}` : '',
          logo_home: data.logo_home ? `/api/uploads/${data.logo_home}` : '',
          report_header: data.report_header
            ? `/api/uploads/${data.report_header}`
            : '',
          report_signature: data.report_signature
            ? `/api/uploads/${data.report_signature}`
            : '',
          report_footer: data.report_footer
            ? `/api/uploads/${data.report_footer}`
            : '',
        });
        setDoctorName(data.doctor_name || '');
        setDoctorTitle(data.doctor_title || '');
      } catch (error) {
        console.error('Failed to fetch branding settings:', error);
        showFlashMessage('Failed to load branding settings.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranding();
  }, [setIsLoading, showFlashMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('clinic_name', clinicName);
    formData.append('doctor_name', doctorName);
    formData.append('doctor_title', doctorTitle);
    if (logoLight) formData.append('logo_light', logoLight);
    if (logoDark) formData.append('logo_dark', logoDark);
    if (logoHome) formData.append('logo_home', logoHome);
    if (reportHeader) formData.append('report_header', reportHeader);
    if (reportSignature) formData.append('report_signature', reportSignature);
    if (reportFooter) formData.append('report_footer', reportFooter);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/branding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      showFlashMessage('Branding updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update branding:', error);
      showFlashMessage('Failed to update branding.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewKey: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setter(file);
      setPreviews((p) => ({ ...p, [previewKey]: URL.createObjectURL(file) }));
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Branding Management</PageTitle>
      <Form onSubmit={handleSubmit}>
        <Card>
          <CardTitle>General Information</CardTitle>
          <FormGroup>
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="doctorName">Doctor's Name</Label>
            <Input
              id="doctorName"
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="doctorTitle">Doctor's Title</Label>
            <Input
              id="doctorTitle"
              type="text"
              value={doctorTitle}
              onChange={(e) => setDoctorTitle(e.target.value)}
            />
          </FormGroup>
        </Card>

        <Card>
          <CardTitle>Logos</CardTitle>
          <FormGroup>
            <Label htmlFor="logoLight">Logo (Light Theme)</Label>
            <FileInputContainer>
              <FileInput
                id="logoLight"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setLogoLight, 'logo_light')
                }
              />
              {previews.logo_light && (
                <PreviewImage
                  src={previews.logo_light}
                  alt="Light logo preview"
                />
              )}
            </FileInputContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="logoDark">Logo (Dark Theme)</Label>
            <FileInputContainer>
              <FileInput
                id="logoDark"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setLogoDark, 'logo_dark')}
              />
              {previews.logo_dark && (
                <PreviewImage
                  src={previews.logo_dark}
                  alt="Dark logo preview"
                />
              )}
            </FileInputContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="logoHome">Logo (Home Page)</Label>
            <FileInputContainer>
              <FileInput
                id="logoHome"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setLogoHome, 'logo_home')}
              />
              {previews.logo_home && (
                <PreviewImage
                  src={previews.logo_home}
                  alt="Home logo preview"
                />
              )}
            </FileInputContainer>
          </FormGroup>
        </Card>

        <Card>
          <CardTitle>Report Assets</CardTitle>
          <FormGroup>
            <Label htmlFor="reportHeader">Report Header Image</Label>
            <FileInputContainer>
              <FileInput
                id="reportHeader"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setReportHeader, 'report_header')
                }
              />
              {previews.report_header && (
                <PreviewImage
                  src={previews.report_header}
                  alt="Report header preview"
                />
              )}
            </FileInputContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="reportSignature">Report Signature Image</Label>
            <FileInputContainer>
              <FileInput
                id="reportSignature"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setReportSignature, 'report_signature')
                }
              />
              {previews.report_signature && (
                <PreviewImage
                  src={previews.report_signature}
                  alt="Report signature preview"
                />
              )}
            </FileInputContainer>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="reportFooter">Report Footer Image</Label>
            <FileInputContainer>
              <FileInput
                id="reportFooter"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, setReportFooter, 'report_footer')
                }
              />
              {previews.report_footer && (
                <PreviewImage
                  src={previews.report_footer}
                  alt="Report footer preview"
                />
              )}
            </FileInputContainer>
          </FormGroup>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </PageContainer>
  );
};

export default BrandingPage;
