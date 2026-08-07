import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { mockTestimonials } from '@/data/mockData';

export default function TestimonialsPage() {
  const { t } = useLanguageStore();
  const [filter, setFilter] = useState('All');
  const treatments = ['All', ...new Set(mockTestimonials.map(t => t.treatment))];
  const filtered = filter === 'All' ? mockTestimonials : mockTestimonials.filter(te => te.treatment === filter);

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Patient Testimonials', 'လူနာ သုံးသပ်ချက်များ')}</h1>
            <p className="text-lg text-green-100">{t('Real stories from our valued patients', 'ကျွန်ုပ်တို့၏ တန်ဖိုးရှိ လူနာများထံမှ တကယ့်ပုံပြင်များ')}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {treatments.map((tr) => (
              <button
                key={tr}
                onClick={() => setFilter(tr)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === tr ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-6"
              >
                <Quote className="w-8 h-8 text-primary-200 mb-3" />
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < testimonial.rating ? 'text-accent-400 fill-accent-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  "{t(testimonial.reviewEn, testimonial.reviewMm)}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                    {testimonial.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.patientName}</p>
                    <p className="text-xs text-primary-600">{testimonial.treatment}</p>
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
