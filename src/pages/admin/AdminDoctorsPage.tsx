import AdminGenericPage from './AdminGenericPage';
import { mockDoctors } from '@/data/mockData';

export default function AdminDoctorsPage() {
  return (
    <AdminGenericPage
      title="Doctors"
      data={mockDoctors as unknown as Record<string, unknown>[]}
      columns={[
        { key: 'nameEn', label: 'Name', render: (item) => (
          <div className="flex items-center gap-3">
            <img src={String(item.photoUrl)} alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-medium">{String(item.nameEn)}</span>
          </div>
        )},
        { key: 'specialtyEn', label: 'Specialty' },
        { key: 'experienceYears', label: 'Experience', render: (item) => `${item.experienceYears} years` },
      ]}
    />
  );
}
