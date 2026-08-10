import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock, CheckCircle, XCircle, AlertCircle, Search,
  Calendar, Phone, Eye, ChevronLeft, ChevronRight,
  UserCheck, X, FilterX,
} from 'lucide-react';
import { useAdminAppointments, useAdminDoctors } from '@/hooks/useAdminData';
import type { Appointment } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppointmentDetailModal from '@/components/admin/AppointmentDetailModal';

const statusConfig: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
  PENDING:   { bg: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" />,        label: 'Pending' },
  CONFIRMED: { bg: 'bg-green-100 text-green-700',   icon: <CheckCircle className="w-3.5 h-3.5" />,  label: 'Confirmed' },
  COMPLETED: { bg: 'bg-blue-100 text-blue-700',     icon: <CheckCircle className="w-3.5 h-3.5" />,  label: 'Completed' },
  CANCELLED: { bg: 'bg-red-100 text-red-700',       icon: <XCircle className="w-3.5 h-3.5" />,      label: 'Cancelled' },
  NO_SHOW:   { bg: 'bg-gray-100 text-gray-700',     icon: <AlertCircle className="w-3.5 h-3.5" />, label: 'No Show' },
};

const STATUS_FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

// Helper to format dates safely
const formatDate = (date: unknown): string => {
  if (!date) return '-';
  if (typeof date === 'string') return date.split('T')[0];
  if (Array.isArray(date)) {
    const [y, m, d] = date;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return String(date);
};

const formatTime = (time: unknown): string => {
  if (!time) return '-';
  if (typeof time === 'string') return time.substring(0, 5);
  return String(time);
};

// Quick date shortcuts
const getDateShortcut = (type: 'today' | 'tomorrow' | 'week'): string => {
  const date = new Date();
  if (type === 'tomorrow') date.setDate(date.getDate() + 1);
  if (type === 'week') date.setDate(date.getDate() + 7);
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

  if (isLoading) return <LoadingSpinner />;

  const appointments: Appointment[] = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  // Client-side search filter (on top of server filters)
  const filtered = appointments.filter((a) =>
    !search ||
    a.patientName.toLowerCase().includes(search.toLowerCase()) ||
    a.patientPhone.includes(search)
  );

  // Stats for status buttons (from current page)
  const statusCounts: Record<string, number> = {
    PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0, NO_SHOW: 0,
  };
  appointments.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });

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

  // Check if any filter is active
  const hasActiveFilters = 
    filterStatus !== 'ALL' || 
    filterDoctor !== 'ALL' || 
    dateFilter !== '' || 
    search !== '';

  // Get selected doctor for badge display
  const selectedDoctorObj = doctors.find(d => d.id === filterDoctor);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalElements} total appointments
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card p-4 mb-6 space-y-4">
        
        {/* Row 1: Search + Doctor + Date */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Search - takes more space */}
          <div className="relative lg:col-span-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Doctor Filter */}
          <div className="relative lg:col-span-4">
            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterDoctor}
              onChange={(e) => {
                const val = e.target.value;
                setFilterDoctor(val === 'ALL' ? 'ALL' : Number(val));
                setPage(0);
              }}
              className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none appearance-none bg-white cursor-pointer"
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
          <div className="relative lg:col-span-3">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-primary-500 outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Row 2: Quick Date Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500">Quick:</span>
          <button
            onClick={() => {
              setDateFilter(getDateShortcut('today'));
              setPage(0);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              dateFilter === getDateShortcut('today')
                ? 'bg-primary-100 text-primary-700'
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
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              dateFilter === getDateShortcut('tomorrow')
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tomorrow
          </button>
          {/* <button
            onClick={() => {
              setDateFilter(getDateShortcut('week'));
              setPage(0);
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              dateFilter === getDateShortcut('week')
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Next 7 Days
          </button> */}
        </div>

        {/* Row 3: Status filter pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {STATUS_FILTERS.map((status) => {
            const count = status === 'ALL' ? totalElements : statusCounts[status] || 0;
            const config = statusConfig[status];
            return (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setPage(0);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config?.icon}
                {status === 'ALL' ? 'All' : config?.label}
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                    filterStatus === status ? 'bg-white/20' : 'bg-white'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary + Clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500">Active filters:</span>
              
              {filterStatus !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-primary-50 text-primary-700 font-medium">
                  Status: {statusConfig[filterStatus]?.label}
                  <button 
                    onClick={() => { setFilterStatus('ALL'); setPage(0); }}
                    className="hover:bg-primary-100 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterDoctor !== 'ALL' && selectedDoctorObj && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-purple-50 text-purple-700 font-medium">
                  Doctor: {selectedDoctorObj.nameEn}
                  <button 
                    onClick={() => { setFilterDoctor('ALL'); setPage(0); }}
                    className="hover:bg-purple-100 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {dateFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700 font-medium">
                  Date: {dateFilter}
                  <button 
                    onClick={() => { setDateFilter(''); setPage(0); }}
                    className="hover:bg-blue-100 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-amber-50 text-amber-700 font-medium">
                  Search: "{search}"
                  <button 
                    onClick={() => setSearch('')}
                    className="hover:bg-amber-100 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors shrink-0"
            >
              <FilterX className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium">No appointments found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50"
                      >
                        <FilterX className="w-3.5 h-3.5" />
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((appt, i) => {
                  const config = statusConfig[appt.status];
                  return (
                    <motion.tr
                      key={appt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleView(appt)}
                    >
                      {/* Patient */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {appt.patientName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                              {appt.patientName}
                              {appt.isNewPatient && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
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
                          {appt.service?.nameEn || '-'}
                        </div>
                        {appt.service && (
                          <div className="text-xs text-gray-500">
                            {appt.service.durationMinutes} min
                          </div>
                        )}
                      </td>

                      {/* Doctor */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {appt.doctor?.nameEn || (
                            <span className="text-gray-400 italic">Any</span>
                          )}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-900 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(appt.appointmentDate)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatTime(appt.appointmentTime)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config?.bg}`}>
                          {config?.icon}
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page + 1} of {totalPages} · {totalElements} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AppointmentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}