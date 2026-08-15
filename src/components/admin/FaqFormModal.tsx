import { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  ChevronLeft,
  Save,
  HelpCircle,
  Sparkles,
  Tag,
  MessageCircle,
} from 'lucide-react';
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

// Reusable classes
const inputClassName =
  'h-10 sm:h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20';

const textareaClassName =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 sm:px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none';

const labelClassName = 'block mb-1.5 text-sm font-semibold text-gray-700';

// Section component
function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 pb-1.5 border-b border-gray-100">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-green-100 mt-0.5">
          <Icon className="w-3 h-3 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-[11px] text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

const DEFAULT_FORM: Partial<Faq> = {
  questionEn: '',
  questionMm: '',
  answerEn: '',
  answerMm: '',
  category: 'GENERAL',
  displayOrder: 0,
  isActive: true,
};

export default function FaqFormModal({ isOpen, onClose, faq }: FaqFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Faq>>(DEFAULT_FORM);

  useEffect(() => {
    if (faq) {
      setForm(faq);
    } else {
      setForm(DEFAULT_FORM);
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

  const handleClose = () => {
    if (isSubmitting) return;
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
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none"
          >
            <div
              className="
                bg-white w-full sm:max-w-2xl 
                sm:rounded-2xl rounded-t-2xl
                sm:max-h-[90vh] max-h-[95vh]
                overflow-hidden pointer-events-auto 
                flex flex-col shadow-2xl
              "
            >
              {/* ============ HEADER ============ */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-br from-green-50/50 to-white shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="sm:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                    aria-label="Close"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-sm shrink-0">
                    {faq ? (
                      <HelpCircle className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {faq ? 'Edit FAQ' : 'Add New FAQ'}
                    </h2>
                    <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
                      {faq
                        ? 'Update this frequently asked question'
                        : 'Add a new question and answer'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* ============ FORM BODY ============ */}
              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto"
                aria-busy={isSubmitting}
              >
                <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                  {/* Category & Order */}
                  <FormSection icon={Tag} title="Category & Order">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={form.category || 'GENERAL'}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value as any })
                          }
                          className={`${inputClassName} appearance-none cursor-pointer`}
                        >
                          {FAQ_CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClassName}>Display Order</label>
                        <input
                          type="number"
                          min="0"
                          value={form.displayOrder || 0}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              displayOrder: Number(e.target.value),
                            })
                          }
                          className={inputClassName}
                        />
                        <p className="mt-1 text-[11px] text-gray-500">
                          Lower = appears first
                        </p>
                      </div>
                    </div>
                  </FormSection>

                  {/* Question */}
                  <FormSection
                    icon={HelpCircle}
                    title="Question"
                    description="What the patient is asking"
                  >
                    <div>
                      <label className={labelClassName}>
                        Question (English) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={500}
                        placeholder="What are your clinic hours?"
                        value={form.questionEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, questionEn: e.target.value })
                        }
                        className={inputClassName}
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        {(form.questionEn || '').length}/500 characters
                      </p>
                    </div>

                    <div>
                      <label className={labelClassName}>Question (Myanmar)</label>
                      <input
                        type="text"
                        maxLength={500}
                        placeholder="ဆေးခန်း ဖွင့်ချိန်က ဘယ်အချိန်လဲ?"
                        value={form.questionMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, questionMm: e.target.value })
                        }
                        className={inputClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Answer */}
                  <FormSection
                    icon={MessageCircle}
                    title="Answer"
                    description="How to answer the question"
                  >
                    <div>
                      <label className={labelClassName}>
                        Answer (English) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="We are open Monday to Friday 9AM-6PM..."
                        value={form.answerEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, answerEn: e.target.value })
                        }
                        className={textareaClassName}
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        {(form.answerEn || '').length} characters
                      </p>
                    </div>

                    <div>
                      <label className={labelClassName}>Answer (Myanmar)</label>
                      <textarea
                        rows={4}
                        placeholder="တနင်္လာနေ့မှ သောကြာနေ့ မနက် ၉ နာရီမှ ညနေ ၆ နာရီ..."
                        value={form.answerMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, answerMm: e.target.value })
                        }
                        className={textareaClassName}
                      />
                    </div>
                  </FormSection>

                  {/* Visibility */}
                  <FormSection icon={Sparkles} title="Visibility">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          checked={form.isActive ?? true}
                          onChange={(e) =>
                            setForm({ ...form, isActive: e.target.checked })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900">
                          Active on Website
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Show this FAQ on the public website
                        </div>
                      </div>
                    </label>
                  </FormSection>
                </div>

                {/* ============ STICKY FOOTER ============ */}
                <div className="sticky bottom-0 flex items-center justify-end gap-2 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-initial inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {faq ? 'Update' : 'Create'}
                      </>
                    )}
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