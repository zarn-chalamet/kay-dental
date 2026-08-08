import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/components/ImageUpload';
import { adminDoctorApi } from '@/api/adminApi';
import { uploadApi } from '@/api/adminApi';  // ← Add this import
import { useQueryClient } from '@tanstack/react-query';
import type { Doctor } from '@/types';
import toast from 'react-hot-toast';

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor?: Doctor | null;
}

export default function DoctorFormModal({ isOpen, onClose, doctor }: DoctorFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);  // ← Track file
  const [form, setForm] = useState<Partial<Doctor>>({
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
  });

  useEffect(() => {
    if (doctor) {
      setForm(doctor);
    } else {
      setForm({
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
      });
    }
    setImageFile(null);  // Reset image file
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
      // User removed the image
      setForm({ ...form, photoUrl: '' });
    }
  };

  const handleClose = () => {
    setImageFile(null);  // Clear pending file
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
            className="fixed inset-0 bg-black/50 z-50"
          />
          
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
                  {doctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  {/* Photo Upload */}
                  <ImageUpload
                    value={form.photoUrl}
                    onChange={handleImageChange}
                    label="Doctor Photo"
                  />

                  {/* ... rest of form fields stay the same ... */}
                  
                  {/* Names */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.nameEn || ''}
                        onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name (Myanmar)
                      </label>
                      <input
                        type="text"
                        value={form.nameMm || ''}
                        onChange={(e) => setForm({ ...form, nameMm: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title (e.g., B.D.S, M.D.Sc) *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title || ''}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  </div>

                  {/* Specialty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialty (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.specialtyEn || ''}
                        onChange={(e) => setForm({ ...form, specialtyEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialty (Myanmar)
                      </label>
                      <input
                        type="text"
                        value={form.specialtyMm || ''}
                        onChange={(e) => setForm({ ...form, specialtyMm: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio (English)
                    </label>
                    <textarea
                      rows={3}
                      value={form.bioEn || ''}
                      onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio (Myanmar)
                    </label>
                    <textarea
                      rows={3}
                      value={form.bioMm || ''}
                      onChange={(e) => setForm({ ...form, bioMm: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qualifications
                    </label>
                    <input
                      type="text"
                      value={form.qualifications || ''}
                      onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  </div>

                  {/* Experience & Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.experienceYears || 0}
                        onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.displayOrder || 0}
                        onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Days (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="MON,TUE,WED,THU,FRI"
                      value={form.availableDays || ''}
                      onChange={(e) => setForm({ ...form, availableDays: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available From
                      </label>
                      <input
                        type="time"
                        value={form.availableFrom || ''}
                        onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available To
                      </label>
                      <input
                        type="time"
                        value={form.availableTo || ''}
                        onChange={(e) => setForm({ ...form, availableTo: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Languages
                    </label>
                    <input
                      type="text"
                      placeholder="Myanmar, English"
                      value={form.languages || ''}
                      onChange={(e) => setForm({ ...form, languages: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive || false}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Active (visible on website)
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSubmitting 
                      ? (imageFile ? 'Uploading & Saving...' : 'Saving...')
                      : (doctor ? 'Update Doctor' : 'Create Doctor')
                    }
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