import AdminGenericPage from './AdminGenericPage';
import { useAdminFaqs } from '@/hooks/useAdminData';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminFaqsPage() {
  const { data: faqs = [], isLoading } = useAdminFaqs();

  if (isLoading) return <LoadingSpinner />;

  return (
    <AdminGenericPage
      title="FAQs"
      data={faqs as unknown as Record<string, unknown>[]}
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