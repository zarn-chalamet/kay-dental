import { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  ChevronLeft,
  Save,
  Image as ImageIcon,
  Sparkles,
  Type,
  Link as LinkIcon,
  Calendar,
  Info,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/components/ImageUpload';
import { adminBannerApi, uploadApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { Banner } from '@/types';
import toast from 'react-hot-toast';
import BannerImageCropper from './BannerImageCropper';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: Banner | null;
}

const BANNER_TYPES = [
  { value: 'GENERAL', label: '📢 General' },
  { value: 'PROMOTION', label: '🎁 Promotion' },
  { value: 'ANNOUNCEMENT', label: '📣 Announcement' },
  { value: 'HOLIDAY', label: '🎉 Holiday' },
];

const inputClassName =
  'h-10 sm:h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20';

const textareaClassName =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none';

const labelClassName = 'block mb-1.5 text-sm font-semibold text-gray-700';

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

const formatDateForInput = (date: unknown): string => {
  if (!date) return '';
  if (typeof date === 'string') return date.split('T')[0];
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return '';
};

const DEFAULT_FORM: Partial<Banner> = {
  titleEn: '',
  titleMm: '',
  messageEn: '',
  messageMm: '',
  imageUrl: '',
  buttonTextEn: '',
  buttonTextMm: '',
  buttonLink: '',
  type: 'GENERAL',
  displayOrder: 0,
  startDate: '',
  endDate: '',
  isActive: true,
};

export default function BannerFormModal({
  isOpen,
  onClose,
  banner,
}: BannerFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<Partial<Banner>>(DEFAULT_FORM);

  useEffect(() => {
    if (banner) {
      setForm({
        ...banner,
        startDate: formatDateForInput(banner.startDate),
        endDate: formatDateForInput(banner.endDate),
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setImageFile(null);
  }, [banner, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end < start) {
        toast.error('End date must be after or equal to start date');
        return;
      }
    }

    if (form.endDate && !form.startDate) {
      toast.error('Please set a start date if you want to set an end date');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        try {
          toast.loading('Uploading image...', { id: 'upload' });
          const uploadResult = await uploadApi.uploadImage(imageFile, 'banners');
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

      const dataToSave = {
        ...form,
        imageUrl,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      if (banner?.id) {
        await adminBannerApi.update(banner.id, dataToSave);
        toast.success('Banner updated successfully');
      } else {
        await adminBannerApi.create(dataToSave);
        toast.success('Banner created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: Handle image selection - opens cropper
  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setForm({ ...form, imageUrl: '' });
      return;
    }

    // Open cropper instead of setting file directly
    setPendingImageFile(file);
    setIsCropperOpen(true);
  };

  // NEW: Handle crop complete
  const handleCropComplete = (croppedFile: File) => {
    setImageFile(croppedFile);

    // Show preview of cropped image
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm({ ...form, imageUrl: e.target?.result as string });
    };
    reader.readAsDataURL(croppedFile);

    setIsCropperOpen(false);
    setPendingImageFile(null);
  };

  // NEW: Handle crop cancel
  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setPendingImageFile(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setImageFile(null);
    onClose();
  };

  const handleStartDateChange = (value: string) => {
    setForm({
      ...form,
      startDate: value,
      endDate: value ? form.endDate : '',
    });
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
                    {banner ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {banner ? 'Edit Banner' : 'Add New Banner'}
                    </h2>
                    <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
                      {banner
                        ? `Editing "${banner.titleEn}"`
                        : 'Create a new homepage banner'}
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
                  {/* Banner Image */}
                  <FormSection icon={ImageIcon} title="Banner Image">
                    <ImageUpload
                      value={form.imageUrl}
                      onChange={handleImageChange}
                      label=""
                    />
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-blue-800 space-y-0.5">
                          <p><strong>📐 Auto-crop enabled:</strong> Any image will be cropped to 16:9 for perfect banner fit</p>
                          <p><strong>📁 Recommended:</strong> High-quality photos, at least 1920x1080</p>
                        </div>
                      </div>
                    </div>
                  </FormSection>

                  {/* Title */}
                  <FormSection icon={Type} title="Title">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Title (English) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.titleEn || ''}
                          onChange={(e) =>
                            setForm({ ...form, titleEn: e.target.value })
                          }
                          className={inputClassName}
                          placeholder="Welcome to KAY Dental"
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>Title (Myanmar)</label>
                        <input
                          type="text"
                          value={form.titleMm || ''}
                          onChange={(e) =>
                            setForm({ ...form, titleMm: e.target.value })
                          }
                          className={inputClassName}
                          placeholder="ကြိုဆိုပါသည်"
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Message */}
                  <FormSection
                    icon={MessageSquare}
                    title="Message"
                    description="Description shown below the title"
                  >
                    <div>
                      <label className={labelClassName}>Message (English)</label>
                      <textarea
                        rows={3}
                        value={form.messageEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, messageEn: e.target.value })
                        }
                        className={textareaClassName}
                        placeholder="Professional dental care in Yangon..."
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Message (Myanmar)</label>
                      <textarea
                        rows={3}
                        value={form.messageMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, messageMm: e.target.value })
                        }
                        className={textareaClassName}
                        placeholder="သွားကုသမှု ဝန်ဆောင်မှု..."
                      />
                    </div>
                  </FormSection>

                  {/* Type & Order */}
                  <FormSection icon={Sparkles} title="Type & Order">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.type || 'GENERAL'}
                          onChange={(e) =>
                            setForm({ ...form, type: e.target.value as any })
                          }
                          className={`${inputClassName} appearance-none cursor-pointer`}
                        >
                          {BANNER_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
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
                          Lower = appears first
                        </p>
                      </div>
                    </div>
                  </FormSection>

                  {/* Call to Action */}
                  <FormSection
                    icon={LinkIcon}
                    title="Call to Action"
                    description="Optional button to add to the banner"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>Button Text (EN)</label>
                        <input
                          type="text"
                          placeholder="Book Appointment"
                          value={form.buttonTextEn || ''}
                          onChange={(e) =>
                            setForm({ ...form, buttonTextEn: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>Button Text (MM)</label>
                        <input
                          type="text"
                          placeholder="ချိန်းဆိုရန်"
                          value={form.buttonTextMm || ''}
                          onChange={(e) =>
                            setForm({ ...form, buttonTextMm: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClassName}>Button Link</label>
                      <input
                        type="text"
                        placeholder="/appointment"
                        value={form.buttonLink || ''}
                        onChange={(e) =>
                          setForm({ ...form, buttonLink: e.target.value })
                        }
                        className={inputClassName}
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        Examples: /appointment, /services, /doctors, /contact
                      </p>
                    </div>
                  </FormSection>

                  {/* Schedule */}
                  <FormSection
                    icon={Calendar}
                    title="Schedule"
                    description="Optionally set when the banner should be visible"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>Start Date</label>
                        <input
                          type="date"
                          value={form.startDate || ''}
                          onChange={(e) => handleStartDateChange(e.target.value)}
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>End Date</label>
                        <input
                          type="date"
                          value={form.endDate || ''}
                          min={form.startDate || undefined}
                          disabled={!form.startDate}
                          onChange={(e) =>
                            setForm({ ...form, endDate: e.target.value })
                          }
                          className={`${inputClassName} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        />
                        {!form.startDate && (
                          <p className="mt-1 text-[11px] text-gray-400">
                            Set start date first
                          </p>
                        )}
                      </div>
                    </div>

                    {form.startDate && form.endDate && (
                      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800">
                            📅 Banner will show from{' '}
                            <strong>{form.startDate}</strong> to{' '}
                            <strong>{form.endDate}</strong>
                          </p>
                        </div>
                      </div>
                    )}
                    {form.startDate && !form.endDate && (
                      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-800">
                            📅 Banner will show from{' '}
                            <strong>{form.startDate}</strong> onwards (no end date)
                          </p>
                        </div>
                      </div>
                    )}
                    {!form.startDate && !form.endDate && (
                      <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-green-800">
                            ✅ Banner will always be visible (when active)
                          </p>
                        </div>
                      </div>
                    )}
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
                          Show this banner on the homepage carousel
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
                        {imageFile ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {banner ? 'Update' : 'Create'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* ============ IMAGE CROPPER ============ */}
          <BannerImageCropper
            isOpen={isCropperOpen}
            imageFile={pendingImageFile}
            onClose={handleCropCancel}
            onCropComplete={handleCropComplete}
          />
        </>
      )}
    </AnimatePresence>
  );
}