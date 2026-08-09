import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminHolidays } from '@/hooks/useAdminData';
import { adminHolidayApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import HolidayFormModal from '@/components/admin/HolidayFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import type { Holiday } from '@/types';
import toast from 'react-hot-toast';

const themeBg: Record<string, string> = {
  THINGYAN: 'bg-blue-100 text-blue-700',
  THADINGYUT: 'bg-yellow-100 text-yellow-700',
  TAZAUNGDAING: 'bg-orange-100 text-orange-700',
  CHRISTMAS: 'bg-red-100 text-red-700',
  NEW_YEAR: 'bg-purple-100 text-purple-700',
  NATIONAL: 'bg-green-100 text-green-700',
  GENERAL: 'bg-gray-100 text-gray-700',
};

// Helper to format date for display
const formatDate = (date: any): string => {
  if (!date) return '-';
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  if (typeof date === 'string') return date.split('T')[0];
  return String(date);
};

export default function AdminHolidaysPage() {
  const queryClient = useQueryClient();
  const { data: holidays = [], isLoading } = useAdminHolidays();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Holidays</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Holiday
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Holiday Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Theme</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reopen Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holidays.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No holidays found. Click "Add Holiday" to create one.
                  </td>
                </tr>
              ) : (
                holidays.map((holiday, i) => (
                  <motion.tr
                    key={holiday.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{holiday.nameEn}</div>
                      {holiday.nameMm && (
                        <div className="text-xs text-gray-500">{holiday.nameMm}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${themeBg[holiday.theme] || 'bg-gray-100 text-gray-700'}`}>
                        {holiday.theme}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(holiday.startDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(holiday.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(holiday.reopenDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        holiday.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {holiday.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(holiday)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(holiday)}
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