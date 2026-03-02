import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { SettingsStackParamList } from '../types/navigation';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';

const Stack = createStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  const theme = useTheme();
  const { t } = useTranslation('settings');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface, elevation: 0, shadowOpacity: 0 },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile') }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: t('privacyPolicy') }} />
    </Stack.Navigator>
  );
}
