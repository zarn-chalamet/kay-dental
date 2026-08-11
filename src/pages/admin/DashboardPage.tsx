import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import {
  useDashboardStats,
  useAdminAppointments,
} from '@/hooks/useAdminData';
import LoadingSpinner from '@/components/LoadingSpinner';

const statusConfig: Record<string, { icon: React.ReactNode; bg: string; dot: string }> = {
  PENDING: {
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-400',
  },
  CONFIRMED: {
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-400',
  },
  COMPLETED: {
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dot: 'bg-blue-400',
  },
  CANCELLED: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    bg: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    dot: 'bg-red-400',
  },
  NO_SHOW: {
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    bg: 'bg-gray-50 text-gray-600 ring-1 ring-gray-200',
    dot: 'bg-gray-400',
  },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: appointmentsData, isLoading: appointmentsLoading } = useAdminAppointments({ size: 5 });

  if (statsLoading || appointmentsLoading) return <LoadingSpinner />;

  const appointments = appointmentsData?.content ?? [];

  const statCards = [
    {
      label: 'Total Appointments',
      value: stats?.totalAppointments ?? 0,
      icon: <Calendar className="w-5 h-5" />,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      lightText: 'text-blue-600',
    },
    {
      label: 'Today',
      value: stats?.todayAppointments ?? 0,
      icon: <CalendarDays className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      lightText: 'text-emerald-600',
    },
    {
      label: 'Pending',
      value: stats?.pendingAppointments ?? 0,
      icon: <CalendarClock className="w-5 h-5" />,
      gradient: 'from-amber-500 to-amber-600',
      lightBg: 'bg-amber-50',
      lightText: 'text-amber-600',
    },
    {
      label: 'Total Patients',
      value: stats?.totalPatients ?? 0,
      icon: <UserCheck className="w-5 h-5" />,
      gradient: 'from-violet-500 to-violet-600',
      lightBg: 'bg-violet-50',
      lightText: 'text-violet-600',
    },
    {
      label: 'This Month',
      value: stats?.appointmentsThisMonth ?? 0,
      icon: <Activity className="w-5 h-5" />,
      gradient: 'from-cyan-500 to-cyan-600',
      lightBg: 'bg-cyan-50',
      lightText: 'text-cyan-600',
    },
    {
      label: 'Unread Messages',
      value: stats?.unreadMessages ?? 0,
      icon: <Mail className="w-5 h-5" />,
      gradient: 'from-rose-500 to-rose-600',
      lightBg: 'bg-rose-50',
      lightText: 'text-rose-600',
    },
  ];

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [h, m] = timeStr.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${m} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your dental clinic
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-xl ${stat.lightBg} ${stat.lightText} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Appointments',
            icon: <Calendar className="w-4 h-4" />,
            path: '/admin/appointments',
            color: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
          },
          {
            label: 'Doctors',
            icon: <Users className="w-4 h-4" />,
            path: '/admin/doctors',
            color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100',
          },
          {
            label: 'Services',
            icon: <Stethoscope className="w-4 h-4" />,
            path: '/admin/services',
            color: 'text-violet-600 bg-violet-50 hover:bg-violet-100',
          },
          {
            label: 'Messages',
            icon: <Mail className="w-4 h-4" />,
            path: '/admin/messages',
            color: 'text-rose-600 bg-rose-50 hover:bg-rose-100',
          },
        ].map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${action.color}`}
          >
            {action.icon}
            {action.label}
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-50" />
          </motion.button>
        ))}
      </div>

      {/* Recent Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest {appointments.length} appointments
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/appointments')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No appointments yet</p>
                  </td>
                </tr>
              ) : (
                appointments.map((appt, i) => {
                  const config = statusConfig[appt.status] ?? statusConfig.PENDING;
                  return (
                    <motion.tr
                      key={appt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.03 }}
                      onClick={() => navigate('/admin/appointments')}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                            {appt.patientName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {appt.patientName}
                            </p>
                            <p className="text-xs text-gray-400">{appt.patientPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="text-sm text-gray-700">
                          {appt.service?.nameEn ?? '—'}
                        </p>
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="text-sm text-gray-700">
                          {appt.doctor?.nameEn ?? '—'}
                        </p>
                      </td>
                      <td className="px-6 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(appt.appointmentDate)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTime(appt.appointmentTime)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg}`}
                        >
                          {config.icon}
                          {appt.status}
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
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No appointments yet</p>
            </div>
          ) : (
            appointments.map((appt, i) => {
              const config = statusConfig[appt.status] ?? statusConfig.PENDING;
              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                  onClick={() => navigate('/admin/appointments')}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                        {appt.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {appt.patientName}
                        </p>
                        <p className="text-xs text-gray-400">{appt.patientPhone}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg}`}
                    >
                      {config.icon}
                      {appt.status}
                    </span>
                  </div>

                  <div className="ml-10 space-y-1">
                    <p className="text-xs text-gray-500">
                      {appt.service?.nameEn ?? '—'}
                      {appt.doctor ? ` • ${appt.doctor.nameEn}` : ''}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(appt.appointmentDate)} at{' '}
                      {formatTime(appt.appointmentTime)}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}