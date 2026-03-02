import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, Button, useTheme, Surface, FAB, Switch, Portal, Modal, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getMedicationsByClient, addMedication, updateMedication, deleteMedication } from '../../services/database/anamnesisService';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import type { Medication } from '../../types/anamnesis';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'Medications'>;
  route: RouteProp<ClientStackParamList, 'Medications'>;
};

export default function MedicationsScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('anamnesis');
  const { db, isReady } = useDatabase();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form fields
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [prescribingDoctor, setPrescribingDoctor] = useState('');
  const [purpose, setPurpose] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadMedications = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getMedicationsByClient(db, clientId);
    setMedications(data);
  }, [db, isReady, clientId]);

  useFocusEffect(useCallback(() => { loadMedications(); }, [loadMedications]));

  const resetForm = () => {
    setMedName(''); setDosage(''); setFrequency('');
    setPrescribingDoctor(''); setPurpose(''); setSideEffects('');
    setIsActive(true); setSelectedId(null);
  };

  const openAdd = () => { resetForm(); setModalVisible(true); };

  const openEdit = (med: Medication) => {
    setSelectedId(med.id);
    setMedName(med.medicationName);
    setDosage(med.dosage || '');
    setFrequency(med.frequency || '');
    setPrescribingDoctor(med.prescribingDoctor || '');
    setPurpose(med.purpose || '');
    setSideEffects(med.sideEffects || '');
    setIsActive(med.isActive);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!db || !medName.trim()) return;
    setSaving(true);
    const data = {
      medicationName: medName.trim(),
      dosage: dosage.trim() || undefined,
      frequency: frequency.trim() || undefined,
      prescribingDoctor: prescribingDoctor.trim() || undefined,
      purpose: purpose.trim() || undefined,
      sideEffects: sideEffects.trim() || undefined,
      isActive,
    };
    if (selectedId) {
      await updateMedication(db, selectedId, data);
    } else {
      await addMedication(db, clientId, data);
    }
    setSaving(false);
    setModalVisible(false);
    loadMedications();
  };

  const handleDelete = async () => {
    if (!db || !selectedId) return;
    await deleteMedication(db, selectedId);
    setDeleteDialogVisible(false);
    setSelectedId(null);
    loadMedications();
  };

  const renderMedication = ({ item }: { item: Medication }) => (
    <Surface style={[styles.medCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
      <View style={styles.medHeader}>
        <View style={styles.medInfo}>
          <MaterialCommunityIcons
            name="pill"
            size={20}
            color={item.isActive ? theme.colors.primary : theme.colors.outline}
          />
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginLeft: 8 }}>
            {item.medicationName}
          </Text>
        </View>
        <View style={styles.medActions}>
          <IconButton icon="pencil" size={18} onPress={() => openEdit(item)} />
          <IconButton icon="delete" size={18} iconColor={theme.colors.error} onPress={() => { setSelectedId(item.id); setDeleteDialogVisible(true); }} />
        </View>
      </View>
      {item.dosage && (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('medication.dosage')}: {item.dosage} {item.frequency ? `- ${item.frequency}` : ''}
        </Text>
      )}
      {item.purpose && (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {t('medication.purpose')}: {item.purpose}
        </Text>
      )}
      <Text variant="bodySmall" style={{ color: item.isActive ? theme.colors.secondary : theme.colors.outline, marginTop: 4 }}>
        {item.isActive ? t('medication.active') : t('medication.inactive')}
      </Text>
    </Surface>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={renderMedication}
        ListEmptyComponent={<EmptyState icon="pill" title={t('medication.noMedications')} actionLabel={t('medication.addMedication')} onAction={openAdd} />}
        contentContainerStyle={medications.length === 0 ? styles.empty : styles.list}
      />

      <FAB icon="plus" style={[styles.fab, { backgroundColor: theme.colors.primary }]} color={theme.colors.onPrimary} onPress={openAdd} />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text variant="titleLarge" style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
              {selectedId ? t('medication.editMedication') : t('medication.addMedication')}
            </Text>
            <TextInput mode="outlined" label={`${t('medication.name')} *`} value={medName} onChangeText={setMedName} style={styles.input} />
            <TextInput mode="outlined" label={t('medication.dosage')} value={dosage} onChangeText={setDosage} style={styles.input} />
            <TextInput mode="outlined" label={t('medication.frequency')} value={frequency} onChangeText={setFrequency} style={styles.input} />
            <TextInput mode="outlined" label={t('medication.prescribingDoctor')} value={prescribingDoctor} onChangeText={setPrescribingDoctor} style={styles.input} />
            <TextInput mode="outlined" label={t('medication.purpose')} value={purpose} onChangeText={setPurpose} style={styles.input} />
            <TextInput mode="outlined" label={t('medication.sideEffects')} value={sideEffects} onChangeText={setSideEffects} multiline style={styles.input} />
            <View style={styles.switchRow}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>{t('medication.active')}</Text>
              <Switch value={isActive} onValueChange={setIsActive} color={theme.colors.primary} />
            </View>
            <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving || !medName.trim()} style={styles.saveBtn} contentStyle={styles.saveBtnContent}>
              {t('save', { ns: 'common' })}
            </Button>
          </ScrollView>
        </Modal>
      </Portal>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title={t('delete', { ns: 'common' })}
        message={t('deleteConfirm', { ns: 'common' })}
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingVertical: 8 },
  empty: { flex: 1 },
  medCard: { marginHorizontal: 16, marginVertical: 4, borderRadius: 12, padding: 12 },
  medHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  medActions: { flexDirection: 'row' },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
  modal: { margin: 20, padding: 20, borderRadius: 16, maxHeight: '80%' },
  modalTitle: { fontWeight: '600', marginBottom: 16 },
  input: { marginBottom: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  saveBtn: { marginTop: 16, borderRadius: 12 },
  saveBtnContent: { height: 48 },
});
