import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminBanners } from '@/hooks/useAdminData';
import { adminBannerApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import BannerFormModal from '@/components/admin/BannerFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Banner } from '@/types';
import toast from 'react-hot-toast';

const typeBg: Record<string, string> = {
  GENERAL: 'bg-blue-100 text-blue-700',
  PROMOTION: 'bg-purple-100 text-purple-700',
  ANNOUNCEMENT: 'bg-yellow-100 text-yellow-700',
  HOLIDAY: 'bg-red-100 text-red-700',
};

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const { data: bannersData, isLoading } = useAdminBanners();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const banners = bannersData?.content || [];

  const handleAdd = () => {
    setSelectedBanner(null);
    setIsFormOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBanner?.id) return;
    
    setIsDeleting(true);
    try {
      await adminBannerApi.delete(selectedBanner.id);
      toast.success('Banner deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete banner');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (banner: Banner) => {
    if (!banner.id) return;
    
    try {
      await adminBannerApi.toggle(banner.id);
      toast.success(`Banner ${banner.isActive ? 'deactivated' : 'activated'}`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
    } catch (error) {
      console.error('Toggle failed:', error);
      toast.error('Failed to toggle banner');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No banners found. Click "Add Banner" to create one.
                  </td>
                </tr>
              ) : (
                banners.map((banner, i) => (
                  <motion.tr
                    key={banner.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {banner.imageUrl ? (
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.titleEn}
                          className="w-20 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1">{banner.titleEn}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{banner.messageEn}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeBg[banner.type] || 'bg-gray-100 text-gray-700'}`}>
                        {banner.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{banner.displayOrder}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(banner)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          banner.isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {banner.isActive ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(banner)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <BannerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        banner={selectedBanner}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Banner"
        message={`Are you sure you want to delete "${selectedBanner?.titleEn}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}