import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
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

const BANNER_STYLES = [
  { value: 'TOP_BAR', label: 'Top Bar' },
  { value: 'FULL_BANNER', label: 'Full Banner' },
  { value: 'POPUP', label: 'Popup' },
];

// Helper to convert backend date (array or string) to input format
const formatDateForInput = (date: any): string => {
  if (!date) return '';
  if (typeof date === 'string') return date.split('T')[0];
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return '';
};

export default function HolidayFormModal({ isOpen, onClose, holiday }: HolidayFormModalProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Partial<Holiday>>({
    nameEn: '',
    nameMm: '',
    startDate: '',
    endDate: '',
    reopenDate: '',
    greetingEn: '',
    greetingMm: '',
    theme: 'GENERAL',
    isActive: true,
  });

  useEffect(() => {
    if (holiday) {
      setForm({
        ...holiday,
        startDate: formatDateForInput(holiday.startDate),
        endDate: formatDateForInput(holiday.endDate),
        reopenDate: formatDateForInput(holiday.reopenDate),
      });
    } else {
      setForm({
        nameEn: '',
        nameMm: '',
        startDate: '',
        endDate: '',
        reopenDate: '',
        greetingEn: '',
        greetingMm: '',
        theme: 'GENERAL',
        isActive: true,
      });
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
      // Include additional fields for backend
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
                  {holiday ? 'Edit Holiday' : 'Add New Holiday'}
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
                  {/* Names */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Holiday Name (English) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Thingyan Festival"
                        value={form.nameEn || ''}
                        onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Holiday Name (Myanmar)
                      </label>
                      <input
                        type="text"
                        placeholder="သင်္ကြန်"
                        value={form.nameMm || ''}
                        onChange={(e) => setForm({ ...form, nameMm: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      />
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theme *
                    </label>
                    <select
                      required
                      value={form.theme || 'GENERAL'}
                      onChange={(e) => setForm({ ...form, theme: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    >
                      {HOLIDAY_THEMES.map((theme) => (
                        <option key={theme.value} value={theme.value}>
                          {theme.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dates */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Holiday Schedule
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={form.startDate || ''}
                          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date *
                        </label>
                        <input
                          type="date"
                          required
                          min={form.startDate || undefined}
                          value={form.endDate || ''}
                          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reopen Date
                        </label>
                        <input
                          type="date"
                          min={form.endDate || undefined}
                          value={form.reopenDate || ''}
                          onChange={(e) => setForm({ ...form, reopenDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                        />
                      </div>
                    </div>
                    
                    {/* Schedule Preview */}
                    {form.startDate && form.endDate && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-xs text-blue-700">
                          🏖️ Clinic closed from <strong>{form.startDate}</strong> to <strong>{form.endDate}</strong>
                          {form.reopenDate && (
                            <>
                              <br />
                              🏥 Reopens on <strong>{form.reopenDate}</strong>
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Greeting */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Greeting Message (English)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Happy Thingyan! Wishing you joy and prosperity!"
                      value={form.greetingEn || ''}
                      onChange={(e) => setForm({ ...form, greetingEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Greeting Message (Myanmar)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="သင်္ကြန်မင်္ဂလာပါ! ပျော်ရွှင်ချမ်းမြေ့ပါစေ!"
                      value={form.greetingMm || ''}
                      onChange={(e) => setForm({ ...form, greetingMm: e.target.value })}
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
                      Active (show on website)
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
                    {holiday ? 'Update Holiday' : 'Create Holiday'}
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