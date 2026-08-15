import { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Stethoscope,
  UserCheck,
  FileText,
  Save,
  ChevronLeft,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAppointmentApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import type { Appointment } from '@/types';
import toast from 'react-hot-toast';
import { formatDate, formatTime, formatDateTime } from '@/utils/formatters';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const STATUS_OPTIONS = [
  { value: 'PENDING',   label: 'Pending',   emoji: '⏳', color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-500', dot: 'bg-yellow-500' },
  { value: 'CONFIRMED', label: 'Confirmed', emoji: '✅', color: 'bg-green-100 text-green-700',   border: 'border-green-500',  dot: 'bg-green-500' },
  { value: 'COMPLETED', label: 'Completed', emoji: '✔️', color: 'bg-blue-100 text-blue-700',     border: 'border-blue-500',   dot: 'bg-blue-500' },
  { value: 'CANCELLED', label: 'Cancelled', emoji: '❌', color: 'bg-red-100 text-red-700',       border: 'border-red-500',    dot: 'bg-red-500' },
  { value: 'NO_SHOW',   label: 'No Show',   emoji: '⚠️', color: 'bg-gray-100 text-gray-700',     border: 'border-gray-500',   dot: 'bg-gray-500' },
];

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

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === appointment.status);
  const hasChanges = status !== appointment.status || adminNotes !== (appointment.adminNotes || '');

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
                    disabled={isSaving}
                    className="sm:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                    aria-label="Close"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white shadow-sm shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                      Appointment #{appointment.id}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">
                      Booked {formatDateTime(appointment.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${currentStatus?.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStatus?.dot}`} />
                    {currentStatus?.label}
                  </span>
                  <button
                    onClick={handleClose}
                    disabled={isSaving}
                    className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Mobile status badge */}
              <div className="sm:hidden px-4 py-2 bg-gray-50 border-b border-gray-100">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${currentStatus?.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStatus?.dot}`} />
                  Current status: {currentStatus?.label}
                </span>
              </div>

              {/* ============ BODY ============ */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
                {/* ===== PATIENT INFO ===== */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
                      <User className="w-3 h-3 text-green-600" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Patient Information
                    </h3>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold shadow-sm">
                        {appointment.patientName?.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">
                            {appointment.patientName}
                          </p>
                          {appointment.isNewPatient && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-bold shrink-0">
                              NEW PATIENT
                            </span>
                          )}
                        </div>

                        <div className="mt-2.5 space-y-1.5">
                          <a
                            href={`tel:${appointment.patientPhone}`}
                            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {appointment.patientPhone}
                          </a>
                          {appointment.patientEmail && (
                            <a
                              href={`mailto:${appointment.patientEmail}`}
                              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 hover:underline truncate"
                            >
                              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate">{appointment.patientEmail}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===== APPOINTMENT DETAILS ===== */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
                      <Calendar className="w-3 h-3 text-green-600" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Appointment Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mb-1">
                        <Calendar className="w-3 h-3" />
                        Date
                      </div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mb-1">
                        <Clock className="w-3 h-3" />
                        Time
                      </div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {formatTime(appointment.appointmentTime)}
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mb-1">
                        <Stethoscope className="w-3 h-3" />
                        Service
                      </div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {appointment.service?.nameEn || 'N/A'}
                      </p>
                      {appointment.service && (
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.service.durationMinutes} min
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="font-semibold text-green-600">
                            MMK {Number(appointment.service.startingPrice).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-3 sm:p-4">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium mb-1">
                        <UserCheck className="w-3 h-3" />
                        Doctor
                      </div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {appointment.doctor?.nameEn || 'Any Available Doctor'}
                      </p>
                      {appointment.doctor && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {appointment.doctor.specialtyEn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ===== PATIENT NOTES ===== */}
                {appointment.notes && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                      </div>
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                        Patient's Notes
                      </h3>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {appointment.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== UPDATE STATUS ===== */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Update Status
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setStatus(opt.value)}
                        className={`flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 ${
                          status === opt.value
                            ? `${opt.border} bg-white shadow-md scale-105`
                            : 'border-gray-100 text-gray-600 hover:border-gray-200 bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{opt.emoji}</span>
                        <span className={status === opt.value ? 'text-gray-900' : ''}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ===== ADMIN NOTES ===== */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-green-100">
                      <FileText className="w-3 h-3 text-green-600" />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                      Admin Notes
                    </h3>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Add internal notes about this appointment..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
                  />
                  <p className="mt-1.5 text-[11px] text-gray-500">
                    These notes are only visible to admin.
                  </p>
                </div>
              </div>

              {/* ============ STICKY FOOTER ============ */}
              <div className="sticky bottom-0 flex items-center justify-end gap-2 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 bg-white shrink-0">
                <button
                  onClick={handleClose}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="flex-1 sm:flex-initial inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}