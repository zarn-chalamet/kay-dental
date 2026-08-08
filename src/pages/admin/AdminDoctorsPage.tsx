import AdminGenericPage from './AdminGenericPage';
import { useAdminDoctors } from '@/hooks/useAdminData';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDoctorsPage() {
  const { data: doctors = [], isLoading } = useAdminDoctors();

  if (isLoading) return <LoadingSpinner />;

  return (
    <AdminGenericPage
      title="Doctors"
      data={doctors as unknown as Record<string, unknown>[]}
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