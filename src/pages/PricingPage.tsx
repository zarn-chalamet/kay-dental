import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Info,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useServices } from '@/hooks/usePublicData';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PAYMENT_METHODS } from '@/constants/clinicInfo';
import { formatPrice } from '@/utils/clinicStatus';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const badgeClassName =
  'inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700';

export default function PricingPage() {
  const { t } = useLanguageStore();
  const { data: services = [], isLoading } = useServices();

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="bg-white pt-20 font-sans">
      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 min-h-[calc(100vh-5rem)] flex items-center py-14 md:py-20">
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-green-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-100/80 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 md:px-8 lg:px-12 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className={badgeClassName}>
              <Sparkles className="h-3.5 w-3.5" />
              {t('Transparent Pricing', 'ပွင့်လင်း စျေးနှုန်း')}
            </span>

            {/* Clean heading without yellow bar */}
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              {t('Service ', 'ဝန်ဆောင်မှု ')}
              <span className="text-green-600">
                {t('Pricing', 'စျေးနှုန်း')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'Transparent and affordable pricing for all our services. No hidden fees, no surprises.',
                'ဝန်ဆောင်မှုအားလုံးအတွက် ပွင့်လင်းပြီး တတ်နိုင်သော စျေးနှုန်းများ။ ဝှက်ထားသော အခကြေးငွေ မရှိပါ။'
              )}
            </p>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('No Hidden Fees', 'ဝှက်ထားသော အခ မရှိ')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('Free Consultation', 'အခမဲ့ တိုင်ပင်ဆွေးနွေး')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('Multiple Payment Options', 'ငွေပေးချေမှု နည်းလမ်းများစွာ')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ============ PRICING TABLE ============ */}
      <section className="px-4 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-8 text-center"
          >
            <span className={badgeClassName}>
              {t('Our Services', 'ဝန်ဆောင်မှုများ')}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {t('Full Price List', 'စျေးနှုန်း စာရင်း')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'Browse all our dental services with clear starting prices.',
                'ကျွန်ုပ်တို့၏ သွားဘက်ဆိုင်ရာ ဝန်ဆောင်မှုအားလုံးကို ရှင်းလင်းသော စျေးနှုန်းများဖြင့် ကြည့်ရှုပါ။'
              )}
            </p>
          </motion.div>

          {/* Info notice - MOVED to right above table, SMALLER & SUBTLER */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-6 flex items-start gap-2.5 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3"
          >
            <Info className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed text-gray-600">
              {t(
                'Prices shown are starting prices and may vary based on treatment complexity. Contact us for a detailed quote.',
                'ဖော်ပြထားသော စျေးနှုန်းများသည် စတင်စျေးနှုန်းများဖြစ်ပြီး ကုသမှုပေါ်မူတည်၍ ကွဲပြားနိုင်ပါသည်။'
              )}
            </p>
          </motion.div>

          {/* Desktop Table */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                    <th className="text-left px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                      {t('Service', 'ဝန်ဆောင်မှု')}
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-sm uppercase tracking-wider">
                      {t('Category', 'အမျိုးအစား')}
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-sm uppercase tracking-wider">
                      {t('Duration', 'ကြာချိန်')}
                    </th>
                    <th className="text-right px-6 py-4 font-semibold text-sm uppercase tracking-wider">
                      {t('Starting Price', 'စတင်စျေးနှုန်း')}
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-sm uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {services.map((service, i) => (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.02 }}
                      className="group hover:bg-green-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <Link
                          to={`/services/${service.slug}`}
                          className="font-semibold text-gray-900 hover:text-green-600 transition-colors"
                        >
                          {t(service.nameEn, service.nameMm)}
                        </Link>
                      </td>
                      <td className="text-center px-4 py-5">
                        <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs font-semibold px-3 py-1">
                          {service.category}
                        </span>
                      </td>
                      <td className="text-center px-4 py-5 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-green-600" />
                          {service.durationMinutes} {t('min', 'မိနစ်')}
                        </span>
                      </td>
                      <td className="text-right px-6 py-5">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(service.startingPrice)}
                        </span>
                      </td>
                      <td className="text-center px-4 py-5">
                        <Link
                          to="/appointment"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors group/link"
                        >
                          {t('Book', 'ချိန်းဆို')}
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/services/${service.slug}`}
                      className="font-semibold text-gray-900 hover:text-green-600 transition-colors"
                    >
                      {t(service.nameEn, service.nameMm)}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5">
                        {service.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {service.durationMinutes} {t('min', 'မိနစ်')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold text-green-600">
                      {formatPrice(service.startingPrice)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('starting', 'စတင်')}
                    </div>
                  </div>
                </div>
                <Link
                  to="/appointment"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 text-white text-sm font-semibold px-4 py-2.5 hover:bg-green-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  {t('Book This Service', 'ဝန်ဆောင်မှုကို ချိန်းဆိုရန်')}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PAYMENT METHODS ============ */}
      <section className="px-4 pb-16 md:px-8 md:pb-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Section header */}
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className={badgeClassName}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {t('Secure Payments', 'လုံခြုံသော ငွေပေးချေမှု')}
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {t('Payment Methods', 'ငွေပေးချေမှု နည်းလမ်းများ')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                {t(
                  'We accept a variety of payment methods for your convenience.',
                  'သင့်အဆင်ပြေစေရန် ငွေပေးချေမှု နည်းလမ်းများစွာကို လက်ခံပါသည်။'
                )}
              </p>
            </div>

            {/* Payment logos grid - NOW IN FULL COLOR */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {PAYMENT_METHODS.map((method, i) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex w-40 flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-green-200 transition-all duration-300"
                >
                  {/* Logo container - FULL COLOR, no grayscale */}
                  <div className="flex h-14 w-full items-center justify-center">
                    {method.logo ? (
                      <img
                        src={method.logo}
                        alt={method.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-4xl">{method.type}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center">
                    {method.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="px-4 pb-16 md:px-8 md:pb-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-600 to-green-700 p-8 md:p-12 lg:p-16 text-white shadow-lg"
          >
            {/* Decorative blobs */}
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-green-400/30 blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Calendar className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold md:text-4xl">
                {t('Ready to book your visit?', 'ရက်ချိန်း ယူရန် အသင့်လား?')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-green-50 md:text-lg">
                {t(
                  'Get in touch with our friendly team and schedule your dental appointment today.',
                  'ကျွန်ုပ်တို့၏အဖွဲ့နှင့် ဆက်သွယ်ပြီး ယနေ့ပင် သွားဘက်ဆိုင်ရာ ရက်ချိန်း ယူပါ။'
                )}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/appointment"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-gray-900 shadow-md transition-all duration-200 hover:bg-yellow-300 hover:shadow-lg active:scale-95"
                >
                  <Calendar className="h-5 w-5" />
                  {t('Book Appointment', 'ချိန်းဆိုရန်')}
                </Link>

                <a
                  href="tel:095158726"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-white/20 active:scale-95"
                >
                  <Phone className="h-5 w-5" />
                  {t('Call Us', 'ဖုန်းခေါ်ရန်')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}