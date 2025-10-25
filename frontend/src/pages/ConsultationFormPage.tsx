import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConsultationForm from '../components/ConsultationForm';

const ConsultationFormPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientAndConsultation = async () => {
      const token = localStorage.getItem('token');
      try {
        const patientRes = await axios.get(`/api/patients?staff_id=${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatient(patientRes.data);

        const consultationRes = await axios.get(`/api/consultations/${staffId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInitialData(consultationRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientAndConsultation();
  }, [staffId]);

  const handleSubmit = async (data: any) => {
    const token = localStorage.getItem('token');
    await axios.post('/api/consultations', { ...data, staff_id: staffId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/consultation');
  };

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div>
      <h2>Consultation for {patient.first_name} {patient.last_name}</h2>
      <ConsultationForm patient={patient} onSuccess={() => navigate('/consultation')} />
    </div>
  );
};

export default ConsultationFormPage;
