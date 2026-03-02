import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, useTheme, FAB, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getAllClients, searchClients } from '../../services/database/clientService';
import ClientCard from '../../components/clients/ClientCard';
import EmptyState from '../../components/common/EmptyState';
import type { ClientWithStats } from '../../types/client';

export default function ClientListScreen() {
  const theme = useTheme();
  const { t } = useTranslation('clients');
  const { db, isReady } = useDatabase();
  const navigation = useNavigation<StackNavigationProp<ClientStackParamList>>();

  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadClients = useCallback(async () => {
    if (!db || !isReady) return;
    try {
      const data = searchQuery.trim()
        ? await searchClients(db, searchQuery.trim())
        : await getAllClients(db, 'active');
      setClients(data);
    } catch (err) {
      console.error('Client list load error:', err);
    }
  }, [db, isReady, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadClients();
    }, [loadClients])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClients();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('title')}
        </Text>
        <IconButton
          icon="archive"
          onPress={() => navigation.navigate('ArchivedClients')}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </View>

      <Searchbar
        placeholder={t('searchClients')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.search, { backgroundColor: theme.colors.surfaceVariant }]}
        inputStyle={{ fontSize: 14 }}
        elevation={0}
      />

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="account-group"
            title={t('noClients')}
            actionLabel={t('addClient')}
            onAction={() => navigation.navigate('AddEditClient', {})}
          />
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={clients.length === 0 ? styles.empty : styles.list}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('AddEditClient', {})}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingTop: 12,
  },
  title: { fontWeight: '700' },
  search: { marginHorizontal: 16, marginVertical: 8, borderRadius: 12 },
  list: { paddingVertical: 4 },
  empty: { flex: 1 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
});
