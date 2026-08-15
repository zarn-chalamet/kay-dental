import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Upload,
  Loader2,
  ChevronLeft,
  Save,
  Image as ImageIcon,
  Sparkles,
  Type,
  FileText,
  Tag,
} from 'lucide-react';
import { uploadApi } from '@/api/adminApi';
import type { GalleryPhoto } from '@/types';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'CLINIC',       label: '🏥 Clinic' },
  { value: 'BEFORE_AFTER', label: '✨ Before/After' },
  { value: 'TEAM',         label: '👥 Team' },
  { value: 'EQUIPMENT',    label: '🔧 Equipment' },
  { value: 'EVENT',        label: '🎉 Event' },
] as const;

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

const emptyForm: Partial<GalleryPhoto> = {
  titleEn: '',
  titleMm: '',
  descriptionEn: '',
  descriptionMm: '',
  imageUrl: '',
  thumbnailUrl: '',
  category: 'CLINIC',
  displayOrder: 0,
  isActive: true,
};

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<GalleryPhoto>) => Promise<void>;
  editingPhoto: GalleryPhoto | null;
  isSaving: boolean;
}

export default function GalleryFormModal({
  isOpen,
  onClose,
  onSave,
  editingPhoto,
  isSaving,
}: GalleryFormModalProps) {
  const [form, setForm] = useState<Partial<GalleryPhoto>>(emptyForm);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(editingPhoto ? { ...editingPhoto } : emptyForm);
    }
  }, [isOpen, editingPhoto]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { url } = await uploadApi.uploadImage(file, 'gallery');
      setForm((f) => ({ ...f, imageUrl: url, thumbnailUrl: url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.titleEn || !form.imageUrl) {
      toast.error('Title and image are required');
      return;
    }
    await onSave(form);
  };

  const handleClose = () => {
    if (isSaving || isUploading) return;
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
                bg-white w-full sm:max-w-lg 
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
                    disabled={isSaving || isUploading}
                    className="sm:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                    aria-label="Close"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-sm shrink-0">
                    {editingPhoto ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {editingPhoto ? 'Edit Photo' : 'Add Photo'}
                    </h2>
                    <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
                      {editingPhoto
                        ? `Editing "${editingPhoto.titleEn}"`
                        : 'Upload a new photo to your gallery'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSaving || isUploading}
                  className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* ============ BODY ============ */}
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6"
                aria-busy={isSaving || isUploading}
              >
                {/* Image Upload */}
                <FormSection
                  icon={ImageIcon}
                  title="Photo"
                  description="Upload a high-quality image"
                >
                  {form.imageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() =>
                          setForm((f) => ({ ...f, imageUrl: '', thumbnailUrl: '' }))
                        }
                        className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 backdrop-blur text-red-600 hover:bg-white shadow-sm transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all ${
                        isUploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-2" />
                          <span className="text-sm font-semibold text-gray-700">
                            Uploading...
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-3">
                            <Upload className="w-6 h-6 text-gray-400" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            Click to upload
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </FormSection>

                {/* Title */}
                <FormSection icon={Type} title="Title">
                  <div>
                    <label className={labelClassName}>
                      Title (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.titleEn ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, titleEn: e.target.value }))
                      }
                      className={inputClassName}
                      placeholder="e.g., Modern Dental Chair"
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Title (Myanmar)</label>
                    <input
                      type="text"
                      value={form.titleMm ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, titleMm: e.target.value }))
                      }
                      className={inputClassName}
                      placeholder="ခေတ်မီ သွားကုသကုလားထိုင်"
                    />
                  </div>
                </FormSection>

                {/* Description */}
                <FormSection
                  icon={FileText}
                  title="Description"
                  description="Optional description shown in lightbox"
                >
                  <div>
                    <label className={labelClassName}>Description (English)</label>
                    <textarea
                      rows={3}
                      value={form.descriptionEn ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, descriptionEn: e.target.value }))
                      }
                      className={textareaClassName}
                      placeholder="Describe this photo..."
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Description (Myanmar)</label>
                    <textarea
                      rows={3}
                      value={form.descriptionMm ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, descriptionMm: e.target.value }))
                      }
                      className={textareaClassName}
                      placeholder="ဓာတ်ပုံ ဖော်ပြချက်..."
                    />
                  </div>
                </FormSection>

                {/* Category & Order */}
                <FormSection icon={Tag} title="Category & Order">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClassName}>Category</label>
                      <select
                        value={form.category ?? 'CLINIC'}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            category: e.target.value as GalleryPhoto['category'],
                          }))
                        }
                        className={`${inputClassName} appearance-none cursor-pointer`}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClassName}>Display Order</label>
                      <input
                        type="number"
                        min="0"
                        value={form.displayOrder ?? 0}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            displayOrder: Number(e.target.value),
                          }))
                        }
                        className={inputClassName}
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        Lower = appears first
                      </p>
                    </div>
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
                          setForm((f) => ({ ...f, isActive: e.target.checked }))
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
                        Show this photo in the public gallery
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
                  disabled={isSaving || isUploading}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving || isUploading}
                  className="flex-1 sm:flex-initial inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingPhoto ? 'Update' : 'Add Photo'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}