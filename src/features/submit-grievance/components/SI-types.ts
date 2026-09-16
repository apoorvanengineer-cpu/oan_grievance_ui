export interface SIFormProps {
  values: Record<string, string>;
  setValue: (key: string, value: string) => void;
}

export interface SIFieldMeta {
  key: string;
  label: string;
  required: boolean;
}

/** Local-number digits only (the country code is a separate field) — 7 to 10 digits covers every code in SI-PhoneField's list. */
export function isValidPhoneNumber(value: string): boolean {
  return /^\d{7,10}$/.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
