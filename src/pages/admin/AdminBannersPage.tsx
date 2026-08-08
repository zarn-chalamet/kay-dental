import AdminGenericPage from './AdminGenericPage';
import { useAdminBanners } from '@/hooks/useAdminData';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminBannersPage() {
  const { data: bannersData, isLoading } = useAdminBanners();

  if (isLoading) return <LoadingSpinner />;

  const banners = bannersData?.content || [];

  return (
    <AdminGenericPage
      title="Banners"
      data={banners as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'titleEn', label: 'Title' },
        { key: 'type', label: 'Type', render: (item) => (
          <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full">
            {String(item.type)}
          </span>
        )},
        { key: 'displayOrder', label: 'Order' },
      ]}
    />
  );
}