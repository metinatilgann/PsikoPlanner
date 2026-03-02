import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { ClientStackParamList } from '../types/navigation';

import ClientListScreen from '../screens/clients/ClientListScreen';
import AddEditClientScreen from '../screens/clients/AddEditClientScreen';
import ClientDetailScreen from '../screens/clients/ClientDetailScreen';
import ClientSessionsScreen from '../screens/clients/ClientSessionsScreen';
import AnamnesisOverviewScreen from '../screens/anamnesis/AnamnesisOverviewScreen';
import FamilyHistoryScreen from '../screens/anamnesis/FamilyHistoryScreen';
import MedicalHistoryScreen from '../screens/anamnesis/MedicalHistoryScreen';
import PsychologicalHistoryScreen from '../screens/anamnesis/PsychologicalHistoryScreen';
import MedicationsScreen from '../screens/anamnesis/MedicationsScreen';
import PresentingProblemScreen from '../screens/anamnesis/PresentingProblemScreen';
import ArchivedClientsScreen from '../screens/clients/ArchivedClientsScreen';
import SessionDetailScreen from '../screens/sessions/SessionDetailScreen';
import SessionNotesScreen from '../screens/sessions/SessionNotesScreen';
import SessionEvaluationScreen from '../screens/sessions/SessionEvaluationScreen';

const Stack = createStackNavigator<ClientStackParamList>();

export default function ClientNavigator() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface, elevation: 0, shadowOpacity: 0 },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="ClientList" component={ClientListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddEditClient" component={AddEditClientScreen} options={{ title: t('clients:addClient') }} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="ClientSessions" component={ClientSessionsScreen} options={{ title: t('clients:sessions') }} />
      <Stack.Screen name="AnamnesisOverview" component={AnamnesisOverviewScreen} options={{ title: t('anamnesis:title') }} />
      <Stack.Screen name="FamilyHistory" component={FamilyHistoryScreen} options={{ title: t('anamnesis:familyHistory') }} />
      <Stack.Screen name="MedicalHistory" component={MedicalHistoryScreen} options={{ title: t('anamnesis:medicalHistory') }} />
      <Stack.Screen name="PsychologicalHistory" component={PsychologicalHistoryScreen} options={{ title: t('anamnesis:psychologicalHistory') }} />
      <Stack.Screen name="Medications" component={MedicationsScreen} options={{ title: t('anamnesis:medications') }} />
      <Stack.Screen name="PresentingProblem" component={PresentingProblemScreen} options={{ title: t('anamnesis:presentingProblem') }} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} options={{ title: t('sessions:sessionDetail') }} />
      <Stack.Screen name="SessionNotes" component={SessionNotesScreen} options={{ title: t('sessions:notes') }} />
      <Stack.Screen name="SessionEvaluation" component={SessionEvaluationScreen} options={{ title: t('sessions:evaluation') }} />
      <Stack.Screen name="ArchivedClients" component={ArchivedClientsScreen} options={{ title: t('clients:archivedClients') }} />
    </Stack.Navigator>
  );
}
