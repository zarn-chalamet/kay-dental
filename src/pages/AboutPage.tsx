import { motion } from 'framer-motion';
import { Shield, Heart, Award, Eye, Target, Users, CheckCircle } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import SectionTitle from '@/components/SectionTitle';

export default function AboutPage() {
  const { t } = useLanguageStore();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="gradient-green py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-60 h-60 rounded-full bg-white/20" />
        </div>
        <div className="container-custom relative text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('About KAY Dental Care', 'KAY Dental Care အကြောင်း')}</h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              {t(
                'Providing quality dental care in Yangon since 2009. Your smile is our mission.',
                '၂၀၀၉ ခုနှစ်မှစ၍ ရန်ကုန်တွင် အရည်အသွေးမြင့် သွားကုသမှု ပေးလျက်ရှိပါသည်။'
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img
                src="https://images.pexels.com/photos/4269268/pexels-photo-4269268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                alt="KAY Dental Clinic"
                className="rounded-2xl shadow-lg w-full"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('Our Story', 'ကျွန်ုပ်တို့၏ အကြောင်းအရာ')}</h2>
              <div className="w-16 h-1 bg-primary-500 rounded-full mb-6" />
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t(
                  'KAY Dental Care was founded in 2009 by Dr. Khin May Oo with a simple yet powerful mission: to provide professional, affordable, and compassionate dental care to the people of Yangon.',
                  'KAY Dental Care ကို ၂၀၀၉ ခုနှစ်တွင် ဒေါက်တာ ခင်မေဦးက ရိုးရှင်းသော်လည်း အားကောင်းသော ရည်မှန်းချက်ဖြင့် တည်ထောင်ခဲ့ပါသည်။'
                )}</p>
                <p>{t(
                  'Starting from a small clinic in Latha Township, we have grown into a trusted dental care provider serving thousands of patients. Our commitment to using modern equipment and following international sterilization standards has earned us the trust of families across Yangon.',
                  'လသာမြို့နယ်ရှိ ဆေးခန်းငယ်မှ စတင်ခဲ့ပြီး လူနာထောင်ပေါင်းများစွာကို ဝန်ဆောင်မှုပေးသော ယုံကြည်ရသော သွားကုသမှု ဝန်ဆောင်မှုပေးသူအဖြစ် ကြီးထွားလာခဲ့ပါသည်။'
                )}</p>
                <p>{t(
                  'Today, with a team of 3 experienced dentists and modern facilities, we continue our mission of giving everyone a reason to smile.',
                  'ယနေ့တွင် အတွေ့အကြုံရှိ သွားဆရာဝန် ၃ ဦးနှင့် ခေတ်မီ အဆောက်အဦများဖြင့် လူတိုင်းကို အပြုံးပေးရန် ကျွန်ုပ်တို့၏ ရည်မှန်းချက်ကို ဆက်လက်ဆောင်ရွက်လျက်ရှိပါသည်။'
                )}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                titleEn: 'Our Mission', titleMm: 'ကျွန်ုပ်တို့၏ ရည်မှန်းချက်',
                descEn: 'To provide accessible, high-quality dental care using modern technology while making every patient feel comfortable and valued.',
                descMm: 'ခေတ်မီနည်းပညာကို အသုံးပြု၍ လူနာတိုင်းကို သက်တောင့်သက်သာ ခံစားရစေပြီး အရည်အသွေးမြင့် သွားကုသမှု ပေးရန်။',
              },
              {
                icon: <Eye className="w-8 h-8" />,
                titleEn: 'Our Vision', titleMm: 'ကျွန်ုပ်တို့၏ မျှော်မှန်းချက်',
                descEn: 'To be the most trusted dental clinic in Myanmar, known for excellence in care, innovation, and patient satisfaction.',
                descMm: 'ကုသမှုဆိုင်ရာ ထူးချွန်မှု၊ ဆန်းသစ်တီထွင်မှုနှင့် လူနာကျေနပ်မှုအတွက် ထင်ရှားသော မြန်မာနိုင်ငံ၏ အယုံကြည်ရဆုံး သွားဆေးခန်းဖြစ်ရန်။',
              },
              {
                icon: <Heart className="w-8 h-8" />,
                titleEn: 'Our Values', titleMm: 'ကျွန်ုပ်တို့၏ တန်ဖိုးများ',
                descEn: 'Compassion, excellence, integrity, and continuous learning guide everything we do for our patients.',
                descMm: 'ကရုဏာ၊ ထူးချွန်မှု၊ သမာဓိနှင့် စဉ်ဆက်မပြတ် သင်ယူမှုတို့သည် ကျွန်ုပ်တို့ လူနာများအတွက် ဆောင်ရွက်သမျှကို လမ်းညွှန်ပါသည်။',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(item.titleEn, item.titleMm)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(item.descEn, item.descMm)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle
            title={t('What Sets Us Apart', 'ကျွန်ုပ်တို့ ဘာကြောင့် ထူးခြားသလဲ')}
            subtitle={t('We go above and beyond for your dental health', 'သင့်သွားကျန်းမာရေးအတွက် ထူးခြားစွာ ဆောင်ရွက်ပေးပါသည်')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { en: 'Modern digital X-ray equipment for accurate diagnosis', mm: 'တိကျသော ရောဂါရှာဖွေရန် ခေတ်မီ ဒစ်ဂျစ်တယ် X-ray ကိရိယာ' },
              { en: 'International sterilization standards (autoclave)', mm: 'နိုင်ငံတကာ ပိုးသတ်စံနှုန်းများ (autoclave)' },
              { en: 'Painless treatment with modern anesthesia', mm: 'ခေတ်မီ ထုံဆေးဖြင့် နာကျင်မှုမရှိသော ကုသမှု' },
              { en: 'Affordable pricing with flexible payment options', mm: 'တတ်နိုင်သော စျေးနှုန်းနှင့် ပြောင်းလွယ်ပြင်လွယ် ငွေပေးချေမှု' },
              { en: 'Bilingual staff (Myanmar & English)', mm: 'ဘာသာစကား နှစ်ဘာသာ ပြောတတ်သော ဝန်ထမ်းများ' },
              { en: 'Central location in Latha Township', mm: 'လသာမြို့နယ် ဗဟိုတည်နေရာ' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <CheckCircle className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
                <span className="text-gray-700">{t(item.en, item.mm)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="gradient-green py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { icon: <Award />, number: '15+', label: t('Years Experience', 'နှစ် အတွေ့အကြုံ') },
              { icon: <Users />, number: '5,000+', label: t('Happy Patients', 'ပျော်ရွှင်သော လူနာများ') },
              { icon: <Shield />, number: '3', label: t('Expert Dentists', 'ကျွမ်းကျင် ဆရာဝန်များ') },
              { icon: <Heart />, number: '100%', label: t('Dedication', 'အပ်နှံမှု') },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-accent-400 flex justify-center mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm text-green-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
