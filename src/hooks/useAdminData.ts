import { useQuery } from '@tanstack/react-query';
import { 
  adminDashboardApi,
  adminAppointmentApi,
  adminDoctorApi,
  adminServiceApi,
  adminBannerApi,
  adminTestimonialApi,
  adminFaqApi,
  adminGalleryApi,
  adminHolidayApi,
  adminContactApi,
} from '@/api/adminApi';

// Dashboard
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: adminDashboardApi.getStats,
  });
};

// Appointments
export const useAdminAppointments = (filters: {
  status?: string;
  date?: string;
  doctorId?: number;
  page?: number;
  size?: number;
} = {}) => {
  return useQuery({
    queryKey: ['admin', 'appointments', filters],
    queryFn: () => adminAppointmentApi.getAll(filters),
  });
};

// Doctors
export const useAdminDoctors = () => {
  return useQuery({
    queryKey: ['admin', 'doctors'],
    queryFn: adminDoctorApi.getAll,
  });
};

// Services
export const useAdminServices = () => {
  return useQuery({
    queryKey: ['admin', 'services'],
    queryFn: adminServiceApi.getAll,
  });
};

// Banners
export const useAdminBanners = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['admin', 'banners', page, size],
    queryFn: () => adminBannerApi.getAll(page, size),
  });
};

// Testimonials
export const useAdminTestimonials = () => {
  return useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: adminTestimonialApi.getAll,
  });
};

// FAQs
export const useAdminFaqs = () => {
  return useQuery({
    queryKey: ['admin', 'faqs'],
    queryFn: adminFaqApi.getAll,
  });
};

// Gallery
export const useAdminGallery = () => {
  return useQuery({
    queryKey: ['admin', 'gallery'],
    queryFn: adminGalleryApi.getAll,
  });
};

// Holidays
export const useAdminHolidays = () => {
  return useQuery({
    queryKey: ['admin', 'holidays'],
    queryFn: adminHolidayApi.getAll,
  });
};

// Contact Messages
export const useAdminContactMessages = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['admin', 'messages', page, size],
    queryFn: () => adminContactApi.getAll(page, size),
  });
};