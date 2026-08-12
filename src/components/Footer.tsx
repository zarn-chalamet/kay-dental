import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';
import { FaViber, FaFacebookMessenger } from 'react-icons/fa';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useClinicSettings } from '@/hooks/usePublicData';

export default function Footer() {
  const { t } = useLanguageStore();
  const { data: settings } = useClinicSettings();
  const currentYear = new Date().getFullYear();

  // Backend data with fallbacks
  const addressEn = settings?.addressEn ?? '';
  const addressMm = settings?.addressMm ?? '';
  const phone1 = settings?.phone1 ?? '';
  const phone2 = settings?.phone2 ?? '';
  const email = settings?.email ?? '';
  const viberNumber = settings?.viberNumber ?? '';
  const messengerLink = settings?.messengerLink ?? '';

  const primaryPhone = phone1 || phone2;

  const exploreLinks = [
    { to: '/about', en: 'About Us', mm: 'အကြောင်း' },
    { to: '/services', en: 'Services', mm: 'ဝန်ဆောင်မှု' },
    { to: '/doctors', en: 'Our Doctors', mm: 'ဆရာဝန်' },
    { to: '/pricing', en: 'Pricing', mm: 'စျေးနှုန်း' },
    { to: '/gallery', en: 'Gallery', mm: 'ဓာတ်ပုံ' },
    { to: '/contact', en: 'Contact', mm: 'ဆက်သွယ်ရန်' },
    { to: '/faq', en: 'FAQ', mm: 'မေးခွန်း' },
    { to: '/testimonials', en: 'Reviews', mm: 'သုံးသပ်ချက်' },
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* ============ BRAND + CTA (5 cols) ============ */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-xl shadow-sm">
                K
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 leading-none">
                  KAY Dental
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {t('Professional Dental Care', 'သွားဘက်ဆိုင်ရာ ကုသမှု')}
                </div>
              </div>
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-gray-600 max-w-md">
              {t(
                'Your trusted dental care provider in Yangon. Quality care with modern equipment and experienced dentists.',
                'ရန်ကုန်ရှိ သင်ယုံကြည်ရသော သွားကုသမှု။ ခေတ်မီကိရိယာနှင့် ကျွမ်းကျင်သော ဆရာဝန်များဖြင့် ဝန်ဆောင်ပါသည်။'
              )}
            </p>

            {/* CTA buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/appointment"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
              >
                <Calendar className="h-4 w-4" />
                {t('Book Appointment', 'ချိန်းဆိုရန်')}
              </Link>

              {primaryPhone && (
                <a
                  href={`tel:${primaryPhone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-green-300 hover:text-green-700 transition-all"
                >
                  <Phone className="h-4 w-4" />
                  {primaryPhone}
                </a>
              )}
            </div>

            {/* Social Icons */}
            {(viberNumber || messengerLink) && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {t('Chat with us', 'ဆက်သွယ်ရန်')}
                </p>
                <div className="flex items-center gap-2">
                  {viberNumber && (
                    <a
                      href={`viber://chat?number=${viberNumber}`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7360F2] text-white transition-all hover:scale-110 hover:shadow-md"
                      aria-label="Viber"
                    >
                      <FaViber className="h-5 w-5" />
                    </a>
                  )}
                  {messengerLink && (
                    <a
                      href={messengerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#00B2FF] via-[#006AFF] to-[#0038FF] text-white transition-all hover:scale-110 hover:shadow-md"
                      aria-label="Messenger"
                    >
                      <FaFacebookMessenger className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ============ EXPLORE (3 cols) - 2 cols on mobile, 1 col on desktop ============ */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              {t('Explore', 'ရှာဖွေရန်')}
            </h3>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-1 gap-x-3 gap-y-3">
              {exploreLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors inline-flex items-center gap-1 group w-fit"
                >
                  {t(link.en, link.mm)}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </Link>
              ))}
            </div>

            {/* Emergency - highlighted */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to="/emergency"
                className="text-sm text-gray-700 hover:text-red-600 transition-colors inline-flex items-center gap-2 group font-medium"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                {t('Dental Emergency', 'အရေးပေါ်')}
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
              </Link>
            </div>
          </div>

          {/* ============ CONTACT INFO (4 cols) ============ */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              {t('Get in Touch', 'ဆက်သွယ်ရန်')}
            </h3>
            <ul className="mt-4 space-y-4">
              {/* Address */}
              {(addressEn || addressMm) && (
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-100">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 font-medium">
                      {t('Address', 'လိပ်စာ')}
                    </div>
                    <div className="mt-0.5 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {t(addressEn, addressMm)}
                    </div>
                  </div>
                </li>
              )}

              {/* Phone */}
              {(phone1 || phone2) && (
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-100">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 font-medium">
                      {t('Phone', 'ဖုန်း')}
                    </div>
                    <div className="mt-0.5 text-sm space-y-0.5">
                      {phone1 && (
                        <a
                          href={`tel:${phone1.replace(/\s/g, '')}`}
                          className="block text-gray-700 hover:text-green-600 transition-colors"
                        >
                          {phone1}
                        </a>
                      )}
                      {phone2 && (
                        <a
                          href={`tel:${phone2.replace(/\s/g, '')}`}
                          className="block text-gray-700 hover:text-green-600 transition-colors"
                        >
                          {phone2}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              )}

              {/* Email */}
              {email && (
                <li className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-100">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 font-medium">
                      {t('Email', 'အီးမေးလ်')}
                    </div>
                    <a
                      href={`mailto:${email}`}
                      className="mt-0.5 block text-sm text-gray-700 hover:text-green-600 transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </li>
              )}

              {/* Hours - from backend */}
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-100">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 font-medium">
                    {t('Hours', 'ဖွင့်ချိန်')}
                  </div>
                  {settings?.openingHours && settings.openingHours.length > 0 ? (
                    <div className="mt-1 space-y-0.5 text-sm">
                      {settings.openingHours.map((schedule) => (
                        <div
                          key={schedule.day}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="text-gray-700 font-medium">
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
                              ? t('Closed', 'ပိတ်')
                              : `${schedule.open} – ${schedule.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-0.5 text-sm text-gray-700 space-y-0.5">
                      <div>{t('Mon–Fri: 9:00 – 18:00', 'တနင်္လာ–သောကြာ: ၉:၀၀ – ၁၈:၀၀')}</div>
                      <div>{t('Saturday: 9:00 – 16:00', 'စနေ: ၉:၀၀ – ၁၆:၀၀')}</div>
                      <div className="text-gray-500">{t('Sunday: Closed', 'တနင်္ဂနွေ: ပိတ်')}</div>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              © {currentYear} KAY Dental Care.{' '}
              {t('All rights reserved.', 'မူပိုင်ခွင့်အားလုံး ထိန်းသိမ်းထားသည်။')}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{t('Yangon, Myanmar', 'ရန်ကုန်၊ မြန်မာ')}</span>
              <span className="text-gray-300">•</span>
              <Link
                to="/admin/login"
                className="text-gray-400 hover:text-green-600 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}