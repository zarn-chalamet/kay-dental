import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  Search,
  X,
  Filter,
  HelpCircle,
  Sparkles,
  EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminFaqs } from '@/hooks/useAdminData';
import { adminFaqApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import FaqFormModal from '@/components/admin/FaqFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Faq } from '@/types';
import toast from 'react-hot-toast';

const categoryConfig: Record<string, { bg: string; icon: string; label: string }> = {
  GENERAL:   { bg: 'bg-blue-100 text-blue-700',     icon: '📋', label: 'General' },
  TREATMENT: { bg: 'bg-green-100 text-green-700',   icon: '🦷', label: 'Treatment' },
  PAYMENT:   { bg: 'bg-purple-100 text-purple-700', icon: '💳', label: 'Payment' },
  EMERGENCY: { bg: 'bg-red-100 text-red-700',       icon: '🚨', label: 'Emergency' },
  BOOKING:   { bg: 'bg-yellow-100 text-yellow-700', icon: '📅', label: 'Booking' },
};

const CATEGORIES = ['ALL', 'GENERAL', 'TREATMENT', 'PAYMENT', 'EMERGENCY', 'BOOKING'];

export default function AdminFaqsPage() {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading } = useAdminFaqs();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter FAQs
  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      if (categoryFilter !== 'ALL' && f.category !== categoryFilter) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.questionEn?.toLowerCase().includes(q) ||
        f.questionMm?.toLowerCase().includes(q) ||
        f.answerEn?.toLowerCase().includes(q) ||
        f.answerMm?.toLowerCase().includes(q)
      );
    });
  }, [faqs, searchQuery, categoryFilter]);

  // Stats
  const activeCount = faqs.filter((f) => f.isActive).length;
  const inactiveCount = faqs.length - activeCount;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: faqs.length };
    faqs.forEach((f) => {
      counts[f.category] = (counts[f.category] || 0) + 1;
    });
    return counts;
  }, [faqs]);

  const handleAdd = () => {
    setSelectedFaq(null);
    setIsFormOpen(true);
  };

  const handleEdit = (faq: Faq, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFaq(faq);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (faq: Faq, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedFaq(faq);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFaq?.id) return;

    setIsDeleting(true);
    try {
      await adminFaqApi.delete(selectedFaq.id);
      toast.success('FAQ deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete FAQ');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading FAQs..." />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">FAQs</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Manage frequently asked questions and answers.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* ============ COMPACT STATS ============ */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <HelpCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                {faqs.length}
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
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
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
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isActive = categoryFilter === cat;
            const config = categoryConfig[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
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
            <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {searchQuery || categoryFilter !== 'ALL'
              ? 'No FAQs match your filters'
              : 'No FAQs yet'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== 'ALL'
              ? 'Try adjusting your search or filters.'
              : 'Answer common questions to help your patients.'}
          </p>
          {searchQuery || categoryFilter !== 'ALL' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
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
              Add FAQ
            </button>
          )}
        </div>
      ) : (
        /* ============ FAQ LIST ============ */
        <div className="space-y-2 sm:space-y-3">
          {filtered.map((faq, i) => {
            const config = categoryConfig[faq.category] || categoryConfig.GENERAL;
            const isExpanded = expandedId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                  !faq.isActive ? 'opacity-70' : ''
                }`}
              >
                {/* Question Row (clickable) */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : (faq.id ?? null))
                  }
                  className="w-full text-left p-4 sm:p-5 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Chevron */}
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5 transition-colors ${
                        isExpanded
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Meta */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${config.bg}`}>
                          {config.icon} {config.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            faq.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              faq.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          />
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Question */}
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                        {faq.questionEn}
                      </h3>

                      {/* Preview when collapsed */}
                      {!isExpanded && faq.answerEn && (
                        <p className="mt-1.5 text-xs text-gray-500 line-clamp-1">
                          {faq.answerEn}
                        </p>
                      )}
                    </div>

                    {/* Actions - Hidden on mobile when collapsed */}
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleEdit(faq, e)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(faq, e)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-3">
                        {/* Myanmar Question */}
                        {faq.questionMm && (
                          <div className="pl-10">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Question (Myanmar)
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {faq.questionMm}
                            </p>
                          </div>
                        )}

                        {/* English Answer */}
                        <div className="pl-10">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Answer (English)
                          </div>
                          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {faq.answerEn}
                            </p>
                          </div>
                        </div>

                        {/* Myanmar Answer */}
                        {faq.answerMm && (
                          <div className="pl-10">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Answer (Myanmar)
                            </div>
                            <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {faq.answerMm}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Mobile Actions */}
                        <div className="sm:hidden pl-10 flex items-center gap-2 pt-2">
                          <button
                            onClick={(e) => handleEdit(faq, e)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(faq, e)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <FaqFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        faq={selectedFaq}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}