import React, { useState } from 'react';
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

const UploadContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  padding: 2rem;
`;

const Instructions = styled.div`
  margin-bottom: 2rem;
  line-height: 1.6;

  h3 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.accent};
  }

  ul {
    padding-left: 20px;
  }
`;

const FileInput = styled.input`
  display: block;
  margin-bottom: 1rem;
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PatientDataUploadPage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        setUploading(true);
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
            alert(response.data.message);
        } catch (error) {
            console.error('File upload failed:', error);
            alert('File upload failed. Please check the console for details.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <PageContainer>
            <PageTitle>Upload Patient Bio-Data</PageTitle>
            <UploadContainer>
                <Instructions>
                    <h3>Upload Instructions</h3>
                    <p>
                        Please upload an Excel file (.xlsx) with the patient data. The file should have the following columns in this specific order:
                    </p>
                    <ul>
                        <li>Staff ID</li>
                        <li>First Name</li>
                        <li>Middle Name (can be empty)</li>
                        <li>Last Name</li>
                        <li>Department</li>
                        <li>Gender</li>
                        <li>Date of Birth (YYYY-MM-DD)</li>
                        <li>Contact Phone</li>
                        <li>Email Address</li>
                        <li>Race</li>
                        <li>Nationality</li>
                    </ul>
                    <p>The first row should be the header row and will be ignored.</p>
                </Instructions>
                <FileInput type="file" accept=".xlsx" onChange={handleFileChange} />
                <Button onClick={handleUpload} disabled={!file || uploading}>
                    {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
            </UploadContainer>
        </PageContainer>
    );
};

export default PatientDataUploadPage;