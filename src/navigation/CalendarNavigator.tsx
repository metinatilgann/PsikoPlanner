import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { CalendarStackParamList } from '../types/navigation';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import DayDetailScreen from '../screens/calendar/DayDetailScreen';
import AddEditSessionScreen from '../screens/sessions/AddEditSessionScreen';

const Stack = createStackNavigator<CalendarStackParamList>();

export default function CalendarNavigator() {
  const theme = useTheme();
  const { t } = useTranslation('sessions');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface, elevation: 0, shadowOpacity: 0 },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DayDetail" component={DayDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="AddSession" component={AddEditSessionScreen} options={{ title: t('addSession') }} />
    </Stack.Navigator>
  );
}
