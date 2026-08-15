import { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  User,
  Award,
  Calendar,
  Clock,
  Globe,
  FileText,
  Save,
  Stethoscope,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/components/ImageUpload';
import { adminDoctorApi, uploadApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { Doctor } from '@/types';
import toast from 'react-hot-toast';
import { formatTime } from '@/utils/formatters';

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor?: Doctor | null;
}

// Reusable classes
const inputClassName =
  'h-10 sm:h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20';

const textareaClassName =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none';

const labelClassName = 'block mb-1.5 text-sm font-semibold text-gray-700';

// Compact section (accordion-style icons in header)
function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
          <Icon className="w-3 h-3 text-green-600" />
        </div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

const DEFAULT_FORM: Partial<Doctor> = {
  nameEn: '',
  nameMm: '',
  title: '',
  specialtyEn: '',
  specialtyMm: '',
  bioEn: '',
  bioMm: '',
  qualifications: '',
  experienceYears: 0,
  photoUrl: '',
  availableDays: 'MON,TUE,WED,THU,FRI',
  availableFrom: '09:00',
  availableTo: '17:00',
  languages: 'Myanmar, English',
  displayOrder: 0,
  isActive: true,
};

export default function DoctorFormModal({
  isOpen,
  onClose,
  doctor,
}: DoctorFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<Partial<Doctor>>(DEFAULT_FORM);

  useEffect(() => {
    if (doctor) {
      setForm({
        ...doctor,
        availableFrom: formatTime(doctor.availableFrom) || '09:00',
        availableTo: formatTime(doctor.availableTo) || '17:00',
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setImageFile(null);
  }, [doctor, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let photoUrl = form.photoUrl;

      if (imageFile) {
        toast.loading('Uploading image...', { id: 'upload' });
        const uploadResult = await uploadApi.uploadImage(imageFile, 'doctors');
        photoUrl = uploadResult.url;
        toast.dismiss('upload');
      }

      const dataToSave = { ...form, photoUrl };

      if (doctor?.id) {
        await adminDoctorApi.update(doctor.id, dataToSave);
        toast.success('Doctor updated successfully');
      } else {
        await adminDoctorApi.create(dataToSave);
        toast.success('Doctor created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'doctors'] });
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setForm({ ...form, photoUrl: '' });
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
              {/* ============ MOBILE-OPTIMIZED HEADER ============ */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-br from-green-50/50 to-white shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  {/* Mobile: back arrow / Desktop: icon */}
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="sm:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                    aria-label="Close"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-sm shrink-0">
                    {doctor ? (
                      <Stethoscope className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {doctor ? 'Edit Doctor' : 'Add New Doctor'}
                    </h2>
                    <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
                      {doctor
                        ? `Editing Dr. ${doctor.nameEn}`
                        : 'Add a new specialist to your team'}
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
                  {/* Photo Upload */}
                  <FormSection icon={User} title="Profile Photo">
                    <ImageUpload
                      value={form.photoUrl}
                      onChange={handleImageChange}
                      label=""
                    />
                  </FormSection>

                  {/* Basic Info */}
                  <FormSection icon={User} title="Basic Info">
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
                          placeholder="Dr. John Smith"
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
                          placeholder="ဒေါက်တာ..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClassName}>
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title || ''}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        className={inputClassName}
                        placeholder="e.g., B.D.S, M.D.Sc"
                      />
                    </div>
                  </FormSection>

                  {/* Specialty */}
                  <FormSection icon={Stethoscope} title="Specialty">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Specialty (EN) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.specialtyEn || ''}
                          onChange={(e) =>
                            setForm({ ...form, specialtyEn: e.target.value })
                          }
                          className={inputClassName}
                          placeholder="General Dentistry"
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>Specialty (MM)</label>
                        <input
                          type="text"
                          value={form.specialtyMm || ''}
                          onChange={(e) =>
                            setForm({ ...form, specialtyMm: e.target.value })
                          }
                          className={inputClassName}
                          placeholder="အထွေထွေ သွားကုသမှု"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClassName}>Qualifications</label>
                      <input
                        type="text"
                        value={form.qualifications || ''}
                        onChange={(e) =>
                          setForm({ ...form, qualifications: e.target.value })
                        }
                        className={inputClassName}
                        placeholder="B.D.S, M.D.Sc..."
                      />
                    </div>
                  </FormSection>

                  {/* Bio */}
                  <FormSection icon={FileText} title="Biography">
                    <div>
                      <label className={labelClassName}>Bio (English)</label>
                      <textarea
                        rows={3}
                        value={form.bioEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, bioEn: e.target.value })
                        }
                        className={textareaClassName}
                        placeholder="Brief professional biography..."
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Bio (Myanmar)</label>
                      <textarea
                        rows={3}
                        value={form.bioMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, bioMm: e.target.value })
                        }
                        className={textareaClassName}
                        placeholder="ကိုယ်ရေးအကျဉ်း..."
                      />
                    </div>
                  </FormSection>

                  {/* Experience */}
                  <FormSection icon={Award} title="Experience">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>Years</label>
                        <input
                          type="number"
                          min="0"
                          value={form.experienceYears || 0}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              experienceYears: Number(e.target.value),
                            })
                          }
                          className={inputClassName}
                        />
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
                      </div>
                    </div>
                  </FormSection>

                  {/* Availability */}
                  <FormSection icon={Calendar} title="Availability">
                    <div>
                      <label className={labelClassName}>Available Days</label>
                      <input
                        type="text"
                        placeholder="MON,TUE,WED,THU,FRI"
                        value={form.availableDays || ''}
                        onChange={(e) =>
                          setForm({ ...form, availableDays: e.target.value })
                        }
                        className={inputClassName}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>From</label>
                        <input
                          type="time"
                          value={form.availableFrom || ''}
                          onChange={(e) =>
                            setForm({ ...form, availableFrom: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>To</label>
                        <input
                          type="time"
                          value={form.availableTo || ''}
                          onChange={(e) =>
                            setForm({ ...form, availableTo: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Languages */}
                  <FormSection icon={Globe} title="Languages">
                    <input
                      type="text"
                      placeholder="Myanmar, English"
                      value={form.languages || ''}
                      onChange={(e) =>
                        setForm({ ...form, languages: e.target.value })
                      }
                      className={inputClassName}
                    />
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
                          Show on public website
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
                        {doctor ? 'Update' : 'Create'}
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