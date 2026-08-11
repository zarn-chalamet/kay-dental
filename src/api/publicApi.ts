import axiosInstance from './axiosInstance';
import type { Banner, Doctor, DentalService, Testimonial, Faq, GalleryPhoto, Holiday, ClinicSettings } from '@/types';
import { mapClinicSettings } from '@/utils/settingsMapper';
import type { ClinicSettingsRaw } from '@/types';

// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============ BANNERS ============
export const bannerApi = {
  getActive: async (): Promise<Banner[]> => {
    const response = await axiosInstance.get<ApiResponse<Banner[]>>('/banners/active');
    return response.data.data;
  },
};

// ============ DOCTORS ============
export const doctorApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await axiosInstance.get<ApiResponse<Doctor[]>>('/doctors');
    return response.data.data;
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await axiosInstance.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return response.data.data;
  },
};

// ============ SERVICES ============
export const serviceApi = {
  getAll: async (): Promise<DentalService[]> => {
    const response = await axiosInstance.get<ApiResponse<DentalService[]>>('/services');
    return response.data.data;
  },

  getBySlug: async (slug: string): Promise<DentalService> => {
    const response = await axiosInstance.get<ApiResponse<DentalService>>(`/services/${slug}`);
    return response.data.data;
  },

  getByCategory: async (category: string): Promise<DentalService[]> => {
    const response = await axiosInstance.get<ApiResponse<DentalService[]>>(`/services/category/${category}`);
    return response.data.data;
  },
};

// ============ GALLERY ============
export const galleryApi = {
  getAll: async (): Promise<GalleryPhoto[]> => {
    const response = await axiosInstance.get<ApiResponse<GalleryPhoto[]>>('/gallery');
    return response.data.data;
  },

  getByCategory: async (category: string): Promise<GalleryPhoto[]> => {
    const response = await axiosInstance.get<ApiResponse<GalleryPhoto[]>>(`/gallery/category/${category}`);
    return response.data.data;
  },
};

// ============ TESTIMONIALS ============
export const testimonialApi = {
  getAll: async (): Promise<Testimonial[]> => {
    const response = await axiosInstance.get<ApiResponse<Testimonial[]>>('/testimonials');
    return response.data.data;
  },
};

// ============ FAQS ============
export const faqApi = {
  getAll: async (): Promise<Faq[]> => {
    const response = await axiosInstance.get<ApiResponse<Faq[]>>('/faqs');
    return response.data.data;
  },

  getByCategory: async (category: string): Promise<Faq[]> => {
    const response = await axiosInstance.get<ApiResponse<Faq[]>>(`/faqs/category/${category}`);
    return response.data.data;
  },
};

// ============ CLINIC ============
export interface ClinicStatusResponse {
  status: 'OPEN' | 'CLOSED' | 'HOLIDAY';
  message: string;
  opensAt?: string;
  closesAt?: string;
  holidayName?: string;
}

export const clinicApi = {
    getSettings: async (): Promise<ClinicSettings> => {
    const response = await axiosInstance.get<ApiResponse<ClinicSettingsRaw>>('/clinic/settings');
    return mapClinicSettings(response.data.data);
  },

  getStatus: async (): Promise<ClinicStatusResponse> => {
    const response = await axiosInstance.get<ApiResponse<ClinicStatusResponse>>('/clinic/status');
    return response.data.data;
  },
};

// ============ HOLIDAYS ============
export const holidayApi = {
  getActive: async (): Promise<Holiday | null> => {
    const response = await axiosInstance.get<ApiResponse<Holiday | null>>('/holidays/active');
    return response.data.data;
  },

  getUpcoming: async (): Promise<Holiday[]> => {
    const response = await axiosInstance.get<ApiResponse<Holiday[]>>('/holidays/upcoming');
    return response.data.data;
  },

  checkDate: async (date: string): Promise<{ isHoliday: boolean; holiday: Holiday | null }> => {
    const response = await axiosInstance.get<ApiResponse<{ isHoliday: boolean; holiday: Holiday | null }>>(`/holidays/check?date=${date}`);
    return response.data.data;
  },
};

// ============ APPOINTMENTS ============
export interface AppointmentRequest {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  serviceId: number;
  doctorId?: number;
  appointmentDate: string;
  appointmentTime: string;
  isNewPatient: boolean;
  notes?: string;
}

export const appointmentApi = {
  create: async (data: AppointmentRequest): Promise<{ id: number }> => {
    const response = await axiosInstance.post<ApiResponse<{ id: number }>>('/appointments', data);
    return response.data.data;
  },

  track: async (phone: string): Promise<unknown[]> => {
    const response = await axiosInstance.get<ApiResponse<unknown[]>>(`/appointments/track?phone=${phone}`);
    return response.data.data;
  },

  getAvailableSlots: async (doctorId: number | null, date: string): Promise<string[]> => {
    const params = doctorId ? `doctorId=${doctorId}&date=${date}` : `date=${date}`;
    const response = await axiosInstance.get<ApiResponse<string[]>>(`/appointments/available-slots?${params}`);
    return response.data.data;
  },
};

// ============ CONTACT ============
export interface ContactRequest {
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
}

export const contactApi = {
  send: async (data: ContactRequest): Promise<{ id: number }> => {
    const response = await axiosInstance.post<ApiResponse<{ id: number }>>('/contact', data);
    return response.data.data;
  },
};
