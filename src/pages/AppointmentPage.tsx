import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ArrowLeft, CheckCircle, User, Phone, Mail, FileText, Clock } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { mockServices, mockDoctors } from '@/data/mockData';
import { formatPrice } from '@/utils/clinicStatus';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const steps = [
  { num: 1, labelEn: 'Service', labelMm: 'ဝန်ဆောင်မှု' },
  { num: 2, labelEn: 'Doctor', labelMm: 'ဆရာဝန်' },
  { num: 3, labelEn: 'Date & Time', labelMm: 'ရက်စွဲနှင့် အချိန်' },
  { num: 4, labelEn: 'Your Info', labelMm: 'သင့်အချက်အလက်' },
  { num: 5, labelEn: 'Confirm', labelMm: 'အတည်ပြု' },
];

export default function AppointmentPage() {
  const { t } = useLanguageStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const selectedService = mockServices.find(s => s.id === form.serviceId);
  const selectedDoctor = mockDoctors.find(d => d.id === form.doctorId);

  const canNext = () => {
    switch (currentStep) {
      case 1: return form.serviceId > 0;
      case 2: return true; // doctor optional
      case 3: return form.date && form.time;
      case 4: return form.patientName && form.patientPhone;
      default: return true;
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    toast.success(t('Appointment booked successfully!', 'ချိန်းဆိုမှု အောင်မြင်စွာ ချိန်းဆိုပြီးပါပြီ!'));
  };

  // Generate next 30 days (excluding Sundays)
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  }).filter(d => d.getDay() !== 0);

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('Appointment Booked!', 'ချိန်းဆိုမှု ချိန်းဆိုပြီးပါပြီ!')}</h2>
          <p className="text-gray-500 mb-6">{t('We will confirm your appointment shortly via phone.', 'ဖုန်းမှတစ်ဆင့် သင့်ချိန်းဆိုမှုကို မကြာမီ အတည်ပြုပါမည်။')}</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">{t('Service', 'ဝန်ဆောင်မှု')}:</span><span className="font-medium">{selectedService && t(selectedService.nameEn, selectedService.nameMm)}</span></div>
            {selectedDoctor && <div className="flex justify-between"><span className="text-gray-500">{t('Doctor', 'ဆရာဝန်')}:</span><span className="font-medium">{t(selectedDoctor.nameEn, selectedDoctor.nameMm)}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">{t('Date', 'ရက်စွဲ')}:</span><span className="font-medium">{form.date}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{t('Time', 'အချိန်')}:</span><span className="font-medium">{form.time}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{t('Name', 'အမည်')}:</span><span className="font-medium">{form.patientName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{t('Phone', 'ဖုန်း')}:</span><span className="font-medium">{form.patientPhone}</span></div>
          </div>
          <Link to="/" className="btn-primary mt-6 inline-block">{t('Back to Home', 'ပင်မစာမျက်နှာသို့ ပြန်သွားရန်')}</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="gradient-green py-12 md:py-16">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('Book an Appointment', 'ချိန်းဆိုမှု ပြုလုပ်ရန်')}</h1>
            <p className="text-green-100">{t('Schedule your visit in a few simple steps', 'ရိုးရှင်းသော အဆင့်အနည်းငယ်ဖြင့် သင့်လာရောက်မှုကို စီစဉ်ပါ')}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-3xl">
          {/* Steps indicator */}
          <div className="flex items-center justify-between mb-10 px-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep >= step.num ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.num ? <CheckCircle className="w-5 h-5" /> : step.num}
                </div>
                <span className={`hidden sm:block ml-2 text-xs font-medium ${currentStep >= step.num ? 'text-primary-600' : 'text-gray-400'}`}>
                  {t(step.labelEn, step.labelMm)}
                </span>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${currentStep > step.num ? 'bg-primary-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="card p-6 md:p-8">
            {/* Step 1: Select Service */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Select a Service', 'ဝန်ဆောင်မှု ရွေးချယ်ပါ')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mockServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setForm({ ...form, serviceId: service.id })}
                      className={`p-4 rounded-xl text-left border-2 transition-all ${
                        form.serviceId === service.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900 text-sm">{t(service.nameEn, service.nameMm)}</h3>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span className="text-primary-600 font-semibold">{formatPrice(service.startingPrice)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{service.durationMinutes}m</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Doctor */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('Choose a Doctor (Optional)', 'ဆရာဝန် ရွေးချယ်ပါ (မဖြစ်မနေ မဟုတ်ပါ)')}</h2>
                <p className="text-sm text-gray-500 mb-4">{t('You can skip this step if you have no preference.', 'နှစ်သက်မှု မရှိပါက ဤအဆင့်ကို ကျော်နိုင်ပါသည်။')}</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setForm({ ...form, doctorId: 0 })}
                    className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                      form.doctorId === 0 ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{t('No Preference', 'နှစ်သက်မှု မရှိပါ')}</span>
                  </button>
                  {mockDoctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setForm({ ...form, doctorId: doctor.id })}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all flex items-center gap-4 ${
                        form.doctorId === doctor.id ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <img src={doctor.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h3 className="font-medium text-gray-900">{t(doctor.nameEn, doctor.nameMm)}</h3>
                        <p className="text-xs text-gray-500">{t(doctor.specialtyEn, doctor.specialtyMm)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Date & Time */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Select Date & Time', 'ရက်စွဲနှင့် အချိန် ရွေးချယ်ပါ')}</h2>
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t('Date', 'ရက်စွဲ')}</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                    {availableDates.slice(0, 20).map((date) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
                      const dayNum = date.getDate();
                      const month = date.toLocaleDateString('en', { month: 'short' });
                      return (
                        <button
                          key={dateStr}
                          onClick={() => setForm({ ...form, date: dateStr })}
                          className={`p-2 rounded-xl text-center border-2 transition-all ${
                            form.date === dateStr ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="text-xs text-gray-500">{dayName}</div>
                          <div className="text-lg font-bold text-gray-900">{dayNum}</div>
                          <div className="text-xs text-gray-400">{month}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {form.date && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{t('Time', 'အချိန်')}</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setForm({ ...form, time })}
                          className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                            form.time === time ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Personal Info */}
            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Your Information', 'သင့်အချက်အလက်')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="w-4 h-4 inline mr-1" />{t('Full Name', 'အမည်အပြည့်အစုံ')} *
                    </label>
                    <input
                      type="text"
                      value={form.patientName}
                      onChange={e => setForm({ ...form, patientName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-4 h-4 inline mr-1" />{t('Phone Number', 'ဖုန်းနံပါတ်')} *
                    </label>
                    <input
                      type="tel"
                      value={form.patientPhone}
                      onChange={e => setForm({ ...form, patientPhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />{t('Email (Optional)', 'အီးမေးလ် (မဖြစ်မနေ မဟုတ်ပါ)')}
                    </label>
                    <input
                      type="email"
                      value={form.patientEmail}
                      onChange={e => setForm({ ...form, patientEmail: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">{t('Are you a new patient?', 'လူနာအသစ်ဖြစ်ပါသလား?')}</label>
                    <button
                      onClick={() => setForm({ ...form, isNewPatient: true })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${form.isNewPatient ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {t('Yes', 'ဟုတ်ကဲ့')}
                    </button>
                    <button
                      onClick={() => setForm({ ...form, isNewPatient: false })}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${!form.isNewPatient ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {t('No', 'မဟုတ်ပါ')}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FileText className="w-4 h-4 inline mr-1" />{t('Notes (Optional)', 'မှတ်ချက် (မဖြစ်မနေ မဟုတ်ပါ)')}
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('Review & Confirm', 'ပြန်လည်စစ်ဆေးပြီး အတည်ပြုပါ')}</h2>
                <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">{t('Service', 'ဝန်ဆောင်မှု')}</span>
                    <span className="font-medium text-gray-900">{selectedService && t(selectedService.nameEn, selectedService.nameMm)}</span>
                  </div>
                  {selectedDoctor && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t('Doctor', 'ဆရာဝန်')}</span>
                      <span className="font-medium text-gray-900">{t(selectedDoctor.nameEn, selectedDoctor.nameMm)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">{t('Date', 'ရက်စွဲ')}</span>
                    <span className="font-medium text-gray-900">{form.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">{t('Time', 'အချိန်')}</span>
                    <span className="font-medium text-gray-900">{form.time}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">{t('Patient', 'လူနာ')}</span>
                    <span className="font-medium text-gray-900">{form.patientName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">{t('Phone', 'ဖုန်း')}</span>
                    <span className="font-medium text-gray-900">{form.patientPhone}</span>
                  </div>
                  {form.patientEmail && (
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">{t('Email', 'အီးမေးလ်')}</span>
                      <span className="font-medium text-gray-900">{form.patientEmail}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('Patient Type', 'လူနာအမျိုးအစား')}</span>
                    <span className="font-medium text-gray-900">{form.isNewPatient ? t('New Patient', 'လူနာအသစ်') : t('Returning Patient', 'ပြန်လာသော လူနာ')}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {currentStep > 1 ? (
                <button onClick={() => setCurrentStep(currentStep - 1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  <ArrowLeft className="w-4 h-4" /> {t('Back', 'နောက်သို့')}
                </button>
              ) : <div />}
              {currentStep < 5 ? (
                <button
                  onClick={() => canNext() && setCurrentStep(currentStep + 1)}
                  disabled={!canNext()}
                  className={`btn-primary flex items-center gap-2 ${!canNext() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {t('Next', 'ရှေ့သို့')} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 !bg-accent-400 !text-gray-900 hover:!bg-accent-300">
                  <Calendar className="w-5 h-5" />
                  {t('Confirm Booking', 'ချိန်းဆိုမှု အတည်ပြုရန်')}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
