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
  adminSettingsApi,
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

// Settings
export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: adminSettingsApi.getAll,
  });
};

// ============ NOTIFICATION HOOKS ============

/**
 * Pending appointments count (for sidebar badge)
 * Auto-refetches every 30 seconds for near real-time updates
 */
export const usePendingAppointmentsCount = () => {
  return useQuery({
    queryKey: ['admin', 'notifications', 'pending-appointments'],
    queryFn: async () => {
      const result = await adminAppointmentApi.getAll({
        status: 'PENDING',
        page: 0,
        size: 1,
      });
      return result.totalElements;
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
  });
};

/**
 * Unread messages count (for sidebar badge)
 * Uses dedicated endpoint for better performance
 */
export const useUnreadMessagesCount = () => {
  return useQuery({
    queryKey: ['admin', 'notifications', 'unread-messages'],
    queryFn: async () => {
      try {
        return await adminContactApi.getUnreadCount();
      } catch (error) {
        console.warn('Unread messages endpoint not available');
        return 0;
      }
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
    retry: false,
  });
};

/**
 * Recent notifications for bell dropdown
 * Combines pending appointments + unread messages into unified feed
 */
export const useRecentNotifications = () => {
  return useQuery({
    queryKey: ['admin', 'notifications', 'recent'],
    queryFn: async () => {
      const appointmentsPromise = adminAppointmentApi.getAll({
        status: 'PENDING',
        page: 0,
        size: 5,
      });

      const messagesPromise = adminContactApi
        .getRecentUnread()
        .catch(() => []);

      const [appointmentsResult, unreadMessages] = await Promise.all([
        appointmentsPromise,
        messagesPromise,
      ]);

      const notifications = [
        ...appointmentsResult.content.map((apt) => ({
          id: `apt-${apt.id}`,
          type: 'appointment' as const,
          title: 'New Appointment',
          description: `${apt.patientName} · ${apt.service?.nameEn || 'Service'}`,
          time: apt.createdAt,
          link: '/admin/appointments',
          data: apt,
        })),
        ...unreadMessages.map((msg) => ({
          id: `msg-${msg.id}`,
          type: 'message' as const,
          title: 'New Message',
          description: `${msg.name}: ${msg.subject || msg.message.substring(0, 50)}`,
          time: msg.createdAt,
          link: '/admin/messages',
          data: msg,
        })),
      ].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );

      return notifications.slice(0, 10);
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
};