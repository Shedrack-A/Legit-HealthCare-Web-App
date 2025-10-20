import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Button } from '../components/common/Button';
import { useApp } from '../contexts/AppContext';
import { UploadCloud } from 'react-feather';

const UploadCloudIcon = styled(UploadCloud)`
  color: ${({ theme }) => theme.main};
`;

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h1`
  color: ${({ theme }) => theme.main};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const UploadCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.cardPadding};
  max-width: 800px;
  margin: auto;
`;

const Instructions = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.6;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.textSecondary};

  h3 {
    color: ${({ theme }) => theme.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  ul {
    padding-left: 20px;
    margin-top: ${({ theme }) => theme.spacing.sm};
  }

  strong {
    color: ${({ theme }) => theme.main};
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FileInputLabel = styled.label`
  border: 2px dashed ${({ theme }) => theme.cardBorder};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.main};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileName = styled.p`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-weight: 600;
`;

const PatientDataUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { showFlashMessage, setIsLoading, isLoading } = useApp();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showFlashMessage('Please select a file first.', 'error');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/patients/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      showFlashMessage(response.data.message, 'success');
      setFile(null); // Clear file after successful upload
    } catch (error: any) {
      console.error('File upload failed:', error);
      const errorMessage =
        error.response?.data?.message ||
        'File upload failed. Please check the console for details.';
      showFlashMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle>Upload Patient Bio-Data</PageTitle>
      <UploadCard>
        <Instructions>
          <h3>Upload Instructions</h3>
          <p>
            Please upload an Excel file (.xlsx) with patient data. The file must
            contain the following headers: <strong>Staff ID</strong>,{' '}
            <strong>First Name</strong>, and <strong>Last Name</strong>.
          </p>
          <p>
            The following columns are optional and will be processed if present,
            in this order:
            <ul>
              <li>Department</li>
              <li>Gender</li>
              <li>Date of Birth</li>
              <li>Contact Phone</li>
              <li>Email Address</li>
              <li>Race</li>
              <li>Nationality</li>
            </ul>
            Any of these details can be left empty and updated manually later.
          </p>
        </Instructions>

        <FileInputContainer>
          <FileInputLabel>
            <FileInput type="file" accept=".xlsx" onChange={handleFileChange} />
            <UploadCloudIcon size={48} />
            <p>Click to browse or drag & drop a file here.</p>
          </FileInputLabel>

          {file && <FileName>Selected file: {file.name}</FileName>}

          <Button onClick={handleUpload} disabled={!file || isLoading}>
            {isLoading ? 'Uploading...' : 'Upload File'}
          </Button>
        </FileInputContainer>
      </UploadCard>
    </PageContainer>
  );
};

export default PatientDataUploadPage;
