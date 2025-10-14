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
import ConsultationFormPage from './pages/ConsultationFormPage';
import ProtectedLayout from './components/ProtectedLayout';
import TestResultsLandingPage from './pages/TestResultsLandingPage';
import TestResultSearchPage from './pages/test-results/TestResultSearchPage';
import TestResultFormPage from './pages/test-results/TestResultFormPage';
import DirectorReviewSearchPage from './pages/DirectorReviewSearchPage';
import DirectorReviewFormPage from './pages/DirectorReviewFormPage';

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
              <Route path="/consultation/form/:patientId" element={<ConsultationFormPage />} />
              <Route path="/test-results" element={<TestResultsLandingPage />} />
              <Route path="/test-results/:testType/search" element={<TestResultSearchPage />} />
              <Route path="/test-results/:testType/form/:patientId" element={<TestResultFormPage />} />
              <Route path="/director-review/search" element={<DirectorReviewSearchPage />} />
              <Route path="/director-review/form/:patientId" element={<DirectorReviewFormPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
