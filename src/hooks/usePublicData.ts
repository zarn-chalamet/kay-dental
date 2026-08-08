import { useQuery } from '@tanstack/react-query';
import { 
  bannerApi, 
  doctorApi, 
  serviceApi,
  testimonialApi,
  faqApi,
  galleryApi,
  clinicApi,
  holidayApi,
} from '@/api/publicApi';

// ============ BANNERS ============
export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: bannerApi.getActive,   // ← Your API uses getActive
  });
};

// ============ DOCTORS ============
export const useDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: doctorApi.getAll,
  });
};

export const useDoctor = (id: number) => {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorApi.getById(id),
    enabled: !!id,  // Only run if id exists
  });
};

// ============ SERVICES ============
export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: serviceApi.getAll,
  });
};

export const useServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => serviceApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useServicesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['services', 'category', category],
    queryFn: () => serviceApi.getByCategory(category),
    enabled: !!category && category !== 'ALL',
  });
};

// ============ TESTIMONIALS ============
export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialApi.getAll,
  });
};

// ============ FAQS ============
export const useFaqs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: faqApi.getAll,
  });
};

// ============ GALLERY ============
export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: galleryApi.getAll,
  });
};

// ============ CLINIC ============
export const useClinicSettings = () => {
  return useQuery({
    queryKey: ['clinic', 'settings'],
    queryFn: clinicApi.getSettings,
    staleTime: 1000 * 60 * 30,  // 30 min (rarely changes)
  });
};

export const useClinicStatus = () => {
  return useQuery({
    queryKey: ['clinic', 'status'],
    queryFn: clinicApi.getStatus,
    refetchInterval: 1000 * 60,  // Refetch every minute
  });
};

// ============ HOLIDAYS ============
export const useActiveHoliday = () => {
  return useQuery({
    queryKey: ['holiday', 'active'],
    queryFn: holidayApi.getActive,
  });
};

export const useUpcomingHolidays = () => {
  return useQuery({
    queryKey: ['holidays', 'upcoming'],
    queryFn: holidayApi.getUpcoming,
  });
};