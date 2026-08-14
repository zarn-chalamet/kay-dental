import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Sparkles,
  Shield,
  Heart,
  Scissors,
  Crown,
  AlignCenter,
  Pin,
  Baby,
  AlertTriangle,
  Clock,
  ArrowRight,
  Calendar,
  Phone,
  Search,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useServices } from '@/hooks/usePublicData';
import ErrorMessage from '@/components/ErrorMessage';
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

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Scissors: <Scissors className="h-6 w-6" />,
  Crown: <Crown className="h-6 w-6" />,
  AlignCenter: <AlignCenter className="h-6 w-6" />,
  Pin: <Pin className="h-6 w-6" />,
  Baby: <Baby className="h-6 w-6" />,
  AlertTriangle: <AlertTriangle className="h-6 w-6" />,
};

const categories = [
  { value: 'ALL', labelEn: 'All Services', labelMm: 'အားလုံး' },
  { value: 'GENERAL', labelEn: 'General', labelMm: 'အထွေထွေ' },
  { value: 'COSMETIC', labelEn: 'Cosmetic', labelMm: 'အလှအပ' },
  { value: 'ORTHODONTICS', labelEn: 'Orthodontics', labelMm: 'သွားညှိ' },
  { value: 'SURGERY', labelEn: 'Surgery', labelMm: 'ခွဲစိတ်' },
  { value: 'PEDIATRIC', labelEn: 'Pediatric', labelMm: 'ကလေး' },
  { value: 'EMERGENCY', labelEn: 'Emergency', labelMm: 'အရေးပေါ်' },
];

export default function ServicesPage() {
  const { t } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const { data: services = [], isLoading, error } = useServices();

  if (error) {
    return (
      <div className="pt-20">
        <ErrorMessage
          message={t(
            'Failed to load services. Please check your connection.',
            'ဝန်ဆောင်မှုများ ရယူ၍ မရပါ။ ချိတ်ဆက်မှုကို စစ်ဆေးပါ။'
          )}
          queryKey={['services']}
        />
      </div>
    );
  }

  const filtered =
    activeCategory === 'ALL'
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <main className="bg-white pt-20 font-sans">
      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 min-h-[calc(100vh-5rem)] flex items-center py-14 md:py-20">
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-green-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-100/80 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className={badgeClassName}>
              <Sparkles className="h-3.5 w-3.5" />
              {t('Our Services', 'ဝန်ဆောင်မှုများ')}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              {t('Our Dental ', 'သွားကုသမှု ')}
              <span className="text-green-600">
                {t('Services', 'ဝန်ဆောင်မှုများ')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
               'Comprehensive dental care for the whole family. From routine checkups to advanced treatments — all in one place.',
                'မိသားစုတစ်ခုလုံးအတွက် ပြည့်စုံသော သွားကုသမှု။ ပုံမှန်စစ်ဆေးခြင်းမှ အဆင့်မြင့်ကုသမှုများအထိ။'
              )}
            </p>

            {/* Stats */}
            {!isLoading && services.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {services.length}+
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {t('Services', 'ဝန်ဆောင်မှု')}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {new Set(services.map((s) => s.category)).size}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {t('Categories', 'အမျိုးအစား')}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {t('Professional', 'ကျွမ်းကျင်')}
                  </div>
                </div>
              </div>
            )}

            <a
              href="#services"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
            >
              <Search className="h-5 w-5" />
              {t('Browse Services', 'ဝန်ဆောင်မှုများ ကြည့်ရန်')}
            </a>
          </motion.div>
        </div>
      </header>

      {/* ============ SERVICES SECTION ============ */}
      <section
        id="services"
        className="py-16 md:py-20 scroll-mt-24"
      >
        <div className="container-custom">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              <Stethoscope className="h-3.5 w-3.5" />
              {t('Treatments', 'ကုသမှုများ')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('Find the Right Treatment', 'သင့်တော်သော ကုသမှုကို ရှာပါ')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'Browse our full range of dental services. Filter by category to find exactly what you need.',
                'ကျွန်ုပ်တို့၏ သွားကုသမှု ဝန်ဆောင်မှုအားလုံးကို ကြည့်ရှုပါ။ အမျိုးအစားအလိုက် စစ်ထုတ်ကြည့်ပါ။'
              )}
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 flex flex-wrap justify-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-green-600 text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {t(cat.labelEn, cat.labelMm)}
              </button>
            ))}
          </motion.div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-100 animate-pulse" />
                      <div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
                    </div>
                    <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-5/6" />
                    <div className="h-px bg-gray-100" />
                    <div className="flex justify-between">
                      <div className="h-6 w-24 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-5 w-16 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filtered.length === 0 && (
            <div className="mx-auto max-w-md text-center py-16">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                <Stethoscope className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('No services found', 'ဝန်ဆောင်မှု မတွေ့ပါ')}
              </h3>
              <p className="mt-2 text-gray-600">
                {t(
                  'Try selecting a different category.',
                  'အခြား အမျိုးအစားကို ရွေးကြည့်ပါ။'
                )}
              </p>
              <button
                onClick={() => setActiveCategory('ALL')}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
              >
                {t('Show All Services', 'ဝန်ဆောင်မှုအားလုံး ပြရန်')}
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Icon + Category */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                        {iconMap[service.iconName] || (
                          <Stethoscope className="h-6 w-6" />
                        )}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        {service.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                      {t(service.nameEn, service.nameMm)}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-base leading-relaxed text-gray-600 flex-1">
                      {t(
                        service.shortDescriptionEn,
                        service.shortDescriptionMm
                      )}
                    </p>

                    {/* Divider */}
                    <div className="my-4 h-px bg-gray-100" />

                    {/* Price + Duration */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">
                          {t('Starting from', 'စတင်')}
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(service.startingPrice)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock className="h-4 w-4 text-green-600" />
                        {service.durationMinutes} {t('min', 'မိနစ်')}
                      </div>
                    </div>

                    {/* Learn More link */}
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {t('Learn More', 'ပိုမိုသိရှိရန်')}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-600 to-green-700 p-8 md:p-12 lg:p-16 text-white shadow-lg"
          >
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-yellow-400/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-green-400/30 blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Calendar className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                {t(
                  'Ready to get started?',
                  'စတင်ရန် အသင့်ဖြစ်ပြီလား?'
                )}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-green-50 md:text-lg">
                {t(
                  'Book an appointment today and let our experienced team take care of your dental health.',
                  'ယနေ့ပင် ရက်ချိန်းယူပြီး ကျွန်ုပ်တို့၏ အတွေ့အကြုံရှိ အဖွဲ့မှ သင့်သွားကျန်းမာရေးကို ဂရုစိုက်ပါ။'
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