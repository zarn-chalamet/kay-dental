import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  Star,
  Shield,
  Heart,
  Clock,
  Users,
  Award,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  Sparkles,
  Phone,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Calendar,
  ChevronDown,
  Scissors,
  AlignCenter,
  Baby,
  Crown,
  Pin,
  Mail,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  useBanners,
  useDoctors,
  useServices,
  useTestimonials,
  useFaqs,
  useClinicSettings,
} from '@/hooks/usePublicData';
import { formatPrice } from '@/utils/clinicStatus';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const badgeClassName =
  'inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700';

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

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-gray-900">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function HomePage() {
  const { t } = useLanguageStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { data: banners = [], isLoading: bannersLoading } = useBanners();
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: testimonials = [] } = useTestimonials();
  const { data: faqs = [] } = useFaqs();
  const { data: settings } = useClinicSettings();

  // Backend data with fallbacks
  const addressEn = settings?.addressEn ?? '';
  const addressMm = settings?.addressMm ?? '';
  const phone1 = settings?.phone1 ?? '';
  const phone2 = settings?.phone2 ?? '';
  const email = settings?.email ?? '';
  const googleMapsEmbedUrl = settings?.googleMapsEmbedUrl ?? '';

  const primaryPhone = phone1 || phone2;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressEn || 'KAY Dental Care Latha Township Yangon'
  )}`;

  const isLoading = bannersLoading || doctorsLoading || servicesLoading;

  return (
    <main className="bg-white font-sans">
      {/* ============ BANNER CAROUSEL ============ */}
      <section className="relative pt-20 bg-white">
        {isLoading ? (
          <div className="container-custom py-6 md:py-8">
            <div className="w-full h-[400px] md:h-[520px] bg-gradient-to-br from-green-50 via-white to-yellow-50 animate-pulse rounded-3xl" />
          </div>
        ) : banners.length > 0 ? (
          <div className="container-custom py-6 md:py-8">
            <div className="relative group">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                pagination={{
                  clickable: true,
                  bulletClass: 'kay-bullet',
                  bulletActiveClass: 'kay-bullet-active',
                }}
                navigation={{
                  nextEl: '.kay-nav-next',
                  prevEl: '.kay-nav-prev',
                }}
                onBeforeInit={(swiper) => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = '.kay-nav-prev';
                  // @ts-ignore
                  swiper.params.navigation.nextEl = '.kay-nav-next';
                }}
                loop
                className="w-full h-[400px] md:h-[520px] rounded-3xl overflow-hidden shadow-lg"
              >
                {banners.map((banner) => (
                  <SwiperSlide key={banner.id}>
                    <div className="relative w-full h-full">
                      <img
                        src={banner.imageUrl}
                        alt={t(banner.titleEn, banner.titleMm)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/75 via-gray-900/40 to-gray-900/10" />

                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full px-6 md:px-12 lg:px-16">
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="max-w-lg text-white"
                          >
                            {banner.type === 'PROMOTION' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
                                <Sparkles className="h-3.5 w-3.5" />
                                {t('Special Offer', 'အထူးလျှော့ဈေး')}
                              </span>
                            )}

                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                              {t(banner.titleEn, banner.titleMm)}
                            </h2>

                            <p className="text-sm md:text-base text-gray-200 mb-6 leading-relaxed line-clamp-3">
                              {t(banner.messageEn, banner.messageMm)}
                            </p>

                            <Link
                              to={banner.buttonLink}
                              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-green-700 hover:shadow-xl active:scale-95"
                            >
                              {t(banner.buttonTextEn, banner.buttonTextMm)}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {banners.length > 1 && (
                <>
                  <button
                    className="kay-nav-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-12 w-12 items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-white hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-8 w-8" strokeWidth={2.5} />
                  </button>
                  <button
                    className="kay-nav-next absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-12 w-12 items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:text-white hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-8 w-8" strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* ============ WELCOME / INTRO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 py-16 md:py-20">
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-green-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-100/80 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        </div>

        <div className="container-custom relative text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto max-w-5xl">
            <span className={badgeClassName}>
              <Sparkles className="h-3.5 w-3.5" />
              {t('Welcome to KAY Dental', 'ကြိုဆိုပါသည်')}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              {t('Your Smile, ', 'သင့်အပြုံး၊ ')}
              <span className="text-green-600">{t('Our Priority', 'ကျွန်ုပ်တို့၏ ဦးစားပေး')}</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'Professional dental care in the heart of Yangon. Modern equipment, experienced dentists, and gentle care for every patient.',
                'ရန်ကုန်မြို့လယ်တွင် ပရော်ဖက်ရှင်နယ် သွားကုသမှု။ ခေတ်မီကိရိယာနှင့် ကျွမ်းကျင်ဆရာဝန်များဖြင့် လူနာတိုင်းအတွက် နူးညံ့စွာ ကုသပါသည်။'
              )}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/appointment"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
              >
                <Calendar className="w-5 h-5" />
                {t('Book Appointment', 'ချိန်းဆိုရန်')}
              </Link>
              <Link
                to="/services"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
              >
                {t('Our Services', 'ဝန်ဆောင်မှုများ')}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('15+ Years Experience', '၁၅ နှစ်')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('5,000+ Happy Patients', 'လူနာ ၅,၀၀၀+')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('International Standards', 'နိုင်ငံတကာ စံနှုန်း')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Award, value: 15, suffix: '+', labelEn: 'Years Experience', labelMm: 'နှစ်' },
              { icon: Users, value: 5000, suffix: '+', labelEn: 'Happy Patients', labelMm: 'လူနာများ' },
              { icon: Stethoscope, value: doctors.length || 3, suffix: '', labelEn: 'Expert Dentists', labelMm: 'ဆရာဝန်' },
              { icon: Star, value: services.length || 10, suffix: '+', labelEn: 'Services', labelMm: 'ဝန်ဆောင်မှု' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100">
                  <stat.icon className="h-6 w-6 text-green-600" />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <div className="mt-1 text-sm text-gray-500 font-medium">
                  {t(stat.labelEn, stat.labelMm)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES PREVIEW ============ */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              <Stethoscope className="h-3.5 w-3.5" />
              {t('Our Services', 'ဝန်ဆောင်မှုများ')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('Comprehensive Dental Care', 'ပြည့်စုံသော သွားကုသမှု')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'From routine checkups to advanced treatments — everything you need for a healthy smile.',
                'ပုံမှန်စစ်ဆေးခြင်းမှ အဆင့်မြင့်ကုသမှုများအထိ — ကျန်းမာသော အပြုံးအတွက် လိုအပ်သည်များ။'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.slice(0, 8).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    {iconMap[service.iconName] || <Stethoscope className="w-6 h-6" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {t(service.nameEn, service.nameMm)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {t(service.shortDescriptionEn, service.shortDescriptionMm)}
                  </p>
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                    <span className="font-bold text-green-600">
                      {t('From ', 'စတင် ')}
                      {formatPrice(service.startingPrice)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {service.durationMinutes} {t('min', 'မိနစ်')}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
            >
              {t('View All Services', 'ဝန်ဆောင်မှုအားလုံး')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              <Award className="h-3.5 w-3.5" />
              {t('Why Choose Us', 'ဘာကြောင့် ရွေးချယ်ရမလဲ')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('Trusted Dental Care in Yangon', 'ရန်ကုန်ရှိ ယုံကြည်ရသော သွားကုသမှု')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'What makes patients trust us with their smiles.',
                'လူနာများ ကျွန်ုပ်တို့ကို ယုံကြည်ရသည့် အကြောင်းရင်းများ။'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                titleEn: 'Safe & Sterile',
                titleMm: 'ဘေးကင်း စိတ်ချရ',
                descEn: 'International sterilization standards for your safety.',
                descMm: 'သင့်ဘေးကင်းရေးအတွက် နိုင်ငံတကာ ပိုးသတ်စံနှုန်း။',
              },
              {
                icon: Heart,
                titleEn: 'Gentle Care',
                titleMm: 'နူးညံ့သော ကုသမှု',
                descEn: 'Painless treatments with modern anesthesia.',
                descMm: 'ခေတ်မီ ထုံဆေးဖြင့် နာကျင်မှုမရှိသော ကုသမှု။',
              },
              {
                icon: Award,
                titleEn: 'Experienced Team',
                titleMm: 'အတွေ့အကြုံရှိ အဖွဲ့',
                descEn: 'Dentists with 10+ years of professional experience.',
                descMm: '၁၀ နှစ်ကျော် အတွေ့အကြုံရှိ ဆရာဝန်များ။',
              },
              {
                icon: Clock,
                titleEn: 'Flexible Hours',
                titleMm: 'အဆင်ပြေသော ချိန်',
                descEn: 'Open 6 days a week with convenient scheduling.',
                descMm: 'တစ်ပတ်လျှင် ၆ ရက် ဖွင့်ပါသည်။',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 group-hover:bg-green-600 transition-colors duration-300">
                  <item.icon className="h-7 w-7 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-gray-900">
                  {t(item.titleEn, item.titleMm)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {t(item.descEn, item.descMm)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DOCTORS PREVIEW ============ */}
      {doctors.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container-custom">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mx-auto mb-10 max-w-3xl text-center"
            >
              <span className={badgeClassName}>
                <Users className="h-3.5 w-3.5" />
                {t('Our Team', 'အဖွဲ့သားများ')}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                {t('Meet Our Doctors', 'ဆရာဝန်များ')}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                {t(
                  'Experienced and caring dental professionals dedicated to your smile.',
                  'သင့်အပြုံးအတွက် ကျွမ်းကျင်ပြီး ဂရုစိုက်သော သွားကုသမှု ကျွမ်းကျင်သူများ။'
                )}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {doctors.slice(0, 3).map((doctor, i) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={doctor.photoUrl}
                        alt={t(doctor.nameEn, doctor.nameMm)}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {doctor.experienceYears && (
                        <div className="absolute top-4 right-4">
                          <div className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                            <Award className="h-3.5 w-3.5 text-yellow-500" />
                            {doctor.experienceYears}+ {t('yrs', 'နှစ်')}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900">
                        {t(doctor.nameEn, doctor.nameMm)}
                      </h3>
                      {doctor.title && (
                        <p className="mt-1 text-sm font-semibold text-green-600">
                          {doctor.title}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-600 flex-1">
                        {t(doctor.specialtyEn, doctor.specialtyMm)}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {t('View Profile', 'ကြည့်ရန်')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
              >
                {t('View All Doctors', 'ဆရာဝန်အားလုံး')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ TESTIMONIALS ============ */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container-custom">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mx-auto mb-10 max-w-3xl text-center"
            >
              <span className={badgeClassName}>
                <Star className="h-3.5 w-3.5" />
                {t('Reviews', 'သုံးသပ်ချက်')}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                {t('What Our Patients Say', 'လူနာများ ပြောကြသည်')}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                {t(
                  'Real stories from real patients who trust us with their dental care.',
                  'ကျွန်ုပ်တို့ကို ယုံကြည်သော လူနာများ၏ တကယ့်ဇာတ်လမ်းများ။'
                )}
              </p>
            </motion.div>

            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              spaceBetween={24}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (testimonial.rating || 5)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-5">
                      "{t(testimonial.reviewEn || '', testimonial.reviewMm || '')}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm">
                        {testimonial.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">
                          {testimonial.patientName}
                        </p>
                        {testimonial.treatment && (
                          <p className="text-gray-500 text-xs">{testimonial.treatment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-4 text-center">
              <Link
                to="/testimonials"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
              >
                {t('Read More Reviews', 'သုံးသပ်ချက်များ ဖတ်ရန်')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ EMERGENCY BANNER ============ */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="rounded-3xl border-2 border-red-100 bg-gradient-to-br from-red-50 via-white to-red-50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    {t('Dental Emergency?', 'သွား အရေးပေါ်လား?')}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {t(
                      'Severe toothache, broken tooth, or dental injury? Contact us immediately.',
                      'ပြင်းထန်သော သွားကိုက်ခြင်း သို့မဟုတ် သွားဒဏ်ရာ? ချက်ချင်း ဆက်သွယ်ပါ။'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {primaryPhone && (
                  <a
                    href={`tel:${primaryPhone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95"
                  >
                    <Phone className="w-5 h-5" />
                    {primaryPhone}
                  </a>
                )}
                <Link
                  to="/emergency"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-red-600 px-5 py-3 font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                >
                  {t('Learn More', 'ပိုမိုသိရှိရန်')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOCATION SECTION ============ */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              <MapPin className="h-3.5 w-3.5" />
              {t('Find Us', 'တည်နေရာ')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('Visit Our Clinic', 'ဆေးခန်းသို့ လာရောက်ရန်')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'Conveniently located in downtown Yangon. Easy to reach.',
                'ရန်ကုန်မြို့လယ်တွင် အဆင်ပြေစွာ တည်ရှိပါသည်။'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-600 to-green-700 p-8 text-white shadow-sm md:p-10 lg:col-span-2">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-green-400/30 blur-3xl" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <MapPin className="h-7 w-7 text-white" />
                </div>

                <h3 className="mt-6 text-2xl font-bold md:text-3xl">KAY Dental Care</h3>

                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-green-50">
                  {t(addressEn, addressMm)}
                </p>

                <div className="mt-8 space-y-3">
                  {phone1 && (
                    <a
                      href={`tel:${phone1.replace(/\s/g, '')}`}
                      className="group/link flex items-center gap-3 text-green-50 transition-colors hover:text-white"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 transition-colors group-hover/link:bg-white/30">
                        <Phone className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{phone1}</span>
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="group/link flex items-center gap-3 text-green-50 transition-colors hover:text-white"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 transition-colors group-hover/link:bg-white/30">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="break-all font-medium text-sm">{email}</span>
                    </a>
                  )}
                  {settings?.openingHours && settings.openingHours.length > 0 && (
                    <div className="flex items-start gap-3 text-green-50">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-medium space-y-0.5">
                        {settings.openingHours.slice(0, 3).map((s) => (
                          <div key={s.day}>
                            {t(s.day, s.dayMm)}:{' '}
                            {s.isClosed ? t('Closed', 'ပိတ်') : `${s.open} - ${s.close}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:bg-yellow-300 hover:shadow-md active:scale-95"
              >
                <MapPin className="h-4 w-4" />
                {t('Get Directions', 'လမ်းညွှန်ရယူရန်')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm lg:col-span-3 min-h-[400px] lg:min-h-[500px]">
              {googleMapsEmbedUrl ? (
                <iframe
                  src={googleMapsEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title="KAY Dental Care Location"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
                  <div className="mx-auto max-w-sm p-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100">
                      <MapPin className="h-10 w-10 text-green-600" />
                    </div>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                    >
                      <MapPin className="h-4 w-4" />
                      {t('Open in Maps', 'Maps ဖွင့်ရန်')}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ PREVIEW ============ */}
      {faqs.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container-custom">
            <div className="mx-auto max-w-4xl">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="mx-auto mb-10 max-w-3xl text-center"
              >
                <span className={badgeClassName}>
                  {t('FAQ', 'မေးခွန်း')}
                </span>
                <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                  {t('Frequently Asked Questions', 'မကြာခဏ မေးလေ့ရှိသော မေးခွန်းများ')}
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                  {t(
                    'Quick answers to common questions.',
                    'အသုံးများသော မေးခွန်းများ၏ အဖြေများ။'
                  )}
                </p>
              </motion.div>

              <div className="space-y-3">
                {faqs.slice(0, 5).map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id!)}
                      className="w-full flex items-center justify-between gap-3 p-5 text-left"
                    >
                      <span className="font-semibold text-gray-900">
                        {t(faq.questionEn, faq.questionMm)}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${
                          openFaq === faq.id ? 'rotate-180 text-green-600' : ''
                        }`}
                      />
                    </button>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="px-5 pb-5 text-base leading-relaxed text-gray-600"
                      >
                        {t(faq.answerEn, faq.answerMm)}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
                >
                  {t('View All FAQs', 'မေးခွန်းအားလုံး')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

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
                {t('Ready for Your Perfect Smile?', 'ပြည့်စုံသော အပြုံးအတွက် အသင့်လား?')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-green-50 md:text-lg">
                {t(
                  'Book your appointment today and let us take care of your dental health.',
                  'ယနေ့ ရက်ချိန်း ယူပြီး သင့်သွားကျန်းမာရေးကို ကျွန်ုပ်တို့ ဂရုစိုက်ပါရစေ။'
                )}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/appointment"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-gray-900 shadow-md transition-all duration-200 hover:bg-yellow-300 hover:shadow-lg active:scale-95"
                >
                  <Calendar className="h-5 w-5" />
                  {t('Book Now', 'ချိန်းဆိုရန်')}
                </Link>

                {primaryPhone && (
                  <a
                    href={`tel:${primaryPhone.replace(/\s/g, '')}`}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-white/20 active:scale-95"
                  >
                    <Phone className="h-5 w-5" />
                    {t('Call Us', 'ဖုန်းခေါ်ရန်')}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}