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
  'h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20';

const textareaClassName =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none';

const labelClassName = 'block mb-1.5 text-sm font-semibold text-gray-700';

// Section component
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
    <div>
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100">
          <Icon className="w-3.5 h-3.5 text-green-600" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
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
      // Normalize time format (strip seconds) for time inputs
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden pointer-events-auto flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-br from-green-50/50 to-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-sm">
                    {doctor ? (
                      <Stethoscope className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {doctor ? 'Edit Doctor' : 'Add New Doctor'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doctor
                        ? `Editing Dr. ${doctor.nameEn}`
                        : 'Add a new specialist to your team'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto"
                aria-busy={isSubmitting}
              >
                <div className="p-6 space-y-8">
                  {/* Photo Upload */}
                  <FormSection icon={User} title="Profile Photo">
                    <ImageUpload
                      value={form.photoUrl}
                      onChange={handleImageChange}
                      label=""
                    />
                  </FormSection>

                  {/* Basic Info */}
                  <FormSection icon={User} title="Basic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClassName}>
                          Specialty (English){' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.specialtyEn || ''}
                          onChange={(e) =>
                            setForm({ ...form, specialtyEn: e.target.value })
                          }
                          className={inputClassName}
                          placeholder="e.g., General Dentistry"
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>
                          Specialty (Myanmar)
                        </label>
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
                        placeholder="B.D.S, M.D.Sc (Prosthodontics), Diploma..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Separate multiple qualifications with commas
                      </p>
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

                  {/* Experience & Display Order */}
                  <FormSection icon={Award} title="Experience">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClassName}>
                          Experience (Years)
                        </label>
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
                        <p className="mt-1 text-xs text-gray-500">
                          Lower numbers appear first
                        </p>
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
                      <p className="mt-1 text-xs text-gray-500">
                        Comma-separated (MON, TUE, WED, THU, FRI, SAT, SUN)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClassName}>Available From</label>
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
                        <label className={labelClassName}>Available To</label>
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
                    <div>
                      <label className={labelClassName}>Spoken Languages</label>
                      <input
                        type="text"
                        placeholder="Myanmar, English"
                        value={form.languages || ''}
                        onChange={(e) =>
                          setForm({ ...form, languages: e.target.value })
                        }
                        className={inputClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Status */}
                  <FormSection icon={Sparkles} title="Visibility">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="relative">
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
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">
                          Active on Website
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Show this doctor on the public website
                        </div>
                      </div>
                    </label>
                  </FormSection>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {imageFile ? 'Uploading & Saving...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {doctor ? 'Update Doctor' : 'Create Doctor'}
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