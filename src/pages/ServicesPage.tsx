import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Sparkles, Shield, Heart, Scissors, Crown, AlignCenter, Pin, Baby, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { mockServices } from '@/data/mockData';
import { formatPrice } from '@/utils/clinicStatus';


const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
  Scissors: <Scissors className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />,
  AlignCenter: <AlignCenter className="w-6 h-6" />,
  Pin: <Pin className="w-6 h-6" />,
  Baby: <Baby className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
};

const categories = [
  { value: 'ALL', labelEn: 'All Services', labelMm: 'အားလုံး' },
  { value: 'GENERAL', labelEn: 'General', labelMm: 'အထွေထွေ' },
  { value: 'COSMETIC', labelEn: 'Cosmetic', labelMm: 'အလှအပ' },
  { value: 'ORTHODONTICS', labelEn: 'Orthodontics', labelMm: 'သွားညှိခြင်း' },
  { value: 'SURGERY', labelEn: 'Surgery', labelMm: 'ခွဲစိတ်ကုသမှု' },
  { value: 'PEDIATRIC', labelEn: 'Pediatric', labelMm: 'ကလေး' },
  { value: 'EMERGENCY', labelEn: 'Emergency', labelMm: 'အရေးပေါ်' },
];

export default function ServicesPage() {
  const { t } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filtered = activeCategory === 'ALL' ? mockServices : mockServices.filter(s => s.category === activeCategory);

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20 relative overflow-hidden">
        <div className="container-custom text-center text-white relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Our Dental Services', 'ကျွန်ုပ်တို့၏ သွားကုသမှု ဝန်ဆောင်မှုများ')}</h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              {t('Comprehensive dental care for the whole family', 'မိသားစုတစ်ခုလုံးအတွက် ပြည့်စုံသော သွားကုသမှု')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(cat.labelEn, cat.labelMm)}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                layout
              >
                <Link to={`/services/${service.slug}`} className="card p-6 block group hover:-translate-y-1 transition-all h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      {iconMap[service.iconName] || <Stethoscope className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {t(service.nameEn, service.nameMm)}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">
                    {t(service.shortDescriptionEn, service.shortDescriptionMm)}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400">{t('Starting from', 'စတင်')}</span>
                      <div className="font-bold text-primary-600">{formatPrice(service.startingPrice)}</div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {service.durationMinutes} {t('min', 'မိနစ်')}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('Learn More', 'ပိုမိုသိရှိရန်')} <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
