import { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  ChevronLeft,
  Save,
  Calendar,
  CalendarOff,
  MessageSquare,
  Sparkles,
  Palette,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminHolidayApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { Holiday } from '@/types';
import toast from 'react-hot-toast';

interface HolidayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  holiday?: Holiday | null;
}

const HOLIDAY_THEMES = [
  { value: 'THINGYAN', label: '💦 Thingyan (Water Festival)' },
  { value: 'THADINGYUT', label: '🕯️ Thadingyut (Festival of Lights)' },
  { value: 'TAZAUNGDAING', label: '🏮 Tazaungdaing' },
  { value: 'CHRISTMAS', label: '🎄 Christmas' },
  { value: 'NEW_YEAR', label: '🎉 New Year' },
  { value: 'NATIONAL', label: '🇲🇲 National Holiday' },
  { value: 'GENERAL', label: '📅 General' },
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

// Helper to convert backend date to input format
const formatDateForInput = (date: unknown): string => {
  if (!date) return '';
  if (typeof date === 'string') return date.split('T')[0];
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return '';
};

const DEFAULT_FORM: Partial<Holiday> = {
  nameEn: '',
  nameMm: '',
  startDate: '',
  endDate: '',
  reopenDate: '',
  greetingEn: '',
  greetingMm: '',
  theme: 'GENERAL',
  isActive: true,
};

export default function HolidayFormModal({
  isOpen,
  onClose,
  holiday,
}: HolidayFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Holiday>>(DEFAULT_FORM);

  useEffect(() => {
    if (holiday) {
      setForm({
        ...holiday,
        startDate: formatDateForInput(holiday.startDate),
        endDate: formatDateForInput(holiday.endDate),
        reopenDate: formatDateForInput(holiday.reopenDate),
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [holiday, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    if (form.startDate && form.endDate) {
      if (new Date(form.endDate) < new Date(form.startDate)) {
        toast.error('End date must be after or equal to start date');
        return;
      }
    }

    if (form.reopenDate && form.endDate) {
      if (new Date(form.reopenDate) <= new Date(form.endDate)) {
        toast.error('Reopen date must be after end date');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const dataToSave = {
        ...form,
        bannerStyle: 'TOP_BAR',
        notifyDaysBefore: 7,
        showEmergencyContact: true,
      };

      if (holiday?.id) {
        await adminHolidayApi.update(holiday.id, dataToSave);
        toast.success('Holiday updated successfully');
      } else {
        await adminHolidayApi.create(dataToSave);
        toast.success('Holiday created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'holidays'] });
      queryClient.invalidateQueries({ queryKey: ['holiday'] });
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save holiday');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  // Calculate duration
  const duration = form.startDate && form.endDate
    ? Math.ceil(
        (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : 0;

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
                    {holiday ? (
                      <Calendar className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      {holiday ? 'Edit Holiday' : 'Add New Holiday'}
                    </h2>
                    <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
                      {holiday
                        ? `Editing ${holiday.nameEn}`
                        : 'Add a clinic closure or holiday announcement'}
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
                  {/* Basic Info */}
                  <FormSection icon={Calendar} title="Holiday Information">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Name (English) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Thingyan Festival"
                          value={form.nameEn || ''}
                          onChange={(e) =>
                            setForm({ ...form, nameEn: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>Name (Myanmar)</label>
                        <input
                          type="text"
                          placeholder="သင်္ကြန်"
                          value={form.nameMm || ''}
                          onChange={(e) =>
                            setForm({ ...form, nameMm: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Theme */}
                  <FormSection icon={Palette} title="Theme">
                    <div>
                      <label className={labelClassName}>
                        Holiday Theme <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={form.theme || 'GENERAL'}
                        onChange={(e) => setForm({ ...form, theme: e.target.value })}
                        className={`${inputClassName} appearance-none cursor-pointer`}
                      >
                        {HOLIDAY_THEMES.map((theme) => (
                          <option key={theme.value} value={theme.value}>
                            {theme.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormSection>

                  {/* Schedule */}
                  <FormSection
                    icon={CalendarOff}
                    title="Closure Schedule"
                    description="When the clinic will be closed"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className={labelClassName}>
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={form.startDate || ''}
                          onChange={(e) =>
                            setForm({ ...form, startDate: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>
                          End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          min={form.startDate || undefined}
                          value={form.endDate || ''}
                          onChange={(e) =>
                            setForm({ ...form, endDate: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>Reopen Date</label>
                        <input
                          type="date"
                          min={form.endDate || undefined}
                          value={form.reopenDate || ''}
                          onChange={(e) =>
                            setForm({ ...form, reopenDate: e.target.value })
                          }
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    {/* Schedule Preview */}
                    {form.startDate && form.endDate && duration > 0 && (
                      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0 text-xs text-blue-800 space-y-1">
                            <div>
                              🏖️ Clinic closed for{' '}
                              <strong>{duration} {duration === 1 ? 'day' : 'days'}</strong>
                            </div>
                            <div>
                              From <strong>{form.startDate}</strong> to{' '}
                              <strong>{form.endDate}</strong>
                            </div>
                            {form.reopenDate && (
                              <div>
                                🏥 Reopens on <strong>{form.reopenDate}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </FormSection>

                  {/* Greeting */}
                  <FormSection
                    icon={MessageSquare}
                    title="Greeting Message"
                    description="Optional festive message for patients"
                  >
                    <div>
                      <label className={labelClassName}>Greeting (English)</label>
                      <textarea
                        rows={3}
                        placeholder="Happy Thingyan! Wishing you joy and prosperity!"
                        value={form.greetingEn || ''}
                        onChange={(e) =>
                          setForm({ ...form, greetingEn: e.target.value })
                        }
                        className={textareaClassName}
                      />
                    </div>

                    <div>
                      <label className={labelClassName}>Greeting (Myanmar)</label>
                      <textarea
                        rows={3}
                        placeholder="သင်္ကြန်မင်္ဂလာပါ! ပျော်ရွှင်ချမ်းမြေ့ပါစေ!"
                        value={form.greetingMm || ''}
                        onChange={(e) =>
                          setForm({ ...form, greetingMm: e.target.value })
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
                          checked={form.isActive || false}
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
                          Show on Website
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Display holiday notice to visitors
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
                        {holiday ? 'Update' : 'Create'}
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