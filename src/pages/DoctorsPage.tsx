import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Sparkles,
  Award,
  Users,
  Stethoscope,
  ArrowRight,
  Phone,
  GraduationCap,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useDoctors } from '@/hooks/usePublicData';
import ErrorMessage from '@/components/ErrorMessage';

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

export default function DoctorsPage() {
  const { t } = useLanguageStore();
  const { data: doctors = [], isLoading, isError } = useDoctors();

  // Calculate stats
  const totalExperience = doctors.reduce((sum, d) => sum + (d.experienceYears || 0), 0);
  const avgExperience = doctors.length > 0 ? Math.round(totalExperience / doctors.length) : 0;

  if (isError) {
    return (
      <div className="pt-20">
        <ErrorMessage
          message={t(
            'Failed to load doctors. Please check your connection.',
            'ဆရာဝန်များ ရယူ၍ မရပါ။ ချိတ်ဆက်မှုကို စစ်ဆေးပါ။'
          )}
          queryKey={['doctors']}
        />
      </div>
    );
  }

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
              {t('Meet Our Team', 'အဖွဲ့သားများနှင့် တွေ့ဆုံပါ')}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              {t('Our Dental ', 'ကျွန်ုပ်တို့၏ ')}
              <span className="text-green-600">
                {t('Specialists', 'ဆရာဝန်များ')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'Experienced, caring, and dedicated to providing the best dental care for you and your family.',
                'အတွေ့အကြုံရှိ၊ ဂရုစိုက်ပြီး သင်နှင့် သင့်မိသားစုအတွက် အကောင်းဆုံး သွားကုသမှုကို ပေးအပ်ရန် အပ်နှံထားပါသည်။'
              )}
            </p>

            {/* Stats */}
            {!isLoading && doctors.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {doctors.length}+
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {t('Specialists', 'ဆရာဝန်')}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {avgExperience}+
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {t('Years Avg. Exp.', 'အတွေ့အကြုံ ပျမ်းမျှ')}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {t('Certified', 'အသိအမှတ်ပြု')}
                  </div>
                </div>
              </div>
            )}

            <a
              href="#doctors"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
            >
              <Users className="h-5 w-5" />
              {t('View All Doctors', 'ဆရာဝန်များ ကြည့်ရန်')}
            </a>
          </motion.div>
        </div>
      </header>

      {/* ============ DOCTORS SECTION ============ */}
      <section id="doctors" className="py-16 md:py-20 scroll-mt-24">
        <div className="container-custom">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              <Stethoscope className="h-3.5 w-3.5" />
              {t('Our Specialists', 'ကျွမ်းကျင်သူများ')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('Meet the Team', 'အဖွဲ့သားများ')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'Each of our specialists brings unique expertise to provide comprehensive dental care.',
                'ကျွမ်းကျင်သူတိုင်းသည် ပြည့်စုံသော သွားကုသမှုပေးရန် ကိုယ်ပိုင် ကျွမ်းကျင်မှုများ ရှိပါသည်။'
              )}
            </p>
          </motion.div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm"
                >
                  <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-100 rounded-lg animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-2/3" />
                    <div className="pt-3 space-y-2">
                      <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-4 bg-gray-100 rounded-lg animate-pulse w-5/6" />
                    </div>
                    <div className="flex gap-2 pt-3">
                      <div className="h-10 bg-gray-100 rounded-xl animate-pulse flex-1" />
                      <div className="h-10 bg-gray-100 rounded-xl animate-pulse flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && doctors.length === 0 && (
            <div className="mx-auto max-w-md text-center py-16">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('No doctors available', 'ဆရာဝန် မရှိသေးပါ')}
              </h3>
              <p className="mt-2 text-gray-600">
                {t(
                  'Please check back later.',
                  'ကျေးဇူးပြု၍ နောက်မှ ပြန်လာကြည့်ပါ။'
                )}
              </p>
            </div>
          )}

          {/* Doctors Grid */}
          {!isLoading && doctors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {doctors.map((doctor, i) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Photo */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={doctor.photoUrl}
                      alt={t(doctor.nameEn, doctor.nameMm)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Experience badge - top right */}
                    {doctor.experienceYears && (
                      <div className="absolute top-4 right-4">
                        <div className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                          <Award className="h-3.5 w-3.5 text-yellow-500" />
                          {doctor.experienceYears}+ {t('yrs', 'နှစ်')}
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-6">
                    {/* Name */}
                    <h3 className="text-xl font-bold text-gray-900">
                      {t(doctor.nameEn, doctor.nameMm)}
                    </h3>

                    {/* Title */}
                    {doctor.title && (
                      <p className="mt-1 text-sm font-semibold text-green-600">
                        {doctor.title}
                      </p>
                    )}

                    {/* Specialty */}
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {t(doctor.specialtyEn, doctor.specialtyMm)}
                    </p>

                    {/* Divider */}
                    <div className="my-4 h-px bg-gray-100" />

                    {/* Details */}
                    <div className="space-y-2.5 flex-1">
                      {doctor.experienceYears && (
                        <div className="flex items-start gap-2.5 text-sm text-gray-600">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                            <GraduationCap className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="pt-1">
                            <span className="font-medium text-gray-900">
                              {doctor.experienceYears}+
                            </span>{' '}
                            {t('years experience', 'နှစ် အတွေ့အကြုံ')}
                          </div>
                        </div>
                      )}

                      {doctor.availableDays && (
                        <div className="flex items-start gap-2.5 text-sm text-gray-600">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                            <Calendar className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="pt-1">
                            {doctor.availableDays.replace(/,/g, ', ')}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-2">
                      <Link
                        to={`/doctors/${doctor.id}`}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border-2 border-green-600 px-4 py-2.5 text-sm font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
                      >
                        {t('View Profile', 'ပရိုဖိုင်')}
                      </Link>
                      <Link
                        to="/appointment"
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                      >
                        <Calendar className="h-4 w-4" />
                        {t('Book', 'ချိန်းဆို')}
                      </Link>
                    </div>
                  </div>
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
                {t('Ready to book with one of our specialists?', 'ဆရာဝန်တစ်ဦးနှင့် ရက်ချိန်း ယူရန် အသင့်လား?')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-green-50 md:text-lg">
                {t(
                  'Schedule your appointment today and get expert dental care.',
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