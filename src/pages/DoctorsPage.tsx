import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { mockDoctors } from '@/data/mockData';


export default function DoctorsPage() {
  const { t } = useLanguageStore();

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Our Dental Team', 'ကျွန်ုပ်တို့၏ သွားကုသမှု အဖွဲ့')}</h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              {t('Experienced, caring, and dedicated to your dental health', 'အတွေ့အကြုံရှိ၊ ဂရုစိုက်ပြီး သင့်သွားကျန်းမာရေးအတွက် အပ်နှံထားသည်')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockDoctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="card group">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={doctor.photoUrl}
                      alt={t(doctor.nameEn, doctor.nameMm)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-1">{t(doctor.nameEn, doctor.nameMm)}</h3>
                    <p className="text-primary-600 font-medium text-sm mb-1">{doctor.title}</p>
                    <p className="text-gray-500 text-sm mb-3">{t(doctor.specialtyEn, doctor.specialtyMm)}</p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-500" />
                        {doctor.experienceYears} {t('years experience', 'နှစ် အတွေ့အကြုံ')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        {doctor.availableDays.replace(/,/g, ', ')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/doctors/${doctor.id}`} className="btn-outline !py-2 !px-4 !text-sm flex-1 text-center">
                        {t('View Profile', 'ပရိုဖိုင်ကြည့်ရန်')}
                      </Link>
                      <Link to="/appointment" className="btn-primary !py-2 !px-4 !text-sm flex-1 text-center">
                        {t('Book', 'ချိန်းဆိုရန်')}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
