import AdminGenericPage from './AdminGenericPage';
import { mockServices } from '@/data/mockData';
import { formatPrice } from '@/utils/clinicStatus';

export default function AdminServicesPage() {
  return (
    <AdminGenericPage
      title="Services"
      data={mockServices as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'nameEn', label: 'Service Name' },
        { key: 'category', label: 'Category', render: (item) => (
          <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">{String(item.category)}</span>
        )},
        { key: 'startingPrice', label: 'Price', render: (item) => formatPrice(Number(item.startingPrice)) },
        { key: 'durationMinutes', label: 'Duration', render: (item) => `${item.durationMinutes} min` },
      ]}
    />
  );
}
