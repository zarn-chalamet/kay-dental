import AdminGenericPage from './AdminGenericPage';
import { mockHolidays } from '@/data/mockData';

export default function AdminHolidaysPage() {
  return (
    <AdminGenericPage
      title="Holidays"
      data={mockHolidays as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'nameEn', label: 'Holiday' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'theme', label: 'Theme', render: (item) => (
          <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">{String(item.theme)}</span>
        )},
      ]}
    />
  );
}
