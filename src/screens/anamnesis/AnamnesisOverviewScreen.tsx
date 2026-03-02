import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Surface, ProgressBar, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getAnamnesisCompletion } from '../../services/database/anamnesisService';
import type { AnamnesisCompletion } from '../../types/anamnesis';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'AnamnesisOverview'>;
  route: RouteProp<ClientStackParamList, 'AnamnesisOverview'>;
};

interface SectionItem {
  key: keyof Omit<AnamnesisCompletion, 'percentage'>;
  icon: string;
  label: string;
  screen: keyof ClientStackParamList;
}

export default function AnamnesisOverviewScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('anamnesis');
  const { db, isReady } = useDatabase();

  const [completion, setCompletion] = useState<AnamnesisCompletion | null>(null);

  const loadCompletion = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getAnamnesisCompletion(db, clientId);
    setCompletion(data);
  }, [db, isReady, clientId]);

  useFocusEffect(useCallback(() => { loadCompletion(); }, [loadCompletion]));

  const sections: SectionItem[] = [
    { key: 'familyHistory', icon: 'account-group', label: t('familyHistory'), screen: 'FamilyHistory' },
    { key: 'medicalHistory', icon: 'hospital-box', label: t('medicalHistory'), screen: 'MedicalHistory' },
    { key: 'psychologicalHistory', icon: 'brain', label: t('psychologicalHistory'), screen: 'PsychologicalHistory' },
    { key: 'medications', icon: 'pill', label: t('medications'), screen: 'Medications' },
    { key: 'presentingProblem', icon: 'clipboard-text', label: t('presentingProblem'), screen: 'PresentingProblem' },
  ];

  const pct = completion?.percentage ?? 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.progressCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
        <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}>
          {t('completion')}
        </Text>
        <Text variant="headlineLarge" style={{ color: theme.colors.primary, fontWeight: '700', marginVertical: 8 }}>
          %{pct}
        </Text>
        <ProgressBar
          progress={pct / 100}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
      </Surface>

      {sections.map((section) => {
        const isCompleted = completion?.[section.key] ?? false;
        return (
          <TouchableRipple
            key={section.key}
            onPress={() => navigation.navigate(section.screen as any, { clientId })}
          >
            <Surface style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
              <View style={[styles.iconContainer, { backgroundColor: isCompleted ? theme.colors.secondaryContainer : theme.colors.surfaceVariant }]}>
                <MaterialCommunityIcons
                  name={section.icon}
                  size={24}
                  color={isCompleted ? theme.colors.secondary : theme.colors.onSurfaceVariant}
                />
              </View>
              <View style={styles.sectionInfo}>
                <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                  {section.label}
                </Text>
                <Text variant="bodySmall" style={{ color: isCompleted ? theme.colors.secondary : theme.colors.onSurfaceVariant }}>
                  {isCompleted ? t('completed') : t('notStarted')}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={isCompleted ? 'check-circle' : 'chevron-right'}
                size={24}
                color={isCompleted ? theme.colors.secondary : theme.colors.outline}
              />
            </Surface>
          </TouchableRipple>
        );
      })}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressCard: { margin: 16, padding: 20, borderRadius: 16, alignItems: 'center' },
  progressBar: { height: 8, borderRadius: 4, width: '100%' },
  sectionCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginVertical: 4, padding: 16, borderRadius: 12,
  },
  iconContainer: {
    width: 48, height: 48, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  sectionInfo: { flex: 1, marginLeft: 12 },
});
