export interface Banner {
  id?: number;
  titleEn: string;
  titleMm?: string;
  messageEn?: string;
  messageMm?: string;
  imageUrl?: string;
  buttonTextEn?: string;
  buttonTextMm?: string;
  buttonLink?: string;
  type: 'GENERAL' | 'PROMOTION' | 'ANNOUNCEMENT' | 'HOLIDAY';
  displayOrder?: number;
  startDate?: string | null;
  endDate?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id: number;
  nameEn: string;
  nameMm: string;
  title: string;
  specialtyEn: string;
  specialtyMm: string;
  bioEn: string;
  bioMm: string;
  qualifications: string;
  experienceYears: number;
  photoUrl: string;
  availableDays: string;
  availableFrom: string;
  availableTo: string;
  languages: string;
  displayOrder: number;
  isActive: boolean;
}

export interface DentalService {
  id?: number;
  nameEn: string;
  nameMm?: string;
  slug?: string;
  shortDescriptionEn: string;
  shortDescriptionMm?: string;
  fullDescriptionEn?: string;
  fullDescriptionMm?: string;
  startingPrice: number;
  durationMinutes: number;
  category: 'GENERAL' | 'COSMETIC' | 'ORTHODONTICS' | 'SURGERY' | 'PEDIATRIC' | 'EMERGENCY';
  iconName?: string;
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  serviceId: number;
  doctorId: number | null;
  appointmentDate: string;
  appointmentTime: string;
  isNewPatient: boolean;
  notes: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  adminNotes: string;
  createdAt: string;
}

export interface Holiday {
  id?: number;
  nameEn: string;
  nameMm?: string;
  startDate: string;
  endDate: string;
  reopenDate?: string;
  greetingEn?: string;
  greetingMm?: string;
  bannerStyle?: string;
  theme: string;
  notifyDaysBefore?: number;
  showEmergencyContact?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryPhoto {
  id: number;
  titleEn: string;
  titleMm: string;
  descriptionEn: string;
  descriptionMm: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: 'CLINIC' | 'BEFORE_AFTER' | 'TEAM' | 'EQUIPMENT' | 'EVENT';
  displayOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id?: number;
  patientName: string;
  treatment?: string;
  reviewEn?: string;
  reviewMm?: string;
  rating?: number;
  photoUrl?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Faq {
  id?: number;
  questionEn: string;
  questionMm?: string;
  answerEn: string;
  answerMm?: string;
  category: 'GENERAL' | 'TREATMENT' | 'PAYMENT' | 'EMERGENCY' | 'BOOKING';
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
}

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

export interface ClinicSettings {
  clinicNameEn: string;
  clinicNameMm: string;
  addressEn: string;
  addressMm: string;
  phone1: string;
  phone2: string;
  email: string;
  viberNumber: string;
  messengerLink: string;
  googleMapsEmbedUrl: string;
  googleMapsLink: string;
  openingHours: DaySchedule[];
  emergencyPhone: string;
  emergencyAvailable: boolean;
}

export interface DaySchedule {
  day: string;
  dayMm: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export type ClinicStatus = 'OPEN' | 'CLOSED' | 'HOLIDAY';
