import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: auto;
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
`;

const FileInput = styled.input`
  padding: 0.8rem;
`;

const Button = styled.button`
  padding: 1rem;
  background-color: ${({ theme }) => theme.main};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.accent};
  }
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
    const [previews, setPreviews] = useState({
        logo_light: '',
        logo_dark: '',
        logo_home: '',
        report_header: '',
        report_signature: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                const { data } = await axios.get('/api/branding');
                setClinicName(data.clinic_name);
                setPreviews({
                    logo_light: data.logo_light ? `/api/uploads/${data.logo_light}` : '',
                    logo_dark: data.logo_dark ? `/api/uploads/${data.logo_dark}` : '',
                    logo_home: data.logo_home ? `/api/uploads/${data.logo_home}` : '',
                    report_header: data.report_header ? `/api/uploads/${data.report_header}` : '',
                    report_signature: data.report_signature ? `/api/uploads/${data.report_signature}` : '',
                });
            } catch (error) {
                console.error('Failed to fetch branding settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBranding();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('clinic_name', clinicName);
        if (logoLight) formData.append('logo_light', logoLight);
        if (logoDark) formData.append('logo_dark', logoDark);
        if (logoHome) formData.append('logo_home', logoHome);
        if (reportHeader) formData.append('report_header', reportHeader);
        if (reportSignature) formData.append('report_signature', reportSignature);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/branding', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Branding updated successfully!');
            // Optionally, refresh previews
            window.location.reload();
        } catch (error) {
            console.error('Failed to update branding:', error);
            alert('Failed to update branding.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>, previewKey: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setter(file);
            setPreviews(p => ({ ...p, [previewKey]: URL.createObjectURL(file) }));
        }
    };

    if (loading) {
        return <PageContainer><p>Loading...</p></PageContainer>;
    }

    return (
        <PageContainer>
            <PageTitle>Branding Management</PageTitle>
            <Form onSubmit={handleSubmit}>
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
                    <Label htmlFor="logoLight">Logo (Light Theme)</Label>
                    <FileInput
                        id="logoLight"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setLogoLight, 'logo_light')}
                    />
                    {previews.logo_light && <PreviewImage src={previews.logo_light} alt="Light logo preview" />}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="logoDark">Logo (Dark Theme)</Label>
                    <FileInput
                        id="logoDark"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setLogoDark, 'logo_dark')}
                    />
                    {previews.logo_dark && <PreviewImage src={previews.logo_dark} alt="Dark logo preview" />}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="logoHome">Logo (Home Page)</Label>
                    <FileInput
                        id="logoHome"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setLogoHome, 'logo_home')}
                    />
                    {previews.logo_home && <PreviewImage src={previews.logo_home} alt="Home logo preview" />}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="reportHeader">Report Header Image</Label>
                    <FileInput
                        id="reportHeader"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setReportHeader, 'report_header')}
                    />
                    {previews.report_header && <PreviewImage src={previews.report_header} alt="Report header preview" />}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="reportSignature">Report Signature Image</Label>
                    <FileInput
                        id="reportSignature"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setReportSignature, 'report_signature')}
                    />
                    {previews.report_signature && <PreviewImage src={previews.report_signature} alt="Report signature preview" />}
                </FormGroup>

                <Button type="submit">Save Changes</Button>
            </Form>
        </PageContainer>
    );
};

export default BrandingPage;