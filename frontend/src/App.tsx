import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme/theme';
import { GlobalStyle } from './GlobalStyle';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import PatientRegistrationPage from './pages/PatientRegistrationPage';
import ConsultationPage from './pages/ConsultationPage';
import ProtectedLayout from './components/ProtectedLayout';
import TestResultsLandingPage from './pages/TestResultsLandingPage';
import FullBloodCountPage from './pages/test-results/FullBloodCountPage';
import KidneyFunctionTestPage from './pages/test-results/KidneyFunctionTestPage';
import LipidProfilePage from './pages/test-results/LipidProfilePage';
import LiverFunctionTestPage from './pages/test-results/LiverFunctionTestPage';
import ECGPage from './pages/test-results/ECGPage';
import SpirometryPage from './pages/test-results/SpirometryPage';
import AudiometryPage from './pages/test-results/AudiometryPage';

const DashboardPage = () => <div><h1>Protected Dashboard</h1></div>;

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage toggleTheme={toggleTheme} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/register-patient" element={<PatientRegistrationPage />} />
              <Route path="/consultation" element={<ConsultationPage />} />
              <Route path="/test-results" element={<TestResultsLandingPage />} />
              <Route path="/test-results/full-blood-count" element={<FullBloodCountPage />} />
              <Route path="/test-results/kidney-function-test" element={<KidneyFunctionTestPage />} />
              <Route path="/test-results/lipid-profile" element={<LipidProfilePage />} />
              <Route path="/test-results/liver-function-test" element={<LiverFunctionTestPage />} />
              <Route path="/test-results/ecg" element={<ECGPage />} />
              <Route path="/test-results/spirometry" element={<SpirometryPage />} />
              <Route path="/test-results/audiometry" element={<AudiometryPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
