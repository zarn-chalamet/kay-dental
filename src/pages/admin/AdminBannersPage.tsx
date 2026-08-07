import AdminGenericPage from './AdminGenericPage';
import { mockBanners } from '@/data/mockData';

export default function AdminBannersPage() {
  return (
    <AdminGenericPage
      title="Banners"
      data={mockBanners as unknown as Record<string, unknown>[]}
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
