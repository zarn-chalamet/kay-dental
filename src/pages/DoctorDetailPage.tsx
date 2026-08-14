import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Award,
  CheckCircle,
  Phone,
  ChevronRight,
  Stethoscope,
  GraduationCap,
  Users,
  Sparkles,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useDoctors } from '@/hooks/usePublicData';

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

export default function DoctorDetailPage() {
  const { id } = useParams();
  const { t } = useLanguageStore();
  const { data: doctors = [], isLoading } = useDoctors();

  const doctor = doctors.find((d) => d.id === Number(id));

  /* ---- Loading skeleton ---- */
  if (isLoading) {
    return (
      <main className="bg-white pt-20 font-sans">
        <div className="container-custom py-8 md:py-12">
          <div className="h-4 w-48 rounded bg-gray-100 animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="aspect-[3/4] rounded-2xl bg-gray-100 animate-pulse" />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="h-8 w-2/3 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-4 w-1/3 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-4 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-4 rounded-lg bg-gray-100 animate-pulse w-5/6" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ---- Not found ---- */
  if (!doctor) {
    return (
      <main className="bg-white pt-20 font-sans min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-md text-center py-16 px-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {t('Doctor Not Found', 'ဆရာဝန် ရှာမတွေ့ပါ')}
          </h3>
          <p className="mt-2 text-gray-600">
            {t(
              'The doctor you are looking for does not exist.',
              'သင်ရှာနေသော ဆရာဝန်ကို ရှာမတွေ့ပါ။'
            )}
          </p>
          <Link
            to="/doctors"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('Back to Doctors', 'ဆရာဝန်များသို့ ပြန်သွားရန်')}
          </Link>
        </div>
      </main>
    );
  }

  const qualifications = doctor.qualifications
    ? doctor.qualifications.split(',').map((q) => q.trim()).filter(Boolean)
    : [];

  return (
    <main className="bg-white pt-20 font-sans">
      {/* ============ BREADCRUMB ============ */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="container-custom py-4 md:py-5">
          <nav
            className="flex items-center gap-1.5 text-sm text-gray-500"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-green-600 transition-colors">
              {t('Home', 'ပင်မ')}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to="/doctors"
              className="hover:text-green-600 transition-colors"
            >
              {t('Doctors', 'ဆရာဝန်များ')}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium truncate">
              {t(doctor.nameEn, doctor.nameMm)}
            </span>
          </nav>
        </div>
      </section>

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 py-12 md:py-16">
        <div className="absolute inset-0 hidden md:block pointer-events-none">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-green-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-100/80 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        </div>

        <div className="container-custom relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start"
          >
            {/* ============ LEFT: PHOTO (2 cols) ============ */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute -inset-4 bg-gradient-to-br from-green-100 to-yellow-100 rounded-3xl blur-2xl opacity-40" />

                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl bg-gray-100">
                  <img
                    src={doctor.photoUrl}
                    alt={t(doctor.nameEn, doctor.nameMm)}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating experience badge */}
                {doctor.experienceYears && (
                  <div className="absolute -bottom-6 -right-4 md:-right-6">
                    <div className="rounded-2xl bg-white px-5 py-4 shadow-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                          <Award className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 leading-none">
                            {doctor.experienceYears}+
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {t('Years Exp.', 'နှစ်')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ============ RIGHT: INFO (3 cols) ============ */}
            <div className="lg:col-span-3">
              <span className={badgeClassName}>
                <Sparkles className="h-3.5 w-3.5" />
                {t('Dental Specialist', 'သွားဆရာဝန်')}
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl leading-tight">
                {t(doctor.nameEn, doctor.nameMm)}
              </h1>

              {doctor.title && (
                <p className="mt-2 text-lg font-semibold text-green-600">
                  {doctor.title}
                </p>
              )}

              <p className="mt-3 text-base text-gray-600 leading-relaxed md:text-lg">
                {t(doctor.specialtyEn, doctor.specialtyMm)}
              </p>

              {/* Quick stats */}
              <div className="mt-6 flex flex-wrap gap-3">
                {doctor.experienceYears && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      {doctor.experienceYears}+
                    </span>
                    <span className="text-gray-600">
                      {t('years', 'နှစ်')}
                    </span>
                  </div>
                )}
                {doctor.languages && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{doctor.languages}</span>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/appointment"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                >
                  <Calendar className="h-5 w-5" />
                  {t('Book Appointment', 'ချိန်းဆိုရန်')}
                </Link>
                <a
                  href="tel:095158726"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
                >
                  <Phone className="h-5 w-5" />
                  {t('Call to Book', 'ဖုန်းဖြင့် ချိန်းဆိုရန်')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* ============ LEFT: DETAILS (2 cols) ============ */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              {(doctor.bioEn || doctor.bioMm) && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                      {t('About', 'အကြောင်း')}
                    </h2>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-base leading-relaxed text-gray-600 whitespace-pre-line">
                      {t(doctor.bioEn || '', doctor.bioMm || '')}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Qualifications */}
              {qualifications.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  className="rounded-2xl border border-gray-100 bg-gradient-to-br from-green-50/50 to-white p-6 md:p-8"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                      {t('Qualifications', 'အရည်အချင်းများ')}
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {qualifications.map((qualification, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-base leading-relaxed text-gray-700">
                          {qualification}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Specialty highlight */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                    {t('Areas of Expertise', 'ကျွမ်းကျင်ရာ')}
                  </h2>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-base leading-relaxed text-gray-700">
                    {t(doctor.specialtyEn, doctor.specialtyMm)}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ============ RIGHT: STICKY SIDEBAR (1 col) ============ */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Availability card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {t('Availability', 'ဖွင့်ချိန်')}
                  </h3>

                  <div className="space-y-3.5">
                    {doctor.availableDays && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-medium">
                            {t('Available Days', 'ရက်များ')}
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-gray-900">
                            {doctor.availableDays.replace(/,/g, ', ')}
                          </div>
                        </div>
                      </div>
                    )}

                    {doctor.availableFrom && doctor.availableTo && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                          <Clock className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-medium">
                            {t('Hours', 'အချိန်')}
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-gray-900">
                            {doctor.availableFrom} – {doctor.availableTo}
                          </div>
                        </div>
                      </div>
                    )}

                    {doctor.languages && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                          <Globe className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-medium">
                            {t('Languages', 'ဘာသာစကား')}
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-gray-900">
                            {doctor.languages}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-2.5">
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
                </div>

                {/* Contact card */}
                <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {t('Have Questions?', 'မေးခွန်း ရှိပါသလား?')}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-gray-600">
                        {t(
                          'Contact us for a free consultation.',
                          'အခမဲ့ တိုင်ပင်ရန် ဆက်သွယ်ပါ။'
                        )}
                      </p>
                      <Link
                        to="/contact"
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors group"
                      >
                        {t('Contact Us', 'ဆက်သွယ်ရန်')}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-16 md:py-24">
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
                  `Ready to book with ${doctor.nameEn.split(' ').slice(0, 2).join(' ')}?`,
                  `${doctor.nameMm} နှင့် ချိန်းဆိုရန် အသင့်လား?`
                )}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-green-50 md:text-lg">
                {t(
                  'Schedule your appointment today and get expert dental care from our experienced team.',
                  'ယနေ့ပင် ရက်ချိန်း ယူပြီး ကျွမ်းကျင်သော သွားကုသမှုကို ရယူပါ။'
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