import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  Info,
  Sparkles,
  Stethoscope,
  UserCheck,
  ClipboardCheck,
  Home,
} from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useServices, useDoctors, useUpcomingHolidays } from '@/hooks/usePublicData';
import { formatPrice } from '@/utils/clinicStatus';
import {
  checkHoliday,
  getSortedUpcomingHolidays,
  formatHolidayRange,
  formatDateLocal,
} from '@/utils/holidayUtils';
import { appointmentApi } from '@/api/publicApi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const steps = [
  { num: 1, labelEn: 'Service', labelMm: 'ဝန်ဆောင်မှု', icon: Stethoscope },
  { num: 2, labelEn: 'Doctor', labelMm: 'ဆရာဝန်', icon: UserCheck },
  { num: 3, labelEn: 'Schedule', labelMm: 'အချိန်', icon: Calendar },
  { num: 4, labelEn: 'Details', labelMm: 'အချက်အလက်', icon: User },
  { num: 5, labelEn: 'Confirm', labelMm: 'အတည်ပြု', icon: ClipboardCheck },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const badgeClassName =
  'inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700';

export default function AppointmentPage() {
  const { t } = useLanguageStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    serviceId: 0,
    doctorId: 0,
    date: '',
    time: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    isNewPatient: true,
    notes: '',
  });

  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();
  const { data: holidays = [] } = useUpcomingHolidays();

  const upcomingHolidays = getSortedUpcomingHolidays(holidays);
  const selectedService = services.find((s) => s.id === form.serviceId);
  const selectedDoctor = doctors.find((d) => d.id === form.doctorId);

  const canNext = () => {
    switch (currentStep) {
      case 1: return form.serviceId > 0;
      case 2: return true;
      case 3: return form.date && form.time;
      case 4: return form.patientName && form.patientPhone;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await appointmentApi.create({
        patientName: form.patientName,
        patientPhone: form.patientPhone,
        patientEmail: form.patientEmail || undefined,
        serviceId: form.serviceId,
        doctorId: form.doctorId || undefined,
        appointmentDate: form.date,
        appointmentTime: form.time,
        isNewPatient: form.isNewPatient,
        notes: form.notes || undefined,
      });

      setIsSubmitted(true);
      toast.success(t('Appointment booked successfully!', 'ချိန်းဆိုမှု အောင်မြင်ပါသည်!'));
    } catch (error: unknown) {
      console.error('Booking failed:', error);
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      const backendMessage = err?.response?.data?.error?.message;

      if (backendMessage?.includes('holiday')) {
        toast.error(t(
          'Cannot book on this date - it is a holiday. Please choose another date.',
          'ဤရက်တွင် ချိန်းဆို၍မရပါ - ရုံးပိတ်ရက်ဖြစ်ပါသည်။ အခြားရက်ရွေးချယ်ပါ။'
        ));
        setForm({ ...form, date: '', time: '' });
        setCurrentStep(3);
      } else if (backendMessage) {
        toast.error(backendMessage);
      } else {
        toast.error(t('Failed to book appointment. Please try again.', 'ချိန်းဆိုမှု ချိန်းဆို၍ မရပါ။'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  }).filter((d) => d.getDay() !== 0);

  // ============ LOADING SKELETON ============
  if (servicesLoading || doctorsLoading) {
    return (
      <main className="bg-white pt-20 font-sans">
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-64 bg-gray-100 rounded-lg mx-auto" />
            <div className="h-4 w-96 bg-gray-100 rounded-lg mx-auto" />
            <div className="h-2 w-full bg-gray-100 rounded-full mt-8" />
            <div className="h-96 bg-gray-100 rounded-2xl mt-8" />
          </div>
        </div>
      </main>
    );
  }

  // ============ SUCCESS PAGE ============
  if (isSubmitted) {
    return (
      <main className="bg-gradient-to-br from-green-50 via-white to-yellow-50 pt-20 font-sans min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-gray-100 bg-white p-8 md:p-12 shadow-xl text-center"
          >
            {/* Success animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-lg"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>

            <span className={badgeClassName}>
              <Sparkles className="h-3.5 w-3.5" />
              {t('Booking Confirmed', 'အတည်ပြုပြီးပါပြီ')}
            </span>

            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
              {t('Appointment Booked!', 'ချိန်းဆိုပြီးပါပြီ!')}
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              {t(
                'We will confirm your appointment shortly via phone. Thank you for choosing KAY Dental Care.',
                'ဖုန်းမှတစ်ဆင့် သင့်ချိန်းဆိုမှုကို မကြာမီ အတည်ပြုပါမည်။ ကျေးဇူးတင်ပါသည်။'
              )}
            </p>

            {/* Booking Details Card */}
            <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-left border border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {t('Booking Details', 'ချိန်းဆိုမှု အသေးစိတ်')}
              </h3>
              <div className="space-y-3 text-sm">
                {selectedService && (
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-gray-500">{t('Service', 'ဝန်ဆောင်မှု')}</span>
                    <span className="font-semibold text-gray-900 text-right">
                      {t(selectedService.nameEn, selectedService.nameMm)}
                    </span>
                  </div>
                )}
                {selectedDoctor && (
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-gray-500">{t('Doctor', 'ဆရာဝန်')}</span>
                    <span className="font-semibold text-gray-900 text-right">
                      {t(selectedDoctor.nameEn, selectedDoctor.nameMm)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start gap-3">
                  <span className="text-gray-500">{t('Date', 'ရက်စွဲ')}</span>
                  <span className="font-semibold text-gray-900">{form.date}</span>
                </div>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-gray-500">{t('Time', 'အချိန်')}</span>
                  <span className="font-semibold text-green-600">{form.time}</span>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-gray-500">{t('Name', 'အမည်')}</span>
                    <span className="font-semibold text-gray-900">{form.patientName}</span>
                  </div>
                  <div className="flex justify-between items-start gap-3 mt-2">
                    <span className="text-gray-500">{t('Phone', 'ဖုန်း')}</span>
                    <span className="font-semibold text-gray-900">{form.patientPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-green-300 hover:text-green-700 transition-all"
              >
                <Home className="h-4 w-4" />
                {t('Back to Home', 'ပင်မသို့')}
              </Link>
              <a
                href="tel:095158726"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95"
              >
                <Phone className="h-4 w-4" />
                {t('Call the Clinic', 'ဖုန်းခေါ်ရန်')}
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // ============ MAIN BOOKING FLOW ============
  return (
    <main className="bg-gradient-to-b from-gray-50 to-white pt-20 font-sans min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12 lg:px-12">
        {/* ============ HEADER ============ */}
        <div className="text-center mb-8 md:mb-12">
          <span className={badgeClassName}>
            <Calendar className="h-3.5 w-3.5" />
            {t('Book Appointment', 'ချိန်းဆိုရန်')}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl leading-tight">
            {t('Schedule your visit', 'ရက်ချိန်း ယူပါ')}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
            {t(
              'Book in a few simple steps. We\'ll confirm shortly.',
              'အဆင့်အနည်းငယ်ဖြင့် ချိန်းဆိုပါ။ မကြာမီ အတည်ပြုပါမည်။'
            )}
          </p>
        </div>

        {/* ============ STEPS INDICATOR (Modern SaaS style) ============ */}
        <div className="mb-8 md:mb-10">
          {/* Progress bar background */}
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-green-600 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {/* Step circles */}
            <div className="relative flex justify-between">
              {steps.map((step) => {
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;
                const StepIcon = step.icon;

                return (
                  <div key={step.num} className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                      }}
                      className={`
                        flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 border-2
                        ${isCompleted
                          ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-100'
                          : isActive
                            ? 'bg-white border-green-600 text-green-600 shadow-md shadow-green-100'
                            : 'bg-white border-gray-200 text-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </motion.div>
                    <span
                      className={`
                        mt-2 text-[10px] md:text-xs font-semibold uppercase tracking-wide transition-colors hidden sm:block
                        ${isActive || isCompleted ? 'text-green-700' : 'text-gray-400'}
                      `}
                    >
                      {t(step.labelEn, step.labelMm)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile step name */}
          <div className="mt-4 text-center sm:hidden">
            <span className="text-xs font-semibold uppercase tracking-wider text-green-700">
              {t('Step', 'အဆင့်')} {currentStep} / {steps.length}
            </span>
            <p className="mt-1 text-sm font-bold text-gray-900">
              {t(steps[currentStep - 1].labelEn, steps[currentStep - 1].labelMm)}
            </p>
          </div>
        </div>

        {/* ============ MAIN CARD ============ */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 lg:p-10 shadow-sm">
          <AnimatePresence mode="wait">
            {/* ============ STEP 1: SERVICE ============ */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {t('What service do you need?', 'ဘယ်ဝန်ဆောင်မှု လိုအပ်ပါသလဲ?')}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('Select a service you\'d like to book.', 'ချိန်းဆိုလိုသော ဝန်ဆောင်မှုကို ရွေးပါ။')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service) => {
                    const isSelected = form.serviceId === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => setForm({ ...form, serviceId: service.id! })}
                        className={`
                          group relative p-4 md:p-5 rounded-2xl text-left border-2 transition-all duration-200
                          ${isSelected
                            ? 'border-green-600 bg-green-50 shadow-md shadow-green-100'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                        <h3 className={`font-semibold text-sm md:text-base leading-tight pr-8 ${
                          isSelected ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {t(service.nameEn, service.nameMm || '')}
                        </h3>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-base font-bold ${
                            isSelected ? 'text-green-700' : 'text-green-600'
                          }`}>
                            {formatPrice(service.startingPrice)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                            <Clock className="h-3 w-3" />
                            {service.durationMinutes}m
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============ STEP 2: DOCTOR ============ */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {t('Choose your dentist', 'ဆရာဝန် ရွေးချယ်ပါ')}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('Optional — pick a preferred dentist or let us assign one.', 'ဆရာဝန်ရွေးချယ်ရန် သို့မဟုတ် ကျော်ရန်။')}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* No preference */}
                  <button
                    onClick={() => setForm({ ...form, doctorId: 0 })}
                    className={`
                      w-full p-4 rounded-2xl text-left border-2 transition-all duration-200 flex items-center gap-4
                      ${form.doctorId === 0
                        ? 'border-green-600 bg-green-50 shadow-md shadow-green-100'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30'
                      }
                    `}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      form.doctorId === 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {t('No Preference', 'နှစ်သက်မှုမရှိပါ')}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t('We\'ll assign the best available dentist', 'အသင့်တော်ဆုံး ဆရာဝန်ကို ရွေးပေးပါမည်')}
                      </p>
                    </div>
                    {form.doctorId === 0 && (
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                    )}
                  </button>

                  {/* Doctor list */}
                  {doctors.map((doctor) => {
                    const isSelected = form.doctorId === doctor.id;
                    return (
                      <button
                        key={doctor.id}
                        onClick={() => setForm({ ...form, doctorId: doctor.id })}
                        className={`
                          w-full p-4 rounded-2xl text-left border-2 transition-all duration-200 flex items-center gap-4
                          ${isSelected
                            ? 'border-green-600 bg-green-50 shadow-md shadow-green-100'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30'
                          }
                        `}
                      >
                        <img
                          src={doctor.photoUrl}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {t(doctor.nameEn, doctor.nameMm)}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {t(doctor.specialtyEn, doctor.specialtyMm)}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============ STEP 3: DATE & TIME ============ */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {t('When would you like to visit?', 'ဘယ်အချိန် လာချင်ပါသလဲ?')}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('Pick a date and time that works for you.', 'ရက်စွဲနှင့် အချိန်ကို ရွေးပါ။')}
                  </p>
                </div>

                {/* Holidays notice */}
                {upcomingHolidays.length > 0 && (
                  <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                        <Info className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide">
                          {t('Upcoming Closures', 'လာမည့် ရုံးပိတ်ရက်')}
                        </p>
                        <div className="mt-2 space-y-1">
                          {upcomingHolidays.slice(0, 3).map((h) => (
                            <div key={h.id} className="text-xs text-amber-800">
                              <span className="font-medium">
                                {t(h.nameEn, h.nameMm || h.nameEn)}
                              </span>
                              <span className="text-amber-600"> · {formatHolidayRange(h)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-900">
                      {t('Date', 'ရက်စွဲ')}
                    </label>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        {t('Available', 'ရနိုင်')}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        {t('Closed', 'ပိတ်')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1 -mr-1">
                    {availableDates.slice(0, 20).map((date) => {
                      const dateStr = formatDateLocal(date);
                      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
                      const dayNum = date.getDate();
                      const month = date.toLocaleDateString('en', { month: 'short' });

                      const holidayCheck = checkHoliday(dateStr, holidays);
                      const isHolidayDate = holidayCheck.isHoliday;
                      const holidayName = holidayCheck.holiday
                        ? t(holidayCheck.holiday.nameEn, holidayCheck.holiday.nameMm || holidayCheck.holiday.nameEn)
                        : '';
                      const isSelected = form.date === dateStr;

                      return (
                        <button
                          key={dateStr}
                          onClick={() => !isHolidayDate && setForm({ ...form, date: dateStr, time: '' })}
                          disabled={isHolidayDate}
                          title={isHolidayDate ? holidayName : ''}
                          className={`
                            relative p-2.5 rounded-xl text-center border-2 transition-all
                            ${isHolidayDate
                              ? 'border-red-100 bg-red-50/60 cursor-not-allowed opacity-60'
                              : isSelected
                                ? 'border-green-600 bg-green-50 shadow-md shadow-green-100'
                                : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30'
                            }
                          `}
                        >
                          <div className={`text-[10px] font-semibold uppercase ${
                            isHolidayDate ? 'text-red-400' : isSelected ? 'text-green-700' : 'text-gray-500'
                          }`}>
                            {dayName}
                          </div>
                          <div className={`text-xl font-bold my-0.5 ${
                            isHolidayDate
                              ? 'text-red-400 line-through'
                              : isSelected
                                ? 'text-green-700'
                                : 'text-gray-900'
                          }`}>
                            {dayNum}
                          </div>
                          <div className={`text-[10px] ${
                            isHolidayDate ? 'text-red-400' : isSelected ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {month}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                {form.date && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <label className="mb-3 block text-sm font-semibold text-gray-900">
                      {t('Available Time Slots', 'ရနိုင်သော အချိန်များ')}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setForm({ ...form, time })}
                          className={`
                            py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all
                            ${form.time === time
                              ? 'border-green-600 bg-green-50 text-green-700 shadow-md shadow-green-100'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/30'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ============ STEP 4: PERSONAL INFO ============ */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {t('Tell us about you', 'သင့်အကြောင်း ပြောပြပါ')}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('We need a few details to confirm your booking.', 'ချိန်းဆိုမှုကို အတည်ပြုရန် အချက်အလက် လိုအပ်ပါသည်။')}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="h-4 w-4 text-green-600" />
                      {t('Full Name', 'အမည်အပြည့်အစုံ')}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      placeholder={t('Your name', 'သင့်အမည်')}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      required
                    />
                  </div>

                  {/* Phone + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Phone className="h-4 w-4 text-green-600" />
                        {t('Phone', 'ဖုန်း')}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={form.patientPhone}
                        onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
                        placeholder="09 XXX XXX XXX"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Mail className="h-4 w-4 text-green-600" />
                        {t('Email', 'အီးမေးလ်')}
                      </label>
                      <input
                        type="email"
                        value={form.patientEmail}
                        onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                  </div>

                  {/* New patient toggle */}
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t('Are you a new patient?', 'လူနာအသစ် ဖြစ်ပါသလား?')}
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setForm({ ...form, isNewPatient: true })}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all border-2 ${
                          form.isNewPatient
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {t('Yes, first visit', 'ဟုတ်ကဲ့၊ ပထမဆုံး')}
                      </button>
                      <button
                        onClick={() => setForm({ ...form, isNewPatient: false })}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all border-2 ${
                          !form.isNewPatient
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {t('Returning patient', 'ပြန်လာသော လူနာ')}
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FileText className="h-4 w-4 text-green-600" />
                      {t('Additional Notes', 'မှတ်ချက်')}
                      <span className="text-xs text-gray-400 font-normal">
                        ({t('optional', 'မဖြစ်မနေ မဟုတ်ပါ')})
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder={t('Any specific concerns or requests?', 'အထူးဂရုပြုစရာများ ရှိပါသလား?')}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============ STEP 5: CONFIRM ============ */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {t('Review your booking', 'ချိန်းဆိုမှုကို စစ်ဆေးပါ')}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('Please confirm the details below.', 'အောက်ပါ အသေးစိတ်ကို အတည်ပြုပါ။')}
                  </p>
                </div>

                {/* Summary card */}
                <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-green-50 to-white p-6 space-y-4">
                  {/* Service */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {t('Service', 'ဝန်ဆောင်မှု')}
                      </div>
                      <div className="mt-0.5 font-semibold text-gray-900">
                        {selectedService && t(selectedService.nameEn, selectedService.nameMm || '')}
                      </div>
                      {selectedService && (
                        <div className="mt-1 text-sm text-green-600 font-bold">
                          {t('From ', 'စတင် ')}{formatPrice(selectedService.startingPrice)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Doctor */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {t('Dentist', 'ဆရာဝန်')}
                      </div>
                      <div className="mt-0.5 font-semibold text-gray-900">
                        {selectedDoctor
                          ? t(selectedDoctor.nameEn, selectedDoctor.nameMm)
                          : t('No preference (auto-assigned)', 'အသင့်တော်ဆုံး ခန့်အပ်ပါမည်')
                        }
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {t('Schedule', 'အချိန်')}
                      </div>
                      <div className="mt-0.5 font-semibold text-gray-900">
                        {form.date} · <span className="text-green-600">{form.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Patient */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        {t('Patient Info', 'လူနာ အချက်အလက်')}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        <div className="font-semibold text-gray-900">{form.patientName}</div>
                        <div className="text-sm text-gray-600">{form.patientPhone}</div>
                        {form.patientEmail && (
                          <div className="text-sm text-gray-600 break-all">{form.patientEmail}</div>
                        )}
                        <div className="inline-flex items-center gap-1 mt-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                          {form.isNewPatient ? t('New Patient', 'လူနာအသစ်') : t('Returning', 'ပြန်လာ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy notice */}
                <p className="mt-4 text-xs text-center text-gray-500">
                  {t(
                    'By confirming, you agree to be contacted about this appointment.',
                    'အတည်ပြုခြင်းဖြင့် ချိန်းဆိုမှုအကြောင်း ဆက်သွယ်ခြင်းကို သဘောတူပါသည်။'
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============ NAVIGATION BUTTONS ============ */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('Back', 'နောက်သို့')}
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                onClick={() => canNext() && setCurrentStep(currentStep + 1)}
                disabled={!canNext()}
                className={`
                  inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all
                  ${!canNext()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-green-700 hover:shadow-md active:scale-95'
                  }
                `}
              >
                {t('Continue', 'ဆက်လက်')}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-gray-900 shadow-md transition-all
                  ${isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-yellow-300 hover:shadow-lg active:scale-95'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-gray-900 border-t-transparent animate-spin" />
                    {t('Booking...', 'ချိန်းဆိုနေသည်...')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    {t('Confirm Booking', 'အတည်ပြုရန်')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ============ HELP TEXT ============ */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {t('Need help? ', 'အကူအညီ လိုပါသလား? ')}
            <a href="tel:095158726" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
              {t('Call 09 5158726', '09 5158726 သို့ ဖုန်းခေါ်ရန်')}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}