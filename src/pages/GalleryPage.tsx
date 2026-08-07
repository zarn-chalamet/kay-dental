import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { mockGallery } from '@/data/mockData';

const categories = [
  { value: 'ALL', labelEn: 'All', labelMm: 'အားလုံး' },
  { value: 'CLINIC', labelEn: 'Clinic', labelMm: 'ဆေးခန်း' },
  { value: 'BEFORE_AFTER', labelEn: 'Before & After', labelMm: 'မတိုင်မီနှင့် ပြီးနောက်' },
  { value: 'TEAM', labelEn: 'Our Team', labelMm: 'ကျွန်ုပ်တို့အဖွဲ့' },
  { value: 'EQUIPMENT', labelEn: 'Equipment', labelMm: 'ကိရိယာများ' },
];

export default function GalleryPage() {
  const { t } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof mockGallery[0] | null>(null);

  const filtered = activeCategory === 'ALL' ? mockGallery : mockGallery.filter(p => p.category === activeCategory);

  return (
    <div className="pt-20">
      <section className="gradient-green py-16 md:py-20">
        <div className="container-custom text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('Our Gallery', 'ဓာတ်ပုံ ပြခန်း')}</h1>
            <p className="text-lg text-green-100">{t('See our clinic, team, and patient transformations', 'ကျွန်ုပ်တို့ ဆေးခန်း၊ အဖွဲ့နှင့် လူနာ ပြောင်းလဲမှုများကို ကြည့်ပါ')}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(cat.labelEn, cat.labelMm)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                layout
                className="cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <img src={photo.imageUrl} alt={t(photo.titleEn, photo.titleMm)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                      <h3 className="font-semibold">{t(photo.titleEn, photo.titleMm)}</h3>
                      <p className="text-xs text-gray-200">{photo.category}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedPhoto.imageUrl}
              alt={t(selectedPhoto.titleEn, selectedPhoto.titleMm)}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 text-center text-white">
              <h3 className="font-semibold text-lg">{t(selectedPhoto.titleEn, selectedPhoto.titleMm)}</h3>
              <p className="text-gray-300 text-sm">{t(selectedPhoto.descriptionEn, selectedPhoto.descriptionMm)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
