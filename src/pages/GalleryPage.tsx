import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Search } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useQuery } from '@tanstack/react-query';
import { galleryApi } from '@/api/publicApi';
import type { GalleryPhoto } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const badgeClassName =
  'inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700';

const categories = [
  { value: 'ALL',          labelEn: 'All Photos',     labelMm: 'အားလုံး' },
  { value: 'CLINIC',       labelEn: 'Clinic',         labelMm: 'ဆေးခန်း' },
  { value: 'BEFORE_AFTER', labelEn: 'Before & After', labelMm: 'မတိုင်မီ / ပြီးနောက်' },
  { value: 'TEAM',         labelEn: 'Our Team',       labelMm: 'အဖွဲ့သား' },
  { value: 'EQUIPMENT',    labelEn: 'Equipment',      labelMm: 'ကိရိယာ' },
];

export default function GalleryPage() {
  const { t } = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: galleryApi.getAll,
  });

  const filtered = activeCategory === 'ALL'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  const getCount = (value: string) => {
    if (value === 'ALL') return photos.length;
    return photos.filter(p => p.category === value).length;
  };

  const selectedPhoto = selectedIndex !== null ? filtered[selectedIndex] : null;

  const goToPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? filtered.length - 1 : selectedIndex - 1);
  }, [selectedIndex, filtered.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === filtered.length - 1 ? 0 : selectedIndex + 1);
  }, [selectedIndex, filtered.length]);

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [selectedIndex, closeLightbox, goToPrev, goToNext]);

  return (
    <main className="bg-white pt-20 font-sans">
      {/* ============ HERO ============ */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-yellow-50 min-h-[calc(100vh-5rem)] flex items-center py-14 md:py-20">
        <div className="absolute inset-0 hidden md:block">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-green-100/70 blur-3xl" />
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-100/80 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-green-200/50 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 md:px-8 lg:px-12 text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className={badgeClassName}>
              <Sparkles className="h-3.5 w-3.5" />
              {t('Photo Gallery', 'ဓာတ်ပုံ ပြခန်း')}
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl leading-tight">
              {t('A Look ', 'ဆေးခန်း ')}
              <span className="text-green-600">
                {t('Inside Our Clinic', 'အတွင်းပိုင်း')}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              {t(
                'Explore our modern facility, meet our team, and see real patient transformations.',
                'ခေတ်မီဆေးခန်း၊ ကျွန်ုပ်တို့အဖွဲ့နှင့် လူနာများ၏ ပြောင်းလဲမှုများကို ကြည့်ရှုပါ။'
              )}
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {photos.length}+
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t('Photos', 'ဓာတ်ပုံ')}
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {t('Categories', 'အမျိုးအစား')}
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-500 mt-1">
                  {t('Authentic', 'အစစ်အမှန်')}
                </div>
              </div>
            </div>

            <a
              href="#gallery"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
            >
              <ImageIcon className="h-5 w-5" />
              {t('Browse Gallery', 'ဓာတ်ပုံများ ကြည့်ရန်')}
            </a>
          </motion.div>
        </div>
      </header>

      {/* ============ GALLERY SECTION ============ */}
      <section id="gallery" className="px-4 py-16 md:px-8 md:py-20 lg:px-12 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-8 max-w-3xl text-center"
          >
            <span className={badgeClassName}>
              {t('Explore', 'ကြည့်ရှုပါ')}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
              {t('Browse Our Photos', 'ကျွန်ုပ်တို့၏ ဓာတ်ပုံများ')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              {t(
                'Filter by category to find what you\'re looking for.',
                'အမျိုးအစားအလိုက် ရွေးချယ်ကြည့်ရှုပါ။'
              )}
            </p>
          </motion.div>

          {/* Category Filter Pills */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-10 flex flex-wrap justify-center gap-2 md:gap-3"
          >
            {categories.map((cat) => {
              const count = getCount(cat.value);
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md scale-105'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  <span>{t(cat.labelEn, cat.labelMm)}</span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full min-w-[24px] h-5 px-1.5 text-xs font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-md text-center py-16"
            >
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('No photos found', 'ဓာတ်ပုံ မတွေ့ပါ')}
              </h3>
              <p className="mt-2 text-gray-600">
                {t(
                  'Try selecting a different category to see more photos.',
                  'အခြားအမျိုးအစားကို ရွေးချယ်ကြည့်ပါ။'
                )}
              </p>
              <button
                onClick={() => setActiveCategory('ALL')}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 text-white font-semibold px-5 py-2.5 hover:bg-green-700 transition-colors"
              >
                {t('Show All Photos', 'ဓာတ်ပုံအားလုံး ကြည့်ရန်')}
              </button>
            </motion.div>
          )}

          {/* Photo Grid - UNIFORM SQUARE GRID (Professional) */}
          {!isLoading && filtered.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((photo, i) => (
                  <motion.button
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    onClick={() => setSelectedIndex(i)}
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {/* Photo - uniform square, object-cover */}
                    <img
                      src={photo.imageUrl}
                      alt={t(photo.titleEn, photo.titleMm)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge - always visible */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 shadow-sm">
                        {photo.category.replace('_', ' ')}
                      </span>
                    </div>

                    {/* View icon on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm shadow-sm">
                        <Search className="h-4 w-4 text-gray-700" />
                      </div>
                    </div>

                    {/* Title on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                        {t(photo.titleEn, photo.titleMm)}
                      </h3>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============ LIGHTBOX ============ */}
      <AnimatePresence>
        {selectedPhoto && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/60 to-transparent">
              <div className="text-white">
                <div className="text-sm text-gray-300">
                  {selectedIndex + 1} / {filtered.length}
                </div>
                <div className="mt-1 inline-flex items-center rounded-full bg-white/10 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 border border-white/20">
                  {selectedPhoto.category.replace('_', ' ')}
                </div>
              </div>

              <button
                onClick={closeLightbox}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors border border-white/20"
                aria-label={t('Close', 'ပိတ်ရန်')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prev button */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors border border-white/20"
                aria-label={t('Previous', 'ရှေ့သို့')}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur text-white hover:bg-white/20 transition-colors border border-white/20"
                aria-label={t('Next', 'နောက်သို့')}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedPhoto.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-6xl w-full h-full flex items-center justify-center p-4 md:p-16"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.imageUrl}
                alt={t(selectedPhoto.titleEn, selectedPhoto.titleMm)}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Bottom info */}
            {(selectedPhoto.titleEn || selectedPhoto.descriptionEn) && (
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="mx-auto max-w-3xl text-center text-white">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {t(selectedPhoto.titleEn, selectedPhoto.titleMm)}
                  </h3>
                  {selectedPhoto.descriptionEn && (
                    <p className="mt-2 text-sm text-gray-300 max-w-2xl mx-auto">
                      {t(selectedPhoto.descriptionEn, selectedPhoto.descriptionMm)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}