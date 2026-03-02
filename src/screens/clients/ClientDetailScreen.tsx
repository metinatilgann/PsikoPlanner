import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Button, Surface, Divider, IconButton, Menu } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getClientById, archiveClient, deleteClient } from '../../services/database/clientService';
import ClientAvatar from '../../components/clients/ClientAvatar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import type { Client } from '../../types/client';
import { formatDate } from '../../utils/dateUtils';
import { formatPhone, formatCurrency } from '../../utils/formatUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'ClientDetail'>;
  route: RouteProp<ClientStackParamList, 'ClientDetail'>;
};

export default function ClientDetailScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const theme = useTheme();
  const { t, i18n } = useTranslation('clients');
  const { db, isReady } = useDatabase();

  const [client, setClient] = useState<Client | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [archiveDialogVisible, setArchiveDialogVisible] = useState(false);

  const loadClient = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getClientById(db, clientId);
    setClient(data);
  }, [db, isReady, clientId]);

  useFocusEffect(useCallback(() => { loadClient(); }, [loadClient]));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
        >
          <Menu.Item
            onPress={() => { setMenuVisible(false); navigation.navigate('AddEditClient', { clientId }); }}
            title={t('editClient')}
            leadingIcon="pencil"
          />
          <Menu.Item
            onPress={() => { setMenuVisible(false); setArchiveDialogVisible(true); }}
            title={t('archive')}
            leadingIcon="archive"
          />
          <Divider />
          <Menu.Item
            onPress={() => { setMenuVisible(false); setDeleteDialogVisible(true); }}
            title={t('delete', { ns: 'common' })}
            leadingIcon="delete"
            titleStyle={{ color: theme.colors.error }}
          />
        </Menu>
      ),
    });
  }, [navigation, menuVisible, clientId, t, theme]);

  const handleArchive = async () => {
    if (!db) return;
    await archiveClient(db, clientId);
    navigation.goBack();
  };

  const handleDelete = async () => {
    if (!db) return;
    await deleteClient(db, clientId);
    navigation.goBack();
  };

  if (!client) return null;

  const InfoRow = ({ icon, label, value }: { icon: string; label: string; value?: string }) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name={icon} size={20} color={theme.colors.onSurfaceVariant} />
        <View style={styles.infoText}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{label}</Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.profileSection}>
        <ClientAvatar firstName={client.firstName} lastName={client.lastName} size={80} />
        <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onBackground }]}>
          {client.firstName} {client.lastName}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {formatCurrency(client.sessionFee)} / {t('sessionFee').toLowerCase()}
        </Text>
      </View>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="calendar-plus"
          onPress={() => navigation.navigate('ClientSessions', { clientId })}
          style={styles.actionBtn}
          compact
        >
          {t('sessions')}
        </Button>
        <Button
          mode="contained-tonal"
          icon="clipboard-text"
          onPress={() => navigation.navigate('AnamnesisOverview', { clientId })}
          style={styles.actionBtn}
          compact
        >
          {t('anamnesis')}
        </Button>
      </View>

      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
          {t('clientDetail')}
        </Text>
        <InfoRow icon="phone" label={t('phone')} value={client.phone ? formatPhone(client.phone) : undefined} />
        <InfoRow icon="email" label={t('email')} value={client.email} />
        <InfoRow icon="cake-variant" label={t('dateOfBirth')} value={client.dateOfBirth ? formatDate(client.dateOfBirth, i18n.language) : undefined} />
        <InfoRow icon="gender-male-female" label={t('gender')} value={client.gender ? t(`genders.${client.gender}`) : undefined} />
        <InfoRow icon="briefcase" label={t('occupation')} value={client.occupation} />
        <InfoRow icon="heart" label={t('maritalStatus')} value={client.maritalStatus ? t(`maritalStatuses.${client.maritalStatus}`) : undefined} />
        <InfoRow icon="account-arrow-right" label={t('referralSource')} value={client.referralSource} />
      </Surface>

      {(client.emergencyContactName || client.emergencyContactPhone) && (
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            {t('emergencyContact')}
          </Text>
          <InfoRow icon="account-alert" label={t('emergencyContactName')} value={client.emergencyContactName} />
          <InfoRow icon="phone-alert" label={t('emergencyContactPhone')} value={client.emergencyContactPhone ? formatPhone(client.emergencyContactPhone) : undefined} />
        </Surface>
      )}

      {client.notes && (
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            {t('notes')}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{client.notes}</Text>
        </Surface>
      )}

      <View style={{ height: 32 }} />

      <ConfirmDialog
        visible={deleteDialogVisible}
        title={t('delete', { ns: 'common' })}
        message={t('deleteClientConfirm')}
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />
      <ConfirmDialog
        visible={archiveDialogVisible}
        title={t('archive')}
        message={t('archiveConfirm')}
        onConfirm={handleArchive}
        onCancel={() => setArchiveDialogVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileSection: { alignItems: 'center', paddingVertical: 24 },
  name: { fontWeight: '700', marginTop: 12, marginBottom: 4 },
  actionButtons: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  actionBtn: { flex: 1, borderRadius: 12 },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 16 },
  cardTitle: { fontWeight: '600', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, gap: 12 },
  infoText: { flex: 1 },
});
