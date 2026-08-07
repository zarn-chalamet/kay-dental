import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { mockAppointments, mockServices, mockDoctors } from '@/data/mockData';
import type { Appointment } from '@/types';

const statusBg: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-gray-100 text-gray-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-3.5 h-3.5" />,
  CONFIRMED: <CheckCircle className="w-3.5 h-3.5" />,
  COMPLETED: <CheckCircle className="w-3.5 h-3.5" />,
  CANCELLED: <XCircle className="w-3.5 h-3.5" />,
  NO_SHOW: <AlertCircle className="w-3.5 h-3.5" />,
};

export default function AdminAppointmentsPage() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = mockAppointments
    .filter((a: Appointment) => filterStatus === 'ALL' || a.status === filterStatus)
    .filter((a: Appointment) => !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.patientPhone.includes(search));

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === status ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-3 h-3 inline mr-1" />
            {status.replace('_', ' ')} {status !== 'ALL' && `(${mockAppointments.filter(a => a.status === status).length})`}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => {
                const service = mockServices.find(s => s.id === appt.serviceId);
                const doctor = mockDoctors.find(d => d.id === appt.doctorId);
                return (
                  <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 text-sm">{appt.patientName}</div>
                      <div className="text-xs text-gray-500">{appt.patientPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{service?.nameEn || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{doctor?.nameEn || 'Any'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appt.appointmentDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appt.appointmentTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusBg[appt.status]}`}>
                        {statusIcons[appt.status]} {appt.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No appointments found</div>
        )}
      </div>
    </div>
  );
}
