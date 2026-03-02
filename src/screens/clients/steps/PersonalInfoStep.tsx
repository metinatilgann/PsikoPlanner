import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, HelperText, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { MD3Theme } from 'react-native-paper';
import type { ClientFormData } from '../../../types/client';
import { GENDERS } from '../../../config/constants';
import WizardStepWrapper from '../../../components/wizard/WizardStepWrapper';

interface StepProps {
  formData: Partial<ClientFormData>;
  setField: (key: string, value: any) => void;
  errors: Record<string, string>;
}

export default function PersonalInfoStep({ formData, setField, errors }: StepProps) {
  const { t } = useTranslation('clients');
  const theme = useTheme<MD3Theme>();

  const genderButtons = GENDERS.map((g) => ({
    value: g,
    label: t(`genders.${g}`),
  }));

  return (
    <WizardStepWrapper>
      <TextInput
        label={t('firstName')}
        value={formData.firstName ?? ''}
        onChangeText={(v) => setField('firstName', v)}
        mode="outlined"
        error={!!errors.firstName}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.firstName}>
        {errors.firstName}
      </HelperText>

      <TextInput
        label={t('lastName')}
        value={formData.lastName ?? ''}
        onChangeText={(v) => setField('lastName', v)}
        mode="outlined"
        error={!!errors.lastName}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.lastName}>
        {errors.lastName}
      </HelperText>

      <TextInput
        label={t('phone')}
        value={formData.phone ?? ''}
        onChangeText={(v) => setField('phone', v)}
        mode="outlined"
        keyboardType="phone-pad"
        left={<TextInput.Icon icon="phone" />}
        style={styles.input}
      />

      <TextInput
        label={t('email')}
        value={formData.email ?? ''}
        onChangeText={(v) => setField('email', v)}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email-outline" />}
        style={styles.input}
      />

      <TextInput
        label={t('dateOfBirth')}
        value={formData.dateOfBirth ?? ''}
        onChangeText={(v) => setField('dateOfBirth', v)}
        mode="outlined"
        placeholder="YYYY-MM-DD"
        left={<TextInput.Icon icon="calendar" />}
        style={styles.input}
      />

      <Text
        variant="bodyMedium"
        style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
      >
        {t('gender')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <SegmentedButtons
          value={formData.gender ?? ''}
          onValueChange={(v) => setField('gender', v)}
          buttons={genderButtons}
          style={styles.segmented}
        />
      </ScrollView>

      <TextInput
        label={t('nationalId')}
        value={formData.nationalId ?? ''}
        onChangeText={(v) => setField('nationalId', v)}
        mode="outlined"
        left={<TextInput.Icon icon="card-account-details" />}
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
