import type { Holiday } from '@/types';

/**
 * Parse date from backend (handles both string and array format)
 * Backend might return: "2026-08-08" OR [2026, 8, 8]
 */
export function parseBackendDate(date: unknown): Date | null {
  if (!date) return null;
  
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return new Date(year, month - 1, day);
  }
  
  if (typeof date === 'string') {
    // Handle "2026-08-08" or "2026-08-08T00:00:00"
    return new Date(date.split('T')[0]);
  }
  
  if (date instanceof Date) return date;
  
  return null;
}

/**
 * Format date as YYYY-MM-DD (local timezone, not UTC)
 */
export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date falls within any holiday period
 */
export interface HolidayCheckResult {
  isHoliday: boolean;
  holiday?: Holiday;
}

export function checkHoliday(
  dateStr: string, 
  holidays: Holiday[]
): HolidayCheckResult {
  if (!holidays || holidays.length === 0) {
    return { isHoliday: false };
  }
  
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  for (const h of holidays) {
    if (!h.isActive) continue;
    
    const start = parseBackendDate(h.startDate);
    const end = parseBackendDate(h.endDate);
    
    if (!start || !end) continue;
    
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    if (targetDate >= start && targetDate <= end) {
      return { isHoliday: true, holiday: h };
    }
  }
  
  return { isHoliday: false };
}

/**
 * Get all upcoming holidays sorted by start date
 */
export function getSortedUpcomingHolidays(holidays: Holiday[]): Holiday[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return holidays
    .filter(h => {
      if (!h.isActive) return false;
      const end = parseBackendDate(h.endDate);
      return end && end >= today;
    })
    .sort((a, b) => {
      const aStart = parseBackendDate(a.startDate);
      const bStart = parseBackendDate(b.startDate);
      if (!aStart || !bStart) return 0;
      return aStart.getTime() - bStart.getTime();
    });
}

/**
 * Format date range for display: "Aug 8 - Aug 13, 2026"
 */
export function formatHolidayRange(holiday: Holiday): string {
  const start = parseBackendDate(holiday.startDate);
  const end = parseBackendDate(holiday.endDate);
  
  if (!start || !end) return '';
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end.toLocaleDateString('en-US', options);
  const year = end.getFullYear();
  
  // Same day
  if (start.getTime() === end.getTime()) {
    return `${startStr}, ${year}`;
  }
  
  // Same month
  if (start.getMonth() === end.getMonth()) {
    return `${startStr} - ${end.getDate()}, ${year}`;
  }
  
  return `${startStr} - ${endStr}, ${year}`;
}