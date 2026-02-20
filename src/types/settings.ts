export interface TherapistProfile {
  name: string;
  title: string;
  licenseNumber?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  email?: string;
}

export interface AppSettings {
  language: 'tr' | 'en';
  theme: 'light' | 'dark' | 'system';
  biometricEnabled: boolean;
  autoLockTimeout: number;
  defaultReminderMinutes: number;
  dailySummaryEnabled: boolean;
  dailySummaryTime: string;
}

export interface NotificationSettings {
  enabled: boolean;
  defaultReminderMinutes: number;
  dailySummaryEnabled: boolean;
  dailySummaryTime: string;
}
