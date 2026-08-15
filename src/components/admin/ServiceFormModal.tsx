import { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  ChevronLeft,
  Save,
  Stethoscope,
  Sparkles,
  FileText,
  DollarSign,
  Tag,
  ListChecks,
  Heart,
  HelpCircle,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/components/ImageUpload';
import { adminServiceApi, uploadApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { DentalService } from '@/types';
import toast from 'react-hot-toast';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: DentalService | null;
}

const SERVICE_CATEGORIES = [
  { value: 'GENERAL', label: 'General' },
  { value: 'COSMETIC', label: 'Cosmetic' },
  { value: 'ORTHODONTICS', label: 'Orthodontics' },
  { value: 'SURGERY', label: 'Surgery' },
  { value: 'PEDIATRIC', label: 'Pediatric' },
  { value: 'EMERGENCY', label: 'Emergency' },
];

const ICON_OPTIONS = [
  { value: 'Stethoscope', label: '🩺 Stethoscope' },
  { value: 'Sparkles', label: '✨ Sparkles' },
  { value: 'Shield', label: '🛡️ Shield' },
  { value: 'Heart', label: '❤️ Heart' },
  { value: 'Scissors', label: '✂️ Scissors' },
  { value: 'Crown', label: '👑 Crown' },
  { value: 'AlignCenter', label: '📏 Align Center' },
  { value: 'Pin', label: '📍 Pin' },
  { value: 'Baby', label: '👶 Baby' },
  { value: 'AlertTriangle', label: '⚠️ Alert Triangle' },
];

// Reusable classes
const inputClassName =
  'h-10 sm:h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20';

const textareaClassName =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none';

const monoTextareaClassName = `${textareaClassName} font-mono`;

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

const DEFAULT_FORM: Partial<DentalService> = {
  nameEn: '',
  nameMm: '',
  shortDescriptionEn: '',
  shortDescriptionMm: '',
  fullDescriptionEn: '',
  fullDescriptionMm: '',
  benefitsEn: '',
  benefitsMm: '',
  processEn: '',
  processMm: '',
  aftercareEn: '',
  aftercareMm: '',
  faqsEn: '',
  faqsMm: '',
  startingPrice: 0,
  durationMinutes: 30,
  category: 'GENERAL',
  iconName: 'Stethoscope',
  imageUrl: '',
  displayOrder: 0,
  isActive: true,
};

export default function ServiceFormModal({
  isOpen,
  onClose,
  service,
}: ServiceFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<Partial<DentalService>>(DEFAULT_FORM);

  useEffect(() => {
    if (service) {
      setForm(service);
    } else {
      setForm(DEFAULT_FORM);
    }
    setImageFile(null);
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        try {
          toast.loading('Uploading image...', { id: 'upload' });
          const uploadResult = await uploadApi.uploadImage(imageFile, 'services');
          imageUrl = uploadResult.url;
          toast.dismiss('upload');
        } catch (uploadError) {
          toast.dismiss('upload');
          console.error('Upload failed:', uploadError);
          toast.error('Failed to upload image');
          setIsSubmitting(false);
          return;
        }
      }

      const dataToSave = { ...form, imageUrl };

      if (service?.id) {
        await adminServiceApi.update(service.id, dataToSave);
        toast.success('Service updated successfully');
      } else {
        await adminServiceApi.create(dataToSave);
        toast.success('Service created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setForm({ ...form, imageUrl: '' });
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setImageFile(null);
    onClose();
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
                    {service ? (
                      <Stethoscope className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {service ? 'Edit Service' : 'Add New Service'}
                    </h2>
                    <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
                      {service
                        ? `Editing ${service.nameEn}`
                        : 'Add a new dental service to your catalog'}
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
                  {/* Service Image */}
                  <FormSection icon={Stethoscope} title="Service Image">
                    <ImageUpload
                      value={form.imageUrl}
                      onChange={handleImageChange}
                      label=""
                    />
                  </FormSection>

                  {/* Basic Info */}
                  <FormSection icon={FileText} title="Basic Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Name (English) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.nameEn || ''}
                          onChange={(e) =>
                            setForm({ ...form, nameEn: e.target.value })
                          }
                          className={inputClassName}
                          placeholder="e.g., Teeth Cleaning"
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>Name (Myanmar)</label>
                        <input
                          type="text"
                          value={form.nameMm || ''}
                          onChange={(e) =>
                            setForm({ ...form, nameMm: e.target.value })
                          }
                          className={inputClassName}
                          placeholder="သွားသန့်စင်ခြင်း"
                        />
                      </div>
                    </div>

                    {service?.slug && (
                      <div>
                        <label className={labelClassName}>Slug (URL)</label>
                        <input
                          type="text"
                          disabled
                          value={service.slug}
                          className="h-10 sm:h-11 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 sm:px-4 text-sm text-gray-500 outline-none font-mono"
                        />
                        <p className="mt-1 text-[11px] text-gray-400">
                          Auto-generated from name
                        </p>
                      </div>
                    )}
                  </FormSection>

                  {/* Short Description */}
                  <FormSection
                    icon={FileText}
                    title="Short Description"
                    description="Brief text shown on service cards"
                  >
                    <div>
                      <label className={labelClassName}>
                        Short Description (English){' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        maxLength={300}
                        placeholder="Brief description for cards..."
                        value={form.shortDescriptionEn || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            shortDescriptionEn: e.target.value,
                          })
                        }
                        className={textareaClassName}
                      />
                      <p className="mt-1 text-[11px] text-gray-400">
                        {(form.shortDescriptionEn || '').length}/300 characters
                      </p>
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Short Description (Myanmar)
                      </label>
                      <textarea
                        rows={2}
                        maxLength={300}
                        value={form.shortDescriptionMm || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            shortDescriptionMm: e.target.value,
                          })
                        }
                        className={textareaClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Full Description */}
                  <FormSection
                    icon={FileText}
                    title="Full Description"
                    description="Detailed content shown on service detail page"
                  >
                    <div>
                      <label className={labelClassName}>
                        Full Description (English)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Detailed description..."
                        value={form.fullDescriptionEn || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            fullDescriptionEn: e.target.value,
                          })
                        }
                        className={textareaClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Full Description (Myanmar)
                      </label>
                      <textarea
                        rows={4}
                        value={form.fullDescriptionMm || ''}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            fullDescriptionMm: e.target.value,
                          })
                        }
                        className={textareaClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Benefits */}
                  <FormSection
                    icon={Award}
                    title="Benefits"
                    description="Why patients need this service (one per line)"
                  >
                    <div>
                      <label className={labelClassName}>
                        Benefits (English)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Prevents cavities&#10;Fresh breath&#10;Saves money long-term"
                        value={form.benefitsEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, benefitsEn: e.target.value })
                        }
                        className={monoTextareaClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Benefits (Myanmar)
                      </label>
                      <textarea
                        rows={4}
                        value={form.benefitsMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, benefitsMm: e.target.value })
                        }
                        className={monoTextareaClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Process */}
                  <FormSection
                    icon={ListChecks}
                    title="Process"
                    description="Treatment steps (auto-numbered, one per line)"
                  >
                    <div>
                      <label className={labelClassName}>
                        Process (English)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Initial consultation&#10;Professional cleaning&#10;Polishing&#10;Aftercare advice"
                        value={form.processEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, processEn: e.target.value })
                        }
                        className={monoTextareaClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Process (Myanmar)
                      </label>
                      <textarea
                        rows={4}
                        value={form.processMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, processMm: e.target.value })
                        }
                        className={monoTextareaClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Aftercare */}
                  <FormSection
                    icon={Heart}
                    title="Aftercare Tips"
                    description="Post-treatment care instructions (one per line)"
                  >
                    <div>
                      <label className={labelClassName}>
                        Aftercare (English)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Brush twice daily&#10;Floss regularly&#10;Avoid hard foods for 24 hours"
                        value={form.aftercareEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, aftercareEn: e.target.value })
                        }
                        className={monoTextareaClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Aftercare (Myanmar)
                      </label>
                      <textarea
                        rows={4}
                        value={form.aftercareMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, aftercareMm: e.target.value })
                        }
                        className={monoTextareaClassName}
                      />
                    </div>
                  </FormSection>

                  {/* FAQs */}
                  <FormSection
                    icon={HelpCircle}
                    title="FAQs"
                    description="Format: 'Q: question' then 'A: answer'. Blank line between FAQs."
                  >
                    <div>
                      <label className={labelClassName}>FAQs (English)</label>
                      <textarea
                        rows={6}
                        placeholder="Q: Does it hurt?&#10;A: No, we use modern painless techniques.&#10;&#10;Q: How long does it take?&#10;A: About 30 minutes."
                        value={form.faqsEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, faqsEn: e.target.value })
                        }
                        className={monoTextareaClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>FAQs (Myanmar)</label>
                      <textarea
                        rows={6}
                        placeholder="မေး: နာကျင်ပါသလား?&#10;ဖြေ: မနာကျင်ပါ။"
                        value={form.faqsMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, faqsMm: e.target.value })
                        }
                        className={monoTextareaClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Category & Icon */}
                  <FormSection icon={Tag} title="Category & Icon">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.category || 'GENERAL'}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              category: e.target.value as any,
                            })
                          }
                          className={`${inputClassName} appearance-none cursor-pointer`}
                        >
                          {SERVICE_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClassName}>Icon</label>
                        <select
                          value={form.iconName || 'Stethoscope'}
                          onChange={(e) =>
                            setForm({ ...form, iconName: e.target.value })
                          }
                          className={`${inputClassName} appearance-none cursor-pointer`}
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon.value} value={icon.value}>
                              {icon.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </FormSection>

                  {/* Price & Duration */}
                  <FormSection icon={DollarSign} title="Pricing & Duration">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Price (MMK) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="1000"
                          value={form.startingPrice || 0}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              startingPrice: Number(e.target.value),
                            })
                          }
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>
                          Duration (min) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="5"
                          value={form.durationMinutes || 30}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              durationMinutes: Number(e.target.value),
                            })
                          }
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClassName}>Display Order</label>
                      <input
                        type="number"
                        min="0"
                        value={form.displayOrder || 0}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            displayOrder: Number(e.target.value),
                          })
                        }
                        className={inputClassName}
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        Lower numbers appear first
                      </p>
                    </div>
                  </FormSection>

                  {/* Visibility */}
                  <FormSection icon={Sparkles} title="Visibility">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          checked={form.isActive || false}
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
                          Show this service on public website
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
                        <span className="truncate">
                          {imageFile ? 'Uploading...' : 'Saving...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {service ? 'Update' : 'Create'}
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