import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import type { DashboardStackParamList } from '../types/navigation';
import DashboardScreen from '../screens/dashboard/DashboardScreen';

const Stack = createStackNavigator<DashboardStackParamList>();

export default function DashboardNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface, elevation: 0, shadowOpacity: 0 },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
