import { useState, useEffect } from 'react';
import { X, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminTestimonialApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { Testimonial } from '@/types';
import toast from 'react-hot-toast';

interface TestimonialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: Testimonial | null;
}

const TREATMENT_OPTIONS = [
  'General Checkup',
  'Teeth Cleaning',
  'Teeth Whitening',
  'Dental Filling',
  'Root Canal',
  'Tooth Extraction',
  'Dental Implant',
  'Braces / Orthodontics',
  'Invisalign',
  'Veneers',
  'Dental Crown',
  'Dental Bridge',
  'Pediatric Dentistry',
  'Emergency Treatment',
  'Other',
];

export default function TestimonialFormModal({
  isOpen,
  onClose,
  testimonial,
}: TestimonialFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const [form, setForm] = useState<Partial<Testimonial>>({
    patientName: '',
    treatment: '',
    reviewEn: '',
    reviewMm: '',
    rating: 5,
    photoUrl: '',
    isActive: true,
  });

  // Reset form when modal opens/closes or testimonial changes
  useEffect(() => {
    if (testimonial) {
      setForm(testimonial);
    } else {
      setForm({
        patientName: '',
        treatment: '',
        reviewEn: '',
        reviewMm: '',
        rating: 5,
        photoUrl: '',
        isActive: true,
      });
    }
  }, [testimonial, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.patientName?.trim()) {
      toast.error('Patient name is required');
      return;
    }
    if (!form.reviewEn?.trim()) {
      toast.error('English review is required');
      return;
    }
    if (!form.rating || form.rating < 1 || form.rating > 5) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      if (testimonial?.id) {
        await adminTestimonialApi.update(testimonial.id, form);
        toast.success('Testimonial updated successfully');
      } else {
        await adminTestimonialApi.create(form);
        toast.success('Testimonial created successfully');
      }

      // Invalidate both admin and public queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredStar ?? form.rating ?? 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">
                  {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-5">

                  {/* Patient Name + Treatment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Patient Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        placeholder="Ma Aye Aye"
                        value={form.patientName || ''}
                        onChange={(e) =>
                          setForm({ ...form, patientName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Treatment
                      </label>
                      <select
                        value={form.treatment || ''}
                        onChange={(e) =>
                          setForm({ ...form, treatment: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      >
                        <option value="">Select treatment...</option>
                        {TREATMENT_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setForm({ ...form, rating: star })}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(null)}
                            className="p-0.5 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= displayRating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600 ml-1">
                        {displayRating}/5
                        {displayRating === 5 && ' ⭐ Excellent'}
                        {displayRating === 4 && ' 👍 Very Good'}
                        {displayRating === 3 && ' 😊 Good'}
                        {displayRating === 2 && ' 😐 Fair'}
                        {displayRating === 1 && ' 😞 Poor'}
                      </span>
                    </div>
                  </div>

                  {/* Review English */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review (English) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="The doctor was very professional and caring. I'm very happy with the results..."
                      value={form.reviewEn || ''}
                      onChange={(e) =>
                        setForm({ ...form, reviewEn: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {(form.reviewEn || '').length} characters
                    </p>
                  </div>

                  {/* Review Myanmar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review (Myanmar)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="ဆရာဝန်က အလွန် ကျွမ်းကျင်ပြီး ဂရုတစိုက် ကုသပေးတယ်..."
                      value={form.reviewMm || ''}
                      onChange={(e) =>
                        setForm({ ...form, reviewMm: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none transition-all"
                    />
                  </div>

                  {/* Photo URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Photo URL{' '}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={form.photoUrl || ''}
                      onChange={(e) =>
                        setForm({ ...form, photoUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    />

                    {/* Photo Preview */}
                    {form.photoUrl && (
                      <div className="mt-2 flex items-center gap-3">
                        <img
                          src={form.photoUrl}
                          alt="Preview"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <p className="text-xs text-gray-500">Photo preview</p>
                      </div>
                    )}
                  </div>

                  {/* Preview Card */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                      Preview
                    </p>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= (form.rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      {/* Review text */}
                      <p className="text-sm text-gray-600 italic mb-3 line-clamp-2">
                        "{form.reviewEn || 'Your review will appear here...'}"
                      </p>
                      {/* Patient info */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs overflow-hidden">
                          {form.photoUrl ? (
                            <img
                              src={form.photoUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  'none';
                              }}
                            />
                          ) : (
                            (form.patientName || 'P').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {form.patientName || 'Patient Name'}
                          </p>
                          <p className="text-xs text-primary-600">
                            {form.treatment || 'Treatment'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive ?? true}
                      onChange={(e) =>
                        setForm({ ...form, isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-gray-700"
                    >
                      Active (visible on website)
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {testimonial ? 'Update Testimonial' : 'Create Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}