export const DB_NAME = 'psikoplanner.db';
export const ENCRYPTION_KEY_ALIAS = 'psikoplanner_db_key';
export const SESSION_REMINDER_DEFAULT_MINUTES = 30;
export const MAX_BACKUP_FILES = 5;
export const BIOMETRIC_KEY = 'biometric_enabled';
export const LANGUAGE_KEY = 'app_language';
export const THEME_KEY = 'app_theme';
export const AUTO_LOCK_KEY = 'auto_lock_timeout';
export const THERAPIST_PROFILE_KEY = 'therapist_profile';

export const SESSION_TYPES = [
  'individual',
  'couple',
  'family',
  'group',
  'online',
  'assessment',
] as const;

export const SESSION_STATUSES = [
  'planned',
  'completed',
  'cancelled',
  'no_show',
] as const;

export const GENDERS = [
  'male',
  'female',
  'other',
  'prefer_not_to_say',
] as const;

export const MARITAL_STATUSES = [
  'single',
  'married',
  'divorced',
  'widowed',
  'separated',
  'other',
] as const;

export const RISK_LEVELS = [
  'none',
  'low',
  'moderate',
  'high',
  'critical',
] as const;

export const PAYMENT_METHODS = [
  'cash',
  'credit_card',
  'bank_transfer',
  'insurance',
  'other',
] as const;

export const NOTE_TYPES = [
  'general',
  'subjective',
  'objective',
  'assessment',
  'plan',
] as const;

export const AUTO_LOCK_OPTIONS = [0, 60, 300, 900] as const; // seconds: immediately, 1min, 5min, 15min

export const EDUCATION_LEVELS = [
  'none', 'primary', 'secondary', 'high_school',
  'associate', 'bachelor', 'master', 'doctorate',
] as const;

export const LIVING_WITH_OPTIONS = [
  'alone', 'spouse', 'family', 'roommate', 'other',
] as const;

export const WIZARD_STEPS = [
  'personalInfo', 'demographics', 'healthSummary', 'familySummary', 'therapyReferral',
] as const;

export const REMINDER_OPTIONS = [15, 30, 60, 120, 1440] as const; // minutes
