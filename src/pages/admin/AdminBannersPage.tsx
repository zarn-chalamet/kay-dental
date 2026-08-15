import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
  Grid3x3,
  List,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminBanners } from '@/hooks/useAdminData';
import { adminBannerApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import BannerFormModal from '@/components/admin/BannerFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Banner } from '@/types';
import toast from 'react-hot-toast';

const typeConfig: Record<string, { bg: string; icon: string; label: string }> = {
  GENERAL:      { bg: 'bg-blue-100 text-blue-700',     icon: '📢', label: 'General' },
  PROMOTION:    { bg: 'bg-purple-100 text-purple-700', icon: '🎁', label: 'Promotion' },
  ANNOUNCEMENT: { bg: 'bg-yellow-100 text-yellow-700', icon: '📣', label: 'Announcement' },
  HOLIDAY:      { bg: 'bg-red-100 text-red-700',       icon: '🎉', label: 'Holiday' },
};

const TYPES = ['ALL', 'GENERAL', 'PROMOTION', 'ANNOUNCEMENT', 'HOLIDAY'];

type ViewMode = 'grid' | 'table';

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const { data: bannersData, isLoading } = useAdminBanners();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const banners = useMemo(() => bannersData?.content || [], [bannersData]);

  // Filter banners
  const filtered = useMemo(() => {
    return banners.filter((b) => {
      if (typeFilter !== 'ALL' && b.type !== typeFilter) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.titleEn?.toLowerCase().includes(q) ||
        b.titleMm?.toLowerCase().includes(q) ||
        b.messageEn?.toLowerCase().includes(q) ||
        b.type?.toLowerCase().includes(q)
      );
    });
  }, [banners, searchQuery, typeFilter]);

  // Stats
  const activeCount = banners.filter((b) => b.isActive).length;
  const inactiveCount = banners.length - activeCount;

  // Type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: banners.length };
    banners.forEach((b) => {
      counts[b.type] = (counts[b.type] || 0) + 1;
    });
    return counts;
  }, [banners]);

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

  const handleToggle = async (banner: Banner, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!banner.id) return;

    try {
      await adminBannerApi.toggle(banner.id);
      toast.success(`Banner ${banner.isActive ? 'deactivated' : 'activated'}`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    } catch (error) {
      console.error('Toggle failed:', error);
      toast.error('Failed to toggle banner');
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading banners..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Banners</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Manage homepage carousel banners and promotional content.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Banner
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
                {banners.length}
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
              <Sparkles className="w-4 h-4 text-green-600" />
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
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search banners..."
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

          <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-gray-100 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mr-0.5 shrink-0">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Type:</span>
          </div>
          {TYPES.map((type) => {
            const count = typeCounts[type] || 0;
            const isActive = typeFilter === type;
            const config = typeConfig[type];
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'ALL' ? 'All' : `${config?.icon || ''} ${config?.label || type}`}
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
            <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {searchQuery || typeFilter !== 'ALL'
              ? 'No banners match your filters'
              : 'No banners yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery || typeFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Create eye-catching banners for your homepage carousel.'}
          </p>
          {searchQuery || typeFilter !== 'ALL' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
              }}
              className="mt-4 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ============ GRID VIEW ============ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((banner, i) => {
            const config = typeConfig[banner.type] || typeConfig.GENERAL;
            return (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                  !banner.isActive ? 'opacity-70' : ''
                }`}
              >
                {/* Banner Image */}
                <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.titleEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                      <ImageIcon className="w-12 h-12 text-green-600" />
                    </div>
                  )}

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur ${config.bg}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>

                  {/* Order badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-sm">
                      #{banner.displayOrder}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1">
                    {banner.titleEn}
                  </h3>
                  {banner.titleMm && (
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {banner.titleMm}
                    </p>
                  )}
                  {banner.messageEn && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {banner.messageEn}
                    </p>
                  )}

                  {/* Status Toggle */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => handleToggle(banner, e)}
                      className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                        banner.isActive
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {banner.isActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Active — Click to Hide
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Inactive — Click to Show
                        </>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(banner)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ============ TABLE / LIST VIEW ============ */
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Banner</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((banner, i) => {
                    const config = typeConfig[banner.type] || typeConfig.GENERAL;
                    return (
                      <motion.tr
                        key={banner.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className={`hover:bg-gray-50/70 transition-colors ${!banner.isActive ? 'opacity-70' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {banner.imageUrl ? (
                              <img
                                src={banner.imageUrl}
                                alt={banner.titleEn}
                                className="w-20 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                              />
                            ) : (
                              <div className="w-20 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shrink-0">
                                <ImageIcon className="w-5 h-5 text-green-600" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 line-clamp-1">
                                {banner.titleEn}
                              </div>
                              {banner.messageEn && (
                                <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                  {banner.messageEn}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg}`}>
                            {config.icon} {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center rounded-full bg-gray-100 min-w-[28px] h-7 px-2 text-xs font-bold text-gray-700">
                            {banner.displayOrder}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => handleToggle(banner, e)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
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
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(banner)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(banner)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile List */}
          <div className="md:hidden space-y-2">
            {filtered.map((banner, i) => {
              const config = typeConfig[banner.type] || typeConfig.GENERAL;
              return (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className={`rounded-xl border border-gray-100 bg-white p-3 shadow-sm ${!banner.isActive ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {banner.imageUrl ? (
                      <img
                        src={banner.imageUrl}
                        alt={banner.titleEn}
                        className="w-20 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-6 h-6 text-green-600" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {banner.titleEn}
                          </h3>
                          {banner.messageEn && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {banner.messageEn}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center justify-center rounded-full bg-gray-100 min-w-[24px] h-5 px-1.5 text-[10px] font-bold text-gray-700 shrink-0">
                          #{banner.displayOrder}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg}`}>
                          {config.icon} {config.label}
                        </span>
                        <button
                          onClick={(e) => handleToggle(banner, e)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                            banner.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {banner.isActive ? (
                            <>
                              <Eye className="w-2.5 h-2.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-2.5 h-2.5" />
                              Inactive
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(banner)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

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