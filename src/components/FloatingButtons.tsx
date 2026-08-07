import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function FloatingButtons() {
  return (
    <>
      {/* Desktop Floating Buttons */}
      <div className="hidden md:flex fixed right-4 bottom-1/3 z-40 flex-col gap-3">
        <motion.a
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          href="tel:095158726"
          className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 hover:scale-110 transition-all"
          title="Call Us"
        >
          <Phone className="w-5 h-5" />
        </motion.a>
        <motion.a
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          href="viber://chat?number=095158726"
          className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 hover:scale-110 transition-all"
          title="Viber"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.a>
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link
            to="/appointment"
            className="w-12 h-12 rounded-full bg-accent-400 text-gray-900 flex items-center justify-center shadow-lg hover:bg-accent-300 hover:scale-110 transition-all"
            title="Book Appointment"
          >
            <Calendar className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-4 gap-0">
          <a href="tel:095158726" className="flex flex-col items-center py-2.5 text-primary-600 hover:bg-primary-50 transition-colors">
            <Phone className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Call</span>
          </a>
          <a href="viber://chat?number=095158726" className="flex flex-col items-center py-2.5 text-purple-600 hover:bg-purple-50 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Viber</span>
          </a>
          <a href="https://m.me/kaydental" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center py-2.5 text-blue-600 hover:bg-blue-50 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Messenger</span>
          </a>
          <Link to="/appointment" className="flex flex-col items-center py-2.5 bg-primary-600 text-white">
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Book</span>
          </Link>
        </div>
      </div>
    </>
  );
}
