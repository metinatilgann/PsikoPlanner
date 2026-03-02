import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getPsychologicalHistory, upsertPsychologicalHistory } from '../../services/database/anamnesisService';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'PsychologicalHistory'>;
  route: RouteProp<ClientStackParamList, 'PsychologicalHistory'>;
};

export default function PsychologicalHistoryScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('anamnesis');
  const { db, isReady } = useDatabase();

  const [previousDiagnoses, setPreviousDiagnoses] = useState('');
  const [previousTreatments, setPreviousTreatments] = useState('');
  const [previousHospitalizations, setPreviousHospitalizations] = useState('');
  const [suicideSelfHarmHistory, setSuicideSelfHarmHistory] = useState('');
  const [traumaHistory, setTraumaHistory] = useState('');
  const [copingMechanisms, setCopingMechanisms] = useState('');
  const [strengths, setStrengths] = useState('');
  const [socialSupport, setSocialSupport] = useState('');
  const [educationalHistory, setEducationalHistory] = useState('');
  const [occupationalHistory, setOccupationalHistory] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getPsychologicalHistory(db, clientId);
    if (data) {
      setPreviousDiagnoses(data.previousDiagnoses || '');
      setPreviousTreatments(data.previousTreatments || '');
      setPreviousHospitalizations(data.previousHospitalizations || '');
      setSuicideSelfHarmHistory(data.suicideSelfHarmHistory || '');
      setTraumaHistory(data.traumaHistory || '');
      setCopingMechanisms(data.copingMechanisms || '');
      setStrengths(data.strengths || '');
      setSocialSupport(data.socialSupport || '');
      setEducationalHistory(data.educationalHistory || '');
      setOccupationalHistory(data.occupationalHistory || '');
    }
  }, [db, isReady, clientId]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    await upsertPsychologicalHistory(db, clientId, {
      previousDiagnoses: previousDiagnoses.trim() || undefined,
      previousTreatments: previousTreatments.trim() || undefined,
      previousHospitalizations: previousHospitalizations.trim() || undefined,
      suicideSelfHarmHistory: suicideSelfHarmHistory.trim() || undefined,
      traumaHistory: traumaHistory.trim() || undefined,
      copingMechanisms: copingMechanisms.trim() || undefined,
      strengths: strengths.trim() || undefined,
      socialSupport: socialSupport.trim() || undefined,
      educationalHistory: educationalHistory.trim() || undefined,
      occupationalHistory: occupationalHistory.trim() || undefined,
    });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput mode="outlined" label={t('psychological.previousDiagnoses')} value={previousDiagnoses} onChangeText={setPreviousDiagnoses} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.previousTreatments')} value={previousTreatments} onChangeText={setPreviousTreatments} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.previousHospitalizations')} value={previousHospitalizations} onChangeText={setPreviousHospitalizations} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.suicideSelfHarmHistory')} value={suicideSelfHarmHistory} onChangeText={setSuicideSelfHarmHistory} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.traumaHistory')} value={traumaHistory} onChangeText={setTraumaHistory} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.copingMechanisms')} value={copingMechanisms} onChangeText={setCopingMechanisms} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.strengths')} value={strengths} onChangeText={setStrengths} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.socialSupport')} value={socialSupport} onChangeText={setSocialSupport} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.educationalHistory')} value={educationalHistory} onChangeText={setEducationalHistory} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('psychological.occupationalHistory')} value={occupationalHistory} onChangeText={setOccupationalHistory} multiline numberOfLines={2} style={styles.input} />

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
  saveBtn: { marginTop: 16, borderRadius: 12 },
  saveBtnContent: { height: 48 },
});
