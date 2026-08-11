import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ImageOff, Upload } from 'lucide-react';
import { uploadApi } from '@/api/adminApi';
import type { GalleryPhoto } from '@/types';
import toast from 'react-hot-toast';

const CATEGORIES = ['CLINIC', 'BEFORE_AFTER', 'TEAM', 'EQUIPMENT', 'EVENT'] as const;

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

  // Sync form when opening or editing target changes
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
      setForm(f => ({ ...f, imageUrl: url, thumbnailUrl: url }));
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingPhoto ? 'Edit Photo' : 'Add Photo'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                {form.imageUrl ? (
                  <div className="relative">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      onClick={() =>
                        setForm(f => ({ ...f, imageUrl: '', thumbnailUrl: '' }))
                      }
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary-400 transition-colors ${
                      isUploading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-sm text-gray-500">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-300 mb-2" />
                        <span className="text-sm text-gray-500">
                          Click to upload image
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
              </div>

              {/* Title EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={form.titleEn ?? ''}
                  onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                />
              </div>

              {/* Title MM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Myanmar)
                </label>
                <input
                  type="text"
                  value={form.titleMm ?? ''}
                  onChange={e => setForm(f => ({ ...f, titleMm: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                />
              </div>

              {/* Description EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={form.descriptionEn ?? ''}
                  onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm resize-none"
                />
              </div>

              {/* Description MM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Myanmar)
                </label>
                <textarea
                  rows={2}
                  value={form.descriptionMm ?? ''}
                  onChange={e => setForm(f => ({ ...f, descriptionMm: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-sm resize-none"
                />
              </div>

              {/* Category + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category ?? 'CLINIC'}
                    onChange={e =>
                      setForm(f => ({
                        ...f,
                        category: e.target.value as GalleryPhoto['category'],
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.displayOrder ?? 0}
                    onChange={e =>
                      setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    form.isActive ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow mt-1 transition-transform ${
                      form.isActive ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving || isUploading}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : editingPhoto ? 'Update' : 'Add Photo'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}