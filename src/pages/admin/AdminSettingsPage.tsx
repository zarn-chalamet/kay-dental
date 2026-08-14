import { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  Building2,
  MessageSquare,
  Globe,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminData';
import { adminSettingsApi } from '@/api/adminApi';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

const DAYS = [
  { key: 'monday', label: 'Monday', labelMm: 'တနင်္လာ' },
  { key: 'tuesday', label: 'Tuesday', labelMm: 'အင်္ဂါ' },
  { key: 'wednesday', label: 'Wednesday', labelMm: 'ဗုဒ္ဓဟူး' },
  { key: 'thursday', label: 'Thursday', labelMm: 'ကြာသပတေး' },
  { key: 'friday', label: 'Friday', labelMm: 'သောကြာ' },
  { key: 'saturday', label: 'Saturday', labelMm: 'စနေ' },
  { key: 'sunday', label: 'Sunday', labelMm: 'တနင်္ဂနွေ' },
];

interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

type OpeningHours = Record<string, DaySchedule>;

const DEFAULT_HOURS: OpeningHours = {
  monday: { open: '09:00', close: '18:00', closed: false },
  tuesday: { open: '09:00', close: '18:00', closed: false },
  wednesday: { open: '09:00', close: '18:00', closed: false },
  thursday: { open: '09:00', close: '18:00', closed: false },
  friday: { open: '09:00', close: '18:00', closed: false },
  saturday: { open: '09:00', close: '15:00', closed: false },
  sunday: { open: '', close: '', closed: true },
};

// Reusable input class
const inputClassName =
  'h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20';

const textareaClassName =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 resize-none';

const labelClassName = 'block mb-1.5 text-sm font-semibold text-gray-700';

// Section Card Component
function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  iconBg = 'bg-green-100',
  iconColor = 'text-green-600',
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data: rawSettings, isLoading } = useAdminSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
      clinic_name_en: rawSettings['clinic_name_en'] || '',
      clinic_name_mm: rawSettings['clinic_name_mm'] || '',
      address_en: rawSettings['address_en'] || '',
      address_mm: rawSettings['address_mm'] || '',
      phone1: rawSettings['phone1'] || '',
      phone2: rawSettings['phone2'] || '',
      email: rawSettings['email'] || '',
      viber_number: rawSettings['viber_number'] || '',
      messenger_link: rawSettings['messenger_link'] || '',
      google_maps_link: rawSettings['google_maps_link'] || '',
      google_maps_embed_url: rawSettings['google_maps_embed_url'] || '',
      emergency_phone: rawSettings['emergency_phone'] || '',
      emergency_available: rawSettings['emergency_available'] || 'true',
    });

    if (rawSettings['opening_hours_json']) {
      try {
        const parsed = JSON.parse(rawSettings['opening_hours_json']);
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

    setHasChanges(false);
  }, [rawSettings]);

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateHours = (
    day: string,
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
    setHasChanges(true);
  };

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
      setHasChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your clinic information, contact details, and business hours.
          </p>
        </div>

        {hasChanges && (
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-700 border border-yellow-200">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            Unsaved changes
          </div>
        )}
      </div>

      {/* ============ CLINIC NAME ============ */}
      <SectionCard
        icon={Building2}
        title="Clinic Name"
        description="Your clinic's name in both languages"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Name (English)</label>
            <input
              type="text"
              value={form.clinic_name_en}
              onChange={(e) => updateForm('clinic_name_en', e.target.value)}
              className={inputClassName}
              placeholder="KAY Dental Care"
            />
          </div>
          <div>
            <label className={labelClassName}>Name (Myanmar)</label>
            <input
              type="text"
              value={form.clinic_name_mm}
              onChange={(e) => updateForm('clinic_name_mm', e.target.value)}
              className={inputClassName}
              placeholder="ကေဝိုင် သွားဆေးခန်း"
            />
          </div>
        </div>
      </SectionCard>

      {/* ============ CONTACT INFO ============ */}
      <SectionCard
        icon={Phone}
        title="Contact Information"
        description="Phone numbers, email, and messaging platforms"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>
              Primary Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.phone1}
              onChange={(e) => updateForm('phone1', e.target.value)}
              className={inputClassName}
              placeholder="09 5158726"
            />
          </div>
          <div>
            <label className={labelClassName}>Secondary Phone</label>
            <input
              type="text"
              value={form.phone2}
              onChange={(e) => updateForm('phone2', e.target.value)}
              className={inputClassName}
              placeholder="09 xxxxxxxxx"
            />
          </div>
          <div>
            <label className={labelClassName}>
              <Mail className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateForm('email', e.target.value)}
              className={inputClassName}
              placeholder="info@kaydental.com"
            />
          </div>
          <div>
            <label className={labelClassName}>
              <MessageSquare className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              Viber Number
            </label>
            <input
              type="text"
              value={form.viber_number}
              onChange={(e) => updateForm('viber_number', e.target.value)}
              className={inputClassName}
              placeholder="+959xxxxxxxxx"
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClassName}>
              <Globe className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              Messenger Link
            </label>
            <input
              type="url"
              value={form.messenger_link}
              onChange={(e) => updateForm('messenger_link', e.target.value)}
              className={inputClassName}
              placeholder="https://m.me/yourpage"
            />
          </div>
        </div>
      </SectionCard>

      {/* ============ ADDRESS ============ */}
      <SectionCard
        icon={MapPin}
        title="Address & Location"
        description="Physical address and map integration"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClassName}>Address (English)</label>
              <textarea
                rows={3}
                value={form.address_en}
                onChange={(e) => updateForm('address_en', e.target.value)}
                className={textareaClassName}
                placeholder="No. 123, Main Road, Latha Township, Yangon"
              />
            </div>
            <div>
              <label className={labelClassName}>Address (Myanmar)</label>
              <textarea
                rows={3}
                value={form.address_mm}
                onChange={(e) => updateForm('address_mm', e.target.value)}
                className={textareaClassName}
                placeholder="အမှတ်၊ ၁၂၃၊ လမ်းမကြီး၊ လသာမြို့နယ်၊ ရန်ကုန်"
              />
            </div>
          </div>
          <div>
            <label className={labelClassName}>Google Maps Link</label>
            <input
              type="url"
              value={form.google_maps_link}
              onChange={(e) => updateForm('google_maps_link', e.target.value)}
              className={inputClassName}
              placeholder="https://maps.google.com/..."
            />
          </div>
          <div>
            <label className={labelClassName}>Google Maps Embed URL</label>
            <textarea
              rows={2}
              value={form.google_maps_embed_url}
              onChange={(e) => updateForm('google_maps_embed_url', e.target.value)}
              className={`${textareaClassName} font-mono text-xs`}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Paste the embed URL from Google Maps → Share → Embed a map
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ============ OPENING HOURS ============ */}
      <SectionCard
        icon={Clock}
        title="Opening Hours"
        description="Set your clinic's business hours for each day"
      >
        <div className="space-y-2">
          {DAYS.map((day) => {
            const hours =
              openingHours[day.key] || {
                open: '09:00',
                close: '18:00',
                closed: false,
              };
            return (
              <div
                key={day.key}
                className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-all ${
                  hours.closed
                    ? 'bg-red-50/50 border-red-100'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                {/* Day label */}
                <div className="w-full sm:w-32 shrink-0">
                  <p className="font-semibold text-sm text-gray-900">
                    {day.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{day.labelMm}</p>
                </div>

                {/* Closed toggle */}
                <label className="inline-flex items-center gap-2 shrink-0 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={(e) =>
                        updateHours(day.key, 'closed', e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-red-500 transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {hours.closed ? 'Closed' : 'Open'}
                  </span>
                </label>

                {/* Hours or Closed */}
                {!hours.closed ? (
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) =>
                        updateHours(day.key, 'open', e.target.value)
                      }
                      className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                    />
                    <span className="text-gray-400 text-sm font-medium">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) =>
                        updateHours(day.key, 'close', e.target.value)
                      }
                      className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-red-600 font-semibold sm:ml-auto">
                    Closed all day
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* ============ EMERGENCY ============ */}
      <SectionCard
        icon={ShieldAlert}
        title="Emergency Contact"
        description="24/7 emergency line and availability status"
        iconBg="bg-red-100"
        iconColor="text-red-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClassName}>Emergency Phone</label>
            <input
              type="text"
              value={form.emergency_phone}
              onChange={(e) => updateForm('emergency_phone', e.target.value)}
              className={inputClassName}
              placeholder="09 xxxxxxxxx"
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-3 cursor-pointer select-none w-full">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.emergency_available === 'true'}
                  onChange={(e) =>
                    updateForm(
                      'emergency_available',
                      e.target.checked ? 'true' : 'false'
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">
                  24/7 Availability
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Emergency service is available round the clock
                </div>
              </div>
            </label>
          </div>
        </div>
      </SectionCard>

      {/* ============ SAVE BAR ============ */}
      <div className="sticky bottom-4 z-30">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {hasChanges ? (
              <>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">
                    You have unsaved changes
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    Don't forget to save your changes
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">
                    All changes saved
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 truncate">
                    Your settings are up to date
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-500/20 transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}