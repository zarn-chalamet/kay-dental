import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
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

export default function ServiceFormModal({ isOpen, onClose, service }: ServiceFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<Partial<DentalService>>({
    nameEn: '',
    nameMm: '',
    shortDescriptionEn: '',
    shortDescriptionMm: '',
    fullDescriptionEn: '',
    fullDescriptionMm: '',
    startingPrice: 0,
    durationMinutes: 30,
    category: 'GENERAL',
    iconName: 'Stethoscope',
    imageUrl: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (service) {
      setForm(service);
    } else {
      setForm({
        nameEn: '',
        nameMm: '',
        shortDescriptionEn: '',
        shortDescriptionMm: '',
        fullDescriptionEn: '',
        fullDescriptionMm: '',
        startingPrice: 0,
        durationMinutes: 30,
        category: 'GENERAL',
        iconName: 'Stethoscope',
        imageUrl: '',
        displayOrder: 0,
        isActive: true,
      });
    }
    setImageFile(null);
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      // Upload image only if new file selected
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
                  {service ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  {/* Service Image */}
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={handleImageChange}
                    label="Service Image (Optional)"
                  />

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

                  {/* Slug (readonly for existing services) */}
                  {service?.slug && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={service.slug}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">Auto-generated from name (cannot be changed)</p>
                    </div>
                  )}

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description (English) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      maxLength={300}
                      placeholder="Brief description for cards (max 300 chars)"
                      value={form.shortDescriptionEn || ''}
                      onChange={(e) => setForm({ ...form, shortDescriptionEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{(form.shortDescriptionEn || '').length}/300 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description (Myanmar)
                    </label>
                    <textarea
                      rows={2}
                      maxLength={300}
                      value={form.shortDescriptionMm || ''}
                      onChange={(e) => setForm({ ...form, shortDescriptionMm: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description (English)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Detailed description for service page"
                      value={form.fullDescriptionEn || ''}
                      onChange={(e) => setForm({ ...form, fullDescriptionEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description (Myanmar)
                    </label>
                    <textarea
                      rows={4}
                      value={form.fullDescriptionMm || ''}
                      onChange={(e) => setForm({ ...form, fullDescriptionMm: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  {/* Category & Icon */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={form.category || 'GENERAL'}
                        onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      >
                        {SERVICE_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      <select
                        value={form.iconName || 'Stethoscope'}
                        onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      >
                        {ICON_OPTIONS.map((icon) => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Starting Price (MMK) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1000"
                        value={form.startingPrice || 0}
                        onChange={(e) => setForm({ ...form, startingPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="5"
                        value={form.durationMinutes || 30}
                        onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Display Order */}
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
                    <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
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
                      : (service ? 'Update Service' : 'Create Service')
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