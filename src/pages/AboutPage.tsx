import { motion } from 'framer-motion';
import {
  Shield,
  Heart,
  Award,
  Eye,
  Target,
  Users,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Calendar,
  Phone,
  Clock,
  Globe,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/store/useLanguageStore';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const badgeClassName =
  'inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700';

export default function AboutPage() {
  const { t } = useLanguageStore();

  const values = [
    {
      icon: Target,
      titleEn: 'Our Mission',
      titleMm: 'ရည်မှန်းချက်',
      descEn:
        'To provide accessible, high-quality dental care using modern technology while making every patient feel comfortable and valued.',
      descMm:
        'ခေတ်မီနည်းပညာဖြင့် လူနာတိုင်းကို သက်တောင့်သက်သာဖြင့် အရည်အသွေးမြင့် သွားကုသမှု ပေးရန်။',
    },
    {
      icon: Eye,
      titleEn: 'Our Vision',
      titleMm: 'မျှော်မှန်းချက်',
      descEn:
        'To be the most trusted dental clinic in Myanmar, known for excellence, innovation, and patient satisfaction.',
      descMm:
        'ကုသမှုထူးချွန်မှုအတွက် ထင်ရှားသော မြန်မာနိုင်ငံ၏ အယုံကြည်ရဆုံး သွားဆေးခန်းဖြစ်ရန်။',
    },
    {
      icon: Heart,
      titleEn: 'Our Values',
      titleMm: 'တန်ဖိုးများ',
      descEn:
        'Compassion, excellence, integrity, and continuous learning guide everything we do for our patients.',
      descMm:
        'ကရုဏာ၊ ထူးချွန်မှုနှင့် သမာဓိတို့ဖြင့် လူနာများအတွက် ဆောင်ရွက်ပါသည်။',
    },
  ];

  const features = [
    {
      icon: Zap,
      en: 'Modern digital X-ray for accurate diagnosis',
      mm: 'တိကျသော ရောဂါရှာဖွေရန် ခေတ်မီ X-ray',
    },
    {
      icon: Shield,
      en: 'International sterilization standards (autoclave)',
      mm: 'နိုင်ငံတကာ ပိုးသတ်စံနှုန်းများ',
    },
    {
      icon: Heart,
      en: 'Painless treatment with modern anesthesia',
      mm: 'ခေတ်မီ ထုံဆေးဖြင့် နာကျင်မှုမရှိသော ကုသမှု',
    },
    {
      icon: Award,
      en: 'Affordable pricing with flexible payment options',
      mm: 'တတ်နိုင်သော စျေးနှုန်းနှင့် ငွေပေးချေမှု နည်းလမ်းများ',
    },
    {
      icon: Globe,
      en: 'Bilingual staff (Myanmar & English)',
      mm: 'ဘာသာစကားနှစ်ခု ပြောတတ်သော ဝန်ထမ်းများ',
    },
    {
      icon: Users,
      en: 'Central location in Latha Township',
      mm: 'လသာမြို့နယ် ဗဟိုတည်နေရာ',
    },
  ];

  const stats = [
    { icon: Award, number: '15+', labelEn: 'Years Experience', labelMm: 'နှစ် အတွေ့အကြုံ' },
    { icon: Users, number: '5,000+', labelEn: 'Happy Patients', labelMm: 'လူနာများ' },
    { icon: Shield, number: '3', labelEn: 'Expert Dentists', labelMm: 'ဆရာဝန်များ' },
    { icon: Heart, number: '100%', labelEn: 'Dedication', labelMm: 'အပ်နှံမှု' },
  ];

  return (
    <main className="bg-white pt-20 font-sans">
      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 min-h-[calc(100vh-5rem)] flex items-center py-14 md:py-20">
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-green-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-100/80 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 md:px-8 lg:px-12 text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className={badgeClassName}>
              <Sparkles className="h-3.5 w-3.5" />
              {t('About KAY Dental Care', 'KAY Dental Care အကြောင်း')}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              {t('Caring for smiles ', 'အပြုံးများကို ')}
              <span className="text-green-600">
                {t('since 2009', '၂၀၀၉ မှစ၍')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'Providing quality dental care in Yangon with modern technology, experienced dentists, and a warm, welcoming environment.',
                'ခေတ်မီနည်းပညာ၊ ကျွမ်းကျင်သော ဆရာဝန်များနှင့် ရင်းနှီးသော ဝန်းကျင်ဖြင့် ရန်ကုန်တွင် အရည်အသွေးမြင့် သွားကုသမှု ပေးလျက်ရှိပါသည်။'
              )}
            </p>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('15+ Years Experience', '၁၅ နှစ်')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('5,000+ Patients Served', 'လူနာ ၅,၀၀၀+')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('International Standards', 'နိုင်ငံတကာ စံနှုန်း')}</span>
              </div>
            </div>

            <a
              href="#story"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
            >
              <ArrowRight className="h-5 w-5" />
              {t('Learn Our Story', 'ကျွန်ုပ်တို့ အကြောင်း')}
            </a>
          </motion.div>
        </div>
      </header>

      {/* ============ OUR STORY ============ */}
      <section id="story" className="px-4 py-16 md:px-8 md:py-24 lg:px-12 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Image */}
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="relative"
            >
              {/* Decorative shape */}
              <div className="absolute -inset-4 bg-gradient-to-br from-green-100 to-yellow-100 rounded-3xl blur-2xl opacity-40" />

              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl bg-gray-100">
                <img
                  src="https://images.pexels.com/photos/4269268/pexels-photo-4269268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=640"
                  alt={t('KAY Dental Clinic', 'KAY Dental ဆေးခန်း')}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Floating years badge */}
              <div className="absolute -bottom-6 -left-4 md:-left-8">
                <div className="rounded-2xl bg-white px-5 py-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 leading-none">15+</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t('Years of Care', 'နှစ်')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className={badgeClassName}>
                {t('Our Story', 'ကျွန်ုပ်တို့ အကြောင်း')}
              </span>

              <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                {t(
                  'A journey of trust and excellence',
                  'ယုံကြည်မှုနှင့် ထူးချွန်မှု၏ ခရီး'
                )}
              </h2>

              <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600">
                <p>
                  {t(
                    'KAY Dental Care was founded in 2009 by Dr. Khin May Oo with a simple yet powerful mission: to provide professional, affordable, and compassionate dental care to the people of Yangon.',
                    'KAY Dental Care ကို ၂၀၀၉ ခုနှစ်တွင် ဒေါက်တာ ခင်မေဦးက ရိုးရှင်းသော်လည်း အားကောင်းသော ရည်မှန်းချက်ဖြင့် တည်ထောင်ခဲ့ပါသည်။'
                  )}
                </p>
                <p>
                  {t(
                    'Starting from a small clinic in Latha Township, we have grown into a trusted dental care provider serving thousands of patients across Yangon.',
                    'လသာမြို့နယ်ရှိ ဆေးခန်းငယ်မှ စတင်ခဲ့ပြီး ရန်ကုန်တစ်ဝန်း လူနာထောင်ပေါင်းများစွာကို ဝန်ဆောင်မှုပေးသော ယုံကြည်ရသော သွားကုသမှုအဖြစ် ကြီးထွားလာခဲ့ပါသည်။'
                  )}
                </p>
                <p>
                  {t(
                    'Today, our team of experienced dentists continues our mission of giving everyone a reason to smile.',
                    'ယနေ့တွင် အတွေ့အကြုံရှိ သွားဆရာဝန်များနှင့်အတူ လူတိုင်းကို အပြုံးပေးရန် ကျွန်ုပ်တို့၏ ရည်မှန်းချက်ကို ဆက်လက် ဆောင်ရွက်လျက်ရှိပါသည်။'
                  )}
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                >
                  <Users className="h-4 w-4" />
                  {t('Meet Our Team', 'အဖွဲ့သားများ')}
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-5 py-2.5 text-sm font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
                >
                  {t('Our Services', 'ဝန်ဆောင်မှုများ')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ STATS SECTION ============ */}
      <section className="px-4 py-12 md:px-8 md:py-16 lg:px-12 bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
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
                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="mt-1 text-sm text-gray-500 font-medium">
                  {t(stat.labelEn, stat.labelMm)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MISSION VISION VALUES ============ */}
      <section className="px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              {t('What Drives Us', 'ကျွန်ုပ်တို့ကို လှုံ့ဆော်သည်')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t(
                'Our mission, vision, and values',
                'ရည်မှန်းချက်၊ မျှော်မှန်းချက်နှင့် တန်ဖိုးများ'
              )}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'The principles that guide everything we do for our patients.',
                'လူနာများအတွက် ကျွန်ုပ်တို့ လုပ်ဆောင်သမျှကို လမ်းညွှန်သော အခြေခံသဘောတရားများ။'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 group-hover:bg-green-600 transition-colors duration-300">
                  <item.icon className="h-7 w-7 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {t(item.titleEn, item.titleMm)}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-gray-600">
                  {t(item.descEn, item.descMm)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT SETS US APART ============ */}
      <section className="px-4 py-16 md:px-8 md:py-24 lg:px-12 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              <Award className="h-3.5 w-3.5" />
              {t('Why Choose Us', 'ဘာကြောင့် ရွေးချယ်ရမလဲ')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('What Sets Us Apart', 'ကျွန်ုပ်တို့ ဘာကြောင့် ထူးခြားသလဲ')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'We go above and beyond to ensure the best experience for your dental care.',
                'သင့်သွားကုသမှုအတွက် အကောင်းဆုံး အတွေ့အကြုံရရှိစေရန် ကျွန်ုပ်တို့ ဆောင်ရွက်ပါသည်။'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-600 transition-colors duration-300">
                  <item.icon className="h-5 w-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-base text-gray-800 leading-relaxed pt-1.5">
                  {t(item.en, item.mm)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
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
                <Heart className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                {t(
                  'Ready to experience KAY Dental Care?',
                  'KAY Dental Care ကို စမ်းသုံးရန် အသင့်လား?'
                )}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-green-50 md:text-lg">
                {t(
                  'Book your appointment today and see why thousands of patients trust us with their smiles.',
                  'ယနေ့ ရက်ချိန်း ယူပြီး လူနာထောင်ပေါင်းများစွာ ဘာကြောင့် ကျွန်ုပ်တို့ကို ယုံကြည်ကြသည်ကို ခံစားပါ။'
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