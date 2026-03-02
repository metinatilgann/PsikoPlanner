import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getMedicalHistory, upsertMedicalHistory } from '../../services/database/anamnesisService';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'MedicalHistory'>;
  route: RouteProp<ClientStackParamList, 'MedicalHistory'>;
};

export default function MedicalHistoryScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('anamnesis');
  const { db, isReady } = useDatabase();

  const [chronicConditions, setChronicConditions] = useState('');
  const [pastSurgeries, setPastSurgeries] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentPhysicalComplaints, setCurrentPhysicalComplaints] = useState('');
  const [sleepPatterns, setSleepPatterns] = useState('');
  const [appetiteChanges, setAppetiteChanges] = useState('');
  const [alcohol, setAlcohol] = useState('');
  const [tobacco, setTobacco] = useState('');
  const [drugs, setDrugs] = useState('');
  const [substanceDetails, setSubstanceDetails] = useState('');
  const [headInjuries, setHeadInjuries] = useState('');
  const [neurologicalHistory, setNeurologicalHistory] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getMedicalHistory(db, clientId);
    if (data) {
      setChronicConditions(data.chronicConditions || '');
      setPastSurgeries(data.pastSurgeries || '');
      setAllergies(data.allergies || '');
      setCurrentPhysicalComplaints(data.currentPhysicalComplaints || '');
      setSleepPatterns(data.sleepPatterns || '');
      setAppetiteChanges(data.appetiteChanges || '');
      setAlcohol(data.substanceUse?.alcohol || '');
      setTobacco(data.substanceUse?.tobacco || '');
      setDrugs(data.substanceUse?.drugs || '');
      setSubstanceDetails(data.substanceUse?.details || '');
      setHeadInjuries(data.headInjuries || '');
      setNeurologicalHistory(data.neurologicalHistory || '');
    }
  }, [db, isReady, clientId]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    await upsertMedicalHistory(db, clientId, {
      chronicConditions: chronicConditions.trim() || undefined,
      pastSurgeries: pastSurgeries.trim() || undefined,
      allergies: allergies.trim() || undefined,
      currentPhysicalComplaints: currentPhysicalComplaints.trim() || undefined,
      sleepPatterns: sleepPatterns.trim() || undefined,
      appetiteChanges: appetiteChanges.trim() || undefined,
      substanceUse: { alcohol, tobacco, drugs, details: substanceDetails },
      headInjuries: headInjuries.trim() || undefined,
      neurologicalHistory: neurologicalHistory.trim() || undefined,
    });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput mode="outlined" label={t('medical.chronicConditions')} value={chronicConditions} onChangeText={setChronicConditions} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.pastSurgeries')} value={pastSurgeries} onChangeText={setPastSurgeries} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.allergies')} value={allergies} onChangeText={setAllergies} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.currentPhysicalComplaints')} value={currentPhysicalComplaints} onChangeText={setCurrentPhysicalComplaints} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.sleepPatterns')} value={sleepPatterns} onChangeText={setSleepPatterns} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.appetiteChanges')} value={appetiteChanges} onChangeText={setAppetiteChanges} multiline numberOfLines={2} style={styles.input} />

      <Text variant="titleMedium" style={[styles.section, { color: theme.colors.primary }]}>
        {t('medical.substanceUse')}
      </Text>
      <TextInput mode="outlined" label={t('medical.alcohol')} value={alcohol} onChangeText={setAlcohol} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.tobacco')} value={tobacco} onChangeText={setTobacco} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.drugs')} value={drugs} onChangeText={setDrugs} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.details')} value={substanceDetails} onChangeText={setSubstanceDetails} multiline numberOfLines={2} style={styles.input} />

      <TextInput mode="outlined" label={t('medical.headInjuries')} value={headInjuries} onChangeText={setHeadInjuries} multiline numberOfLines={2} style={styles.input} />
      <TextInput mode="outlined" label={t('medical.neurologicalHistory')} value={neurologicalHistory} onChangeText={setNeurologicalHistory} multiline numberOfLines={2} style={styles.input} />

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
  section: { fontWeight: '600', marginTop: 16, marginBottom: 12 },
  input: { marginBottom: 12 },
  saveBtn: { marginTop: 16, borderRadius: 12 },
  saveBtnContent: { height: 48 },
});
