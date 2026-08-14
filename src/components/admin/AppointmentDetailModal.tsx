import { useState, useEffect } from 'react';
import { X, Loader2, User, Phone, Mail, Calendar, Clock, Stethoscope, UserCheck, FileText, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAppointmentApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { Appointment } from '@/types';
import toast from 'react-hot-toast';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const STATUS_OPTIONS = [
  { value: 'PENDING',   label: '⏳ Pending',   color: 'bg-yellow-100 text-yellow-700' },
  { value: 'CONFIRMED', label: '✅ Confirmed', color: 'bg-green-100 text-green-700' },
  { value: 'COMPLETED', label: '✔️ Completed', color: 'bg-blue-100 text-blue-700' },
  { value: 'CANCELLED', label: '❌ Cancelled', color: 'bg-red-100 text-red-700' },
  { value: 'NO_SHOW',   label: '⚠️ No Show',   color: 'bg-gray-100 text-gray-700' },
];

// Helper to format dates from backend
const formatDate = (date: unknown): string => {
  if (!date) return '-';
  if (typeof date === 'string') return date.split('T')[0];
  if (Array.isArray(date)) {
    const [y, m, d] = date;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return String(date);
};

const formatTime = (time: unknown): string => {
  if (!time) return '-';
  if (typeof time === 'string') return time.substring(0, 5); // "09:00:00" → "09:00"
  return String(time);
};

const formatDateTime = (dateTime: unknown): string => {
  if (!dateTime) return '-';
  try {
    return new Date(String(dateTime)).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return String(dateTime);
  }
};

export default function AppointmentDetailModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentDetailModalProps) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string>('PENDING');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (appointment) {
      setStatus(appointment.status);
      setAdminNotes(appointment.adminNotes || '');
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminAppointmentApi.updateStatus(appointment.id, status, adminNotes);
      toast.success('Appointment updated successfully');
      
      // Invalidate all related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
      
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update appointment');
    } finally {
      setIsSaving(false);
    }
  };

  const currentStatus = STATUS_OPTIONS.find(s => s.value === appointment.status);

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
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Appointment #{appointment.id}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Booked on {formatDateTime(appointment.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentStatus?.color}`}>
                    {currentStatus?.label}
                  </span>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Patient Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Patient Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-medium text-gray-900">{appointment.patientName}</span>
                        {appointment.isNewPatient && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                            New Patient
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <a
                        href={`tel:${appointment.patientPhone}`}
                        className="text-primary-600 hover:underline"
                      >
                        {appointment.patientPhone}
                      </a>
                    </div>
                    {appointment.patientEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <a
                          href={`mailto:${appointment.patientEmail}`}
                          className="text-primary-600 hover:underline text-sm"
                        >
                          {appointment.patientEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Appointment Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Appointment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Date
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        Time
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatTime(appointment.appointmentTime)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        Service
                      </div>
                      <p className="font-semibold text-gray-900">
                        {appointment.service?.nameEn || 'N/A'}
                      </p>
                      {appointment.service && (
                        <p className="text-xs text-gray-500 mt-1">
                          {appointment.service.durationMinutes} min · MMK {Number(appointment.service.startingPrice).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        Doctor
                      </div>
                      <p className="font-semibold text-gray-900">
                        {appointment.doctor?.nameEn || 'Any Available'}
                      </p>
                      {appointment.doctor && (
                        <p className="text-xs text-gray-500 mt-1">
                          {appointment.doctor.specialtyEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Patient Notes */}
                {appointment.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Patient Notes
                    </h3>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {appointment.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Update Section */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Update Appointment
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setStatus(opt.value)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 ${
                              status === opt.value
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-100 text-gray-600 hover:border-gray-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Add internal notes about this appointment..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}