import AdminGenericPage from './AdminGenericPage';
import { mockTestimonials } from '@/data/mockData';
import { Star } from 'lucide-react';

export default function AdminTestimonialsPage() {
  return (
    <AdminGenericPage
      title="Testimonials"
      data={mockTestimonials as unknown as Record<string, unknown>[]}
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
