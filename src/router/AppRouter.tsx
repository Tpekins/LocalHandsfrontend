
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Role } from '../types';

// Layouts
import MainLayout from '../layouts/MainLayout';
import ClientLayout from '../layouts/ClientLayout';
import ProviderLayout from '../layouts/ProviderLayout';
import AdminLayout from '../layouts/AdminLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import ServicesPage from '../pages/public/ServicesPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import ProviderProfilePage from '../pages/public/ProviderProfilePage';
// Client Pages
import ClientDashboardPage from '../pages/client/ClientDashboardPage';
import PostJobPage from '../pages/client/PostJobPage';
import MyProposalsPage from '../pages/client/MyProposalsPage';
import ClientActiveJobsPage from '../pages/client/ActiveJobsPage';
import ClientSettingsPage from '../pages/client/SettingsPage';
import ClientContractsPage from '../pages/client/ClientContractsPage';
import ClientChatPage from '../pages/client/ClientChatPage';
import ClientBookingsPage from '../pages/client/ClientBookingsPage';

// --- Provider Pages ---
import ProviderDashboardPage from '../pages/provider/ProviderDashboardPage';
import BrowseJobsPage from '../pages/provider/BrowseJobsPage';
import NewBrowseJobsPage from '../pages/provider/NewBrowseJobsPage';
import JobDetailsPage from '../pages/provider/JobDetailsPage';
import SubmitProposalPage from '../pages/provider/SubmitProposalPage';
import EarningsPage from '../pages/provider/EarningsPage';
import SettingsPage from '../pages/provider/SettingsPage';
import ServiceManagementPage from '../pages/provider/ServiceManagementPage';
import NewServiceManagementPage from '../pages/provider/NewServiceManagementPage';
import ProposalsPage from '../pages/provider/ProposalsPage';
import PaymentMethodsPage from '../pages/provider/PaymentMethodsPage';

// import MyProfilePage from '../pages/provider/MyProfilePage';
import NewMyProfilePage from '../pages/provider/NewMyProfilePage';
import NewMessagesPage from '../pages/provider/NewMessagesPage';
import ProviderChatPage from '../pages/provider/ProviderChatPage';
import ProviderOnboardingPage from '../pages/provider/ProviderOnboardingPage';
// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import AdminServiceManagementPage from '../pages/admin/ServiceManagementPage';
import CategoryManagementPage from '../pages/admin/CategoryManagementPage';
import ReportsPage from '../pages/admin/ReportsPage';
import SystemSettingsPage from '../pages/admin/SystemSettingsPage';
import ApplicationsPage from '../pages/admin/ApplicationsPage';
import PrivacyPolicyPage from '../pages/public/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/public/TermsOfServicePage';
import TrustAndSafetyPage from '../pages/public/TrustAndSafetyPage';
import ProviderSafetyPage from '../pages/provider/ProviderSafetyPage';
import WhyProvidePage from '../pages/provider/WhyProvidePage';
import CookiePolicyPage from '../pages/public/CookiePolicyPage';
import FAQPage from '../pages/public/FAQPage';
import HelpCenterPage from '../pages/public/HelpCenterPage';
import AboutUsPage from '../pages/public/AboutUsPage';
import BlogPage from '../pages/public/BlogPage';
import CareersPage from '../pages/public/CareersPage';
import ContactUsPage from '../pages/public/ContactUsPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import BlogPostPage from '../pages/public/BlogPostPage';
import TransactionsPage from '../pages/admin/TransactionsPage';

// --- Other ---
import NotFoundPage from '../pages/NotFoundPage';
import { Toaster } from 'sonner';
import { ContractsProvider } from '../contexts/ContractsContext';

const AppRouter: React.FC = () => {
  return (
    <ContractsProvider>
      <Toaster richColors position="top-right" />
      <Routes>
      {/* Admin Login Route - No Layout */}
      <Route path="/management/login" element={<AdminLoginPage />} />

      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/providers/:providerId" element={<ProviderProfilePage />} />
      </Route>

      {/* Client Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.CLIENT]} />}>
        <Route path="/client" element={<ClientLayout />}>
          <Route path="dashboard" element={<ClientDashboardPage />} />
          <Route path="post-job" element={<PostJobPage />} />
          <Route path="my-proposals" element={<MyProposalsPage />} />
          <Route path="active-jobs" element={<ClientActiveJobsPage />} />
          
          <Route path="chat" element={<ClientChatPage />} />
          <Route path="bookings" element={<ClientBookingsPage />} />
          <Route path="settings" element={<ClientSettingsPage />} />
          <Route path="contracts" element={<ClientContractsPage />} />

        </Route>
      </Route>

      {/* Provider Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.PROVIDER]} />}>
        <Route path="/provider" element={<ProviderLayout />}>
        <Route path="dashboard" element={<ProviderDashboardPage />} />
          <Route path="onboarding" element={<ProviderOnboardingPage />} />
          <Route path="browse-jobs" element={<BrowseJobsPage />} />
              <Route path="browse-jobs-new" element={<NewBrowseJobsPage />} />
          <Route path="job-details/:jobId" element={<JobDetailsPage />} />
          <Route path="submit-proposal/:jobId" element={<SubmitProposalPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="service-management" element={<ServiceManagementPage />} />
              <Route path="service-management-new" element={<NewServiceManagementPage />} />
          <Route path="proposals" element={<ProposalsPage />} />
                    <Route path="earnings" element={<EarningsPage />} />
          <Route path="payment-methods" element={<PaymentMethodsPage />} />
          {/* <Route path="my-profile" element={<MyProfilePage />} /> */}
          <Route path="my-profile-new" element={<NewMyProfilePage />} />
          <Route path="messages-new" element={<NewMessagesPage />} />
          <Route path="chat" element={<ProviderChatPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route path="user-management" element={<UserManagementPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="service-management" element={<AdminServiceManagementPage />} />
          <Route path="category-management" element={<CategoryManagementPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SystemSettingsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
        </Route>
      </Route>

      <Route path="/about" element={<AboutUsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
<Route path="/careers" element={<CareersPage />} />
<Route path="/contact" element={<ContactUsPage />} />
<Route path="/cookie-policy" element={<CookiePolicyPage />} />
<Route path="/faq" element={<FAQPage />} />
<Route path="/help" element={<HelpCenterPage />} />
<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
<Route path="/terms-of-service" element={<TermsOfServicePage />} />
<Route path="/trust-and-safety" element={<TrustAndSafetyPage />} />
<Route path="/providers/safety" element={<ProviderSafetyPage />} />
<Route path="/providers/why-local-hands" element={<WhyProvidePage />} />

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </ContractsProvider>
  );
};

export default AppRouter;