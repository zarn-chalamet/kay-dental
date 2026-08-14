import { motion } from 'framer-motion';
import {
  AlertCircle,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  MapPin,
  Info,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Link } from 'react-router-dom';

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

export default function EmergencyPage() {
  const { t } = useLanguageStore();

  const emergencySymptoms = [
    { en: 'Severe or persistent toothache', mm: 'ပြင်းထန်သော သွားကိုက်ခြင်း' },
    { en: 'Broken, chipped, or cracked tooth', mm: 'ကျိုးနေသော၊ အက်နေသော သွား' },
    { en: 'Knocked-out tooth', mm: 'ကျွတ်သွားသော သွား' },
    { en: 'Loose or dislodged tooth', mm: 'လွတ်နေသော သွား' },
    { en: 'Severe infection or abscess', mm: 'ပြင်းထန်သော ပိုးဝင်ခြင်း' },
    { en: 'Uncontrolled bleeding', mm: 'မရပ်သော သွေးထွက်ခြင်း' },
    { en: 'Jaw injury or trauma', mm: 'မေးရိုးဒဏ်ရာ' },
  ];

  const firstAidSteps = [
    {
      en: 'Call us during clinic hours',
      mm: 'ဆေးခန်းဖွင့်ချိန်တွင် ဖုန်းခေါ်ပါ',
      detail: {
        en: 'Reach us at 09 5158726 for immediate guidance and to book an urgent slot.',
        mm: '09 5158726 သို့ ဖုန်းခေါ်ပြီး အရေးပေါ်ရက်ချိန်း ရယူပါ။',
      },
    },
    {
      en: 'For a knocked-out tooth',
      mm: 'ကျွတ်သွားသော သွားအတွက်',
      detail: {
        en: 'Pick it up by the crown (not root), rinse gently, and keep it in milk until you arrive.',
        mm: 'ခေါင်းစွပ်ပိုင်းကို ကိုင်ပါ (အမြစ်မဟုတ်)၊ နူးညံ့စွာ ဆေးပါ၊ နို့ထဲတွင် ထားပါ။',
      },
    },
    {
      en: 'For severe toothache',
      mm: 'သွားကိုက်ခြင်းအတွက်',
      detail: {
        en: 'Rinse with warm salt water and take over-the-counter pain relief if needed.',
        mm: 'ရေနွေးဆားရည်ဖြင့် ပလုပ်ကျင်းပါ။ လိုအပ်ပါက အကိုက်ပြေးဆေး သောက်ပါ။',
      },
    },
    {
      en: 'For heavy bleeding',
      mm: 'သွေးထွက်ခြင်းအတွက်',
      detail: {
        en: 'Apply gentle pressure with clean gauze for 10-15 minutes.',
        mm: 'သန့်ရှင်းသော ဂေါ့ဇ်ဖြင့် ၁၀-၁၅ မိနစ်ခန့် ဖိထားပါ။',
      },
    },
  ];

  return (
    <main className="bg-white pt-20 font-sans">
      {/* ============ HERO - CALM, BRAND GREEN ============ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 min-h-[calc(100vh-5rem)] flex items-center py-14 md:py-20">
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-green-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-100/80 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            {/* Subtle alert badge - not scary */}
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-700">
              <AlertCircle className="h-3.5 w-3.5" />
              {t('Urgent Dental Care', 'အရေးပေါ် သွားကုသ')}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              {t('Dental ', 'သွား ')}
              <span className="text-green-600">
                {t('Emergency?', 'အရေးပေါ်')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'If you\'re in pain or have a dental emergency, call us right away. Our team will help you as quickly as possible.',
                'သွားနာနေခြင်း သို့မဟုတ် အရေးပေါ် ဖြစ်နေပါက ချက်ချင်း ဖုန်းခေါ်ပါ။ ကျွန်ုပ်တို့၏အဖွဲ့မှ အမြန်ဆုံး ကူညီပေးပါမည်။'
              )}
            </p>

            {/* Primary CTA - clear and prominent but not overwhelming */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="tel:095158726"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg active:scale-95"
              >
                <Phone className="h-5 w-5" />
                {t('Call 09 5158726', '09 5158726 ဖုန်းခေါ်ရန်')}
              </a>

              <a
                href="#first-aid"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white"
              >
                {t('First Aid Guide', 'ရှေးဦးသူနာပြု လမ်းညွှန်')}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            {/* Honest availability notice */}
            <div className="mt-8 inline-flex items-start gap-2 rounded-full bg-white/80 backdrop-blur border border-gray-200 px-4 py-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <span>
                {t(
                  'Available during clinic hours: Mon–Sat, 9:00 AM – 6:00 PM',
                  'ဆေးခန်းဖွင့်ချိန်- တနင်္လာ–စနေ ၉:၀၀ – ၁၈:၀၀'
                )}
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ============ EMERGENCY SYMPTOMS ============ */}
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
              <AlertCircle className="h-3.5 w-3.5" />
              {t('Warning Signs', 'သတိပေးလက္ခဏာ')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('What Counts as a Dental Emergency?', 'သွား အရေးပေါ်ဟု ဘာကို ဆိုသလဲ?')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'If you experience any of these, please contact us as soon as possible.',
                'အောက်ပါ လက္ခဏာများ ခံစားရပါက အမြန်ဆုံး ဆက်သွယ်ပါ။'
              )}
            </p>
          </motion.div>

          {/* Symptoms grid - subtle, professional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencySymptoms.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:border-green-100 transition-all duration-300"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-600 transition-colors duration-300">
                  <CheckCircle className="h-5 w-5 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-base text-gray-800 leading-relaxed">
                  {t(item.en, item.mm)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FIRST AID STEPS ============ */}
      <section id="first-aid" className="py-16 md:py-20 scroll-mt-24">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-10 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              <Heart className="h-3.5 w-3.5" />
              {t('First Aid', 'ရှေးဦးသူနာပြု')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('What to Do Before You Arrive', 'မရောက်မီ ဘာလုပ်သင့်သလဲ')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'Follow these simple steps to manage the situation until you reach the clinic.',
                'ဆေးခန်းသို့ မရောက်မီ အောက်ပါအဆင့်များအတိုင်း လုပ်ဆောင်ပါ။'
              )}
            </p>
          </motion.div>

          {/* Numbered steps */}
          <div className="space-y-4">
            {firstAidSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative flex items-start gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Step number */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t(step.en, step.mm)}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-gray-600">
                    {t(step.detail.en, step.detail.mm)}
                  </p>

                  {/* Call button on first step */}
                  {i === 0 && (
                    <a
                      href="tel:095158726"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      09 5158726
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HONEST AVAILABILITY + LOCATION ============ */}
      <section className="pb-16 md:pb-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Availability card - HONEST */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 group-hover:bg-green-600 transition-colors duration-300">
                <Clock className="h-7 w-7 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {t('Clinic Hours', 'ဆေးခန်းဖွင့်ချိန်')}
              </h3>
              <div className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">{t('Monday – Friday', 'တနင်္လာ – သောကြာ')}</span>
                  <span>9:00 – 18:00</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">{t('Saturday', 'စနေ')}</span>
                  <span>9:00 – 16:00</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="font-medium">{t('Sunday', 'တနင်္ဂနွေ')}</span>
                  <span>{t('Closed', 'ပိတ်သည်')}</span>
                </div>
              </div>
              <div className="mt-5 flex items-start gap-2 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
                <Info className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed text-gray-600">
                  {t(
                    'For after-hours emergencies, we recommend visiting the nearest hospital emergency department.',
                    'ဆေးခန်းပိတ်ချိန်တွင် အရေးပေါ်ဖြစ်ပါက အနီးဆုံးဆေးရုံ၏ အရေးပေါ်ဌာနသို့ သွားရောက်ရန် အကြံပြုပါသည်။'
                  )}
                </p>
              </div>
            </motion.div>

            {/* Location card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 group-hover:bg-green-600 transition-colors duration-300">
                <MapPin className="h-7 w-7 text-green-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                {t('Our Location', 'တည်နေရာ')}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">
                {t(
                  'KAY Dental Care is located in Latha Township, Yangon. Easy to reach for urgent visits.',
                  'KAY Dental Care သည် ရန်ကုန်မြို့၊ လသာမြို့နယ်တွင် တည်ရှိပါသည်။ အရေးပေါ် လာရောက်ရန် လွယ်ကူပါသည်။'
                )}
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors group/link"
              >
                {t('Get Directions', 'လမ်းညွှန်ကြည့်ရန်')}
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA - CALM GREEN ============ */}
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
                <Phone className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                {t('Need help right now?', 'ချက်ချင်း အကူအညီ လိုအပ်ပါသလား?')}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-green-50 md:text-lg">
                {t(
                  'Call us during clinic hours and our team will guide you through the next steps.',
                  'ဆေးခန်းဖွင့်ချိန်တွင် ဖုန်းခေါ်ပါ။ ကျွန်ုပ်တို့၏အဖွဲ့မှ လမ်းညွှန်ပေးပါမည်။'
                )}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="tel:095158726"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-gray-900 shadow-md transition-all duration-200 hover:bg-yellow-300 hover:shadow-lg active:scale-95"
                >
                  <Phone className="h-5 w-5" />
                  {t('Call 09 5158726', '09 5158726')}
                </a>

                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-white/20 active:scale-95"
                >
                  {t('Contact Us', 'ဆက်သွယ်ရန်')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}