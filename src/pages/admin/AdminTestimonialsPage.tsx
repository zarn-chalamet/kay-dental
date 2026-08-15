import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Search,
  X,
  Filter,
  Grid3x3,
  List,
  Sparkles,
  MessageSquare,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminTestimonials } from '@/hooks/useAdminData';
import { adminTestimonialApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import TestimonialFormModal from '@/components/admin/TestimonialFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Testimonial } from '@/types';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'table';
type FilterStatus = 'ALL' | 'ACTIVE' | 'INACTIVE';

// Star rating display component
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sizeClass} ${
            s <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const { data: testimonials = [], isLoading } = useAdminTestimonials();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter testimonials
  const filtered = useMemo(() => {
    return testimonials.filter((t) => {
      if (filterStatus === 'ACTIVE' && !t.isActive) return false;
      if (filterStatus === 'INACTIVE' && t.isActive) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.patientName?.toLowerCase().includes(q) ||
        t.treatment?.toLowerCase().includes(q) ||
        t.reviewEn?.toLowerCase().includes(q) ||
        t.reviewMm?.toLowerCase().includes(q)
      );
    });
  }, [testimonials, searchQuery, filterStatus]);

  // Stats
  const activeCount = testimonials.filter((t) => t.isActive).length;
  const avgRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) /
          testimonials.length
        ).toFixed(1)
      : '0.0';

  const filterButtons: { value: FilterStatus; label: string; count: number }[] = [
    { value: 'ALL', label: 'All', count: testimonials.length },
    { value: 'ACTIVE', label: 'Active', count: activeCount },
    { value: 'INACTIVE', label: 'Inactive', count: testimonials.length - activeCount },
  ];

  const handleAdd = () => {
    setSelectedTestimonial(null);
    setIsFormOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTestimonial?.id) return;

    setIsDeleting(true);
    try {
      await adminTestimonialApi.delete(selectedTestimonial.id);
      toast.success('Testimonial deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete testimonial');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading testimonials..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Manage patient reviews and social proof.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* ============ COMPACT STATS ============ */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {testimonials.length}
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
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100">
              <Award className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none flex items-center gap-1">
                {avgRating}
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Avg Rating
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
              placeholder="Search testimonials..."
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

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mr-0.5 shrink-0">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filter:</span>
          </div>
          {filterButtons.map((btn) => {
            const isActive = filterStatus === btn.value;
            return (
              <button
                key={btn.value}
                onClick={() => setFilterStatus(btn.value)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {btn.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  {btn.count}
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
            <Star className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {searchQuery || filterStatus !== 'ALL'
              ? 'No testimonials match your filters'
              : 'No testimonials yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Add patient reviews to build trust with new visitors.'}
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
              Add Testimonial
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ============ GRID VIEW ============ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className={`group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                !testimonial.isActive ? 'opacity-75' : ''
              }`}
            >
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={testimonial.rating || 0} size="md" />
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      testimonial.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        testimonial.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    {testimonial.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Review */}
                <div className="min-h-[80px]">
                  <p className="text-sm text-gray-700 italic leading-relaxed line-clamp-4">
                    "{testimonial.reviewEn || 'No review'}"
                  </p>
                </div>

                {/* Patient info */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm overflow-hidden shadow-sm">
                    {testimonial.photoUrl ? (
                      <img
                        src={testimonial.photoUrl}
                        alt={testimonial.patientName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      testimonial.patientName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {testimonial.patientName}
                    </p>
                    {testimonial.treatment && (
                      <p className="text-xs text-green-600 font-medium truncate">
                        {testimonial.treatment}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(testimonial)}
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
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Treatment</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Review</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((testimonial, i) => (
                    <motion.tr
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className={`hover:bg-gray-50/70 transition-colors ${!testimonial.isActive ? 'opacity-70' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm overflow-hidden shadow-sm">
                            {testimonial.photoUrl ? (
                              <img
                                src={testimonial.photoUrl}
                                alt={testimonial.patientName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              testimonial.patientName?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm truncate">
                            {testimonial.patientName}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {testimonial.treatment ? (
                          <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-semibold">
                            {testimonial.treatment}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Not set</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <StarRating rating={testimonial.rating || 0} />
                          <span className="text-[10px] text-gray-500 font-medium">
                            {testimonial.rating}/5
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-gray-700 italic line-clamp-2">
                          "{testimonial.reviewEn || '—'}"
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            testimonial.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              testimonial.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          {testimonial.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(testimonial)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(testimonial)}
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

          {/* Mobile List */}
          <div className="md:hidden space-y-2">
            {filtered.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`rounded-xl border border-gray-100 bg-white p-3 shadow-sm ${!testimonial.isActive ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm overflow-hidden shadow-sm">
                    {testimonial.photoUrl ? (
                      <img
                        src={testimonial.photoUrl}
                        alt={testimonial.patientName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      testimonial.patientName?.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {testimonial.patientName}
                        </h3>
                        {testimonial.treatment && (
                          <p className="text-xs text-green-600 font-medium truncate mt-0.5">
                            {testimonial.treatment}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                          testimonial.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="mt-2">
                      <StarRating rating={testimonial.rating || 0} />
                    </div>

                    <p className="text-xs text-gray-600 italic line-clamp-2 mt-2">
                      "{testimonial.reviewEn || '—'}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(testimonial)}
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
      <TestimonialFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        testimonial={selectedTestimonial}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${selectedTestimonial?.patientName}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}