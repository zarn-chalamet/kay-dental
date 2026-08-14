import axiosInstance from './axiosInstance';
import type { Banner, Doctor, DentalService, Testimonial, Faq, GalleryPhoto, Holiday, Appointment } from '@/types';

// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ============ DASHBOARD ============
export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  totalPatients: number;
  appointmentsThisMonth: number;
  unreadMessages: number;
}

export const adminDashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data.data;
  },
};

// ============ ADMIN BANNERS ============
export const adminBannerApi = {
  getAll: async (page = 0, size = 20): Promise<PageResponse<Banner>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Banner>>>(`/admin/banners?page=${page}&size=${size}`);
    return response.data.data;
  },

  create: async (data: Partial<Banner>): Promise<Banner> => {
    const response = await axiosInstance.post<ApiResponse<Banner>>('/admin/banners', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Banner>): Promise<Banner> => {
    const response = await axiosInstance.put<ApiResponse<Banner>>(`/admin/banners/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/banners/${id}`);
  },

  toggle: async (id: number): Promise<Banner> => {
    const response = await axiosInstance.patch<ApiResponse<Banner>>(`/admin/banners/${id}/toggle`);
    return response.data.data;
  },

  reorder: async (orderedIds: number[]): Promise<void> => {
    await axiosInstance.patch('/admin/banners/reorder', { orderedIds });
  },
};

// ============ ADMIN APPOINTMENTS ============
export interface AppointmentFilters {
  status?: string;
  date?: string;
  doctorId?: number;
  page?: number;
  size?: number;
}

export const adminAppointmentApi = {
  getAll: async (filters: AppointmentFilters = {}): Promise<PageResponse<Appointment>> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);
    if (filters.doctorId) params.append('doctorId', filters.doctorId.toString());
    params.append('page', (filters.page || 0).toString());
    params.append('size', (filters.size || 20).toString());
    
    const response = await axiosInstance.get<ApiResponse<PageResponse<Appointment>>>(`/admin/appointments?${params}`);
    return response.data.data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const response = await axiosInstance.get<ApiResponse<Appointment>>(`/admin/appointments/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: number, status: string, adminNotes?: string): Promise<Appointment> => {
    const response = await axiosInstance.patch<ApiResponse<Appointment>>(`/admin/appointments/${id}/status`, { status, adminNotes });
    return response.data.data;
  },

  update: async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
    const response = await axiosInstance.put<ApiResponse<Appointment>>(`/admin/appointments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/appointments/${id}`);
  },
};

// ============ ADMIN DOCTORS ============
export const adminDoctorApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await axiosInstance.get<ApiResponse<Doctor[]>>('/admin/doctors');
    return response.data.data;
  },

  create: async (data: Partial<Doctor>): Promise<Doctor> => {
    const response = await axiosInstance.post<ApiResponse<Doctor>>('/admin/doctors', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Doctor>): Promise<Doctor> => {
    const response = await axiosInstance.put<ApiResponse<Doctor>>(`/admin/doctors/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/doctors/${id}`);
  },
};

// ============ ADMIN SERVICES ============
export const adminServiceApi = {
  getAll: async (): Promise<DentalService[]> => {
    const response = await axiosInstance.get<ApiResponse<DentalService[]>>('/admin/services');
    return response.data.data;
  },

  create: async (data: Partial<DentalService>): Promise<DentalService> => {
    const response = await axiosInstance.post<ApiResponse<DentalService>>('/admin/services', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<DentalService>): Promise<DentalService> => {
    const response = await axiosInstance.put<ApiResponse<DentalService>>(`/admin/services/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/services/${id}`);
  },
};

// ============ ADMIN HOLIDAYS ============
export const adminHolidayApi = {
  getAll: async (): Promise<Holiday[]> => {
    const response = await axiosInstance.get<ApiResponse<Holiday[]>>('/admin/holidays');
    return response.data.data;
  },

  create: async (data: Partial<Holiday>): Promise<Holiday> => {
    const response = await axiosInstance.post<ApiResponse<Holiday>>('/admin/holidays', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Holiday>): Promise<Holiday> => {
    const response = await axiosInstance.put<ApiResponse<Holiday>>(`/admin/holidays/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/holidays/${id}`);
  },
};

// ============ ADMIN GALLERY ============
export const adminGalleryApi = {
  getAll: async (): Promise<GalleryPhoto[]> => {
    const response = await axiosInstance.get<ApiResponse<GalleryPhoto[]>>('/admin/gallery');
    return response.data.data;
  },

  create: async (data: Partial<GalleryPhoto>): Promise<GalleryPhoto> => {
    const response = await axiosInstance.post<ApiResponse<GalleryPhoto>>('/admin/gallery', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<GalleryPhoto>): Promise<GalleryPhoto> => {
    const response = await axiosInstance.put<ApiResponse<GalleryPhoto>>(`/admin/gallery/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/gallery/${id}`);
  },
};

// ============ ADMIN TESTIMONIALS ============
export const adminTestimonialApi = {
  getAll: async (): Promise<Testimonial[]> => {
    const response = await axiosInstance.get<ApiResponse<Testimonial[]>>('/admin/testimonials');
    return response.data.data;
  },

  create: async (data: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await axiosInstance.post<ApiResponse<Testimonial>>('/admin/testimonials', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await axiosInstance.put<ApiResponse<Testimonial>>(`/admin/testimonials/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/testimonials/${id}`);
  },
};

// ============ ADMIN FAQS ============
export const adminFaqApi = {
  getAll: async (): Promise<Faq[]> => {
    const response = await axiosInstance.get<ApiResponse<Faq[]>>('/admin/faqs');
    return response.data.data;
  },

  create: async (data: Partial<Faq>): Promise<Faq> => {
    const response = await axiosInstance.post<ApiResponse<Faq>>('/admin/faqs', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Faq>): Promise<Faq> => {
    const response = await axiosInstance.put<ApiResponse<Faq>>(`/admin/faqs/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/faqs/${id}`);
  },
};

// ============ ADMIN SETTINGS ============
export const adminSettingsApi = {
  getAll: async (): Promise<Record<string, string>> => {
    const response = await axiosInstance.get<ApiResponse<Record<string, string>>>('/admin/settings');
    return response.data.data;
  },

  update: async (settings: Record<string, string>): Promise<void> => {
    await axiosInstance.put('/admin/settings', settings);
  },
};

// ============ ADMIN CONTACT MESSAGES ============
export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const adminContactApi = {
  getAll: async (page = 0, size = 20): Promise<PageResponse<ContactMessage>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<ContactMessage>>>(`/admin/messages?page=${page}&size=${size}`);
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get<ApiResponse<number>>('/admin/messages/unread-count');
    return response.data.data;
  },

  getRecentUnread: async (): Promise<ContactMessage[]> => {
    const response = await axiosInstance.get<ApiResponse<ContactMessage[]>>('/admin/messages/unread');
    return response.data.data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await axiosInstance.patch(`/admin/messages/${id}/read`);
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/messages/${id}`);
  },
};

// ============ FILE UPLOAD ============
export const uploadApi = {
  uploadImage: async (file: File, folder: string = 'general'): Promise<{ url: string; publicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const response = await axiosInstance.post<ApiResponse<{ url: string; publicId: string }>>(
      '/admin/upload/image', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
};
