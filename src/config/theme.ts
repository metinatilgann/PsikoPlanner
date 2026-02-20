import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

const fonts = configureFonts({ config: fontConfig });

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563EB',
    onPrimary: '#FFFFFF',
    primaryContainer: '#DBEAFE',
    onPrimaryContainer: '#1E3A5F',
    secondary: '#059669',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#D1FAE5',
    onSecondaryContainer: '#064E3B',
    tertiary: '#7C3AED',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#EDE9FE',
    onTertiaryContainer: '#4C1D95',
    error: '#DC2626',
    onError: '#FFFFFF',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#991B1B',
    background: '#F8FAFC',
    onBackground: '#0F172A',
    surface: '#FFFFFF',
    onSurface: '#0F172A',
    surfaceVariant: '#F1F5F9',
    onSurfaceVariant: '#475569',
    outline: '#CBD5E1',
    outlineVariant: '#E2E8F0',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F8FAFC',
      level3: '#F1F5F9',
      level4: '#E2E8F0',
      level5: '#CBD5E1',
    },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60A5FA',
    onPrimary: '#1E3A5F',
    primaryContainer: '#1E3A5F',
    onPrimaryContainer: '#DBEAFE',
    secondary: '#34D399',
    onSecondary: '#064E3B',
    secondaryContainer: '#064E3B',
    onSecondaryContainer: '#D1FAE5',
    tertiary: '#A78BFA',
    onTertiary: '#4C1D95',
    tertiaryContainer: '#4C1D95',
    onTertiaryContainer: '#EDE9FE',
    error: '#F87171',
    onError: '#991B1B',
    errorContainer: '#991B1B',
    onErrorContainer: '#FEE2E2',
    background: '#0F172A',
    onBackground: '#E2E8F0',
    surface: '#1E293B',
    onSurface: '#E2E8F0',
    surfaceVariant: '#334155',
    onSurfaceVariant: '#94A3B8',
    outline: '#475569',
    outlineVariant: '#334155',
    elevation: {
      level0: 'transparent',
      level1: '#1E293B',
      level2: '#253449',
      level3: '#2D3E57',
      level4: '#344965',
      level5: '#3B5373',
    },
  },
};
