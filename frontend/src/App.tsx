import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme/theme';
import { GlobalStyle } from './GlobalStyle';
import { GlobalFilterProvider } from './contexts/GlobalFilterContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
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
import PatientReportSearchPage from './pages/PatientReportSearchPage';
import PatientReportPage from './pages/PatientReportPage';
import ViewPatientsPage from './pages/ViewPatientsPage';
import EditPatientPage from './pages/EditPatientPage';
import ViewRecordsPage from './pages/ViewRecordsPage';
import ControlPanelPage from './pages/ControlPanelPage';
import UserManagementPage from './pages/UserManagementPage';
import RoleManagementPage from './pages/RoleManagementPage';
import TempAccessCodePage from './pages/TempAccessCodePage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import AuditLogPage from './pages/AuditLogPage';
import EditUserPage from './pages/EditUserPage';
import ManageAccountPage from './pages/ManageAccountPage';
import ProfileUpdateForm from './pages/ProfileUpdateForm';
import PasswordChangeForm from './pages/PasswordChangeForm';
import Manage2FAPage from './pages/Manage2FAPage';
import EmailConfigPage from './pages/EmailConfigPage';
import MessagingPage from './pages/MessagingPage';
import DashboardPage from './pages/DashboardPage';
import BrandingPage from './pages/BrandingPage';
import PatientDataUploadPage from './pages/PatientDataUploadPage';
import ClaimAccountPage from './pages/ClaimAccountPage';
import MyReportPage from './pages/MyReportPage';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <AppProvider>
        <GlobalFilterProvider>
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<HomePage toggleTheme={toggleTheme} theme={theme} />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/claim-account" element={<ClaimAccountPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<ProtectedLayout toggleTheme={toggleTheme} theme={theme} />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/register-patient" element={<PatientRegistrationPage />} />
                    <Route path="/consultation" element={<ConsultationPage />} />
                    <Route path="/consultation/form/:staffId" element={<ConsultationFormPage />} />
                    <Route path="/test-results" element={<TestResultsLandingPage />} />
                    <Route path="/test-results/:testType/search" element={<TestResultSearchPage />} />
                    <Route path="/test-results/:testType/form/:staffId" element={<TestResultFormPage />} />
                    <Route path="/director-review/search" element={<DirectorReviewSearchPage />} />
                    <Route path="/director-review/form/:staffId" element={<DirectorReviewFormPage />} />
                    <Route path="/patient-report/search" element={<PatientReportSearchPage />} />
                    <Route path="/patient-report/view/:staffId" element={<PatientReportPage />} />
                    <Route path="/view-patients" element={<ViewPatientsPage />} />
                    <Route path="/edit-patient/:staffId" element={<EditPatientPage />} />
                    <Route path="/view-records" element={<ViewRecordsPage />} />
                    {/* Control Panel Routes */}
                    <Route path="/control-panel" element={<ControlPanelPage />} />
                    <Route path="/control-panel/user-management" element={<UserManagementPage />} />
                    <Route path="/control-panel/edit-user/:userId" element={<EditUserPage />} />
                    <Route path="/control-panel/role-management" element={<RoleManagementPage />} />
                    <Route path="/control-panel/temp-access-codes" element={<TempAccessCodePage />} />
                    <Route path="/control-panel/audit-log" element={<AuditLogPage />} />
                    <Route path="/control-panel/email-config" element={<EmailConfigPage />} />
                    <Route path="/control-panel/branding" element={<BrandingPage />} />
                    <Route path="/control-panel/patient-upload" element={<PatientDataUploadPage />} />
                    <Route path="/access-denied" element={<AccessDeniedPage />} />
                    {/* Manage Account Routes */}
                    <Route path="/manage-account" element={<ManageAccountPage />} />
                    <Route path="/manage-account/profile" element={<ProfileUpdateForm />} />
                    <Route path="/manage-account/change-password" element={<PasswordChangeForm />} />
                    <Route path="/manage-account/2fa" element={<Manage2FAPage />} />
                    <Route path="/messaging" element={<MessagingPage />} />
                    <Route path="/my-report" element={<MyReportPage />} />
                  </Route>
                </Route>
              </Routes>
            </AuthProvider>
          </Router>
        </GlobalFilterProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
