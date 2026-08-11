import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock,
  Send, MessageCircle, CheckCircle,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useClinicSettings } from '@/hooks/usePublicData';
import { contactApi } from '@/api/publicApi';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { t } = useLanguageStore();
  const { data: settings } = useClinicSettings();

  const [form, setForm] = useState({
    name: '', phone: '', email: '', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error(t('Please fill in required fields', 'လိုအပ်သော အကွက်များကို ဖြည့်ပါ'));
      return;
    }
    setIsSubmitting(true);
    try {
      await contactApi.send({
        name: form.name,
        phone: form.phone || undefined,
        email: form.email || undefined,
        subject: form.subject || undefined,
        message: form.message,
      });
      setSubmitted(true);
      toast.success(t('Message sent successfully!', 'မက်ဆေ့ဂျ် အောင်မြင်စွာ ပို့ပြီးပါပြီ!'));
    } catch {
      toast.error(t('Failed to send message. Please try again.', 'မက်ဆေ့ဂျ် ပို့မရပါ။ ထပ်စမ်းကြည့်ပါ။'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addressEn         = settings?.addressEn ?? '';
  const addressMm         = settings?.addressMm ?? '';
  const phone1            = settings?.phone1 ?? '';
  const phone2            = settings?.phone2 ?? '';
  const email             = settings?.email ?? '';
  const viberNumber       = settings?.viberNumber ?? '';
  const messengerLink     = settings?.messengerLink ?? '';
  const googleMapsEmbedUrl = settings?.googleMapsEmbedUrl ?? '';

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('Contact Us', 'ဆက်သွယ်ရန်')}
            </h1>
            <p className="text-lg text-green-100">
              {t("We'd love to hear from you", 'သင့်ထံမှ ကြားလိုပါသည်')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('Get in Touch', 'ဆက်သွယ်ပါ')}
              </h2>

              <div className="space-y-6 mb-8">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('Address', 'လိပ်စာ')}</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {t(addressEn, addressMm)}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('Phone', 'ဖုန်း')}</h4>
                    <div className="space-y-1">
                      {phone1 && (
                        <a
                          href={`tel:${phone1.replace(/\s/g, '')}`}
                          className="block text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          {phone1}
                        </a>
                      )}
                      {phone2 && (
                        <a
                          href={`tel:${phone2.replace(/\s/g, '')}`}
                          className="block text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          {phone2}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <Mail />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('Email', 'အီးမေးလ်')}</h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                    <Clock />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{t('Hours', 'ဖွင့်ချိန်')}</h4>
                    {settings?.openingHours && settings.openingHours.length > 0 ? (
                      <div className="space-y-0.5">
                        {settings.openingHours.map((schedule) => (
                          <p key={schedule.day} className="text-gray-600 text-sm">
                            <span className="font-medium">
                              {t(schedule.day, schedule.dayMm)}:
                            </span>{' '}
                            {schedule.isClosed
                              ? t('Closed', 'ပိတ်သည်')
                              : `${schedule.open} - ${schedule.close}`}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 whitespace-pre-line">
                        {`${t('Mon-Fri', 'တနင်္လာ-သောကြာ')}: 9:00-18:00\n${t('Saturday', 'စနေ')}: 9:00-16:00`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {viberNumber && (
                  <a
                    href={`viber://chat?number=${viberNumber}`}
                    className="flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2.5 rounded-xl font-medium hover:bg-purple-200 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Viber
                  </a>
                )}
                {messengerLink && (
                  <a
                    href={messengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2.5 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Messenger
                  </a>
                )}
              </div>

              {/* Map */}
              {googleMapsEmbedUrl && (
                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg h-[250px]">
                  <iframe
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Location"
                  />
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('Message Sent!', 'မက်ဆေ့ဂျ် ပို့ပြီးပါပြီ!')}
                  </h3>
                  <p className="text-gray-500">
                    {t(
                      'We will get back to you as soon as possible.',
                      'တတ်နိုင်သမျှ အမြန်ဆုံး ပြန်လည်ဆက်သွယ်ပါမည်။'
                    )}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
                    }}
                    className="btn-primary mt-4"
                  >
                    {t('Send Another Message', 'နောက်ထပ် မက်ဆေ့ဂျ် ပို့ရန်')}
                  </button>
                </div>
              ) : (
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t('Send Us a Message', 'မက်ဆေ့ဂျ် ပို့ပါ')}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('Name', 'အမည်')} *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        required
                      />
                    </div>

                    {/* Phone + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Phone', 'ဖုန်း')}
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Email', 'အီးမေးလ်')}
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('Subject', 'ခေါင်းစဉ်')}
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('Message', 'မက်ဆေ့ဂျ်')} *
                      </label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('Sending...', 'ပို့နေသည်...')}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t('Send Message', 'မက်ဆေ့ဂျ် ပို့ရန်')}
                        </>
                      )}
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