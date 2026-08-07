import { motion } from 'framer-motion';
import { AlertTriangle, Phone, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { Link } from 'react-router-dom';

export default function EmergencyPage() {
  const { t } = useLanguageStore();

  return (
    <div className="pt-20">
      <section className="bg-red-600 py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Dental Emergency', 'သွား အရေးပေါ်')}</h1>
            <p className="text-lg text-red-100 mb-6">{t('If you are experiencing a dental emergency, contact us immediately.', 'သွားအရေးပေါ် ကြုံနေပါက ချက်ချင်းဆက်သွယ်ပါ။')}</p>
            <a href="tel:095158726" className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-red-50 transition-all inline-flex items-center gap-3 shadow-lg">
              <Phone className="w-6 h-6" />
              09 5158726
            </a>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('What Counts as a Dental Emergency?', 'သွား အရေးပေါ်ဟု ဘာကို ဆိုသလဲ?')}</h2>
          <div className="space-y-4 mb-12">
            {[
              { en: 'Severe or persistent toothache', mm: 'ပြင်းထန်သော သို့မဟုတ် ဆက်တိုက်ဖြစ်နေသော သွားကိုက်ခြင်း' },
              { en: 'Broken, chipped, or cracked tooth', mm: 'ကျိုးနေသော၊ အက်နေသော သွား' },
              { en: 'Knocked-out tooth (dental avulsion)', mm: 'ကျွတ်သွားသော သွား' },
              { en: 'Loose or dislodged tooth', mm: 'လွတ်နေသော သို့မဟုတ် ရွေ့နေသော သွား' },
              { en: 'Severe dental infection or abscess', mm: 'ပြင်းထန်သော သွားပိုးဝင်ခြင်း သို့မဟုတ် ပြည်တည်ခြင်း' },
              { en: 'Uncontrolled bleeding after extraction', mm: 'သွားနုတ်ပြီးနောက် မရပ်သော သွေးထွက်ခြင်း' },
              { en: 'Jaw injury or trauma', mm: 'မေးရိုးဒဏ်ရာ' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 bg-red-50 rounded-xl"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-gray-800">{t(item.en, item.mm)}</span>
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('What to Do Before You Arrive', 'မရောက်မီ ဘာလုပ်သင့်သလဲ')}</h2>
          <div className="space-y-4 mb-12">
            {[
              { en: 'Stay calm and call us immediately at 09 5158726', mm: 'စိတ်အေးအေးထားပြီး 09 5158726 သို့ ချက်ချင်းဖုန်းခေါ်ပါ' },
              { en: 'For a knocked-out tooth: pick it up by the crown (not root), rinse gently, try to put it back in the socket or keep in milk', mm: 'ကျွတ်သွားသော သွားအတွက်: ခေါင်းစွပ်ပိုင်းကို ကိုင်ပါ (အမြစ်မဟုတ်)၊ နူးညံ့စွာ ဆေးပါ၊ နို့ထဲတွင် ထားပါ' },
              { en: 'For toothache: rinse with warm salt water, take over-the-counter pain relief', mm: 'သွားကိုက်ခြင်းအတွက်: ရေနွေးဆားရည်ဖြင့် ပလုပ်ကျင်းပါ' },
              { en: 'For bleeding: apply gentle pressure with clean gauze', mm: 'သွေးထွက်ခြင်းအတွက်: သန့်ရှင်းသော ဂေါ့ဇ်ဖြင့် ဖြည်းညှင်းစွာ ဖိထားပါ' },
              { en: 'Try to reach us within 30 minutes for best outcome', mm: 'အကောင်းဆုံးရလဒ်ရရှိရန် ၃၀ မိနစ်အတွင်း ဆက်သွယ်ပါ' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <span className="text-gray-700">{t(item.en, item.mm)}</span>
              </motion.div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-4">
            <Clock className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{t('Emergency Availability', 'အရေးပေါ် ရရှိနိုင်မှု')}</h3>
              <p className="text-gray-600 text-sm">
                {t(
                  'For after-hours emergencies, please call 09 5158726. We will do our best to assist you or guide you to the nearest emergency dental facility.',
                  'ဆေးခန်းဖွင့်ချိန်ပြင်ပ အရေးပေါ်များအတွက် 09 5158726 သို့ ဖုန်းခေါ်ပါ။ သင့်ကို ကူညီရန် သို့မဟုတ် အနီးဆုံး အရေးပေါ် သွားဆေးခန်းသို့ လမ်းညွှန်ပေးပါမည်။'
                )}
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              {t('Contact Us', 'ဆက်သွယ်ရန်')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
