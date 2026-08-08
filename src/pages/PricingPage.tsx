import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Info } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useServices } from '@/hooks/usePublicData';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PAYMENT_METHODS } from '@/constants/clinicInfo';
import { formatPrice } from '@/utils/clinicStatus';

export default function PricingPage() {
  const { t } = useLanguageStore();
  const { data: services = [], isLoading } = useServices();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Service Pricing', 'ဝန်ဆောင်မှု စျေးနှုန်းများ')}</h1>
            <p className="text-lg text-green-100">{t('Transparent and affordable pricing for all our services', 'ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုအားလုံးအတွက် ပွင့်လင်းမြင်သာပြီး တတ်နိုင်သော စျေးနှုန်းများ')}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              {t(
                'Prices shown are starting prices and may vary based on the complexity of the treatment. Please contact us for a detailed quote after consultation.',
                'ဖော်ပြထားသော စျေးနှုန်းများသည် စတင်စျေးနှုန်းများဖြစ်ပြီး ကုသမှု၏ ရှုပ်ထွေးမှုပေါ်မူတည်၍ ကွဲပြားနိုင်ပါသည်။'
              )}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary-600 text-white">
                  <th className="text-left px-6 py-4 rounded-tl-xl font-semibold">{t('Service', 'ဝန်ဆောင်မှု')}</th>
                  <th className="text-center px-4 py-4 font-semibold">{t('Category', 'အမျိုးအစား')}</th>
                  <th className="text-center px-4 py-4 font-semibold">{t('Duration', 'ကြာချိန်')}</th>
                  <th className="text-right px-6 py-4 font-semibold">{t('Starting Price', 'စတင်စျေးနှုန်း')}</th>
                  <th className="text-center px-4 py-4 rounded-tr-xl font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, i) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-100 hover:bg-primary-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/services/${service.slug}`} className="font-medium text-gray-900 hover:text-primary-600 transition-colors">
                        {t(service.nameEn, service.nameMm)}
                      </Link>
                    </td>
                    <td className="text-center px-4 py-4">
                      <span className="text-xs font-medium bg-primary-50 text-primary-600 px-2 py-1 rounded-full">{service.category}</span>
                    </td>
                    <td className="text-center px-4 py-4 text-sm text-gray-500">
                      <span className="flex items-center justify-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.durationMinutes} {t('min', 'မိနစ်')}</span>
                    </td>
                    <td className="text-right px-6 py-4 font-bold text-primary-600">{formatPrice(service.startingPrice)}</td>
                    <td className="text-center px-4 py-4">
                      <Link to="/appointment" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        {t('Book', 'ချိန်းဆို')}
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Methods */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t('Payment Methods', 'ငွေပေးချေမှု နည်းလမ်းများ')}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {PAYMENT_METHODS.map((method) => (
                <div key={method.name} className="card px-6 py-4 flex items-center gap-3 hover:-translate-y-1 transition-all">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-gray-900">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link to="/appointment" className="btn-primary inline-flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              {t('Book Your Appointment', 'သင့်ချိန်းဆိုမှုကို ချိန်းဆိုရန်')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
