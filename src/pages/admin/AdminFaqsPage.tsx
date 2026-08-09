import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminFaqs } from '@/hooks/useAdminData';
import { adminFaqApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import FaqFormModal from '@/components/admin/FaqFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Faq } from '@/types';
import toast from 'react-hot-toast';

const categoryBg: Record<string, string> = {
  GENERAL: 'bg-blue-100 text-blue-700',
  TREATMENT: 'bg-green-100 text-green-700',
  PAYMENT: 'bg-purple-100 text-purple-700',
  EMERGENCY: 'bg-red-100 text-red-700',
  BOOKING: 'bg-yellow-100 text-yellow-700',
};

export default function AdminFaqsPage() {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading } = useAdminFaqs();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleAdd = () => {
    setSelectedFaq(null);
    setIsFormOpen(true);
  };

  const handleEdit = (faq: Faq) => {
    setSelectedFaq(faq);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (faq: Faq) => {
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
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete FAQ');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">
            No FAQs found. Click "Add FAQ" to create one.
          </div>
        ) : (
          faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="card overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Expand Button */}
                  <button
                    onClick={() => setExpandedId(expandedId === faq.id ? null : (faq.id ?? null))}
                    className="p-1 rounded hover:bg-gray-100 transition-colors mt-1"
                  >
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryBg[faq.category] || 'bg-gray-100 text-gray-700'}`}>
                            {faq.category}
                          </span>
                          <span className="text-xs text-gray-400">Order: {faq.displayOrder}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            faq.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {faq.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {faq.questionEn}
                        </h3>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(faq)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 space-y-3"
                        >
                          {/* Myanmar Question */}
                          {faq.questionMm && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Question (Myanmar):</p>
                              <p className="text-sm text-gray-700">{faq.questionMm}</p>
                            </div>
                          )}

                          {/* English Answer */}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500 mb-1">Answer (English):</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{faq.answerEn}</p>
                          </div>

                          {/* Myanmar Answer */}
                          {faq.answerMm && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">Answer (Myanmar):</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{faq.answerMm}</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

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