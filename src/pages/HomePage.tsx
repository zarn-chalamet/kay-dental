import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  Star, Shield, Heart, Clock, Users, Award, ChevronRight,
  Stethoscope, Sparkles, Phone, AlertTriangle, MapPin, 
  ArrowRight, Calendar, ChevronDown, ChevronUp,
  Scissors, AlignCenter, Baby, Crown, Pin
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { mockBanners, mockDoctors, mockServices, mockTestimonials, mockFaqs } from '@/data/mockData';
import { CLINIC_INFO } from '@/constants/clinicInfo';
import { formatPrice } from '@/utils/clinicStatus';
import SectionTitle from '@/components/SectionTitle';

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
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function HomePage() {
  const { t } = useLanguageStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Banner Carousel */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="w-full h-[500px] md:h-[600px]"
        >
          {mockBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full">
                <img
                  src={banner.imageUrl}
                  alt={t(banner.titleEn, banner.titleMm)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container-custom">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                      className="max-w-xl text-white"
                    >
                      {banner.type === 'PROMOTION' && (
                        <span className="inline-block px-3 py-1 bg-accent-400 text-gray-900 text-xs font-bold rounded-full mb-3">
                          {t('Special Offer', 'အထူးလျှော့ဈေး')}
                        </span>
                      )}
                      <h2 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                        {t(banner.titleEn, banner.titleMm)}
                      </h2>
                      <p className="text-base md:text-lg text-gray-200 mb-6">
                        {t(banner.messageEn, banner.messageMm)}
                      </p>
                      <Link
                        to={banner.buttonLink}
                        className="btn-primary inline-flex items-center gap-2"
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
      </section>

      {/* Hero Section */}
      <section className="gradient-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white/15" />
        </div>
        <div className="container-custom py-16 md:py-24 relative">
          <div className="text-center text-white max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                {t('Your Smile,', 'သင့်အပြုံး')}
                <br />
                <span className="text-accent-400">{t('Our Priority', 'ကျွန်ုပ်တို့၏ ဦးစားပေး')}</span>
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                {t(
                  'Professional dental care in the heart of Yangon. Modern equipment, experienced doctors, and a gentle touch for every patient.',
                  'ရန်ကုန်မြို့လယ်တွင် ပရော်ဖက်ရှင်နယ် သွားကုသမှု။ ခေတ်မီ ကိရိယာများ၊ အတွေ့အကြုံရှိ ဆရာဝန်များနှင့် လူနာတိုင်းအတွက် နူးညံ့သိမ်မွေ့သော ကုသမှု။'
                )}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/appointment" className="btn-accent flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('Book Appointment', 'ချိန်းဆိုရန်')}
                </Link>
                <Link to="/services" className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2">
                  {t('Our Services', 'ဝန်ဆောင်မှုများ')}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-primary-800 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <Award className="w-8 h-8" />, value: 15, suffix: '+', label: t('Years Experience', 'နှစ်များ အတွေ့အကြုံ') },
              { icon: <Users className="w-8 h-8" />, value: 5000, suffix: '+', label: t('Happy Patients', 'ပျော်ရွှင်သော လူနာများ') },
              { icon: <Stethoscope className="w-8 h-8" />, value: 3, suffix: '', label: t('Expert Dentists', 'ကျွမ်းကျင်သွားဆရာဝန်များ') },
              { icon: <Star className="w-8 h-8" />, value: 10, suffix: '+', label: t('Dental Services', 'သွားကုသမှု ဝန်ဆောင်မှုများ') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <div className="flex justify-center mb-2 text-accent-400">{stat.icon}</div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="text-sm text-green-200 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionTitle
            title={t('Our Dental Services', 'ကျွန်ုပ်တို့၏ သွားကုသမှု ဝန်ဆောင်မှုများ')}
            subtitle={t('Comprehensive dental care for the whole family', 'မိသားစုတစ်ခုလုံးအတွက် ပြည့်စုံသော သွားကုသမှု')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockServices.slice(0, 8).map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/services/${service.slug}`} className="card p-6 block group hover:-translate-y-1 transition-all h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {iconMap[service.iconName] || <Stethoscope className="w-6 h-6" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {t(service.nameEn, service.nameMm)}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {t(service.shortDescriptionEn, service.shortDescriptionMm)}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary-600">{t('From', 'စတင်')} {formatPrice(service.startingPrice)}</span>
                    <span className="text-gray-400">{service.durationMinutes} {t('min', 'မိနစ်')}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="btn-outline inline-flex items-center gap-2">
              {t('View All Services', 'ဝန်ဆောင်မှုအားလုံး ကြည့်ရန်')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            title={t('Why Choose KAY Dental Care?', 'KAY Dental Care ကို ဘာကြောင့် ရွေးချယ်သင့်သလဲ?')}
            subtitle={t('We are committed to providing the best dental experience', 'အကောင်းဆုံး သွားကုသမှု အတွေ့အကြုံကို ပေးရန် ကတိပြုပါသည်')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                titleEn: 'Safe & Sterile',
                titleMm: 'ဘေးကင်းပြီး ပိုးသတ်ထားသော',
                descEn: 'International sterilization standards to ensure your safety at every visit.',
                descMm: 'လာရောက်မှုတိုင်းတွင် သင့်ဘေးကင်းရေးကို သေချာစေရန် နိုင်ငံတကာ ပိုးသတ်စံနှုန်းများ။',
              },
              {
                icon: <Heart className="w-8 h-8" />,
                titleEn: 'Gentle Care',
                titleMm: 'နူးညံ့သော ကုသမှု',
                descEn: 'Painless procedures with modern anesthesia and a caring approach.',
                descMm: 'ခေတ်မီ ထုံဆေးနှင့် ဂရုစိုက်သော ချဉ်းကပ်မှုဖြင့် နာကျင်မှုမရှိသော ကုသမှုများ။',
              },
              {
                icon: <Award className="w-8 h-8" />,
                titleEn: 'Experienced Team',
                titleMm: 'အတွေ့အကြုံရှိ အဖွဲ့',
                descEn: 'Our dentists have over 10 years of experience with continuous education.',
                descMm: 'ကျွန်ုပ်တို့၏ သွားဆရာဝန်များတွင် ၁၀ နှစ်ကျော် အတွေ့အကြုံရှိပါသည်။',
              },
              {
                icon: <Clock className="w-8 h-8" />,
                titleEn: 'Convenient Hours',
                titleMm: 'အဆင်ပြေသော အချိန်',
                descEn: 'Open 6 days a week with flexible appointment scheduling.',
                descMm: 'တစ်ပတ်လျှင် ၆ ရက် ဖွင့်ပြီး ပြောင်းလွယ်ပြင်လွယ် ချိန်းဆိုမှု စီစဉ်ခြင်း။',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{t(item.titleEn, item.titleMm)}</h3>
                <p className="text-sm text-gray-500">{t(item.descEn, item.descMm)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Doctors */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionTitle
            title={t('Meet Our Doctors', 'ကျွန်ုပ်တို့၏ ဆရာဝန်များ')}
            subtitle={t('Experienced and caring dental professionals', 'အတွေ့အကြုံရှိပြီး ဂရုစိုက်သော သွားကုသမှု ပညာရှင်များ')}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {mockDoctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/doctors/${doctor.id}`} className="card group block">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={doctor.photoUrl}
                      alt={t(doctor.nameEn, doctor.nameMm)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900">{t(doctor.nameEn, doctor.nameMm)}</h3>
                    <p className="text-primary-600 text-sm font-medium">{doctor.title}</p>
                    <p className="text-gray-500 text-sm mt-1">{t(doctor.specialtyEn, doctor.specialtyMm)}</p>
                    <p className="text-xs text-gray-400 mt-2">{doctor.experienceYears} {t('years experience', 'နှစ် အတွေ့အကြုံ')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/doctors" className="btn-outline inline-flex items-center gap-2">
              {t('View All Doctors', 'ဆရာဝန်အားလုံး ကြည့်ရန်')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding gradient-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-white/10" />
        </div>
        <div className="container-custom relative">
          <SectionTitle
            title={t('What Our Patients Say', 'ကျွန်ုပ်တို့၏ လူနာများ ပြောကြသည်')}
            subtitle={t('Real stories from real patients', 'တကယ့်လူနာများထံမှ တကယ့်ပုံပြင်များ')}
            light
          />
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
          >
            {mockTestimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-accent-400 fill-accent-400' : 'text-white/30'}`} />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm mb-4 line-clamp-4 leading-relaxed">
                    "{t(testimonial.reviewEn, testimonial.reviewMm)}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-accent-400 flex items-center justify-center text-gray-900 font-bold text-sm">
                      {testimonial.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{testimonial.patientName}</p>
                      <p className="text-green-200 text-xs">{testimonial.treatment}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="text-center mt-8">
            <Link to="/testimonials" className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 inline-flex items-center gap-2">
              {t('Read More Reviews', 'နောက်ထပ် သုံးသပ်ချက်များ ဖတ်ရန်')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-12 bg-red-50 border-y border-red-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-red-800">{t('Dental Emergency?', 'သွား အရေးပေါ်လား?')}</h3>
                <p className="text-red-600 text-sm">
                  {t('Severe toothache, broken tooth, or dental injury? Contact us immediately.', 'ပြင်းထန်သော သွားကိုက်ခြင်း၊ သွားကျိုးခြင်း သို့မဟုတ် သွားဒဏ်ရာ? ချက်ချင်းဆက်သွယ်ပါ။')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="tel:095158726" className="bg-red-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center gap-2 shadow-md">
                <Phone className="w-5 h-5" />
                09 5158726
              </a>
              <Link to="/emergency" className="btn-outline !border-red-600 !text-red-600 hover:!bg-red-600 hover:!text-white">
                {t('Emergency Info', 'အရေးပေါ် အချက်အလက်')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            title={t('Visit Our Clinic', 'ကျွန်ုပ်တို့ ဆေးခန်းသို့ လာရောက်ပါ')}
            subtitle={t('Conveniently located in downtown Yangon', 'ရန်ကုန်မြို့လယ်တွင် အဆင်ပြေစွာ တည်ရှိသည်')}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-lg h-[300px] md:h-[400px] bg-gray-200">
              <iframe
                src={CLINIC_INFO.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KAY Dental Care Location"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('Address', 'လိပ်စာ')}</h4>
                  <p className="text-gray-600 text-sm">{t(CLINIC_INFO.addressEn, CLINIC_INFO.addressMm)}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('Phone', 'ဖုန်း')}</h4>
                  <p className="text-gray-600 text-sm">{CLINIC_INFO.phone1}</p>
                  <p className="text-gray-600 text-sm">{CLINIC_INFO.phone2}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t('Opening Hours', 'ဖွင့်ချိန်')}</h4>
                  <div className="space-y-1">
                    {CLINIC_INFO.openingHours.map((day) => (
                      <div key={day.day} className="flex justify-between text-sm gap-4">
                        <span className="text-gray-600">{t(day.day, day.dayMm)}</span>
                        <span className={day.isClosed ? 'text-red-500 font-medium' : 'text-gray-900 font-medium'}>
                          {day.isClosed ? t('Closed', 'ပိတ်') : `${day.open} - ${day.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <SectionTitle
            title={t('Frequently Asked Questions', 'မေးလေ့ရှိသော မေးခွန်းများ')}
            subtitle={t('Find answers to common questions', 'အဖြေများကို ရှာဖွေပါ')}
          />
          <div className="max-w-3xl mx-auto space-y-3">
            {mockFaqs.slice(0, 5).map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
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
          <div className="text-center mt-8">
            <Link to="/faq" className="btn-outline inline-flex items-center gap-2">
              {t('View All FAQs', 'မေးခွန်းအားလုံး ကြည့်ရန်')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-green py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/4" />
        </div>
        <div className="container-custom text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('Ready to Get Your Perfect Smile?', 'သင့်ပြည့်စုံတဲ့ အပြုံးကို ရယူဖို့ အဆင်သင့်ဖြစ်ပြီလား?')}
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
              {t('Book your appointment today and let us take care of your dental health.', 'ယနေ့ပဲ ချိန်းဆိုပြီး သင့်သွားကျန်းမာရေးကို ကျွန်ုပ်တို့ ဂရုစိုက်ပါရစေ။')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/appointment" className="btn-accent flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                {t('Book Now', 'ချိန်းဆိုရန်')}
              </Link>
              <a href="tel:095158726" className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2 text-lg">
                <Phone className="w-5 h-5" />
                {t('Call Us', 'ဖုန်းခေါ်ရန်')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
