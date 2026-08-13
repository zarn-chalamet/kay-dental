import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Phone,
  Stethoscope,
  ChevronRight,
  Info,
  ListChecks,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useServiceBySlug } from '@/hooks/usePublicData';
import { formatPrice } from '@/utils/clinicStatus';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Helper: parse newline-separated bullets
const parseList = (text: string | undefined | null): string[] => {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

// Helper: parse FAQ format (Q: ... A: ... or မေး: ... ဖြေ: ...)
const parseFaqs = (text: string | undefined | null): { question: string; answer: string }[] => {
  if (!text) return [];

  const faqs: { question: string; answer: string }[] = [];
  const blocks = text.split(/\n\s*\n/);

  blocks.forEach((block) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    let question = '';
    let answer = '';

    lines.forEach((line) => {
      if (/^(Q\s*[:.]|မေး\s*[:။])/.test(line)) {
        question = line.replace(/^(Q\s*[:.]|မေး\s*[:။])\s*/, '').trim();
      } else if (/^(A\s*[:.]|ဖြေ\s*[:။])/.test(line)) {
        answer = line.replace(/^(A\s*[:.]|ဖြေ\s*[:။])\s*/, '').trim();
      } else if (question && !answer) {
        question += ' ' + line;
      } else if (answer) {
        answer += ' ' + line;
      }
    });

    if (question && answer) {
      faqs.push({ question, answer });
    }
  });

  return faqs;
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t, language } = useLanguageStore();

  const { data: service, isLoading, error } = useServiceBySlug(slug!);

  /* ---- Loading skeleton ---- */
  if (isLoading) {
    return (
      <main className="bg-white pt-20 font-sans">
        <div className="px-4 py-8 md:px-8 md:py-12 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="h-4 w-48 rounded bg-gray-100 animate-pulse mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3">
                <div className="aspect-video rounded-2xl bg-gray-100 animate-pulse" />
                <div className="mt-6 space-y-3">
                  <div className="h-8 w-2/3 rounded-lg bg-gray-100 animate-pulse" />
                  <div className="h-4 rounded-lg bg-gray-100 animate-pulse" />
                  <div className="h-4 rounded-lg bg-gray-100 animate-pulse w-5/6" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ---- Not found ---- */
  if (error || !service) {
    return (
      <main className="bg-white pt-20 font-sans min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-md text-center py-16 px-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
            <Stethoscope className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {t('Service Not Found', 'ဝန်ဆောင်မှု ရှာမတွေ့ပါ')}
          </h3>
          <p className="mt-2 text-gray-600">
            {t(
              'The service you are looking for does not exist.',
              'သင်ရှာနေသော ဝန်ဆောင်မှုကို ရှာမတွေ့ပါ။'
            )}
          </p>
          <Link
            to="/services"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('Back to Services', 'ဝန်ဆောင်မှုများသို့ ပြန်သွားရန်')}
          </Link>
        </div>
      </main>
    );
  }

  // Parse rich content based on current language
  const benefits = parseList(language === 'en' ? service.benefitsEn : service.benefitsMm);
  const processSteps = parseList(language === 'en' ? service.processEn : service.processMm);
  const aftercareTips = parseList(language === 'en' ? service.aftercareEn : service.aftercareMm);
  const faqs = parseFaqs(language === 'en' ? service.faqsEn : service.faqsMm);

  const hasRichContent = benefits.length > 0 || processSteps.length > 0 || aftercareTips.length > 0 || faqs.length > 0;

  return (
    <main className="bg-white pt-20 font-sans">
      {/* ============ BREADCRUMB ============ */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="px-4 py-4 md:px-8 md:py-5 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-green-600 transition-colors">
                {t('Home', 'ပင်မ')}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/services" className="hover:text-green-600 transition-colors">
                {t('Services', 'ဝန်ဆောင်မှု')}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 font-medium truncate">
                {t(service.nameEn, service.nameMm)}
              </span>
            </nav>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="px-4 py-8 md:px-8 md:py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12"
          >
            {/* ============ LEFT: MAIN CONTENT (3 cols) ============ */}
            <div className="lg:col-span-3 space-y-10">
              {/* Image */}
              {service.imageUrl && (
                <div className="aspect-video overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-100">
                  <img
                    src={service.imageUrl}
                    alt={t(service.nameEn, service.nameMm)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Title Section */}
              <div>
                <div className="mb-3">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
                    {service.category}
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  {t(service.nameEn, service.nameMm)}
                </h1>

                <div className="mt-6">
                  <p className="text-base leading-relaxed text-gray-600 md:text-lg whitespace-pre-line">
                    {t(service.fullDescriptionEn || '', service.fullDescriptionMm || '')}
                  </p>
                </div>
              </div>

              {/* ============ BENEFITS SECTION ============ */}
              {benefits.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  className="rounded-2xl border border-gray-100 bg-gradient-to-br from-green-50/50 to-white p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {t('Benefits', 'အကျိုးကျေးဇူးများ')}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-base leading-relaxed text-gray-700">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* ============ PROCESS SECTION ============ */}
              {processSteps.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <ListChecks className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {t('Our Process', 'ကုသမှုအဆင့်များ')}
                    </h2>
                  </div>
                  <ol className="space-y-4">
                    {processSteps.map((step, i) => (
                      <li
                        key={i}
                        className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white font-bold shadow-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1 pt-1.5">
                          <p className="text-base text-gray-800 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}

              {/* ============ AFTERCARE SECTION ============ */}
              {aftercareTips.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  className="rounded-2xl border border-yellow-100 bg-gradient-to-br from-yellow-50/70 to-white p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
                      <Heart className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {t('Aftercare Tips', 'ကုသပြီးနောက် စောင့်ရှောက်မှု')}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {aftercareTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-100 mt-0.5">
                          <Heart className="h-3.5 w-3.5 text-yellow-600" />
                        </div>
                        <span className="text-base leading-relaxed text-gray-700">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* ============ FAQS SECTION ============ */}
              {faqs.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <HelpCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {t('Frequently Asked Questions', 'မကြာခဏ မေးလေ့ရှိသော မေးခွန်းများ')}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {faqs.map((faq, i) => (
                      <details
                        key={i}
                        className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none">
                          <span className="font-semibold text-gray-900 flex-1">
                            {faq.question}
                          </span>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform shrink-0" />
                        </summary>
                        <div className="px-5 pb-5 pt-0 text-base leading-relaxed text-gray-600">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ============ FALLBACK: What to Expect (if no rich content) ============ */}
              {!hasRichContent && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-green-600" />
                    {t('What to Expect', 'ဘာကို မျှော်လင့်နိုင်သလဲ')}
                  </h2>
                  <ul className="space-y-3">
                    {[
                      t('Professional consultation and examination', 'ပရော်ဖက်ရှင်နယ် ဆွေးနွေးခြင်းနှင့် စစ်ဆေးခြင်း'),
                      t('Detailed treatment plan discussion', 'အသေးစိတ် ကုသမှုအစီအစဉ် ဆွေးနွေးခြင်း'),
                      t('Comfortable and painless procedure', 'သက်တောင့်သက်သာ ကုသမှုလုပ်ငန်းစဉ်'),
                      t('Post-treatment care instructions', 'ကုသမှုပြီးနောက် စောင့်ရှောက်မှု ညွှန်ကြားချက်'),
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-base leading-relaxed text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ============ RIGHT: STICKY BOOKING CARD (2 cols) ============ */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Booking card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                  <div className="pb-5 border-b border-gray-100">
                    <div className="text-sm text-gray-500 font-medium">
                      {t('Starting price', 'စတင်စျေးနှုန်း')}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-bold text-green-600">
                        {formatPrice(service.startingPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="py-5 space-y-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">
                          {t('Duration', 'ကြာချိန်')}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {service.durationMinutes} {t('minutes', 'မိနစ်')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                        <Stethoscope className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">
                          {t('Category', 'အမျိုးအစား')}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {service.category}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 space-y-2.5">
                    <Link
                      to="/appointment"
                      className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                    >
                      <Calendar className="h-5 w-5" />
                      {t('Book Appointment', 'ချိန်းဆိုရန်')}
                    </Link>

                    <a
                      href="tel:095158726"
                      className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all duration-200 hover:border-green-600 hover:text-green-600"
                    >
                      <Phone className="h-5 w-5" />
                      {t('Call to Book', 'ဖုန်းဖြင့် ချိန်းဆိုရန်')}
                    </a>
                  </div>

                  <p className="mt-4 text-xs text-center text-gray-500">
                    {t(
                      'Free consultation · No hidden fees',
                      'အခမဲ့ တိုင်ပင်ဆွေးနွေး · ဝှက်ထားသော အခ မရှိ'
                    )}
                  </p>
                </div>

                {/* Help card */}
                <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Info className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {t('Need help deciding?', 'အကူအညီ လိုအပ်ပါသလား?')}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-gray-600">
                        {t(
                          'Call us for a free consultation and personalized recommendation.',
                          'အခမဲ့ တိုင်ပင်ရန် ဖုန်းခေါ်ပါ။'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}