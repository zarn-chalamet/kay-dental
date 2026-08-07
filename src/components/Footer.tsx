import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { CLINIC_INFO } from '@/constants/clinicInfo';

export default function Footer() {
  const { t } = useLanguageStore();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Clinic Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <div>
                <div className="font-bold text-white text-lg">KAY Dental</div>
                <div className="text-xs text-gray-400">{t('Professional Dental Care', 'ပရော်ဖက်ရှင်နယ် သွားကုသမှု')}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t(
                'Your trusted dental care provider in Yangon. We provide quality dental services with modern equipment and experienced dentists.',
                'ရန်ကုန်ရှိ သင်ယုံကြည်ရသော သွားကုသမှု ဝန်ဆောင်မှုပေးသူ။ ခေတ်မီ ကိရိယာများနှင့် အတွေ့အကြုံရှိ သွားဆရာဝန်များဖြင့် အရည်အသွေးမြင့် သွားကုသမှု ဝန်ဆောင်မှုများ ပေးပါသည်။'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('Quick Links', 'အမြန်လင့်ခ်များ')}</h3>
            <ul className="space-y-2">
              {[
                { to: '/about', en: 'About Us', mm: 'ကျွန်ုပ်တို့အကြောင်း' },
                { to: '/services', en: 'Our Services', mm: 'ဝန်ဆောင်မှုများ' },
                { to: '/doctors', en: 'Our Doctors', mm: 'ဆရာဝန်များ' },
                { to: '/testimonials', en: 'Testimonials', mm: 'သုံးသပ်ချက်များ' },
                { to: '/faq', en: 'FAQ', mm: 'မေးလေ့ရှိသောမေးခွန်းများ' },
                { to: '/appointment', en: 'Book Appointment', mm: 'ချိန်းဆိုရန်' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {t(link.en, link.mm)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('Services', 'ဝန်ဆောင်မှုများ')}</h3>
            <ul className="space-y-2">
              {[
                { en: 'Dental Check-up', mm: 'သွားစစ်ဆေးခြင်း' },
                { en: 'Teeth Whitening', mm: 'သွားဖြူစင်ခြင်း' },
                { en: 'Root Canal', mm: 'သွားအမြစ်ကုသခြင်း' },
                { en: 'Orthodontics', mm: 'သွားညှိခြင်း' },
                { en: 'Dental Implants', mm: 'သွားအတုစိုက်ခြင်း' },
                { en: 'Emergency Care', mm: 'အရေးပေါ်ကုသမှု' },
              ].map((s) => (
                <li key={s.en}>
                  <Link to="/services" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {t(s.en, s.mm)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('Contact Us', 'ဆက်သွယ်ရန်')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span className="text-sm">{t(CLINIC_INFO.addressEn, CLINIC_INFO.addressMm)}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <div className="text-sm">
                  <a href={`tel:${CLINIC_INFO.phone1.replace(/\s/g, '')}`} className="hover:text-primary-400 transition-colors">{CLINIC_INFO.phone1}</a>
                  <br />
                  <a href={`tel:${CLINIC_INFO.phone2.replace(/\s/g, '')}`} className="hover:text-primary-400 transition-colors">{CLINIC_INFO.phone2}</a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="text-sm hover:text-primary-400 transition-colors">{CLINIC_INFO.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <div className="text-sm">
                  <div>{t('Mon-Fri: 9:00 AM - 6:00 PM', 'တနင်္လာ-သောကြာ: ၉:၀၀ - ၁၈:၀၀')}</div>
                  <div>{t('Saturday: 9:00 AM - 4:00 PM', 'စနေ: ၉:၀၀ - ၁၆:၀၀')}</div>
                  <div>{t('Sunday: Closed', 'တနင်္ဂနွေ: ပိတ်')}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} KAY Dental Care. {t('All rights reserved.', 'မူပိုင်ခွင့်အားလုံး ထိန်းသိမ်းထားသည်။')}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {t('Made with', 'ဖြင့် ပြုလုပ်သည်')} <Heart className="w-3 h-3 text-red-400 fill-red-400" /> {t('in Yangon', 'ရန်ကုန်')}
            </p>
            <Link to="/admin/login" className="text-xs text-gray-600 hover:text-primary-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
