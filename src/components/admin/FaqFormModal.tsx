import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminFaqApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { Faq } from '@/types';
import toast from 'react-hot-toast';

interface FaqFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: Faq | null;
}

const FAQ_CATEGORIES = [
  { value: 'GENERAL', label: '📋 General' },
  { value: 'TREATMENT', label: '🦷 Treatment' },
  { value: 'PAYMENT', label: '💳 Payment' },
  { value: 'EMERGENCY', label: '🚨 Emergency' },
  { value: 'BOOKING', label: '📅 Booking' },
];

export default function FaqFormModal({ isOpen, onClose, faq }: FaqFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Faq>>({
    questionEn: '',
    questionMm: '',
    answerEn: '',
    answerMm: '',
    category: 'GENERAL',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (faq) {
      setForm(faq);
    } else {
      setForm({
        questionEn: '',
        questionMm: '',
        answerEn: '',
        answerMm: '',
        category: 'GENERAL',
        displayOrder: 0,
        isActive: true,
      });
    }
  }, [faq, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (faq?.id) {
        await adminFaqApi.update(faq.id, form);
        toast.success('FAQ updated successfully');
      } else {
        await adminFaqApi.create(form);
        toast.success('FAQ created successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  {faq ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  {/* Category & Order */}
                  <div className="grid grid-cols-2 gap-4">
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
                        {FAQ_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
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

                  {/* Question (English) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question (English) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={500}
                      placeholder="What are your clinic hours?"
                      value={form.questionEn || ''}
                      onChange={(e) => setForm({ ...form, questionEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{(form.questionEn || '').length}/500 characters</p>
                  </div>

                  {/* Question (Myanmar) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question (Myanmar)
                    </label>
                    <input
                      type="text"
                      maxLength={500}
                      placeholder="ဆေးခန်း ဖွင့်ချိန်က ဘယ်အချိန်လဲ?"
                      value={form.questionMm || ''}
                      onChange={(e) => setForm({ ...form, questionMm: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  </div>

                  {/* Answer (English) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer (English) *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="We are open Monday to Friday 9AM-6PM..."
                      value={form.answerEn || ''}
                      onChange={(e) => setForm({ ...form, answerEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  {/* Answer (Myanmar) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer (Myanmar)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="တနင်္လာနေ့မှ သောကြာနေ့ မနက် ၉ နာရီမှ ညနေ ၆ နာရီ..."
                      value={form.answerMm || ''}
                      onChange={(e) => setForm({ ...form, answerMm: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
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
                    onClick={onClose}
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
                    {faq ? 'Update FAQ' : 'Create FAQ'}
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