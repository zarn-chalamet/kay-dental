import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  ImageOff,
  Search,
  X,
  Filter,
  Image as ImageIcon,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminGallery } from '@/hooks/useAdminData';
import { adminGalleryApi } from '@/api/adminApi';
import type { GalleryPhoto } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import GalleryFormModal from '@/components/admin/GalleryFormModal';
import toast from 'react-hot-toast';

const CATEGORIES = ['CLINIC', 'BEFORE_AFTER', 'TEAM', 'EQUIPMENT', 'EVENT'] as const;

const categoryConfig: Record<string, { bg: string; icon: string; label: string }> = {
  CLINIC:       { bg: 'bg-blue-100 text-blue-700',     icon: '🏥', label: 'Clinic' },
  BEFORE_AFTER: { bg: 'bg-purple-100 text-purple-700', icon: '✨', label: 'Before/After' },
  TEAM:         { bg: 'bg-green-100 text-green-700',   icon: '👥', label: 'Team' },
  EQUIPMENT:    { bg: 'bg-amber-100 text-amber-700',   icon: '🔧', label: 'Equipment' },
  EVENT:        { bg: 'bg-rose-100 text-rose-700',     icon: '🎉', label: 'Event' },
};

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const { data: photos = [], isLoading } = useAdminGallery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Filter photos
  const filtered = useMemo(() => {
    return photos.filter((p) => {
      if (filterCategory !== 'ALL' && p.category !== filterCategory) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.titleEn?.toLowerCase().includes(q) ||
        p.titleMm?.toLowerCase().includes(q) ||
        p.descriptionEn?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });
  }, [photos, searchQuery, filterCategory]);

  // Stats
  const activeCount = photos.filter((p) => p.isActive).length;
  const inactiveCount = photos.length - activeCount;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: photos.length };
    photos.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [photos]);

  const openCreate = () => {
    setEditingPhoto(null);
    setIsModalOpen(true);
  };

  const openEdit = (photo: GalleryPhoto, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingPhoto(photo);
    setIsModalOpen(true);
  };

  const openDelete = (photo: GalleryPhoto, e?: React.MouseEvent) => {
    e?.stopPropagation();
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
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
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
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setIsDeleteOpen(false);
    } catch {
      toast.error('Failed to delete photo');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading gallery..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Manage clinic photos, patient transformations, and team pictures.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      {/* ============ COMPACT STATS ============ */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <ImageIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {photos.length}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Total
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <Eye className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {activeCount}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Active
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <EyeOff className="w-4 h-4 text-gray-500" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {inactiveCount}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Inactive
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TOOLBAR ============ */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3 sm:p-4 mb-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mr-0.5 shrink-0">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Category:</span>
          </div>
          {['ALL', ...CATEGORIES].map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = filterCategory === cat;
            const config = categoryConfig[cat];
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'All' : `${config?.icon || ''} ${config?.label || cat}`}
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============ EMPTY STATE ============ */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-100">
            <ImageOff className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {searchQuery || filterCategory !== 'ALL'
              ? 'No photos match your filters'
              : 'No photos yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery || filterCategory !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Start building your gallery by uploading photos.'}
          </p>
          {searchQuery || filterCategory !== 'ALL' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('ALL');
              }}
              className="mt-4 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={openCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add First Photo
            </button>
          )}
        </div>
      ) : (
        /* ============ GRID VIEW ============ */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((photo, i) => {
            const config = categoryConfig[photo.category] || categoryConfig.CLINIC;
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                  !photo.isActive ? 'opacity-75' : ''
                }`}
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.titleEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Inactive overlay */}
                  {!photo.isActive && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-900/80 backdrop-blur text-white px-2 py-0.5 text-[10px] font-bold">
                        <EyeOff className="w-2.5 h-2.5" />
                        Inactive
                      </span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur ${config.bg}`}>
                      {config.icon}
                    </span>
                  </div>

                  {/* Hover actions overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => openEdit(photo, e)}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/95 backdrop-blur text-blue-600 hover:bg-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => openDelete(photo, e)}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/95 backdrop-blur text-red-600 hover:bg-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {photo.titleEn}
                  </p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold mt-1.5 ${config.bg}`}>
                    {config.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
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
        message={`Are you sure you want to delete "${selectedPhoto?.titleEn}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}