import AdminGenericPage from './AdminGenericPage';
import { useAdminTestimonials } from '@/hooks/useAdminData';
import { Star } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminTestimonialsPage() {
  const { data: testimonials = [], isLoading } = useAdminTestimonials();

  if (isLoading) return <LoadingSpinner />;

  return (
    <AdminGenericPage
      title="Testimonials"
      data={testimonials as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'patientName', label: 'Patient' },
        { key: 'treatment', label: 'Treatment' },
        { key: 'rating', label: 'Rating', render: (item) => (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: Number(item.rating) }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        )},
      ]}
    />
  );
}