/**
 * Format time from "HH:mm:ss" to "HH:mm"
 * Example: "09:00:00" → "09:00"
 */
export const formatTime = (time?: string | null): string => {
  if (!time) return '';
  return time.substring(0, 5);
};

/**
 * Format date from various formats to "YYYY-MM-DD"
 * Handles strings, arrays, and Date objects from backend
 */
export const formatDate = (date: unknown): string => {
  if (!date) return '-';
  if (typeof date === 'string') return date.split('T')[0];
  if (Array.isArray(date)) {
    const [y, m, d] = date;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return String(date);
};

/**
 * Format datetime to readable string
 * Example: "2024-01-15T10:30:00" → "Jan 15, 2024, 10:30 AM"
 */
export const formatDateTime = (dateTime: unknown): string => {
  if (!dateTime) return '-';
  try {
    return new Date(String(dateTime)).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateTime);
  }
};

/**
 * Format relative time (e.g., "2m ago", "1h ago", "Jan 15")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return then.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};