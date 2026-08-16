import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Stethoscope,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  CalendarDays,
  UserCheck,
  CalendarClock,
  Mail,
  ArrowRight,
  Activity,
  Bell,
  MessageSquare,
  Plus,
  Sparkles,
  TrendingUp,
  Phone,
} from 'lucide-react';
import {
  useDashboardStats,
  useAdminAppointments,
} from '@/hooks/useAdminData';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuthStore } from '@/store/useAuthStore';
import { formatTime } from '@/utils/formatters';

const statusConfig: Record<string, { icon: React.ReactNode; bg: string; dot: string; label: string }> = {
  PENDING: {
    icon: <Clock className="w-3 h-3" />,
    bg: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500',
    label: 'Pending',
  },
  CONFIRMED: {
    icon: <CheckCircle className="w-3 h-3" />,
    bg: 'bg-green-100 text-green-700',
    dot: 'bg-green-500',
    label: 'Confirmed',
  },
  COMPLETED: {
    icon: <CheckCircle className="w-3 h-3" />,
    bg: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    label: 'Completed',
  },
  CANCELLED: {
    icon: <XCircle className="w-3 h-3" />,
    bg: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    label: 'Cancelled',
  },
  NO_SHOW: {
    icon: <AlertCircle className="w-3 h-3" />,
    bg: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-500',
    label: 'No Show',
  },
};

// Helper to get greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Helper to format date safely
const formatAppointmentDate = (dateStr: unknown): string => {
  if (!dateStr) return '';
  const str = typeof dateStr === 'string' ? dateStr : Array.isArray(dateStr) ? 
    `${dateStr[0]}-${String(dateStr[1]).padStart(2, '0')}-${String(dateStr[2]).padStart(2, '0')}` : 
    String(dateStr);
  
  try {
    const date = new Date(str);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return str;
  }
};

// Helper: is date today?
const isToday = (dateStr: unknown): boolean => {
  if (!dateStr) return false;
  const str = typeof dateStr === 'string' ? dateStr : Array.isArray(dateStr) ? 
    `${dateStr[0]}-${String(dateStr[1]).padStart(2, '0')}-${String(dateStr[2]).padStart(2, '0')}` : 
    String(dateStr);
  
  try {
    return new Date(str).toDateString() === new Date().toDateString();
  } catch {
    return false;
  }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: appointmentsData, isLoading: appointmentsLoading } = useAdminAppointments({ size: 10 });

  const appointments = appointmentsData?.content ?? [];

  // Today's appointments (from recent data)
  const todaysAppointments = useMemo(() => {
    return appointments
      .filter((a) => isToday(a.appointmentDate))
      .filter((a) => a.status === 'CONFIRMED' || a.status === 'PENDING')
      .slice(0, 3);
  }, [appointments]);

  // Current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (statsLoading || appointmentsLoading) return <LoadingSpinner label="Loading dashboard..." />;

  const pendingCount = stats?.pendingAppointments ?? 0;
  const unreadMessages = stats?.unreadMessages ?? 0;
  const attentionCount = pendingCount + unreadMessages;

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* ============ WELCOME HEADER ============ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-600 to-green-700 p-5 sm:p-6 text-white shadow-lg"
      >
        {/* Decorative blobs */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-green-400/30 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-semibold uppercase tracking-wider text-green-100">
                {currentDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              {getGreeting()}, {user?.username || 'admin'}! 👋
            </h1>
            <p className="mt-1 text-sm text-green-50">
              {attentionCount > 0 ? (
                <>
                  You have <strong>{attentionCount}</strong> {attentionCount === 1 ? 'item' : 'items'} that need attention.
                </>
              ) : (
                <>All caught up! Great work today. 🎉</>
              )}
            </p>
          </div>

          {/* Quick book button */}
          <button
            onClick={() => navigate('/admin/appointments')}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:bg-yellow-300 hover:shadow-md active:scale-95 shrink-0"
          >
            <Calendar className="w-4 h-4" />
            View Appointments
          </button>
        </div>
      </motion.div>

      {/* ============ ATTENTION NEEDED (only show if there are items) ============ */}
      {attentionCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-red-100 bg-gradient-to-br from-red-50 to-white p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100">
                <Bell className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  Needs Your Attention
                </h2>
                <p className="text-xs text-gray-500">
                  {attentionCount} {attentionCount === 1 ? 'item requires' : 'items require'} action
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingCount > 0 && (
              <button
                onClick={() => navigate('/admin/appointments')}
                className="group flex items-center gap-3 rounded-xl bg-white border border-yellow-200 p-3 hover:border-yellow-400 hover:shadow-md transition-all text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 font-bold text-sm">
                  {pendingCount}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    Pending Appointments
                  </p>
                  <p className="text-xs text-gray-500">Review and confirm</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" />
              </button>
            )}

            {unreadMessages > 0 && (
              <button
                onClick={() => navigate('/admin/messages')}
                className="group flex items-center gap-3 rounded-xl bg-white border border-blue-200 p-3 hover:border-blue-400 hover:shadow-md transition-all text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-sm">
                  {unreadMessages}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    Unread Messages
                  </p>
                  <p className="text-xs text-gray-500">Read and reply</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ============ STATS GRID ============ */}
      <div>
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {[
            {
              label: 'Total Appts',
              value: stats?.totalAppointments ?? 0,
              icon: Calendar,
              bg: 'bg-blue-100',
              text: 'text-blue-600',
              path: '/admin/appointments',
            },
            {
              label: 'Today',
              value: stats?.todayAppointments ?? 0,
              icon: CalendarDays,
              bg: 'bg-green-100',
              text: 'text-green-600',
              path: '/admin/appointments',
            },
            {
              label: 'Pending',
              value: stats?.pendingAppointments ?? 0,
              icon: CalendarClock,
              bg: 'bg-yellow-100',
              text: 'text-yellow-600',
              path: '/admin/appointments',
              highlight: (stats?.pendingAppointments ?? 0) > 0,
            },
            {
              label: 'Patients',
              value: stats?.totalPatients ?? 0,
              icon: UserCheck,
              bg: 'bg-purple-100',
              text: 'text-purple-600',
            },
            {
              label: 'This Month',
              value: stats?.appointmentsThisMonth ?? 0,
              icon: TrendingUp,
              bg: 'bg-cyan-100',
              text: 'text-cyan-600',
            },
            {
              label: 'Messages',
              value: stats?.unreadMessages ?? 0,
              icon: Mail,
              bg: 'bg-rose-100',
              text: 'text-rose-600',
              path: '/admin/messages',
              highlight: (stats?.unreadMessages ?? 0) > 0,
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            const Wrapper = stat.path ? 'button' : 'div';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Wrapper
                  onClick={stat.path ? () => navigate(stat.path!) : undefined}
                  className={`w-full text-left rounded-xl border bg-white p-3 shadow-sm transition-all ${
                    stat.path
                      ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                      : ''
                  } ${
                    stat.highlight
                      ? 'border-yellow-200 ring-1 ring-yellow-100'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg ${stat.bg}`}
                    >
                      <Icon className={`w-4 h-4 ${stat.text}`} />
                    </div>
                    {stat.highlight && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                      {stat.label}
                    </div>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ============ TWO-COLUMN LAYOUT ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* ============ RECENT APPOINTMENTS (2 cols) ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600" />
                Recent Appointments
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Latest {appointments.length} bookings
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/appointments')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left px-6 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="text-left px-6 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="text-left px-6 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="text-left px-6 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                        <Calendar className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        No appointments yet
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        New bookings will appear here
                      </p>
                    </td>
                  </tr>
                ) : (
                  appointments.slice(0, 5).map((appt, i) => {
                    const config = statusConfig[appt.status] ?? statusConfig.PENDING;
                    return (
                      <motion.tr
                        key={appt.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.03 }}
                        onClick={() => navigate('/admin/appointments')}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-xs shadow-sm">
                              {appt.patientName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {appt.patientName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {appt.patientPhone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <p className="text-sm text-gray-700 truncate max-w-[180px]">
                            {appt.service?.nameEn ?? '—'}
                          </p>
                        </td>
                        <td className="px-6 py-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatAppointmentDate(appt.appointmentDate)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(appt.appointmentTime)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                            {config.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-50">
            {appointments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  No appointments yet
                </p>
              </div>
            ) : (
              appointments.slice(0, 5).map((appt, i) => {
                const config = statusConfig[appt.status] ?? statusConfig.PENDING;
                return (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.03 }}
                    onClick={() => navigate('/admin/appointments')}
                    className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm shadow-sm">
                        {appt.patientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {appt.patientName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {appt.service?.nameEn ?? '—'}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${config.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                            {config.label}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatAppointmentDate(appt.appointmentDate)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(appt.appointmentTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* ============ TODAY'S SCHEDULE + QUICK ACTIONS (1 col) ============ */}
        <div className="space-y-5 sm:space-y-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-green-600" />
                Today's Schedule
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {todaysAppointments.length > 0
                  ? `${todaysAppointments.length} upcoming today`
                  : 'No appointments today'}
              </p>
            </div>

            <div className="p-4 sm:p-5">
              {todaysAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Free day! 🎉
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {todaysAppointments.map((appt, i) => {
                    const config = statusConfig[appt.status] ?? statusConfig.PENDING;
                    return (
                      <motion.div
                        key={appt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.05 }}
                        onClick={() => navigate('/admin/appointments')}
                        className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 border border-green-100 px-2 py-1.5 shrink-0 min-w-[52px]">
                          <span className="text-[10px] font-bold text-green-700 uppercase leading-none">
                            {formatTime(appt.appointmentTime).split(' ')[1] || 'AM'}
                          </span>
                          <span className="text-sm font-bold text-green-900 leading-tight">
                            {formatTime(appt.appointmentTime).split(' ')[0]}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {appt.patientName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {appt.service?.nameEn ?? 'Service'}
                          </p>
                        </div>

                        <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${config.bg}`}>
                          {config.label}
                        </span>
                      </motion.div>
                    );
                  })}

                  <button
                    onClick={() => navigate('/admin/appointments')}
                    className="w-full mt-2 py-2 rounded-lg text-xs font-semibold text-green-600 hover:bg-green-50 transition-colors"
                  >
                    View Full Schedule →
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
          >
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                Quick Actions
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Jump to common tasks
              </p>
            </div>

            <div className="p-3 grid grid-cols-2 gap-2">
              {[
                {
                  label: 'Doctors',
                  icon: Users,
                  path: '/admin/doctors',
                  bg: 'bg-green-50 hover:bg-green-100 text-green-700',
                },
                {
                  label: 'Services',
                  icon: Stethoscope,
                  path: '/admin/services',
                  bg: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
                },
                {
                  label: 'Messages',
                  icon: MessageSquare,
                  path: '/admin/messages',
                  bg: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
                },
                {
                  label: 'Holidays',
                  icon: CalendarClock,
                  path: '/admin/holidays',
                  bg: 'bg-orange-50 hover:bg-orange-100 text-orange-700',
                },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    onClick={() => navigate(action.path)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${action.bg}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{action.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}