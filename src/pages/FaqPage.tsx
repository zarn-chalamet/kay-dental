import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useFaqs } from '@/hooks/usePublicData';
import LoadingSpinner from '@/components/LoadingSpinner';

const categories = [
  { value: 'ALL', labelEn: 'All', labelMm: 'အားလုံး' },
  { value: 'GENERAL', labelEn: 'General', labelMm: 'အထွေထွေ' },
  { value: 'TREATMENT', labelEn: 'Treatment', labelMm: 'ကုသမှု' },
  { value: 'PAYMENT', labelEn: 'Payment', labelMm: 'ငွေပေးချေမှု' },
  { value: 'EMERGENCY', labelEn: 'Emergency', labelMm: 'အရေးပေါ်' },
  { value: 'BOOKING', labelEn: 'Booking', labelMm: 'ချိန်းဆိုမှု' },
];

export default function FaqPage() {
  const { t, language } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: faqs = [], isLoading } = useFaqs();

  if (isLoading) return <LoadingSpinner />;

  const filtered = faqs
    .filter(f => activeCategory === 'ALL' || f.category === activeCategory)
    .filter(f => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (language === 'en' ? f.questionEn : f.questionMm).toLowerCase().includes(q) ||
             (language === 'en' ? f.answerEn : f.answerMm).toLowerCase().includes(q);
    });

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('Frequently Asked Questions', 'မေးလေ့ရှိသော မေးခွန်းများ')}
            </h1>
            <p className="text-lg text-green-100">
              {t('Find answers to your dental questions', 'သင့် သွားဆိုင်ရာ မေးခွန်းများ၏ အဖြေများကို ရှာဖွေပါ')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search questions...', 'မေးခွန်းများ ရှာဖွေပါ...')}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(cat.labelEn, cat.labelMm)}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{t(faq.questionEn, faq.questionMm)}</span>
                  {openFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-primary-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-gray-600 text-sm leading-relaxed">{t(faq.answerEn, faq.answerMm)}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {t('No questions found matching your search.', 'သင်ရှာဖွေမှုနှင့် ကိုက်ညီသော မေးခွန်းများ မရှိပါ။')}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}