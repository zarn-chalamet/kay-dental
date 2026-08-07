import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function NotFoundPage() {
  const { t } = useLanguageStore();

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container-custom text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-8xl md:text-9xl font-bold text-primary-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('Page Not Found', 'စာမျက်နှာ ရှာမတွေ့ပါ')}</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {t("Sorry, the page you're looking for doesn't exist or has been moved.", 'တောင်းပန်ပါသည်၊ သင်ရှာနေသော စာမျက်နှာ မရှိပါ သို့မဟုတ် ရွှေ့ပြီးပါပြီ။')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="btn-primary flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t('Go Home', 'ပင်မစာမျက်နှာသို့')}
            </Link>
            <button onClick={() => window.history.back()} className="btn-outline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('Go Back', 'နောက်သို့ ပြန်သွားရန်')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
