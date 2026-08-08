import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Stethoscope, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle 
} from 'lucide-react';
import { 
  useDashboardStats, 
  useAdminAppointments, 
  useAdminDoctors, 
  useAdminServices 
} from '@/hooks/useAdminData';
import LoadingSpinner from '@/components/LoadingSpinner';

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
  CONFIRMED: <CheckCircle className="w-4 h-4 text-green-500" />,
  COMPLETED: <CheckCircle className="w-4 h-4 text-blue-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
  NO_SHOW: <AlertCircle className="w-4 h-4 text-gray-500" />,
};

const statusBg: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-gray-100 text-gray-700',
};

export default function DashboardPage() {
  // Fetch data from API
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: appointmentsData, isLoading: appointmentsLoading } = useAdminAppointments({ size: 10 });
  const { data: doctors = [], isLoading: doctorsLoading } = useAdminDoctors();
  const { data: services = [], isLoading: servicesLoading } = useAdminServices();

  const isLoading = statsLoading || appointmentsLoading || doctorsLoading || servicesLoading;

  if (isLoading) return <LoadingSpinner />;

  const appointments = appointmentsData?.content || [];

  const stats = [
    { 
      label: 'Total Appointments', 
      value: dashboardStats?.totalAppointments ?? appointments.length, 
      icon: <Calendar className="w-5 h-5" />, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      label: 'Pending', 
      value: dashboardStats?.pendingAppointments ?? appointments.filter(a => a.status === 'PENDING').length, 
      icon: <Clock className="w-5 h-5" />, 
      color: 'bg-yellow-100 text-yellow-600' 
    },
    { 
      label: 'Doctors', 
      value: doctors.length, 
      icon: <Users className="w-5 h-5" />, 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      label: 'Services', 
      value: services.length, 
      icon: <Stethoscope className="w-5 h-5" />, 
      color: 'bg-purple-100 text-purple-600' 
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            Recent Appointments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => {
                  const service = services.find(s => s.id === appt.serviceId);
                  return (
                    <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 text-sm">{appt.patientName}</div>
                        <div className="text-xs text-gray-500">{appt.patientPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{service?.nameEn || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{appt.appointmentDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{appt.appointmentTime}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBg[appt.status]}`}>
                          {statusIcons[appt.status]}
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}