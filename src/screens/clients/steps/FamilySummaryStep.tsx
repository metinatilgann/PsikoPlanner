import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Switch, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { MD3Theme } from 'react-native-paper';
import type { ClientFormData } from '../../../types/client';
import { MARITAL_STATUSES } from '../../../config/constants';
import WizardStepWrapper from '../../../components/wizard/WizardStepWrapper';
import FormSection from '../../../components/wizard/FormSection';
import DropdownSelect from '../../../components/wizard/DropdownSelect';

interface StepProps {
  formData: Partial<ClientFormData>;
  setField: (key: string, value: any) => void;
  errors: Record<string, string>;
}

export default function FamilySummaryStep({ formData, setField, errors }: StepProps) {
  const { t } = useTranslation('clients');
  const theme = useTheme<MD3Theme>();

  const parentMaritalOptions = MARITAL_STATUSES.map((s) => ({
    value: s,
    label: t(`maritalStatuses.${s}`),
  }));

  return (
    <WizardStepWrapper>
      <FormSection icon="account-group" title={t('family.sectionTitle')} />

      <TextInput
        label={t('family.numberOfSiblings')}
        value={formData.numberOfSiblings != null ? String(formData.numberOfSiblings) : ''}
        onChangeText={(v) => setField('numberOfSiblings', v ? Number(v) : undefined)}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label={t('family.birthOrder')}
        value={formData.birthOrder != null ? String(formData.birthOrder) : ''}
        onChangeText={(v) => setField('birthOrder', v ? Number(v) : undefined)}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {t('family.motherAlive')}
        </Text>
        <Switch
          value={!!formData.motherAlive}
          onValueChange={(v) => setField('motherAlive', v)}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.switchRow}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {t('family.fatherAlive')}
        </Text>
        <Switch
          value={!!formData.fatherAlive}
          onValueChange={(v) => setField('fatherAlive', v)}
          color={theme.colors.primary}
        />
      </View>

      <DropdownSelect
        label={t('family.parentMaritalStatus')}
        value={formData.parentMaritalStatus ?? ''}
        options={parentMaritalOptions}
        onSelect={(v) => setField('parentMaritalStatus', v)}
      />

      <TextInput
        label={t('family.familyPsychiatricNote')}
        value={formData.familyPsychiatricNote ?? ''}
        onChangeText={(v) => setField('familyPsychiatricNote', v)}
        mode="outlined"
        multiline
        numberOfLines={3}
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
