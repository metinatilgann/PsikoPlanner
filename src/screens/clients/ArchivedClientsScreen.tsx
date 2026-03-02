import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, Surface, TouchableRipple, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getAllClients, unarchiveClient } from '../../services/database/clientService';
import ClientAvatar from '../../components/clients/ClientAvatar';
import EmptyState from '../../components/common/EmptyState';
import type { ClientWithStats } from '../../types/client';

type Props = { navigation: StackNavigationProp<ClientStackParamList, 'ArchivedClients'> };

export default function ArchivedClientsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { t } = useTranslation('clients');
  const { db, isReady } = useDatabase();
  const [clients, setClients] = useState<ClientWithStats[]>([]);

  const loadClients = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getAllClients(db, 'archived');
    setClients(data);
  }, [db, isReady]);

  useFocusEffect(useCallback(() => { loadClients(); }, [loadClients]));

  const handleUnarchive = async (id: string) => {
    if (!db) return;
    await unarchiveClient(db, id);
    loadClients();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <ClientAvatar firstName={item.firstName} lastName={item.lastName} size={44} />
            <View style={styles.info}>
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
                {item.firstName} {item.lastName}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {t('totalSessions')}: {item.totalSessions}
              </Text>
            </View>
            <IconButton
              icon="archive-arrow-up"
              iconColor={theme.colors.primary}
              onPress={() => handleUnarchive(item.id)}
            />
          </Surface>
        )}
        ListEmptyComponent={<EmptyState icon="archive" title={t('noArchivedClients')} />}
        contentContainerStyle={clients.length === 0 ? styles.empty : styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingVertical: 8 },
  empty: { flex: 1 },
  card: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 4, padding: 12, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12 },
});
