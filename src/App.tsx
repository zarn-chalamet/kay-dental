import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/router/ProtectedRoute';

// Public Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import DoctorsPage from '@/pages/DoctorsPage';
import DoctorDetailPage from '@/pages/DoctorDetailPage';
import GalleryPage from '@/pages/GalleryPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import PricingPage from '@/pages/PricingPage';
import FaqPage from '@/pages/FaqPage';
import ContactPage from '@/pages/ContactPage';
import AppointmentPage from '@/pages/AppointmentPage';
import EmergencyPage from '@/pages/EmergencyPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminBannersPage from '@/pages/admin/AdminBannersPage';
import AdminAppointmentsPage from '@/pages/admin/AdminAppointmentsPage';
import AdminDoctorsPage from '@/pages/admin/AdminDoctorsPage';
import AdminServicesPage from '@/pages/admin/AdminServicesPage';
import AdminHolidaysPage from '@/pages/admin/AdminHolidaysPage';
import AdminGalleryPage from '@/pages/admin/AdminGalleryPage';
import AdminTestimonialsPage from '@/pages/admin/AdminTestimonialsPage';
import AdminFaqsPage from '@/pages/admin/AdminFaqsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminContactPage from './pages/admin/AdminContactPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#1f2937',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
        </Route>

        {/* Admin Login (no layout) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/banners" element={<AdminBannersPage />} />
          <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/holidays" element={<AdminHolidaysPage />} />
          <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
          <Route path="/admin/faqs" element={<AdminFaqsPage />} />
          <Route path="/admin/messages" element={<AdminContactPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
