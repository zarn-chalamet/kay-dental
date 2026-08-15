import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isDeleting?: boolean;
  confirmLabel?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this? This action cannot be undone.',
  isDeleting = false,
  confirmLabel = 'Delete',
}: ConfirmDeleteModalProps) {
  const handleClose = () => {
    if (isDeleting) return;
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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md pointer-events-auto shadow-2xl overflow-hidden"
              role="alertdialog"
              aria-labelledby="delete-modal-title"
              aria-describedby="delete-modal-description"
            >
              {/* Header with warning icon */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  {/* Animated warning icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 shadow-sm shadow-red-500/20"
                  >
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <h3
                      id="delete-modal-title"
                      className="text-lg font-bold text-gray-900"
                    >
                      {title}
                    </h3>
                    <p
                      id="delete-modal-description"
                      className="mt-1.5 text-sm text-gray-600 leading-relaxed"
                    >
                      {message}
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    disabled={isDeleting}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Warning note */}
              <div className="mx-6 mb-6 p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    This action is permanent and cannot be reversed. Please
                    proceed with caution.
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/70 border-t border-gray-100">
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-500/20 transition-all duration-200 hover:bg-red-700 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      {confirmLabel}
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