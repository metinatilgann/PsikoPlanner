import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface, SegmentedButtons } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getEvaluationBySession, upsertEvaluation } from '../../services/database/evaluationService';
import { RISK_LEVELS } from '../../config/constants';
import type { RiskLevel } from '../../types/session';
import Slider from '@react-native-community/slider';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'SessionEvaluation'>;
  route: RouteProp<ClientStackParamList, 'SessionEvaluation'>;
};

function RatingSlider({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  const theme = useTheme();
  return (
    <View style={sliderStyles.container}>
      <View style={sliderStyles.header}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{label}</Text>
        <Text variant="titleMedium" style={{ color, fontWeight: '700' }}>{value}/10</Text>
      </View>
      <Slider
        value={value}
        onValueChange={onChange}
        minimumValue={0}
        maximumValue={10}
        step={1}
        minimumTrackTintColor={color}
        maximumTrackTintColor={theme.colors.outlineVariant}
        thumbTintColor={color}
        style={sliderStyles.slider}
      />
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  slider: { height: 40 },
});

export default function SessionEvaluationScreen({ navigation, route }: Props) {
  const { sessionId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('sessions');
  const { db, isReady } = useDatabase();

  const [clientMood, setClientMood] = useState(5);
  const [clientEngagement, setClientEngagement] = useState(5);
  const [therapeuticAlliance, setTherapeuticAlliance] = useState(5);
  const [progressRating, setProgressRating] = useState(5);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('none');
  const [techniquesUsed, setTechniquesUsed] = useState('');
  const [homeworkAssigned, setHomeworkAssigned] = useState('');
  const [nextSessionFocus, setNextSessionFocus] = useState('');
  const [therapistObservations, setTherapistObservations] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadEvaluation = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getEvaluationBySession(db, sessionId);
    if (data) {
      setClientMood(data.clientMood ?? 5);
      setClientEngagement(data.clientEngagement ?? 5);
      setTherapeuticAlliance(data.therapeuticAlliance ?? 5);
      setProgressRating(data.progressRating ?? 5);
      setRiskLevel(data.riskLevel ?? 'none');
      setTechniquesUsed(data.techniquesUsed?.join(', ') || '');
      setHomeworkAssigned(data.homeworkAssigned || '');
      setNextSessionFocus(data.nextSessionFocus || '');
      setTherapistObservations(data.therapistObservations || '');
    }
  }, [db, isReady, sessionId]);

  useFocusEffect(useCallback(() => { loadEvaluation(); }, [loadEvaluation]));

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    try {
      await upsertEvaluation(db, sessionId, {
        clientMood,
        clientEngagement,
        therapeuticAlliance,
        progressRating,
        riskLevel,
        techniquesUsed: techniquesUsed.split(',').map((s) => s.trim()).filter(Boolean),
        homeworkAssigned: homeworkAssigned.trim() || undefined,
        nextSessionFocus: nextSessionFocus.trim() || undefined,
        therapistObservations: therapistObservations.trim() || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save evaluation error:', err);
    }
    setSaving(false);
  };

  const riskButtons = RISK_LEVELS.map((r) => ({
    value: r,
    label: t(`riskLevels.${r}`),
    style: styles.riskBtn,
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
          {t('evaluation')}
        </Text>

        <RatingSlider label={t('evaluationFields.clientMood')} value={clientMood} onChange={setClientMood} color={theme.colors.primary} />
        <RatingSlider label={t('evaluationFields.clientEngagement')} value={clientEngagement} onChange={setClientEngagement} color={theme.colors.secondary} />
        <RatingSlider label={t('evaluationFields.therapeuticAlliance')} value={therapeuticAlliance} onChange={setTherapeuticAlliance} color={theme.colors.tertiary} />
        <RatingSlider label={t('evaluationFields.progressRating')} value={progressRating} onChange={setProgressRating} color="#D97706" />
      </Surface>

      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
          {t('evaluationFields.riskLevel')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SegmentedButtons
            value={riskLevel}
            onValueChange={(v) => setRiskLevel(v as RiskLevel)}
            buttons={riskButtons}
            density="small"
          />
        </ScrollView>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <TextInput
          mode="outlined"
          label={t('evaluationFields.techniquesUsed')}
          value={techniquesUsed}
          onChangeText={setTechniquesUsed}
          placeholder="CBT, EMDR, ..."
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label={t('evaluationFields.homeworkAssigned')}
          value={homeworkAssigned}
          onChangeText={setHomeworkAssigned}
          multiline
          numberOfLines={2}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label={t('evaluationFields.nextSessionFocus')}
          value={nextSessionFocus}
          onChangeText={setNextSessionFocus}
          multiline
          numberOfLines={2}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label={t('evaluationFields.therapistObservations')}
          value={therapistObservations}
          onChangeText={setTherapistObservations}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
      </Surface>

      {saved && (
        <Text variant="bodySmall" style={{ color: theme.colors.secondary, textAlign: 'center', marginTop: 8 }}>
          {t('success', { ns: 'common' })}
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        style={styles.saveBtn}
        contentStyle={styles.saveBtnContent}
      >
        {t('save', { ns: 'common' })}
      </Button>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 16 },
  card: { marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 16 },
  cardTitle: { fontWeight: '600', marginBottom: 12 },
  input: { marginBottom: 8 },
  riskBtn: { minWidth: 56 },
  saveBtn: { marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  saveBtnContent: { height: 48 },
});
