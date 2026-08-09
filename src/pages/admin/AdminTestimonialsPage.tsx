import { useState } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminTestimonials } from '@/hooks/useAdminData';
import { adminTestimonialApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import TestimonialFormModal from '@/components/admin/TestimonialFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Testimonial } from '@/types';
import toast from 'react-hot-toast';

// Star rating display component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
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
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete testimonial');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  // Stats
  const activeCount = testimonials.filter((t) => t.isActive).length;
  const avgRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) /
          testimonials.length
        ).toFixed(1)
      : '0.0';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {testimonials.length} total · {activeCount} active · ⭐ {avgRating} avg rating
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {testimonials.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="font-medium">No testimonials yet</p>
                    <p className="text-sm mt-1">
                      Click "Add Testimonial" to create one
                    </p>
                  </td>
                </tr>
              ) : (
                testimonials.map((testimonial, i) => (
                  <motion.tr
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm overflow-hidden shrink-0">
                          {testimonial.photoUrl ? (
                            <img
                              src={testimonial.photoUrl}
                              alt={testimonial.patientName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails
                                (e.target as HTMLImageElement).style.display =
                                  'none';
                              }}
                            />
                          ) : (
                            testimonial.patientName?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">
                          {testimonial.patientName}
                        </span>
                      </div>
                    </td>

                    {/* Treatment */}
                    <td className="px-6 py-4">
                      {testimonial.treatment ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {testimonial.treatment}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <StarRating rating={testimonial.rating || 0} />
                        <span className="text-xs text-gray-400">
                          {testimonial.rating}/5
                        </span>
                      </div>
                    </td>

                    {/* Review */}
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {testimonial.reviewEn || '—'}
                      </p>
                      {testimonial.reviewMm && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {testimonial.reviewMm}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          testimonial.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {testimonial.isActive ? '● Active' : '○ Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(testimonial)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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