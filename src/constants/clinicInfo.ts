import type { ClinicSettings } from '@/types';

export const CLINIC_INFO: ClinicSettings = {
  clinicNameEn: 'KAY Dental Care',
  clinicNameMm: 'KAY သွား ဆေးခန်း',
  addressEn: 'No. 102, 21st Street, Latha Township, Yangon, Myanmar, 11141',
  addressMm: 'အမှတ် 102, 21 လမ်း, လသာမြို့နယ်, ရန်ကုန်, 11141',
  phone1: '09 5158726',
  phone2: '09 786333243',
  email: 'kaydental@gmail.com',
  viberNumber: '095158726',
  messengerLink: 'https://m.me/kaydental',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.5!2d96.1561!3d16.7750!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQ2JzMwLjAiTiA5NsKwMDknMjIuMCJF!5e0!3m2!1sen!2smm!4v1234567890',
  googleMapsLink: 'https://maps.google.com/?q=16.7750,96.1561',
  openingHours: [
    { day: 'Monday', dayMm: 'တနင်္လာ', open: '09:00', close: '18:00', isClosed: false },
    { day: 'Tuesday', dayMm: 'အင်္ဂါ', open: '09:00', close: '18:00', isClosed: false },
    { day: 'Wednesday', dayMm: 'ဗုဒ္ဓဟူး', open: '09:00', close: '18:00', isClosed: false },
    { day: 'Thursday', dayMm: 'ကြာသပတေး', open: '09:00', close: '18:00', isClosed: false },
    { day: 'Friday', dayMm: 'သောကြာ', open: '09:00', close: '18:00', isClosed: false },
    { day: 'Saturday', dayMm: 'စနေ', open: '09:00', close: '16:00', isClosed: false },
    { day: 'Sunday', dayMm: 'တနင်္ဂနွေ', open: '', close: '', isClosed: true },
  ],
  emergencyPhone: '09 5158726',
  emergencyAvailable: true,
};

export const PAYMENT_METHODS = [
  {
    name: 'Cash',
    nameEn: 'Cash',
    nameMm: 'ငွေသား',
    logo: '/payment-logos/cash.png',
    type: 'icon',
  },
  {
    name: 'KBZ Pay',
    nameEn: 'KBZ Pay',
    nameMm: 'KBZ Pay',
    logo: '/payment-logos/kbz-pay.webp',
    type: 'image',
  },
  {
    name: 'Wave Pay',
    nameEn: 'Wave Pay',
    nameMm: 'Wave Pay',
    logo: '/payment-logos/wave-money.webp',
    type: 'image',
  },
  {
    name: 'AYA Pay',
    nameEn: 'AYA Pay',
    nameMm: 'AYA Pay',
    logo: '/payment-logos/aya-pay.webp',
    type: 'image',
  },
];
