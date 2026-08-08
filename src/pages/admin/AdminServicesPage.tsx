import AdminGenericPage from './AdminGenericPage';
import { useAdminServices } from '@/hooks/useAdminData';
import { formatPrice } from '@/utils/clinicStatus';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminServicesPage() {
  const { data: services = [], isLoading } = useAdminServices();

  if (isLoading) return <LoadingSpinner />;

  return (
    <AdminGenericPage
      title="Services"
      data={services as unknown as Record<string, unknown>[]}
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