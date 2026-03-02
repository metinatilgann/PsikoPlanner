import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getPresentingProblem, upsertPresentingProblem } from '../../services/database/anamnesisService';
import Slider from '@react-native-community/slider';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'PresentingProblem'>;
  route: RouteProp<ClientStackParamList, 'PresentingProblem'>;
};

export default function PresentingProblemScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('anamnesis');
  const { db, isReady } = useDatabase();

  const [chiefComplaint, setChiefComplaint] = useState('');
  const [onsetDate, setOnsetDate] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState(5);
  const [triggers, setTriggers] = useState('');
  const [alleviatingFactors, setAlleviatingFactors] = useState('');
  const [impactOnDailyLife, setImpactOnDailyLife] = useState('');
  const [goalsForTherapy, setGoalsForTherapy] = useState('');
  const [previousAttempts, setPreviousAttempts] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getPresentingProblem(db, clientId);
    if (data) {
      setChiefComplaint(data.chiefComplaint || '');
      setOnsetDate(data.onsetDate || '');
      setDuration(data.duration || '');
      setSeverity(data.severity ?? 5);
      setTriggers(data.triggers || '');
      setAlleviatingFactors(data.alleviatingFactors || '');
      setImpactOnDailyLife(data.impactOnDailyLife || '');
      setGoalsForTherapy(data.goalsForTherapy || '');
      setPreviousAttempts(data.previousAttempts || '');
    }
  }, [db, isReady, clientId]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    await upsertPresentingProblem(db, clientId, {
      chiefComplaint: chiefComplaint.trim() || undefined,
      onsetDate: onsetDate.trim() || undefined,
      duration: duration.trim() || undefined,
      severity,
      triggers: triggers.trim() || undefined,
      alleviatingFactors: alleviatingFactors.trim() || undefined,
      impactOnDailyLife: impactOnDailyLife.trim() || undefined,
      goalsForTherapy: goalsForTherapy.trim() || undefined,
      previousAttempts: previousAttempts.trim() || undefined,
    });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput mode="outlined" label={t('problem.chiefComplaint')} value={chiefComplaint} onChangeText={setChiefComplaint} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={`${t('problem.onsetDate')} (YYYY-MM-DD)`} value={onsetDate} onChangeText={setOnsetDate} style={styles.input} />
      <TextInput mode="outlined" label={t('problem.duration')} value={duration} onChangeText={setDuration} style={styles.input} />

      <View style={styles.severityContainer}>
        <View style={styles.severityHeader}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{t('problem.severity')}</Text>
          <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>{severity}/10</Text>
        </View>
        <Slider
          value={severity}
          onValueChange={setSeverity}
          minimumValue={0}
          maximumValue={10}
          step={1}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.outlineVariant}
          thumbTintColor={theme.colors.primary}
          style={styles.slider}
        />
      </View>

      <TextInput mode="outlined" label={t('problem.triggers')} value={triggers} onChangeText={setTriggers} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('problem.alleviatingFactors')} value={alleviatingFactors} onChangeText={setAlleviatingFactors} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('problem.impactOnDailyLife')} value={impactOnDailyLife} onChangeText={setImpactOnDailyLife} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={t('problem.goalsForTherapy')} value={goalsForTherapy} onChangeText={setGoalsForTherapy} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={t('problem.previousAttempts')} value={previousAttempts} onChangeText={setPreviousAttempts} multiline numberOfLines={2} style={styles.input} />

      <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={styles.saveBtn} contentStyle={styles.saveBtnContent}>
        {t('save', { ns: 'common' })}
      </Button>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  input: { marginBottom: 12 },
  severityContainer: { marginBottom: 16 },
  severityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  slider: { height: 40 },
  saveBtn: { marginTop: 16, borderRadius: 12 },
  saveBtnContent: { height: 48 },
});
