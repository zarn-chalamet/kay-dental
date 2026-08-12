import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { FaPhone, FaViber, FaFacebookMessenger } from 'react-icons/fa';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function FloatingButtons() {
  const { t } = useLanguageStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded actions - shown when main button is clicked */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Call */}
            <motion.a
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.05 }}
              href="tel:095158726"
              className="group flex items-center gap-2"
              aria-label={t('Call clinic', 'ဆေးခန်းသို့ ဖုန်းခေါ်ရန်')}
            >
              <span className="hidden group-hover:inline-flex md:inline-flex items-center rounded-full bg-white shadow-md px-3 py-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap">
                {t('Call us', 'ဖုန်းခေါ်ရန်')}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-all duration-200 hover:bg-green-700 hover:scale-110 active:scale-95">
                <FaPhone className="h-5 w-5" />
              </span>
            </motion.a>

            {/* Viber - REAL LOGO */}
            <motion.a
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              href="viber://chat?number=095158726"
              className="group flex items-center gap-2"
              aria-label="Chat on Viber"
            >
              <span className="hidden group-hover:inline-flex md:inline-flex items-center rounded-full bg-white shadow-md px-3 py-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap">
                Viber
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7360F2] text-white shadow-lg transition-all duration-200 hover:bg-[#5D48D0] hover:scale-110 active:scale-95">
                <FaViber className="h-6 w-6" />
              </span>
            </motion.a>

            {/* Messenger - REAL LOGO */}
            <motion.a
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.15 }}
              href="https://m.me/kaydental"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2"
              aria-label="Chat on Messenger"
            >
              <span className="hidden group-hover:inline-flex md:inline-flex items-center rounded-full bg-white shadow-md px-3 py-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap">
                Messenger
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#00B2FF] via-[#006AFF] to-[#0038FF] text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95">
                <FaFacebookMessenger className="h-6 w-6" />
              </span>
            </motion.a>

            {/* Book Appointment */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.2 }}
              className="group flex items-center gap-2"
            >
              <span className="hidden group-hover:inline-flex md:inline-flex items-center rounded-full bg-white shadow-md px-3 py-1.5 text-xs font-semibold text-gray-700 whitespace-nowrap">
                {t('Book appointment', 'ချိန်းဆိုရန်')}
              </span>
              <Link
                to="/appointment"
                onClick={() => setIsExpanded(false)}
                aria-label={t('Book appointment', 'ချိန်းဆိုရန်')}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-gray-900 shadow-lg transition-all duration-200 hover:bg-yellow-300 hover:scale-110 active:scale-95"
              >
                <Calendar className="h-5 w-5" />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB - Always visible */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 25 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
          isExpanded
            ? 'bg-gray-900 text-white'
            : 'bg-green-600 text-white'
        }`}
        aria-label={isExpanded ? t('Close menu', 'ပိတ်ရန်') : t('Contact us', 'ဆက်သွယ်ရန်')}
        aria-expanded={isExpanded}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}