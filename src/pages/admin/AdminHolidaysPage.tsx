import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Search,
  Filter,
  X,
  Grid3x3,
  List,
  CalendarOff,
  CalendarCheck,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminHolidays } from '@/hooks/useAdminData';
import { adminHolidayApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import HolidayFormModal from '@/components/admin/HolidayFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Holiday } from '@/types';
import toast from 'react-hot-toast';

const themeConfig: Record<string, { bg: string; icon: string; label: string }> = {
  THINGYAN:     { bg: 'bg-blue-100 text-blue-700',     icon: '💦', label: 'Thingyan' },
  THADINGYUT:   { bg: 'bg-yellow-100 text-yellow-700', icon: '🕯️', label: 'Thadingyut' },
  TAZAUNGDAING: { bg: 'bg-orange-100 text-orange-700', icon: '🏮', label: 'Tazaungdaing' },
  CHRISTMAS:    { bg: 'bg-red-100 text-red-700',       icon: '🎄', label: 'Christmas' },
  NEW_YEAR:     { bg: 'bg-purple-100 text-purple-700', icon: '🎉', label: 'New Year' },
  NATIONAL:     { bg: 'bg-green-100 text-green-700',   icon: '🇲🇲', label: 'National' },
  GENERAL:      { bg: 'bg-gray-100 text-gray-700',     icon: '📅', label: 'General' },
};

const THEMES = ['ALL', 'THINGYAN', 'THADINGYUT', 'TAZAUNGDAING', 'CHRISTMAS', 'NEW_YEAR', 'NATIONAL', 'GENERAL'];

type ViewMode = 'grid' | 'table';

// Helper to format date
const formatDate = (date: unknown): string => {
  if (!date) return '-';
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  if (typeof date === 'string') return date.split('T')[0];
  return String(date);
};

const formatDateReadable = (date: unknown): string => {
  const dateStr = formatDate(date);
  if (dateStr === '-') return '-';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const getHolidayStatus = (holiday: Holiday): 'upcoming' | 'current' | 'past' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(formatDate(holiday.startDate));
  const endDate = new Date(formatDate(holiday.endDate));
  if (today < startDate) return 'upcoming';
  if (today > endDate) return 'past';
  return 'current';
};

const getDuration = (holiday: Holiday): number => {
  const start = new Date(formatDate(holiday.startDate));
  const end = new Date(formatDate(holiday.endDate));
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

export default function AdminHolidaysPage() {
  const queryClient = useQueryClient();
  const { data: holidays = [], isLoading } = useAdminHolidays();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState<string>('ALL');
  const [showPast, setShowPast] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter holidays
  const filtered = useMemo(() => {
    return holidays.filter((h) => {
      // Auto-hide past holidays unless toggled
      const status = getHolidayStatus(h);
      if (!showPast && status === 'past') return false;

      // Theme filter
      if (themeFilter !== 'ALL' && h.theme !== themeFilter) return false;

      // Search
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        h.nameEn?.toLowerCase().includes(q) ||
        h.nameMm?.toLowerCase().includes(q) ||
        h.theme?.toLowerCase().includes(q)
      );
    });
  }, [holidays, searchQuery, themeFilter, showPast]);

  // Stats
  const activeCount = holidays.filter((h) => h.isActive).length;
  const upcomingCount = holidays.filter(
    (h) => h.isActive && (getHolidayStatus(h) === 'upcoming' || getHolidayStatus(h) === 'current')
  ).length;
  const pastCount = holidays.filter((h) => getHolidayStatus(h) === 'past').length;

  // Theme counts (only from visible)
  const themeCounts = useMemo(() => {
    const visibleHolidays = showPast ? holidays : holidays.filter((h) => getHolidayStatus(h) !== 'past');
    const counts: Record<string, number> = { ALL: visibleHolidays.length };
    visibleHolidays.forEach((h) => {
      counts[h.theme] = (counts[h.theme] || 0) + 1;
    });
    return counts;
  }, [holidays, showPast]);

  const handleAdd = () => {
    setSelectedHoliday(null);
    setIsFormOpen(true);
  };

  const handleEdit = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedHoliday?.id) return;

    setIsDeleting(true);
    try {
      await adminHolidayApi.delete(selectedHoliday.id);
      toast.success('Holiday deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'holidays'] });
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete holiday');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setThemeFilter('ALL');
    setShowPast(false);
  };

  if (isLoading) return <LoadingSpinner label="Loading holidays..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Holidays</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Manage clinic closure dates and holiday announcements.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Holiday
        </button>
      </div>

      {/* ============ COMPACT STATS ============ */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {holidays.length}
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
              <CalendarCheck className="w-4 h-4 text-green-600" />
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
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {upcomingCount}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                Upcoming
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ TOOLBAR ============ */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3 sm:p-4 mb-4 space-y-3">
        {/* Search + View Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search holidays..."
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

        {/* Theme Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 mr-0.5 shrink-0">
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Theme:</span>
          </div>
          {THEMES.map((theme) => {
            const count = themeCounts[theme] || 0;
            const isActive = themeFilter === theme;
            const config = themeConfig[theme];
            return (
              <button
                key={theme}
                onClick={() => setThemeFilter(theme)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {theme === 'ALL' ? 'All' : `${config?.icon || ''} ${config?.label || theme}`}
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

        {/* Show Past Toggle */}
        {pastCount > 0 && (
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {showPast ? (
                  <>Showing <strong>{pastCount}</strong> past {pastCount === 1 ? 'holiday' : 'holidays'}</>
                ) : (
                  <><strong>{pastCount}</strong> past {pastCount === 1 ? 'holiday is' : 'holidays are'} hidden</>
                )}
              </span>
            </div>
            <button
              onClick={() => setShowPast(!showPast)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                showPast
                  ? 'bg-gray-800 text-white hover:bg-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showPast ? (
                <>
                  <CalendarOff className="w-3.5 h-3.5" />
                  Hide Past
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  Show Past
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ============ EMPTY STATE ============ */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-100">
            <CalendarOff className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {searchQuery || themeFilter !== 'ALL'
              ? 'No holidays match your filters'
              : !showPast && pastCount > 0
              ? 'No upcoming holidays'
              : 'No holidays yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery || themeFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : !showPast && pastCount > 0
              ? `You have ${pastCount} past ${pastCount === 1 ? 'holiday' : 'holidays'}. Click "Show Past" to view them.`
              : 'Add clinic closure dates and holiday announcements.'}
          </p>
          {searchQuery || themeFilter !== 'ALL' ? (
            <button
              onClick={clearAllFilters}
              className="mt-4 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              Clear filters
            </button>
          ) : !showPast && pastCount > 0 ? (
            <button
              onClick={() => setShowPast(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 transition-all"
            >
              <Calendar className="w-4 h-4" />
              Show Past Holidays
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Holiday
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* ============ GRID VIEW ============ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((holiday, i) => {
            const config = themeConfig[holiday.theme] || themeConfig.GENERAL;
            const status = getHolidayStatus(holiday);
            const duration = getDuration(holiday);
            const isPast = status === 'past';

            return (
              <motion.div
                key={holiday.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                  isPast ? 'opacity-75' : ''
                }`}
              >
                <div className={`relative aspect-[3/2] flex items-center justify-center ${config.bg.replace('text-', 'bg-').split(' ')[0]}/30`}>
                  <span className={`text-5xl sm:text-6xl ${isPast ? 'grayscale opacity-60' : ''}`}>
                    {config.icon}
                  </span>

                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur ${
                        status === 'current'
                          ? 'bg-red-100/95 text-red-700'
                          : status === 'upcoming'
                          ? 'bg-orange-100/95 text-orange-700'
                          : 'bg-gray-100/95 text-gray-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          status === 'current'
                            ? 'bg-red-500 animate-pulse'
                            : status === 'upcoming'
                            ? 'bg-orange-500'
                            : 'bg-gray-400'
                        }`}
                      />
                      {status === 'current'
                        ? 'Ongoing'
                        : status === 'upcoming'
                        ? 'Upcoming'
                        : 'Past'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur ${
                        holiday.isActive
                          ? 'bg-green-100/95 text-green-700'
                          : 'bg-gray-100/95 text-gray-700'
                      }`}
                    >
                      {holiday.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">
                        {holiday.nameEn}
                      </h3>
                      {holiday.nameMm && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {holiday.nameMm}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${config.bg}`}
                    >
                      {config.label}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {formatDateReadable(holiday.startDate)}
                        {formatDate(holiday.startDate) !== formatDate(holiday.endDate) && (
                          <> → {formatDateReadable(holiday.endDate)}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                      <span>
                        {duration} {duration === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(holiday)}
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
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Holiday</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Theme</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Reopen</th>
                    <th className="text-left px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((holiday, i) => {
                    const config = themeConfig[holiday.theme] || themeConfig.GENERAL;
                    const status = getHolidayStatus(holiday);
                    const duration = getDuration(holiday);
                    const isPast = status === 'past';

                    return (
                      <motion.tr
                        key={holiday.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className={`hover:bg-gray-50/70 transition-colors ${isPast ? 'opacity-70' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg} text-lg shrink-0 ${isPast ? 'grayscale' : ''}`}>
                              {config.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 truncate">
                                {holiday.nameEn}
                              </div>
                              {holiday.nameMm && (
                                <div className="text-xs text-gray-500 truncate mt-0.5">
                                  {holiday.nameMm}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg}`}>
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                            <div>
                              <div className="text-sm text-gray-900 font-medium leading-tight">
                                {formatDateReadable(holiday.startDate)}
                                {formatDate(holiday.startDate) !== formatDate(holiday.endDate) && (
                                  <>
                                    <span className="text-gray-400 mx-1">→</span>
                                    {formatDateReadable(holiday.endDate)}
                                  </>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {duration} {duration === 1 ? 'day' : 'days'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {holiday.reopenDate ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              {formatDateReadable(holiday.reopenDate)}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Not set</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold w-fit ${
                                holiday.isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  holiday.isActive ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                              />
                              {holiday.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold w-fit ${
                                status === 'current'
                                  ? 'bg-red-50 text-red-700'
                                  : status === 'upcoming'
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'bg-gray-50 text-gray-600'
                              }`}
                            >
                              {status === 'current' ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                  Ongoing
                                </>
                              ) : status === 'upcoming' ? (
                                <>
                                  <Clock className="w-2.5 h-2.5" />
                                  Upcoming
                                </>
                              ) : (
                                <>
                                  <CalendarOff className="w-2.5 h-2.5" />
                                  Past
                                </>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(holiday)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(holiday)}
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
            {filtered.map((holiday, i) => {
              const config = themeConfig[holiday.theme] || themeConfig.GENERAL;
              const status = getHolidayStatus(holiday);
              const duration = getDuration(holiday);
              const isPast = status === 'past';

              return (
                <motion.div
                  key={holiday.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className={`rounded-xl border border-gray-100 bg-white p-3 shadow-sm ${isPast ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.bg} text-2xl shrink-0 ${isPast ? 'grayscale' : ''}`}>
                      {config.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {holiday.nameEn}
                          </h3>
                          {holiday.nameMm && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {holiday.nameMm}
                            </p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                            holiday.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {holiday.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg}`}>
                          {config.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            status === 'current'
                              ? 'bg-red-50 text-red-700'
                              : status === 'upcoming'
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {status === 'current' ? '🔴 Ongoing' : status === 'upcoming' ? '⏳ Upcoming' : '✓ Past'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateReadable(holiday.startDate)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {duration}d
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(holiday)}
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

      <HolidayFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        holiday={selectedHoliday}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Holiday"
        message={`Are you sure you want to delete "${selectedHoliday?.nameEn}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}