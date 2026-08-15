import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Calendar,
  Phone,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  X,
  FilterX,
  Filter,
  Users,
  CalendarCheck,
} from 'lucide-react';
import { useAdminAppointments, useAdminDoctors } from '@/hooks/useAdminData';
import type { Appointment } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppointmentDetailModal from '@/components/admin/AppointmentDetailModal';
import { formatDate, formatTime } from '@/utils/formatters';

const statusConfig: Record<string, { bg: string; icon: React.ReactNode; label: string; dot: string }> = {
  PENDING:   { bg: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500', icon: <Clock className="w-3 h-3" />,        label: 'Pending' },
  CONFIRMED: { bg: 'bg-green-100 text-green-700',   dot: 'bg-green-500',  icon: <CheckCircle className="w-3 h-3" />,  label: 'Confirmed' },
  COMPLETED: { bg: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',   icon: <CheckCircle className="w-3 h-3" />,  label: 'Completed' },
  CANCELLED: { bg: 'bg-red-100 text-red-700',       dot: 'bg-red-500',    icon: <XCircle className="w-3 h-3" />,      label: 'Cancelled' },
  NO_SHOW:   { bg: 'bg-gray-100 text-gray-700',     dot: 'bg-gray-500',   icon: <AlertCircle className="w-3 h-3" />,  label: 'No Show' },
};

const STATUS_FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

// Quick date shortcuts
const getDateShortcut = (type: 'today' | 'tomorrow'): string => {
  const date = new Date();
  if (type === 'tomorrow') date.setDate(date.getDate() + 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function AdminAppointmentsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDoctor, setFilterDoctor] = useState<number | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data, isLoading } = useAdminAppointments({
    size: 20,
    page,
    status: filterStatus !== 'ALL' ? filterStatus : undefined,
    date: dateFilter || undefined,
    doctorId: filterDoctor !== 'ALL' ? filterDoctor : undefined,
  });

  const { data: doctors = [] } = useAdminDoctors();

  const appointments: Appointment[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Client-side search filter
  const filtered = useMemo(() => {
    return appointments.filter((a) =>
      !search ||
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientPhone.includes(search)
    );
  }, [appointments, search]);

  // Status counts from current page
  const statusCounts: Record<string, number> = {
    PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0, NO_SHOW: 0,
  };
  appointments.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

  // Stats for header cards
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const todayCount = appointments.filter(a => {
    const today = getDateShortcut('today');
    return formatDate(a.appointmentDate) === today;
  }).length;

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailOpen(true);
  };

  const clearAllFilters = () => {
    setFilterStatus('ALL');
    setFilterDoctor('ALL');
    setDateFilter('');
    setSearch('');
    setPage(0);
  };

  const hasActiveFilters =
    filterStatus !== 'ALL' ||
    filterDoctor !== 'ALL' ||
    dateFilter !== '' ||
    search !== '';

  const selectedDoctorObj = doctors.find((d) => d.id === filterDoctor);

  if (isLoading) return <LoadingSpinner label="Loading appointments..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Manage patient bookings and appointment schedules.
          </p>
        </div>
      </div>

      {/* ============ COMPACT STATS ============ */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {totalElements}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Total
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {pendingCount}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Pending
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <CalendarCheck className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {todayCount}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Today
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FILTERS ============ */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3 sm:p-4 mb-4 space-y-3">
        {/* Row 1: Search + Doctor + Date */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative sm:col-span-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Doctor Filter */}
          <div className="relative sm:col-span-4">
            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterDoctor}
              onChange={(e) => {
                const val = e.target.value;
                setFilterDoctor(val === 'ALL' ? 'ALL' : Number(val));
                setPage(0);
              }}
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm text-gray-900 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none cursor-pointer"
            >
              <option value="ALL">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative sm:col-span-3">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(0);
              }}
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer"
            />
          </div>
        </div>

        {/* Row 2: Quick Date Shortcuts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-gray-500 mr-0.5">Quick:</span>
          <button
            onClick={() => {
              setDateFilter(getDateShortcut('today'));
              setPage(0);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              dateFilter === getDateShortcut('today')
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => {
              setDateFilter(getDateShortcut('tomorrow'));
              setPage(0);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              dateFilter === getDateShortcut('tomorrow')
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tomorrow
          </button>
          {dateFilter && (
            <button
              onClick={() => { setDateFilter(''); setPage(0); }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>

        {/* Row 3: Status filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mr-0.5 shrink-0">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Status:</span>
          </div>
          {STATUS_FILTERS.map((status) => {
            const count = status === 'ALL' ? totalElements : statusCounts[status] || 0;
            const config = statusConfig[status];
            const isActive = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setPage(0);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config?.icon}
                {status === 'ALL' ? 'All' : config?.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-gray-500">Active:</span>

              {filterStatus !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-green-50 text-green-700 border border-green-100">
                  {statusConfig[filterStatus]?.label}
                  <button
                    onClick={() => { setFilterStatus('ALL'); setPage(0); }}
                    className="hover:bg-green-100 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterDoctor !== 'ALL' && selectedDoctorObj && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                  {selectedDoctorObj.nameEn}
                  <button
                    onClick={() => { setFilterDoctor('ALL'); setPage(0); }}
                    className="hover:bg-purple-100 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {dateFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                  {dateFilter}
                  <button
                    onClick={() => { setDateFilter(''); setPage(0); }}
                    className="hover:bg-blue-100 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                  "{search}"
                  <button
                    onClick={() => setSearch('')}
                    className="hover:bg-amber-100 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors shrink-0"
            >
              <FilterX className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ============ EMPTY STATE ============ */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            No appointments found
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Appointments from patients will appear here.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-all"
            >
              <FilterX className="w-4 h-4" />
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ============ DESKTOP TABLE ============ */}
          <div className="hidden md:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((appt, i) => {
                    const config = statusConfig[appt.status];
                    return (
                      <motion.tr
                        key={appt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                        className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                        onClick={() => handleView(appt)}
                      >
                        {/* Patient */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm shadow-sm">
                              {appt.patientName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                <span className="truncate">{appt.patientName}</span>
                                {appt.isNewPatient && (
                                  <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] font-bold">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" />
                                {appt.patientPhone}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Service */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {appt.service?.nameEn || <span className="text-gray-400 italic">N/A</span>}
                          </div>
                          {appt.service && (
                            <div className="text-xs text-gray-500 mt-0.5 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {appt.service.durationMinutes} min
                            </div>
                          )}
                        </td>

                        {/* Doctor */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {appt.doctor?.nameEn || (
                              <span className="text-gray-400 italic">Any Available</span>
                            )}
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                            <div>
                              <div className="text-sm text-gray-900 font-medium leading-tight">
                                {formatDate(appt.appointmentDate)}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5 inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(appt.appointmentTime)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config?.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config?.dot}`} />
                            {config?.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(appt);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-600 hover:bg-green-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                <p className="text-xs text-gray-500 font-medium">
                  Page <span className="font-bold text-gray-900">{page + 1}</span> of{' '}
                  <span className="font-bold text-gray-900">{totalPages}</span> · {totalElements} total
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ============ MOBILE LIST ============ */}
          <div className="md:hidden space-y-2">
            {filtered.map((appt, i) => {
              const config = statusConfig[appt.status];
              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  onClick={() => handleView(appt)}
                  className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold shadow-sm">
                      {appt.patientName?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                              {appt.patientName}
                            </h3>
                            {appt.isNewPatient && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[9px] font-bold shrink-0">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {appt.patientPhone}
                          </div>
                        </div>

                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${config?.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${config?.dot}`} />
                          {config?.label}
                        </span>
                      </div>

                      {/* Service */}
                      {appt.service && (
                        <div className="text-xs text-gray-700 mt-2 truncate">
                          <span className="font-medium">{appt.service.nameEn}</span>
                          <span className="text-gray-400"> · {appt.service.durationMinutes}min</span>
                        </div>
                      )}

                      {/* Doctor */}
                      {appt.doctor && (
                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                          Dr. {appt.doctor.nameEn}
                        </div>
                      )}

                      {/* Date & Time */}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {formatDate(appt.appointmentDate)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {formatTime(appt.appointmentTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View button */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(appt);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 mt-4 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">
                  Page <span className="font-bold text-gray-900">{page + 1}</span> of{' '}
                  <span className="font-bold text-gray-900">{totalPages}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail Modal */}
      <AppointmentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}