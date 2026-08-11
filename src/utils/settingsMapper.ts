import type { ClinicSettings, ClinicSettingsRaw, DaySchedule } from '@/types';

const DAY_NAMES: Record<string, { en: string; mm: string }> = {
  monday:    { en: 'Monday',    mm: 'တနင်္လာ' },
  tuesday:   { en: 'Tuesday',   mm: 'အင်္ဂါ' },
  wednesday: { en: 'Wednesday', mm: 'ဗုဒ္ဓဟူး' },
  thursday:  { en: 'Thursday',  mm: 'ကြာသပတေး' },
  friday:    { en: 'Friday',    mm: 'သောကြာ' },
  saturday:  { en: 'Saturday',  mm: 'စနေ' },
  sunday:    { en: 'Sunday',    mm: 'တနင်္ဂနွေ' },
};

function parseOpeningHours(json: string): DaySchedule[] {
  try {
    const parsed = JSON.parse(json) as Record<
      string,
      { open: string; close: string; closed: boolean }
    >;
    return Object.entries(parsed).map(([day, value]) => ({
      day: DAY_NAMES[day]?.en ?? day,
      dayMm: DAY_NAMES[day]?.mm ?? day,
      open: value.open,
      close: value.close,
      isClosed: value.closed,
    }));
  } catch {
    return [];
  }
}

export function mapClinicSettings(raw: ClinicSettingsRaw): ClinicSettings {
  return {
    clinicNameEn:        raw.clinic_name_en,
    clinicNameMm:        raw.clinic_name_mm,
    addressEn:           raw.address_en,
    addressMm:           raw.address_mm,
    phone1:              raw.phone1,
    phone2:              raw.phone2,
    email:               raw.email,
    viberNumber:         raw.viber_number,
    messengerLink:       raw.messenger_link,
    googleMapsEmbedUrl:  raw.google_maps_embed_url,
    googleMapsLink:      raw.google_maps_link,
    openingHours:        parseOpeningHours(raw.opening_hours_json),
    emergencyPhone:      raw.emergency_phone,
    emergencyAvailable:  raw.emergency_available === 'true',
  };
}