import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useClinicSettings } from '@/hooks/usePublicData';
import { contactApi } from '@/api/publicApi';
import toast from 'react-hot-toast';

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

export default function ContactPage() {
  const { t } = useLanguageStore();
  const { data: settings } = useClinicSettings();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
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

  const addressEn = settings?.addressEn ?? '';
  const addressMm = settings?.addressMm ?? '';
  const phone1 = settings?.phone1 ?? '';
  const phone2 = settings?.phone2 ?? '';
  const email = settings?.email ?? '';
  const viberNumber = settings?.viberNumber ?? '';
  const messengerLink = settings?.messengerLink ?? '';
  const googleMapsEmbedUrl = settings?.googleMapsEmbedUrl ?? '';

  const primaryPhone = phone1 || phone2;

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressEn || 'KAY Dental Care Latha Township Yangon'
  )}`;

  const badgeClassName =
    'inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700';

  const inputClassName =
    'h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20';

  const textareaClassName =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none';

  const contactItemClassName =
    'group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-white hover:shadow-lg';

  const socialButtonClassName =
    'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50 hover:text-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';

  return (
    <main className="bg-white pt-20 font-sans">
      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 py-16 md:py-24">
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-green-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-100/80 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        </div>

        <div className="relative container-custom px-4 md:px-8 lg:px-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              {t('Contact KAY Dental Care', 'KAY Dental Care သို့ ဆက်သွယ်ရန်')}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              {t('We’d love to hear from you', 'ဆက်သွယ်ရန် ကြိုဆိုပါသည်')}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'Have a question, need help, or want to book a visit? Reach out to our team and we\'ll get back to you as soon as possible.',
                'မေးမြန်းရန် သို့မဟုတ် ရက်ချိန်းယူရန် ဆက်သွယ်နိုင်ပါသည်။ အမြန်ဆုံး ပြန်လည်ဆက်သွယ်ပါမည်။'
              )}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {primaryPhone && (
                <a
                  href={`tel:${primaryPhone.replace(/\s/g, '')}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Phone className="h-5 w-5" />
                  {t('Call the Clinic', 'ဆေးခန်းသို့ ဖုန်းခေါ်ရန်')}
                </a>
              )}

              <a
                href="#contact-form"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-6 py-3 text-center font-semibold text-green-600 transition-all duration-200 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Send className="h-5 w-5" />
                {t('Send a Message', 'မက်ဆေ့ဂျ် ပို့ရန်')}
              </a>
            </div>

            {(primaryPhone || email) && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {primaryPhone && (
                  <a
                    href={`tel:${primaryPhone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:text-green-700"
                  >
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{primaryPhone}</span>
                  </a>
                )}

                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-green-200 hover:text-green-700"
                  >
                    <Mail className="h-4 w-4 text-green-600" />
                    <span>{email}</span>
                  </a>
                )}
              </div>
            )}

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('Fast Response', 'အမြန်ဖြေကြားခြင်း')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('Trusted Care', 'ယုံကြည်စိတ်ချရသော ကုသမှု')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t('Latha Township, Yangon', 'လသာမြို့နယ်၊ ရန်ကုန်')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ============ CONTACT INFO + FORM ============ */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className={badgeClassName}>
              {t('Get in touch', 'ဆက်သွယ်ပါ')}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {t('Visit, call, or message us', 'လာရောက်ပါ၊ ဖုန်းခေါ်ပါ၊ သို့မဟုတ် မက်ဆေ့ဂျ်ပို့ပါ')}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'We’re here to help with appointments, treatment questions, and general inquiries.',
                'ရက်ချိန်းယူခြင်း၊ ကုသမှုဆိုင်ရာ မေးခွန်းများနှင့် အထွေထွေ သိလိုသည်များအတွက် ကျွန်ုပ်တို့က ကူညီပေးရန် အမြဲအသင့်ရှိပါသည်။'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start xl:gap-12">
            <motion.div
              variants={fadeLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
                <span className={badgeClassName}>
                  {t('Clinic information', 'ဆေးခန်းအချက်အလက်')}
                </span>

                <h3 className="mt-4 text-xl font-semibold text-gray-900 md:text-2xl">
                  {t('Reach KAY Dental Care easily', 'KAY Dental Care သို့ ဆက်သွယ်ရန်')}
                </h3>

                <p className="mt-3 text-base leading-relaxed text-gray-600">
                  {t(
                    'Find our address, phone numbers, email, and clinic hours below.',
                    'လိပ်စာ၊ ဖုန်းနံပါတ်များ၊ အီးမေးလ်နှင့် ဖွင့်ချိန်များကို အောက်တွင် ကြည့်ရှုနိုင်ပါသည်။'
                  )}
                </p>

                <div className="mt-8 space-y-4">
                  <div className={contactItemClassName}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                        <MapPin className="h-7 w-7 text-green-600 transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {t('Address', 'လိပ်စာ')}
                        </h4>
                        <p className="mt-1 whitespace-pre-line text-base leading-relaxed text-gray-600">
                          {t(addressEn, addressMm)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={contactItemClassName}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                        <Phone className="h-7 w-7 text-green-600 transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {t('Phone', 'ဖုန်း')}
                        </h4>
                        <div className="mt-1 space-y-1">
                          {phone1 && (
                            <a
                              href={`tel:${phone1.replace(/\s/g, '')}`}
                              className="block text-base text-gray-600 transition-colors duration-200 hover:text-green-600"
                            >
                              {phone1}
                            </a>
                          )}
                          {phone2 && (
                            <a
                              href={`tel:${phone2.replace(/\s/g, '')}`}
                              className="block text-base text-gray-600 transition-colors duration-200 hover:text-green-600"
                            >
                              {phone2}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={contactItemClassName}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                        <Mail className="h-7 w-7 text-green-600 transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {t('Email', 'အီးမေးလ်')}
                        </h4>
                        <a
                          href={`mailto:${email}`}
                          className="mt-1 block break-all text-base text-gray-600 transition-colors duration-200 hover:text-green-600"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className={contactItemClassName}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                        <Clock className="h-7 w-7 text-green-600 transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {t('Hours', 'ဖွင့်ချိန်')}
                        </h4>

                        {settings?.openingHours && settings.openingHours.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {settings.openingHours.map((schedule) => (
                              <div
                                key={schedule.day}
                                className="flex items-center justify-between text-sm gap-2"
                              >
                                <span className="font-medium text-gray-900">
                                  {t(schedule.day, schedule.dayMm)}
                                </span>
                                <span
                                  className={
                                    schedule.isClosed
                                      ? 'text-red-500 font-medium'
                                      : 'text-gray-600'
                                  }
                                >
                                  {schedule.isClosed
                                    ? t('Closed', 'ပိတ်သည်')
                                    : `${schedule.open} - ${schedule.close}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">
                                {t('Mon-Fri', 'တနင်္လာ-သောကြာ')}
                              </span>
                              <span className="text-gray-600">9:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-900">
                                {t('Saturday', 'စနေ')}
                              </span>
                              <span className="text-gray-600">9:00 - 16:00</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(viberNumber || messengerLink) && (
                <div className="rounded-2xl border border-green-100 bg-green-50/70 p-6 shadow-sm md:p-8">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t('Quick messaging options', 'အမြန်ဆက်သွယ်ရန် နည်းလမ်းများ')}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-gray-600">
                    {t(
                      'Prefer messaging? Reach out through your favorite app.',
                      'မက်ဆေ့ဂျ်ပို့ခြင်းကို ပိုနှစ်သက်ပါက သင်နှစ်သက်သော app မှတစ်ဆင့် ဆက်သွယ်နိုင်ပါသည်။'
                    )}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {viberNumber && (
                      <a
                        href={`viber://chat?number=${viberNumber}`}
                        className={socialButtonClassName}
                      >
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <span>Viber</span>
                      </a>
                    )}

                    {messengerLink && (
                      <a
                        href={messengerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={socialButtonClassName}
                      >
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <span>Messenger</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:sticky lg:top-24"
            >
              {submitted ? (
                <div
                  className="flex flex-col items-center justify-center rounded-2xl border border-green-100 bg-white p-6 text-center shadow-sm md:p-8"
                  aria-live="polite"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>

                  <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-yellow-700">
                    {t('Message delivered', 'မက်ဆေ့ဂျ် ပို့ပြီးပါပြီ')}
                  </span>

                  <h3 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                    {t('Thank you for contacting us', 'ဆက်သွယ်ပေးသည့်အတွက် ကျေးဇူးတင်ပါသည်')}
                  </h3>

                  <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600 md:text-lg">
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
                    className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {t('Send Another Message', 'နောက်ထပ် မက်ဆေ့ဂျ် ပို့ရန်')}
                  </button>
                </div>
              ) : (
                <div
                  id="contact-form"
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
                >
                  <span className={badgeClassName}>
                    {t('Send a message', 'မက်ဆေ့ဂျ် ပို့ပါ')}
                  </span>

                  <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                    {t('Tell us how we can help', 'ကျွန်ုပ်တို့ ဘယ်လိုကူညီပေးရမလဲ')}
                  </h2>

                  <p className="mt-3 text-base leading-relaxed text-gray-600">
                    {t(
                      'Fill out the form below and our team will respond as soon as possible.',
                      'အောက်ပါ form ကို ဖြည့်ပြီး ပေးပို့ပါ။ ကျွန်ုပ်တို့၏အဖွဲ့မှ အမြန်ဆုံး ပြန်လည်ဖြေကြားပေးပါမည်။'
                    )}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {t('* Required fields', '* ဖြည့်ရန်လိုအပ်သော အကွက်များ')}
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5" aria-busy={isSubmitting}>
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {t('Name', 'အမည်')} *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t('Your full name', 'သင့်အမည်အပြည့်အစုံ')}
                        className={inputClassName}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          {t('Phone', 'ဖုန်း')}
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder={t('Phone number', 'ဖုန်းနံပါတ်')}
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          {t('Email', 'အီးမေးလ်')}
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder={t('Email address', 'အီးမေးလ်လိပ်စာ')}
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {t('Subject', 'ခေါင်းစဉ်')}
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        autoComplete="off"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder={t('What would you like to ask?', 'ဘာအကြောင်း မေးမြန်းလိုပါသလဲ')}
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {t('Message', 'မက်ဆေ့ဂျ်')} *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={t(
                          'Write your message here...',
                          'သင့်မက်ဆေ့ဂျ်ကို ဒီနေရာတွင် ရေးပါ...'
                        )}
                        className={textareaClassName}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          {t('Sending...', 'ပို့နေသည်...')}
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          {t('Send Message', 'မက်ဆေ့ဂျ် ပို့ရန်')}
                        </>
                      )}
                    </button>

                    <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span>
                        {t(
                          'Your contact details will only be used to respond to your inquiry.',
                          'သင်ပေးပို့သော ဆက်သွယ်ရန် အချက်အလက်များကို သင့်မေးမြန်းချက်အား ပြန်လည်ဖြေကြားရန်အတွက်သာ အသုံးပြုပါမည်။'
                        )}
                      </span>
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ LOCATION / MAP SECTION ============ */}
      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Section header */}
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className={badgeClassName}>
                {t('Our location', 'ကျွန်ုပ်တို့တည်နေရာ')}
              </span>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
                {t('Find us on the map', 'မြေပုံပေါ်တွင် ကျွန်ုပ်တို့ကို ရှာပါ')}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                {t(
                  'Visit our clinic in Latha Township, Yangon. We look forward to welcoming you.',
                  'ရန်ကုန်မြို့၊ လသာမြို့နယ်ရှိ ကျွန်ုပ်တို့၏ ဆေးခန်းသို့ လာရောက်နိုင်ပါသည်။'
                )}
              </p>
            </div>

            {/* Split layout: Info card (left) + Map (right) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
              {/* Info card - LEFT (2 cols) */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-600 to-green-700 p-8 text-white shadow-sm md:p-10 lg:col-span-2">
                {/* Decorative blobs */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-green-400/30 blur-3xl" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold md:text-3xl">
                    KAY Dental Care
                  </h3>

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
                    <div className="flex items-center gap-3 text-green-50">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
                        <Clock className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">
                        {t('Open today · 9:00 - 18:00', 'ယနေ့ ဖွင့်သည် · 9:00 - 18:00')}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:bg-yellow-300 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-green-700"
                >
                  <MapPin className="h-4 w-4" />
                  {t('Get Directions', 'လမ်းညွှန်ရယူရန်')}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Map - RIGHT (3 cols) */}
              <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm lg:col-span-3 min-h-[400px] lg:min-h-[500px]">
                {googleMapsEmbedUrl ? (
                  <iframe
                    src={googleMapsEmbedUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    allowFullScreen
                    loading="lazy"
                    title={t('KAY Dental Care location map', 'KAY Dental Care တည်နေရာ မြေပုံ')}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
                    <div className="mx-auto max-w-sm p-8 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100">
                        <MapPin className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {t('View on Google Maps', 'Google Maps တွင် ကြည့်ရန်')}
                      </h3>
                      <p className="mb-6 text-gray-600">
                        {t(
                          'Click the button to see our exact location.',
                          'ကျွန်ုပ်တို့၏ တည်နေရာအတိအကျကို ကြည့်ရန် button ကို နှိပ်ပါ။'
                        )}
                      </p>
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                      >
                        <MapPin className="h-4 w-4" />
                        {t('Open in Maps', 'Maps တွင် ဖွင့်ရန်')}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}