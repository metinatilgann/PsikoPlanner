import Constants from 'expo-constants';

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://ptpcokjtqrdezeldvqbf.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_gWZfVxFUTaPzHZAcFHB4ag_wgMFMgy6';

export const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
export const APP_BUILD_NUMBER =
  Constants.expoConfig?.ios?.buildNumber ??
  String(Constants.expoConfig?.android?.versionCode ?? '1');
