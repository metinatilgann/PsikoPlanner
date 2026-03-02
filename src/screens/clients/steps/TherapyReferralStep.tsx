import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Switch, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { MD3Theme } from 'react-native-paper';
import type { ClientFormData } from '../../../types/client';
import WizardStepWrapper from '../../../components/wizard/WizardStepWrapper';
import FormSection from '../../../components/wizard/FormSection';
import ConditionalField from '../../../components/wizard/ConditionalField';

interface StepProps {
  formData: Partial<ClientFormData>;
  setField: (key: string, value: any) => void;
  errors: Record<string, string>;
}

export default function TherapyReferralStep({ formData, setField, errors }: StepProps) {
  const { t } = useTranslation('clients');
  const theme = useTheme<MD3Theme>();

  return (
    <WizardStepWrapper>
      <FormSection icon="clipboard-text-outline" title={t('therapy.sectionTitle')} />

      <View style={styles.switchRow}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {t('therapy.hasPreviousTherapy')}
        </Text>
        <Switch
          value={!!formData.hasPreviousTherapy}
          onValueChange={(v) => setField('hasPreviousTherapy', v)}
          color={theme.colors.primary}
        />
      </View>

      <ConditionalField visible={!!formData.hasPreviousTherapy}>
        <TextInput
          label={t('therapy.previousTherapySummary')}
          value={formData.previousTherapySummary ?? ''}
          onChangeText={(v) => setField('previousTherapySummary', v)}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
        />
      </ConditionalField>

      <View style={styles.switchRow}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {t('therapy.hasPsychiatricMedication')}
        </Text>
        <Switch
          value={!!formData.hasPsychiatricMedication}
          onValueChange={(v) => setField('hasPsychiatricMedication', v)}
          color={theme.colors.primary}
        />
      </View>

      <ConditionalField visible={!!formData.hasPsychiatricMedication}>
        <TextInput
          label={t('therapy.psychiatricMedicationNote')}
          value={formData.psychiatricMedicationNote ?? ''}
          onChangeText={(v) => setField('psychiatricMedicationNote', v)}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
        />
      </ConditionalField>

      <TextInput
        label={t('therapy.therapyExpectations')}
        value={formData.therapyExpectations ?? ''}
        onChangeText={(v) => setField('therapyExpectations', v)}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <TextInput
        label={t('referralSource')}
        value={formData.referralSource ?? ''}
        onChangeText={(v) => setField('referralSource', v)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('referralDetail')}
        value={formData.referralDetail ?? ''}
        onChangeText={(v) => setField('referralDetail', v)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('insuranceInfo')}
        value={formData.insuranceInfo ?? ''}
        onChangeText={(v) => setField('insuranceInfo', v)}
        mode="outlined"
        style={styles.input}
      />

      {/* Emergency Contact Section */}
      <FormSection icon="phone-alert" title={t('emergencyContact')} />

      <TextInput
        label={t('emergencyContactName')}
        value={formData.emergencyContactName ?? ''}
        onChangeText={(v) => setField('emergencyContactName', v)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('emergencyContactPhone')}
        value={formData.emergencyContactPhone ?? ''}
        onChangeText={(v) => setField('emergencyContactPhone', v)}
        mode="outlined"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        label={t('emergencyContactRelation')}
        value={formData.emergencyContactRelation ?? ''}
        onChangeText={(v) => setField('emergencyContactRelation', v)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('notes')}
        value={formData.notes ?? ''}
        onChangeText={(v) => setField('notes', v)}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
    </WizardStepWrapper>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
});
