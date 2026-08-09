import { useState } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdminServices } from '@/hooks/useAdminData';
import { adminServiceApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import ServiceFormModal from '@/components/admin/ServiceFormModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { formatPrice } from '@/utils/clinicStatus';
import type { DentalService } from '@/types';
import toast from 'react-hot-toast';

const categoryBg: Record<string, string> = {
  GENERAL: 'bg-blue-100 text-blue-700',
  COSMETIC: 'bg-purple-100 text-purple-700',
  ORTHODONTICS: 'bg-pink-100 text-pink-700',
  SURGERY: 'bg-red-100 text-red-700',
  PEDIATRIC: 'bg-yellow-100 text-yellow-700',
  EMERGENCY: 'bg-orange-100 text-orange-700',
};

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const { data: services = [], isLoading } = useAdminServices();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<DentalService | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = () => {
    setSelectedService(null);
    setIsFormOpen(true);
  };

  const handleEdit = (service: DentalService) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (service: DentalService) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService?.id) return;
    
    setIsDeleting(true);
    try {
      await adminServiceApi.delete(selectedService.id);
      toast.success('Service deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      setIsDeleteOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete service');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No services found. Click "Add Service" to create one.
                  </td>
                </tr>
              ) : (
                services.map((service, i) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {service.imageUrl ? (
                        <img 
                          src={service.imageUrl} 
                          alt={service.nameEn}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{service.nameEn}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{service.shortDescriptionEn}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryBg[service.category] || 'bg-gray-100 text-gray-700'}`}>
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-primary-600">{formatPrice(Number(service.startingPrice))}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {service.durationMinutes} min
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(service)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ServiceFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        service={selectedService}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.nameEn}"? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  );
}