import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Calendar, CheckCircle } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { mockServices } from '@/data/mockData';
import { formatPrice } from '@/utils/clinicStatus';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguageStore();
  const service = mockServices.find(s => s.slug === slug);

  if (!service) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Service Not Found', 'ဝန်ဆောင်မှု ရှာမတွေ့ပါ')}</h1>
          <Link to="/services" className="btn-primary mt-4 inline-block">{t('Back to Services', 'ဝန်ဆောင်မှုများသို့ ပြန်သွားရန်')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/services" className="inline-flex items-center gap-1 text-green-200 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> {t('All Services', 'ဝန်ဆောင်မှုအားလုံး')}
            </Link>
            <span className="block text-xs font-medium text-accent-400 bg-accent-400/20 px-3 py-1 rounded-full w-fit mb-3">
              {service.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t(service.nameEn, service.nameMm)}</h1>
            <div className="flex flex-wrap items-center gap-4 text-green-100">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {service.durationMinutes} {t('minutes', 'မိနစ်')}</span>
              <span className="font-semibold text-accent-400">{t('From', 'စတင်')} {formatPrice(service.startingPrice)}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              {service.imageUrl && (
                <img src={service.imageUrl} alt={t(service.nameEn, service.nameMm)} className="w-full rounded-2xl shadow-lg mb-8" />
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('About This Service', 'ဤဝန်ဆောင်မှုအကြောင်း')}</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {t(service.fullDescriptionEn, service.fullDescriptionMm)}
              </p>

              <div className="bg-primary-50 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-gray-900 mb-3">{t('What to Expect', 'ဘာကို မျှော်လင့်နိုင်သလဲ')}</h3>
                <ul className="space-y-2">
                  {[
                    t('Professional consultation and examination', 'ပရော်ဖက်ရှင်နယ် ဆွေးနွေးခြင်းနှင့် စစ်ဆေးခြင်း'),
                    t('Detailed treatment plan discussion', 'အသေးစိတ် ကုသမှုအစီအစဉ် ဆွေးနွေးခြင်း'),
                    t('Comfortable and painless procedure', 'သက်တောင့်သက်သာနှင့် နာကျင်မှုမရှိသော လုပ်ငန်းစဉ်'),
                    t('Post-treatment care instructions', 'ကုသမှုပြီးနောက် စောင့်ရှောက်မှု ညွှန်ကြားချက်များ'),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">{t('Duration', 'ကြာချိန်')}</span>
                    <div className="font-semibold text-gray-900">{service.durationMinutes} {t('minutes', 'မိနစ်')}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{t('Starting Price', 'စတင်စျေးနှုန်း')}</span>
                    <div className="font-semibold text-primary-600">{formatPrice(service.startingPrice)}</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link to="/appointment" className="btn-primary inline-flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" />
                  {t('Book This Service', 'ဤဝန်ဆောင်မှုကို ချိန်းဆိုရန်')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
