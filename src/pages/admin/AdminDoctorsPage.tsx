import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  X,
  Grid3x3,
  List,
  Award,
  Calendar,
  Clock,
  Filter,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminDoctors } from '@/hooks/useAdminData';
import { adminDoctorApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import DoctorFormModal from '@/components/admin/DoctorFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Doctor } from '@/types';
import toast from 'react-hot-toast';
import { formatTime } from '@/utils/formatters';

type ViewMode = 'grid' | 'table';
type FilterStatus = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function AdminDoctorsPage() {
  const queryClient = useQueryClient();
  const { data: doctors = [], isLoading } = useAdminDoctors();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter doctors
  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      if (filterStatus === 'ACTIVE' && !d.isActive) return false;
      if (filterStatus === 'INACTIVE' && d.isActive) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.nameEn?.toLowerCase().includes(q) ||
        d.nameMm?.toLowerCase().includes(q) ||
        d.specialtyEn?.toLowerCase().includes(q) ||
        d.specialtyMm?.toLowerCase().includes(q) ||
        d.title?.toLowerCase().includes(q)
      );
    });
  }, [doctors, searchQuery, filterStatus]);

  const activeCount = doctors.filter((d) => d.isActive).length;
  const inactiveCount = doctors.length - activeCount;

  const handleAdd = () => {
    setSelectedDoctor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDoctor?.id) return;

    setIsDeleting(true);
    try {
      await adminDoctorApi.delete(selectedDoctor.id);
      toast.success('Doctor deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete doctor');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading doctors..." />;

  const filterButtons: { value: FilterStatus; label: string; count: number }[] = [
    { value: 'ALL', label: 'All', count: doctors.length },
    { value: 'ACTIVE', label: 'Active', count: activeCount },
    { value: 'INACTIVE', label: 'Inactive', count: inactiveCount },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Manage your clinic's dental specialists.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {/* ============ COMPACT STATS (3-column always) ============ */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {doctors.length}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Total
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <Award className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {activeCount}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Active
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Users className="w-4 h-4 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {inactiveCount}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Inactive
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TOOLBAR ============ */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3 sm:p-4 mb-4 space-y-3">
        {/* Row 1: Search + View Toggle (both visible on mobile now) */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle - NOW VISIBLE ON MOBILE TOO */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-gray-100 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mr-0.5">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filter:</span>
          </div>
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilterStatus(btn.value)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === btn.value
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {btn.label}
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold ${
                  filterStatus === btn.value
                    ? 'bg-white/25 text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ============ EMPTY STATE ============ */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {searchQuery || filterStatus !== 'ALL'
              ? 'No doctors match your filters'
              : 'No doctors yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding your first doctor.'}
          </p>
          {searchQuery || filterStatus !== 'ALL' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('ALL');
              }}
              className="mt-4 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Doctor
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ============ GRID VIEW ============ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((doctor, i) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Photo */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {doctor.photoUrl ? (
                  <img
                    src={doctor.photoUrl}
                    alt={doctor.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                    <span className="text-5xl font-bold text-green-700">
                      {doctor.nameEn?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur ${
                      doctor.isActive
                        ? 'bg-green-100/95 text-green-700'
                        : 'bg-gray-100/95 text-gray-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        doctor.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    {doctor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Actions overlay - Always visible on mobile, hover on desktop */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(doctor)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 backdrop-blur text-blue-600 hover:bg-white shadow-sm transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(doctor)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 backdrop-blur text-red-600 hover:bg-white shadow-sm transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">
                  {doctor.nameEn}
                </h3>
                {doctor.title && (
                  <p className="text-xs text-green-600 font-semibold mt-0.5">
                    {doctor.title}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">
                  {doctor.specialtyEn}
                </p>

                {/* Meta */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {doctor.experienceYears || 0}y
                  </span>
                  {doctor.availableFrom && doctor.availableTo && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(doctor.availableFrom)}-{formatTime(doctor.availableTo)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* ============ TABLE/LIST VIEW ============ */
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Specialty
                    </th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((doctor, i) => (
                    <motion.tr
                      key={doctor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {doctor.photoUrl ? (
                            <img
                              src={doctor.photoUrl}
                              alt={doctor.nameEn}
                              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700 font-bold shadow-sm">
                              {doctor.nameEn?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {doctor.nameEn}
                            </div>
                            {doctor.title && (
                              <div className="text-xs text-green-600 font-medium mt-0.5">
                                {doctor.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                          {doctor.specialtyEn}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <Award className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-semibold">
                            {doctor.experienceYears || 0}
                          </span>{' '}
                          years
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {doctor.availableFrom && doctor.availableTo ? (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-600 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {formatTime(doctor.availableFrom)} - {formatTime(doctor.availableTo)}
                            </div>
                            {doctor.availableDays && (
                              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                {doctor.availableDays.replace(/,/g, ', ')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            doctor.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              doctor.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          {doctor.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(doctor)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(doctor)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile List (Compact Cards) */}
          <div className="md:hidden space-y-2">
            {filtered.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  {doctor.photoUrl ? (
                    <img
                      src={doctor.photoUrl}
                      alt={doctor.nameEn}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-green-700 font-bold shadow-sm shrink-0">
                      {doctor.nameEn?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {doctor.nameEn}
                        </h3>
                        {doctor.title && (
                          <p className="text-xs text-green-600 font-medium mt-0.5">
                            {doctor.title}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                          doctor.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            doctor.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        {doctor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {doctor.specialtyEn}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {doctor.experienceYears || 0}y
                      </span>
                      {doctor.availableFrom && doctor.availableTo && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(doctor.availableFrom)}-{formatTime(doctor.availableTo)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(doctor)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(doctor)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <DoctorFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        doctor={selectedDoctor}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        message={`Are you sure you want to delete Dr. ${selectedDoctor?.nameEn}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}