import { Link } from 'react-router-dom';
import { Bell, Calendar, MessageSquare, Clock, CheckCheck } from 'lucide-react';
import { useRecentNotifications } from '@/hooks/useAdminData';

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  totalCount: number;
}

// Format relative time (e.g., "2m ago", "1h ago")
const formatRelativeTime = (date: string): string => {
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
    return then.toLocaleDateString();
  } catch {
    return '';
  }
};

export default function NotificationDropdown({
  isOpen,
  onToggle,
  onClose,
  totalCount,
}: NotificationDropdownProps) {
  const { data: notifications = [] } = useRecentNotifications();

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={onToggle}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {totalCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for closing */}
          <div className="fixed inset-0 z-30" onClick={onClose} />

          {/* Mobile: Full screen bottom sheet | Desktop: Dropdown */}
          <div
            className="
              fixed inset-x-0 top-16 z-40 mx-2 sm:mx-4
              sm:absolute sm:right-0 sm:left-auto sm:top-auto sm:inset-x-auto sm:mx-0 sm:mt-2 sm:w-96
              rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden
              max-h-[calc(100vh-5rem)] flex flex-col
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Notifications
                </h3>
                {totalCount > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {totalCount} new {totalCount === 1 ? 'item' : 'items'}
                  </p>
                )}
              </div>
              {totalCount > 0 && (
                <div className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live
                </div>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                    <CheckCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    All caught up!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    No new notifications
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif) => {
                    const Icon =
                      notif.type === 'appointment' ? Calendar : MessageSquare;
                    const iconBg =
                      notif.type === 'appointment'
                        ? 'bg-blue-100'
                        : 'bg-purple-100';
                    const iconColor =
                      notif.type === 'appointment'
                        ? 'text-blue-600'
                        : 'text-purple-600';

                    return (
                      <Link
                        key={notif.id}
                        to={notif.link}
                        onClick={onClose}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                        >
                          <Icon className={`w-4 h-4 ${iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              {notif.title}
                            </p>
                            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                          </div>
                          <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">
                            {notif.description}
                          </p>
                          <p className="mt-1 text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(notif.time)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-2 shrink-0">
                <div className="grid grid-cols-2 gap-1">
                  <Link
                    to="/admin/appointments"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-white hover:text-green-700 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Appointments
                  </Link>
                  <Link
                    to="/admin/messages"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-white hover:text-green-700 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Messages
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}