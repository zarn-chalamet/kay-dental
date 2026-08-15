import { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  Star,
  ChevronLeft,
  Save,
  MessageSquare,
  Sparkles,
  User,
  FileText,
  Camera,
  Eye,
} from 'lucide-react';
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

// Reusable classes
const inputClassName =
  'h-10 sm:h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20';

const textareaClassName =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none';

const labelClassName = 'block mb-1.5 text-sm font-semibold text-gray-700';

// Section component
function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 pb-1.5 border-b border-gray-100">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-green-100 mt-0.5">
          <Icon className="w-3 h-3 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-[11px] text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

const DEFAULT_FORM: Partial<Testimonial> = {
  patientName: '',
  treatment: '',
  reviewEn: '',
  reviewMm: '',
  rating: 5,
  photoUrl: '',
  isActive: true,
};

export default function TestimonialFormModal({
  isOpen,
  onClose,
  testimonial,
}: TestimonialFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>(DEFAULT_FORM);

  useEffect(() => {
    if (testimonial) {
      setForm(testimonial);
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [testimonial, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const displayRating = hoveredStar ?? form.rating ?? 0;

  const getRatingLabel = (rating: number) => {
    if (rating === 5) return '⭐ Excellent';
    if (rating === 4) return '👍 Very Good';
    if (rating === 3) return '😊 Good';
    if (rating === 2) return '😐 Fair';
    if (rating === 1) return '😞 Poor';
    return '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
          >
            <div
              className="
                bg-white w-full sm:max-w-2xl 
                sm:rounded-2xl rounded-t-2xl
                sm:max-h-[90vh] max-h-[95vh]
                overflow-hidden pointer-events-auto 
                flex flex-col shadow-2xl
              "
            >
              {/* ============ HEADER ============ */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-br from-green-50/50 to-white shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="sm:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                    aria-label="Close"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-sm shrink-0">
                    {testimonial ? (
                      <MessageSquare className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                    </h2>
                    <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
                      {testimonial
                        ? `Editing review from ${testimonial.patientName}`
                        : 'Add a new patient review'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* ============ FORM BODY ============ */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto"
                aria-busy={isSubmitting}
              >
                <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                  {/* Patient Info */}
                  <FormSection icon={User} title="Patient Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Name <span className="text-red-500">*</span>
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
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label className={labelClassName}>Treatment</label>
                        <select
                          value={form.treatment || ''}
                          onChange={(e) =>
                            setForm({ ...form, treatment: e.target.value })
                          }
                          className={`${inputClassName} appearance-none cursor-pointer`}
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
                  </FormSection>

                  {/* Rating */}
                  <FormSection
                    icon={Star}
                    title="Rating"
                    description="How would the patient rate their experience?"
                  >
                    <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-yellow-50/50 to-white p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setForm({ ...form, rating: star })}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(null)}
                              className="p-0.5 transition-transform hover:scale-125 active:scale-110"
                            >
                              <Star
                                className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                                  star <= displayRating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {displayRating}
                          </span>
                          <span className="text-sm text-gray-500">/ 5</span>
                          {displayRating > 0 && (
                            <span className="text-xs font-semibold text-gray-600 ml-2">
                              {getRatingLabel(displayRating)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormSection>

                  {/* Review */}
                  <FormSection icon={FileText} title="Review">
                    <div>
                      <label className={labelClassName}>
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
                        className={textareaClassName}
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        {(form.reviewEn || '').length} characters
                      </p>
                    </div>

                    <div>
                      <label className={labelClassName}>Review (Myanmar)</label>
                      <textarea
                        rows={4}
                        placeholder="ဆရာဝန်က အလွန် ကျွမ်းကျင်ပြီး ဂရုတစိုက် ကုသပေးတယ်..."
                        value={form.reviewMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, reviewMm: e.target.value })
                        }
                        className={textareaClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Photo */}
                  <FormSection
                    icon={Camera}
                    title="Patient Photo"
                    description="Optional photo URL for the patient"
                  >
                    <div>
                      <input
                        type="url"
                        placeholder="https://example.com/photo.jpg"
                        value={form.photoUrl || ''}
                        onChange={(e) =>
                          setForm({ ...form, photoUrl: e.target.value })
                        }
                        className={inputClassName}
                      />

                      {form.photoUrl && (
                        <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <img
                            src={form.photoUrl}
                            alt="Preview"
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <p className="text-xs text-gray-600">Photo preview</p>
                        </div>
                      )}
                    </div>
                  </FormSection>

                  {/* Live Preview */}
                  <FormSection
                    icon={Eye}
                    title="Live Preview"
                    description="How it will appear on your website"
                  >
                    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4">
                      <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                        {/* Stars */}
                        <div className="flex items-center gap-0.5 mb-3">
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
                        <p className="text-sm text-gray-700 italic mb-3 line-clamp-3 leading-relaxed">
                          "{form.reviewEn || 'Your review will appear here...'}"
                        </p>
                        {/* Patient info */}
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm overflow-hidden shadow-sm">
                            {form.photoUrl ? (
                              <img
                                src={form.photoUrl}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              (form.patientName || 'P').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {form.patientName || 'Patient Name'}
                            </p>
                            {form.treatment && (
                              <p className="text-xs text-green-600 font-medium truncate">
                                {form.treatment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormSection>

                  {/* Visibility */}
                  <FormSection icon={Sparkles} title="Visibility">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          checked={form.isActive ?? true}
                          onChange={(e) =>
                            setForm({ ...form, isActive: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900">
                          Active on Website
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Show this testimonial in the reviews section
                        </div>
                      </div>
                    </label>
                  </FormSection>
                </div>

                {/* ============ STICKY FOOTER ============ */}
                <div className="sticky bottom-0 flex items-center justify-end gap-2 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {testimonial ? 'Update' : 'Create'}
                      </>
                    )}
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