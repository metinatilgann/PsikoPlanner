import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getSetting, setSetting } from '../../services/database/settingsService';
import { THERAPIST_PROFILE_KEY } from '../../config/constants';
import type { TherapistProfile } from '../../types/settings';

export default function ProfileScreen() {
  const theme = useTheme();
  const { t } = useTranslation('settings');
  const { db, isReady } = useDatabase();

  const [name, setName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!db || !isReady) return;
    getSetting(db, THERAPIST_PROFILE_KEY).then((val) => {
      if (val) {
        try {
          const profile: TherapistProfile = JSON.parse(val);
          setName(profile.name || '');
          setProfessionalTitle(profile.title || '');
          setLicenseNumber(profile.licenseNumber || '');
          setClinicName(profile.clinicName || '');
          setClinicAddress(profile.clinicAddress || '');
          setClinicPhone(profile.clinicPhone || '');
          setEmail(profile.email || '');
        } catch {}
      }
    });
  }, [db, isReady]);

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    const profile: TherapistProfile = {
      name: name.trim(),
      title: professionalTitle.trim(),
      licenseNumber: licenseNumber.trim() || undefined,
      clinicName: clinicName.trim() || undefined,
      clinicAddress: clinicAddress.trim() || undefined,
      clinicPhone: clinicPhone.trim() || undefined,
      email: email.trim() || undefined,
    };
    await setSetting(db, THERAPIST_PROFILE_KEY, JSON.stringify(profile));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="titleMedium" style={[styles.section, { color: theme.colors.primary }]}>
        {t('therapistProfile')}
      </Text>

      <TextInput mode="outlined" label={t('name')} value={name} onChangeText={setName} left={<TextInput.Icon icon="account" />} style={styles.input} />
      <TextInput mode="outlined" label={t('professionalTitle')} value={professionalTitle} onChangeText={setProfessionalTitle} left={<TextInput.Icon icon="school" />} style={styles.input} />
      <TextInput mode="outlined" label={t('licenseNumber')} value={licenseNumber} onChangeText={setLicenseNumber} left={<TextInput.Icon icon="card-account-details" />} style={styles.input} />

      <Text variant="titleMedium" style={[styles.section, { color: theme.colors.primary }]}>
        {t('clinicName')}
      </Text>

      <TextInput mode="outlined" label={t('clinicName')} value={clinicName} onChangeText={setClinicName} left={<TextInput.Icon icon="hospital-building" />} style={styles.input} />
      <TextInput mode="outlined" label={t('clinicAddress')} value={clinicAddress} onChangeText={setClinicAddress} left={<TextInput.Icon icon="map-marker" />} multiline style={styles.input} />
      <TextInput mode="outlined" label={t('clinicPhone')} value={clinicPhone} onChangeText={setClinicPhone} keyboardType="phone-pad" left={<TextInput.Icon icon="phone" />} style={styles.input} />
      <TextInput mode="outlined" label="E-posta" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" left={<TextInput.Icon icon="email" />} style={styles.input} />

      {saved && (
        <Text variant="bodySmall" style={{ color: theme.colors.secondary, textAlign: 'center', marginTop: 8 }}>
          {t('success', { ns: 'common' })}
        </Text>
      )}

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
  input: { marginBottom: 8 },
  saveBtn: { marginTop: 24, borderRadius: 12 },
  saveBtnContent: { height: 48 },
});
