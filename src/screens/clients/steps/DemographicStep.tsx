import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TextInput, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { MD3Theme } from 'react-native-paper';
import type { ClientFormData } from '../../../types/client';
import { MARITAL_STATUSES, EDUCATION_LEVELS, LIVING_WITH_OPTIONS } from '../../../config/constants';
import WizardStepWrapper from '../../../components/wizard/WizardStepWrapper';
import DropdownSelect from '../../../components/wizard/DropdownSelect';

interface StepProps {
  formData: Partial<ClientFormData>;
  setField: (key: string, value: any) => void;
  errors: Record<string, string>;
}

export default function DemographicStep({ formData, setField, errors }: StepProps) {
  const { t } = useTranslation('clients');
  const theme = useTheme<MD3Theme>();

  const maritalButtons = MARITAL_STATUSES.map((s) => ({
    value: s,
    label: t(`maritalStatuses.${s}`),
  }));

  const educationOptions = EDUCATION_LEVELS.map((level) => ({
    value: level,
    label: t(`educationLevels.${level}`),
  }));

  const livingWithOptions = LIVING_WITH_OPTIONS.map((opt) => ({
    value: opt,
    label: t(`livingWithOptions.${opt}`),
  }));

  return (
    <WizardStepWrapper>
      <TextInput
        label={t('nationality')}
        value={formData.nationality ?? ''}
        onChangeText={(v) => setField('nationality', v)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('occupation')}
        value={formData.occupation ?? ''}
        onChangeText={(v) => setField('occupation', v)}
        mode="outlined"
        left={<TextInput.Icon icon="briefcase" />}
        style={styles.input}
      />

      <Text
        variant="bodyMedium"
        style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('maritalStatus')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <SegmentedButtons
          value={formData.maritalStatus ?? ''}
          onValueChange={(v) => setField('maritalStatus', v)}
          buttons={maritalButtons}
          style={styles.segmented}
        />
      </ScrollView>

      <DropdownSelect
        label={t('educationLevel')}
        value={formData.educationLevel ?? ''}
        options={educationOptions}
        onSelect={(v) => setField('educationLevel', v)}
      />

      <TextInput
        label={t('numberOfChildren')}
        value={formData.numberOfChildren != null ? String(formData.numberOfChildren) : ''}
        onChangeText={(v) => setField('numberOfChildren', v ? Number(v) : undefined)}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label={t('address')}
        value={formData.address ?? ''}
        onChangeText={(v) => setField('address', v)}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <TextInput
        label={t('city')}
        value={formData.city ?? ''}
        onChangeText={(v) => setField('city', v)}
        mode="outlined"
        style={styles.input}
      />

      <DropdownSelect
        label={t('livingWith')}
        value={formData.livingWith ?? ''}
        options={livingWithOptions}
        onSelect={(v) => setField('livingWith', v)}
      />

      <TextInput
        label={t('sessionFee')}
        value={formData.sessionFee != null ? String(formData.sessionFee) : ''}
        onChangeText={(v) => setField('sessionFee', v ? Number(v) : undefined)}
        mode="outlined"
        keyboardType="numeric"
        left={<TextInput.Icon icon="currency-try" />}
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
  label: {
    marginBottom: 6,
    marginTop: 4,
  },
  segmented: {
    marginBottom: 12,
  },
});
