import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionTitle({ title, subtitle, centered = true, light = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-10 md:mb-14 ${centered ? 'text-center' : ''}`}
    >
      <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-green-100' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-1 w-16 rounded-full ${centered ? 'mx-auto' : ''} ${light ? 'bg-accent-400' : 'bg-primary-500'}`} />
    </motion.div>
  );
}
