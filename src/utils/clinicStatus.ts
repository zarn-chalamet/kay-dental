import type { ClinicStatus, DaySchedule } from '@/types';
import { CLINIC_INFO } from '@/constants/clinicInfo';
import { mockHolidays } from '@/data/mockData';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getClinicStatus(): { status: ClinicStatus; message: string; messageMm: string } {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Check holidays
  for (const holiday of mockHolidays) {
    if (holiday.isActive && todayStr >= holiday.startDate && todayStr <= holiday.endDate) {
      return { status: 'HOLIDAY', message: `Holiday: ${holiday.nameEn}`, messageMm: `ရုံးပိတ်ရက်: ${holiday.nameMm}` };
    }
  }

  const dayName = dayNames[now.getDay()];
  const schedule = CLINIC_INFO.openingHours.find((d: DaySchedule) => d.day === dayName);

  if (!schedule || schedule.isClosed) {
    return { status: 'CLOSED', message: 'Closed Today', messageMm: 'ယနေ့ ပိတ်ပါသည်' };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = schedule.open.split(':').map(Number);
  const [closeH, closeM] = schedule.close.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return { status: 'OPEN', message: `Open until ${schedule.close}`, messageMm: `${schedule.close} ထိ ဖွင့်ပါသည်` };
  }

  return { status: 'CLOSED', message: `Closed. Opens ${schedule.open}`, messageMm: `ပိတ်ပါသည်။ ${schedule.open} ဖွင့်ပါမည်` };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-MM').format(price) + ' MMK';
}

export function formatPhone(phone: string): string {
  return phone.replace(/\s/g, '');
}
