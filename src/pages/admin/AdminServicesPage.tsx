import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Search,
  Filter,
  X,
  Grid3x3,
  List,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminServices } from '@/hooks/useAdminData';
import { adminServiceApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import ServiceFormModal from '@/components/admin/ServiceFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { formatPrice } from '@/utils/clinicStatus';
import type { DentalService } from '@/types';
import toast from 'react-hot-toast';

const categoryBg: Record<string, string> = {
  GENERAL: 'bg-blue-100 text-blue-700',
  COSMETIC: 'bg-purple-100 text-purple-700',
  ORTHODONTICS: 'bg-pink-100 text-pink-700',
  SURGERY: 'bg-red-100 text-red-700',
  PEDIATRIC: 'bg-yellow-100 text-yellow-700',
  EMERGENCY: 'bg-orange-100 text-orange-700',
};

const CATEGORIES = ['ALL', 'GENERAL', 'COSMETIC', 'ORTHODONTICS', 'SURGERY', 'PEDIATRIC', 'EMERGENCY'];

type ViewMode = 'grid' | 'table';

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const { data: services = [], isLoading } = useAdminServices();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DentalService | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter services
  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.nameEn?.toLowerCase().includes(q) ||
        s.nameMm?.toLowerCase().includes(q) ||
        s.shortDescriptionEn?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      );
    });
  }, [services, searchQuery, categoryFilter]);

  // Stats
  const activeCount = services.filter((s) => s.isActive).length;
  const inactiveCount = services.length - activeCount;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: services.length };
    services.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [services]);

  const handleAdd = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service: DentalService) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (service: DentalService) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService?.id) return;

    setIsDeleting(true);
    try {
      await adminServiceApi.delete(selectedService.id);
      toast.success('Service deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete service');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading services..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Manage your clinic's dental treatments and services.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* ============ COMPACT STATS ============ */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Stethoscope className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {services.length}
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
              <Sparkles className="w-4 h-4 text-green-600" />
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
              <Stethoscope className="w-4 h-4 text-gray-500" />
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
        {/* Search + View Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
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

          {/* View Mode Toggle */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-gray-100 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
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
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mr-0.5 shrink-0">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Category:</span>
          </div>
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
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
      </div>

      {/* ============ EMPTY STATE ============ */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Stethoscope className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {searchQuery || categoryFilter !== 'ALL'
              ? 'No services match your filters'
              : 'No services yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding your first service.'}
          </p>
          {searchQuery || categoryFilter !== 'ALL' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
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
              Add Service
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ============ GRID VIEW ============ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                    <Stethoscope className="w-12 h-12 text-green-600" />
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur ${
                      categoryBg[service.category] || 'bg-gray-100/95 text-gray-700'
                    }`}
                  >
                    {service.category}
                  </span>
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur ${
                      service.isActive
                        ? 'bg-green-100/95 text-green-700'
                        : 'bg-gray-100/95 text-gray-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        service.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 line-clamp-1">
                  {service.nameEn}
                </h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed min-h-[2rem]">
                  {service.shortDescriptionEn}
                </p>

                {/* Price + Duration */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-500 font-medium">
                      From
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      {formatPrice(Number(service.startingPrice))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-medium">
                      Duration
                    </div>
                    <div className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {service.durationMinutes}m
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* ============ TABLE / LIST VIEW ============ */
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Duration
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
                  {filtered.map((service, i) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {service.imageUrl ? (
                            <img
                              src={service.imageUrl}
                              alt={service.nameEn}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shrink-0">
                              <Stethoscope className="w-5 h-5 text-green-600" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate">
                              {service.nameEn}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {service.shortDescriptionEn}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            categoryBg[service.category] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-green-600">
                          {formatPrice(Number(service.startingPrice))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {service.durationMinutes} min
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            service.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              service.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(service)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(service)}
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
            {filtered.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {/* Image */}
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.nameEn}
                      className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {service.nameEn}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold mt-1 ${
                            categoryBg[service.category] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {service.category}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                          service.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            service.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {service.shortDescriptionEn}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px]">
                      <span className="font-bold text-green-600">
                        {formatPrice(Number(service.startingPrice))}
                      </span>
                      <span className="text-gray-500 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.durationMinutes}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(service)}
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
      <ServiceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        service={selectedService}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.nameEn}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}