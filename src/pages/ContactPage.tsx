import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { CLINIC_INFO } from '@/constants/clinicInfo';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { t } = useLanguageStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error(t('Please fill in required fields', 'လိုအပ်သော အကွက်များကို ဖြည့်ပါ'));
      return;
    }
    setSubmitted(true);
    toast.success(t('Message sent successfully!', 'မက်ဆေ့ဂျ် အောင်မြင်စွာ ပို့ပြီးပါပြီ!'));
  };

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Contact Us', 'ဆက်သွယ်ရန်')}</h1>
            <p className="text-lg text-green-100">{t('We\'d love to hear from you', 'သင့်ထံမှ ကြားလိုပါသည်')}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Get in Touch', 'ဆက်သွယ်ပါ')}</h2>
              <div className="space-y-6 mb-8">
                {[
                  { icon: <MapPin />, label: t('Address', 'လိပ်စာ'), value: t(CLINIC_INFO.addressEn, CLINIC_INFO.addressMm) },
                  { icon: <Phone />, label: t('Phone', 'ဖုန်း'), value: `${CLINIC_INFO.phone1}\n${CLINIC_INFO.phone2}`, isPhone: true },
                  { icon: <Mail />, label: t('Email', 'အီးမေးလ်'), value: CLINIC_INFO.email },
                  { icon: <Clock />, label: t('Hours', 'ဖွင့်ချိန်'), value: `${t('Mon-Fri', 'တနင်္လာ-သောကြာ')}: 9:00-18:00\n${t('Saturday', 'စနေ')}: 9:00-16:00` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.label}</h4>
                      {item.isPhone ? (
                        <div className="space-y-1">
                          <a href={`tel:${CLINIC_INFO.phone1.replace(/\s/g, '')}`} className="block text-gray-600 hover:text-primary-600 transition-colors">{CLINIC_INFO.phone1}</a>
                          <a href={`tel:${CLINIC_INFO.phone2.replace(/\s/g, '')}`} className="block text-gray-600 hover:text-primary-600 transition-colors">{CLINIC_INFO.phone2}</a>
                        </div>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a href={`viber://chat?number=${CLINIC_INFO.viberNumber}`} className="flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2.5 rounded-xl font-medium hover:bg-purple-200 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Viber
                </a>
                <a href={CLINIC_INFO.messengerLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2.5 rounded-xl font-medium hover:bg-blue-200 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Messenger
                </a>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-2xl overflow-hidden shadow-lg h-[250px]">
                <iframe
                  src={CLINIC_INFO.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Location"
                />
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('Message Sent!', 'မက်ဆေ့ဂျ် ပို့ပြီးပါပြီ!')}</h3>
                  <p className="text-gray-500">{t('We will get back to you as soon as possible.', 'တတ်နိုင်သမျှ အမြန်ဆုံး ပြန်လည်ဆက်သွယ်ပါမည်။')}</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', subject: '', message: '' }); }} className="btn-primary mt-4">
                    {t('Send Another Message', 'နောက်ထပ် မက်ဆေ့ဂျ် ပို့ရန်')}
                  </button>
                </div>
              ) : (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('Send Us a Message', 'မက်ဆေ့ဂျ် ပို့ပါ')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('Name', 'အမည်')} *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Phone', 'ဖုန်း')}</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Email', 'အီးမေးလ်')}</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('Subject', 'ခေါင်းစဉ်')}</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('Message', 'မက်ဆေ့ဂျ်')} *</label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      {t('Send Message', 'မက်ဆေ့ဂျ် ပို့ရန်')}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
