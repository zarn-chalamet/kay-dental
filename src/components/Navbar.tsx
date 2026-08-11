import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar, Globe } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getClinicStatus } from '@/utils/clinicStatus';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/', labelEn: 'Home', labelMm: 'ပင်မ' },
  { path: '/about', labelEn: 'About', labelMm: 'အကြောင်း' },
  { path: '/services', labelEn: 'Services', labelMm: 'ဝန်ဆောင်မှု' },
  { path: '/doctors', labelEn: 'Doctors', labelMm: 'ဆရာဝန်' },
  { path: '/gallery', labelEn: 'Gallery', labelMm: 'ဓာတ်ပုံ' },
  { path: '/pricing', labelEn: 'Pricing', labelMm: 'စျေးနှုန်း' },
  { path: '/contact', labelEn: 'Contact', labelMm: 'ဆက်သွယ်ရန်' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguageStore();
  const clinicStatus = getClinicStatus();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const statusColor =
    clinicStatus.status === 'OPEN'
      ? 'bg-green-500'
      : clinicStatus.status === 'HOLIDAY'
      ? 'bg-orange-500'
      : 'bg-red-500';

  // Shorten status message based on state
  const getShortStatus = () => {
    if (clinicStatus.status === 'OPEN') {
      return { en: 'Open', mm: 'ဖွင့်သည်' };
    }
    if (clinicStatus.status === 'HOLIDAY') {
      return { en: 'Holiday', mm: 'ပိတ်ရက်' };
    }
    // For closed, just show "Closed" without extra time info
    return { en: 'Closed', mm: 'ပိတ်သည်' };
  };

  const shortStatus = getShortStatus();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              K
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-primary-700 text-lg leading-tight whitespace-nowrap">
                KAY Dental
              </div>
              <div className="text-[10px] text-gray-500 leading-tight whitespace-nowrap">
                {t('Professional Dental Care', 'သွားဘက်ဆိုင်ရာ ကုသမှု')}
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === link.path
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {t(link.labelEn, link.labelMm)}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Clinic Status Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 whitespace-nowrap">
              <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse shrink-0`} />
              <span className="text-xs font-medium text-gray-600">
                {t(shortStatus.en, shortStatus.mm)}
              </span>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-xs font-medium whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'en' ? 'MM' : 'EN'}
            </button>

            {/* Phone */}
            <a
              href="tel:095158726"
              className="hidden xl:flex items-center gap-1 text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">09 5158726</span>
            </a>

            {/* Book CTA */}
            <Link
              to="/appointment"
              className="hidden sm:flex items-center gap-1.5 btn-primary !py-2 !px-4 !text-sm whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              {t('Book Now', 'ချိန်းဆိုရန်')}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="container-custom py-4 space-y-1">
              {/* Clinic status mobile - Full detail here since there's space */}
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse shrink-0`} />
                <span className="text-sm text-gray-600">
                  {t(clinicStatus.message, clinicStatus.messageMm)}
                </span>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {t(link.labelEn, link.labelMm)}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                <a
                  href="tel:095158726"
                  className="flex items-center gap-2 px-3 py-2.5 text-primary-600 font-medium text-sm"
                >
                  <Phone className="w-4 h-4" /> 09 5158726
                </a>
                <Link to="/appointment" className="btn-primary text-center !text-sm">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {t('Book Appointment', 'ချိန်းဆိုရန်')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}