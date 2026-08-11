import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminGallery } from '@/hooks/useAdminData';
import { adminGalleryApi } from '@/api/adminApi';
import type { GalleryPhoto } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import GalleryFormModal from '@/components/admin/GalleryFormModal';
import toast from 'react-hot-toast';

const CATEGORIES = ['CLINIC', 'BEFORE_AFTER', 'TEAM', 'EQUIPMENT', 'EVENT'] as const;

const categoryColors: Record<string, string> = {
  CLINIC:       'bg-blue-50 text-blue-600',
  BEFORE_AFTER: 'bg-purple-50 text-purple-600',
  TEAM:         'bg-green-50 text-green-600',
  EQUIPMENT:    'bg-amber-50 text-amber-600',
  EVENT:        'bg-rose-50 text-rose-600',
};

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const { data: photos = [], isLoading } = useAdminGallery();

  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [isDeleteOpen, setIsDeleteOpen]     = useState(false);
  const [isDeleting, setIsDeleting]         = useState(false);
  const [isSaving, setIsSaving]             = useState(false);
  const [editingPhoto, setEditingPhoto]     = useState<GalleryPhoto | null>(null);
  const [selectedPhoto, setSelectedPhoto]   = useState<GalleryPhoto | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filtered = filterCategory === 'ALL'
    ? photos
    : photos.filter(p => p.category === filterCategory);

  const openCreate = () => {
    setEditingPhoto(null);
    setIsModalOpen(true);
  };

  const openEdit = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setIsModalOpen(true);
  };

  const openDelete = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setIsDeleteOpen(true);
  };

  const handleSave = async (data: Partial<GalleryPhoto>) => {
    setIsSaving(true);
    try {
      if (editingPhoto) {
        await adminGalleryApi.update(editingPhoto.id, data);
        toast.success('Photo updated');
      } else {
        await adminGalleryApi.create(data);
        toast.success('Photo added');
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save photo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPhoto) return;
    setIsDeleting(true);
    try {
      await adminGalleryApi.delete(selectedPhoto.id);
      toast.success('Photo deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
      setIsDeleteOpen(false);
    } catch {
      toast.error('Failed to delete photo');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-500 mt-0.5">{photos.length} photos</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Photo
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center text-gray-400">
          <ImageOff className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No photos found</p>
          <button onClick={openCreate} className="btn-primary mt-4">Add First Photo</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!photo.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                      Inactive
                    </span>
                  </div>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(photo)}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:text-primary-600 transition-colors shadow"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDelete(photo)}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-600 transition-colors shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-900 truncate">{photo.titleEn}</p>
                <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-xs font-medium ${categoryColors[photo.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {photo.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <GalleryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingPhoto={editingPhoto}
        isSaving={isSaving}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Photo"
        message={`Are you sure you want to delete "${selectedPhoto?.titleEn}"?`}
        isDeleting={isDeleting}
      />
    </div>
  );
}