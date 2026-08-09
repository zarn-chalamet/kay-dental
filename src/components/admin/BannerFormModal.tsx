import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/components/ImageUpload';
import { adminBannerApi, uploadApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { Banner } from '@/types';
import toast from 'react-hot-toast';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: Banner | null;
}

const BANNER_TYPES = [
  { value: 'GENERAL', label: 'General' },
  { value: 'PROMOTION', label: 'Promotion' },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'HOLIDAY', label: 'Holiday' },
];

export default function BannerFormModal({ isOpen, onClose, banner }: BannerFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<Partial<Banner>>({
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
  });

  useEffect(() => {
    if (banner) {
      setForm({
        ...banner,
        startDate: banner.startDate || '',
        endDate: banner.endDate || '',
      });
    } else {
      setForm({
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
      });
    }
    setImageFile(null);
  }, [banner, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      // Upload image only if new file selected
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

      // Clean empty date fields (send null instead of empty string)
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
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save banner');
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
                  {banner ? 'Edit Banner' : 'Add New Banner'}
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
                  {/* Banner Image */}
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={handleImageChange}
                    label="Banner Image"
                  />

                  {/* Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.titleEn || ''}
                        onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title (Myanmar)
                      </label>
                      <input
                        type="text"
                        value={form.titleMm || ''}
                        onChange={(e) => setForm({ ...form, titleMm: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (English)
                    </label>
                    <textarea
                      rows={3}
                      value={form.messageEn || ''}
                      onChange={(e) => setForm({ ...form, messageEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message (Myanmar)
                    </label>
                    <textarea
                      rows={3}
                      value={form.messageMm || ''}
                      onChange={(e) => setForm({ ...form, messageMm: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  {/* Type & Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type *
                      </label>
                      <select
                        required
                        value={form.type || 'GENERAL'}
                        onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      >
                        {BANNER_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
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

                  {/* Button */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text (English)
                      </label>
                      <input
                        type="text"
                        placeholder="Book Appointment"
                        value={form.buttonTextEn || ''}
                        onChange={(e) => setForm({ ...form, buttonTextEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text (Myanmar)
                      </label>
                      <input
                        type="text"
                        placeholder="ချိန်းဆိုရန်"
                        value={form.buttonTextMm || ''}
                        onChange={(e) => setForm({ ...form, buttonTextMm: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Button Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Link
                    </label>
                    <input
                      type="text"
                      placeholder="/appointment"
                      value={form.buttonLink || ''}
                      onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">Example: /appointment, /services, /doctors</p>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={form.startDate || ''}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={form.endDate || ''}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
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
                      : (banner ? 'Update Banner' : 'Create Banner')
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