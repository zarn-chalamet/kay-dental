import { useState } from 'react';
import { Save } from 'lucide-react';
import { CLINIC_INFO } from '@/constants/clinicInfo';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    clinicNameEn: CLINIC_INFO.clinicNameEn,
    clinicNameMm: CLINIC_INFO.clinicNameMm,
    addressEn: CLINIC_INFO.addressEn,
    addressMm: CLINIC_INFO.addressMm,
    phone1: CLINIC_INFO.phone1,
    phone2: CLINIC_INFO.phone2,
    email: CLINIC_INFO.email,
    emergencyPhone: CLINIC_INFO.emergencyPhone,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clinic Settings</h1>
        <button onClick={handleSave} className="btn-primary !py-2 !px-4 !text-sm flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-sm"
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">Opening Hours</h3>
          <div className="space-y-3">
            {CLINIC_INFO.openingHours.map((day) => (
              <div key={day.day} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                <span className="w-24 font-medium text-sm text-gray-700">{day.day}</span>
                {day.isClosed ? (
                  <span className="text-red-500 text-sm font-medium">Closed</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input type="time" defaultValue={day.open} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                    <span className="text-gray-400">to</span>
                    <input type="time" defaultValue={day.close} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
