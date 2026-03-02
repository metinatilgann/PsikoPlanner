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

export default function HealthSummaryStep({ formData, setField, errors }: StepProps) {
  const { t } = useTranslation('clients');
  const theme = useTheme<MD3Theme>();

  return (
    <WizardStepWrapper>
      <FormSection icon="hospital-box" title={t('health.sectionTitle')} />

      <View style={styles.switchRow}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {t('health.hasChronicIllness')}
        </Text>
        <Switch
          value={!!formData.hasChronicIllness}
          onValueChange={(v) => setField('hasChronicIllness', v)}
          color={theme.colors.primary}
        />
      </View>

      <ConditionalField visible={!!formData.hasChronicIllness}>
        <TextInput
          label={t('health.chronicIllnessSummary')}
          value={formData.chronicIllnessSummary ?? ''}
          onChangeText={(v) => setField('chronicIllnessSummary', v)}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
        />
      </ConditionalField>

      <TextInput
        label={t('health.currentMedications')}
        value={formData.currentMedications ?? ''}
        onChangeText={(v) => setField('currentMedications', v)}
        mode="outlined"
        multiline
        numberOfLines={2}
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {t('health.hasAllergies')}
        </Text>
        <Switch
          value={!!formData.hasAllergies}
          onValueChange={(v) => setField('hasAllergies', v)}
          color={theme.colors.primary}
        />
      </View>

      <ConditionalField visible={!!formData.hasAllergies}>
        <TextInput
          label={t('health.allergySummary')}
          value={formData.allergySummary ?? ''}
          onChangeText={(v) => setField('allergySummary', v)}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
        />
      </ConditionalField>
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
