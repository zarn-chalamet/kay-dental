import { useState, useEffect } from 'react';
import { Save, Loader2, Phone, Mail, MapPin, Clock, AlertCircle } from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminData';
import { adminSettingsApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const DAYS = [
  { key: 'monday',    label: 'Monday',    labelMm: 'တနင်္လာ' },
  { key: 'tuesday',   label: 'Tuesday',   labelMm: 'အင်္ဂါ' },
  { key: 'wednesday', label: 'Wednesday', labelMm: 'ဗုဒ္ဓဟူး' },
  { key: 'thursday',  label: 'Thursday',  labelMm: 'ကြာသပတေး' },
  { key: 'friday',    label: 'Friday',    labelMm: 'သောကြာ' },
  { key: 'saturday',  label: 'Saturday',  labelMm: 'စနေ' },
  { key: 'sunday',    label: 'Sunday',    labelMm: 'တနင်္ဂနွေ' },
];

interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

type OpeningHours = Record<string, DaySchedule>;

const DEFAULT_HOURS: OpeningHours = {
  monday:    { open: '09:00', close: '18:00', closed: false },
  tuesday:   { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday:  { open: '09:00', close: '18:00', closed: false },
  friday:    { open: '09:00', close: '18:00', closed: false },
  saturday:  { open: '09:00', close: '15:00', closed: false },
  sunday:    { open: '',      close: '',      closed: true  },
};

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data: rawSettings, isLoading } = useAdminSettings();
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    clinic_name_en: '',
    clinic_name_mm: '',
    address_en: '',
    address_mm: '',
    phone1: '',
    phone2: '',
    email: '',
    viber_number: '',
    messenger_link: '',
    google_maps_link: '',
    google_maps_embed_url: '',
    emergency_phone: '',
    emergency_available: 'true',
  });

  const [openingHours, setOpeningHours] = useState<OpeningHours>(DEFAULT_HOURS);

  useEffect(() => {
    if (!rawSettings) return;

    setForm({
      clinic_name_en:        rawSettings['clinic_name_en'] || '',
      clinic_name_mm:        rawSettings['clinic_name_mm'] || '',
      address_en:            rawSettings['address_en'] || '',
      address_mm:            rawSettings['address_mm'] || '',
      phone1:                rawSettings['phone1'] || '',
      phone2:                rawSettings['phone2'] || '',
      email:                 rawSettings['email'] || '',
      viber_number:          rawSettings['viber_number'] || '',
      messenger_link:        rawSettings['messenger_link'] || '',
      google_maps_link:      rawSettings['google_maps_link'] || '',
      google_maps_embed_url: rawSettings['google_maps_embed_url'] || '',
      emergency_phone:       rawSettings['emergency_phone'] || '',
      emergency_available:   rawSettings['emergency_available'] || 'true',
    });

    if (rawSettings['opening_hours_json']) {
      try {
        const parsed = JSON.parse(rawSettings['opening_hours_json']);
        // Normalize null → empty string
        const normalized: OpeningHours = {};
        for (const key of Object.keys(DEFAULT_HOURS)) {
          const day = parsed[key] || DEFAULT_HOURS[key];
          normalized[key] = {
            open: day.open ?? '',
            close: day.close ?? '',
            closed: day.closed ?? false,
          };
        }
        setOpeningHours(normalized);
      } catch {
        setOpeningHours(DEFAULT_HOURS);
      }
    }
  }, [rawSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settingsToSave: Record<string, string> = {
        ...form,
        opening_hours_json: JSON.stringify(openingHours),
      };

      await adminSettingsApi.update(settingsToSave);
      
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['clinic', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['clinic', 'status'] });
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateHours = (day: string, field: keyof DaySchedule, value: string | boolean) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-start gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Clinic Settings</h1>
      </div>

      {/* Clinic Name */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">🏥 Clinic Name</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
            <input
              type="text"
              value={form.clinic_name_en}
              onChange={(e) => setForm({ ...form, clinic_name_en: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (Myanmar)</label>
            <input
              type="text"
              value={form.clinic_name_mm}
              onChange={(e) => setForm({ ...form, clinic_name_mm: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary-600" /> Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone 1 *</label>
            <input
              type="text"
              value={form.phone1}
              onChange={(e) => setForm({ ...form, phone1: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone 2</label>
            <input
              type="text"
              value={form.phone2}
              onChange={(e) => setForm({ ...form, phone2: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-3.5 h-3.5 inline mr-1" />Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Viber Number</label>
            <input
              type="text"
              value={form.viber_number}
              onChange={(e) => setForm({ ...form, viber_number: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Messenger Link</label>
            <input
              type="url"
              value={form.messenger_link}
              onChange={(e) => setForm({ ...form, messenger_link: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-600" /> Address & Location
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address (English)</label>
            <textarea
              rows={2}
              value={form.address_en}
              onChange={(e) => setForm({ ...form, address_en: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address (Myanmar)</label>
            <textarea
              rows={2}
              value={form.address_mm}
              onChange={(e) => setForm({ ...form, address_mm: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
            <input
              type="url"
              value={form.google_maps_link}
              onChange={(e) => setForm({ ...form, google_maps_link: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
            <textarea
              rows={2}
              value={form.google_maps_embed_url}
              onChange={(e) => setForm({ ...form, google_maps_embed_url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none text-xs"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-600" /> Opening Hours
        </h2>
        <div className="space-y-3">
          {DAYS.map((day) => {
            const hours = openingHours[day.key] || { open: '09:00', close: '18:00', closed: false };
            return (
              <div key={day.key} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                <div className="w-28 shrink-0">
                  <p className="font-medium text-sm text-gray-800">{day.label}</p>
                  <p className="text-xs text-gray-500">{day.labelMm}</p>
                </div>

                <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hours.closed}
                    onChange={(e) => updateHours(day.key, 'closed', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
                  />
                  <span className="text-xs font-medium text-gray-600">Closed</span>
                </label>

                {!hours.closed ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => updateHours(day.key, 'open', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-primary-500 outline-none"
                    />
                    <span className="text-gray-400 text-sm">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => updateHours(day.key, 'close', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:border-primary-500 outline-none"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-red-500 font-medium">Closed all day</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" /> Emergency Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
            <input
              type="text"
              value={form.emergency_phone}
              onChange={(e) => setForm({ ...form, emergency_phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
            />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              id="emergencyAvailable"
              checked={form.emergency_available === 'true'}
              onChange={(e) => setForm({ ...form, emergency_available: e.target.checked ? 'true' : 'false' })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="emergencyAvailable" className="text-sm font-medium text-gray-700">
              Emergency service available 24/7
            </label>
          </div>
        </div>
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end pb-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>
    </div>
  );
}