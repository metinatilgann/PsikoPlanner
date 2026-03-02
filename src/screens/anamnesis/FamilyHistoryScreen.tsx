import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getFamilyHistory, upsertFamilyHistory } from '../../services/database/anamnesisService';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'FamilyHistory'>;
  route: RouteProp<ClientStackParamList, 'FamilyHistory'>;
};

export default function FamilyHistoryScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('anamnesis');
  const { db, isReady } = useDatabase();

  const [motherInfo, setMotherInfo] = useState('');
  const [fatherInfo, setFatherInfo] = useState('');
  const [familyPsychiatricHistory, setFamilyPsychiatricHistory] = useState('');
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState('');
  const [familyDynamics, setFamilyDynamics] = useState('');
  const [childhoodEnvironment, setChildhoodEnvironment] = useState('');
  const [significantEvents, setSignificantEvents] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getFamilyHistory(db, clientId);
    if (data) {
      setMotherInfo(data.motherInfo || '');
      setFatherInfo(data.fatherInfo || '');
      setFamilyPsychiatricHistory(data.familyPsychiatricHistory || '');
      setFamilyMedicalHistory(data.familyMedicalHistory || '');
      setFamilyDynamics(data.familyDynamics || '');
      setChildhoodEnvironment(data.childhoodEnvironment || '');
      setSignificantEvents(data.significantEvents || '');
    }
  }, [db, isReady, clientId]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    await upsertFamilyHistory(db, clientId, {
      motherInfo: motherInfo.trim() || undefined,
      fatherInfo: fatherInfo.trim() || undefined,
      familyPsychiatricHistory: familyPsychiatricHistory.trim() || undefined,
      familyMedicalHistory: familyMedicalHistory.trim() || undefined,
      familyDynamics: familyDynamics.trim() || undefined,
      childhoodEnvironment: childhoodEnvironment.trim() || undefined,
      significantEvents: significantEvents.trim() || undefined,
    });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput mode="outlined" label={t('family.motherInfo')} value={motherInfo} onChangeText={setMotherInfo} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={t('family.fatherInfo')} value={fatherInfo} onChangeText={setFatherInfo} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={t('family.familyPsychiatricHistory')} value={familyPsychiatricHistory} onChangeText={setFamilyPsychiatricHistory} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={t('family.familyMedicalHistory')} value={familyMedicalHistory} onChangeText={setFamilyMedicalHistory} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={t('family.familyDynamics')} value={familyDynamics} onChangeText={setFamilyDynamics} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={t('family.childhoodEnvironment')} value={childhoodEnvironment} onChangeText={setChildhoodEnvironment} multiline numberOfLines={3} style={styles.input} />
      <TextInput mode="outlined" label={t('family.significantEvents')} value={significantEvents} onChangeText={setSignificantEvents} multiline numberOfLines={3} style={styles.input} />

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
