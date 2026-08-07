import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Globe, Award, CheckCircle } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { mockDoctors } from '@/data/mockData';

export default function DoctorDetailPage() {
  const { id } = useParams();
  const { t } = useLanguageStore();
  const doctor = mockDoctors.find(d => d.id === Number(id));

  if (!doctor) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('Doctor Not Found', 'ဆရာဝန် ရှာမတွေ့ပါ')}</h1>
          <Link to="/doctors" className="btn-primary mt-4 inline-block">{t('Back to Doctors', 'ဆရာဝန်များသို့ ပြန်သွားရန်')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom">
          <Link to="/doctors" className="inline-flex items-center gap-1 text-green-200 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('All Doctors', 'ဆရာဝန်အားလုံး')}
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
              <div className="card overflow-hidden">
                <img src={doctor.photoUrl} alt={t(doctor.nameEn, doctor.nameMm)} className="w-full aspect-[3/4] object-cover" />
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900">{t(doctor.nameEn, doctor.nameMm)}</h1>
                  <p className="text-primary-600 font-medium">{doctor.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{t(doctor.specialtyEn, doctor.specialtyMm)}</p>
                  <div className="mt-4">
                    <Link to="/appointment" className="btn-primary w-full text-center flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {t('Book with', 'ချိန်းဆိုရန်')} {t(doctor.nameEn, doctor.nameMm).split(' ').slice(0, 2).join(' ')}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 pt-32 lg:pt-0">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{t('About', 'အကြောင်း')}</h2>
                  <p className="text-gray-600 leading-relaxed">{t(doctor.bioEn, doctor.bioMm)}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-500">{t('Experience', 'အတွေ့အကြုံ')}</span>
                      <div className="font-semibold text-gray-900">{doctor.experienceYears} {t('Years', 'နှစ်')}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-500">{t('Languages', 'ဘာသာစကား')}</span>
                      <div className="font-semibold text-gray-900">{doctor.languages}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-500">{t('Available Days', 'ရက်များ')}</span>
                      <div className="font-semibold text-gray-900">{doctor.availableDays.replace(/,/g, ', ')}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-500">{t('Hours', 'အချိန်')}</span>
                      <div className="font-semibold text-gray-900">{doctor.availableFrom} - {doctor.availableTo}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">{t('Qualifications', 'အရည်အချင်းများ')}</h3>
                  <div className="space-y-2">
                    {doctor.qualifications.split(',').map((q, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{q.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
