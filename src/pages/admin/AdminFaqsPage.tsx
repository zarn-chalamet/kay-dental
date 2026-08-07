import AdminGenericPage from './AdminGenericPage';
import { mockFaqs } from '@/data/mockData';

export default function AdminFaqsPage() {
  return (
    <AdminGenericPage
      title="FAQs"
      data={mockFaqs as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'questionEn', label: 'Question', render: (item) => (
          <span className="line-clamp-1 max-w-xs">{String(item.questionEn)}</span>
        )},
        { key: 'category', label: 'Category', render: (item) => (
          <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">{String(item.category)}</span>
        )},
        { key: 'displayOrder', label: 'Order' },
      ]}
    />
  );
}
