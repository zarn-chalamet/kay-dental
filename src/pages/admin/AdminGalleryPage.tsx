import AdminGenericPage from './AdminGenericPage';
import { mockGallery } from '@/data/mockData';

export default function AdminGalleryPage() {
  return (
    <AdminGenericPage
      title="Gallery"
      data={mockGallery as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'titleEn', label: 'Title', render: (item) => (
          <div className="flex items-center gap-3">
            <img src={String(item.imageUrl)} alt="" className="w-12 h-8 rounded object-cover" />
            <span>{String(item.titleEn)}</span>
          </div>
        )},
        { key: 'category', label: 'Category', render: (item) => (
          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">{String(item.category)}</span>
        )},
      ]}
    />
  );
}
