import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, FAB, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getSessionsByClient } from '../../services/database/sessionService';
import { getClientById } from '../../services/database/clientService';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';
import { getStatusColor } from '../../utils/colorUtils';
import type { Session, SessionStatus } from '../../types/session';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Surface, TouchableRipple } from 'react-native-paper';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'ClientSessions'>;
  route: RouteProp<ClientStackParamList, 'ClientSessions'>;
};

export default function ClientSessionsScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const theme = useTheme();
  const { t, i18n } = useTranslation('sessions');
  const { db, isReady } = useDatabase();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState<SessionStatus | undefined>(undefined);

  const loadSessions = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getSessionsByClient(db, clientId, filter);
    setSessions(data);
  }, [db, isReady, clientId, filter]);

  useFocusEffect(useCallback(() => { loadSessions(); }, [loadSessions]));

  React.useEffect(() => {
    if (!db || !isReady) return;
    getClientById(db, clientId).then((client) => {
      if (client) {
        navigation.setOptions({ title: `${client.firstName} ${client.lastName}` });
      }
    });
  }, [db, isReady, clientId, navigation]);

  const renderSession = ({ item }: { item: Session }) => (
    <TouchableRipple onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}>
      <Surface style={[styles.sessionCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <View style={[styles.statusBar, { backgroundColor: getStatusColor(item.status) }]} />
        <View style={styles.sessionContent}>
          <View style={styles.sessionHeader}>
            <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
              {t('sessionNumber')}: {item.sessionNumber}
            </Text>
            <Chip compact textStyle={{ fontSize: 10, color: '#fff' }} style={{ backgroundColor: getStatusColor(item.status) }}>
              {t(`statuses.${item.status}`)}
            </Chip>
          </View>
          <View style={styles.sessionDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar" size={14} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                {formatDate(item.sessionDate, i18n.language)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                {formatTime(item.startTime)} - {formatTime(item.endTime)}
              </Text>
            </View>
          </View>
          <View style={styles.sessionFooter}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t(`types.${item.sessionType}`)}
            </Text>
            <Text variant="bodySmall" style={{ color: item.isPaid ? theme.colors.secondary : theme.colors.error }}>
              {formatCurrency(item.fee)} {item.isPaid ? `(${t('paid')})` : `(${t('unpaid')})`}
            </Text>
          </View>
        </View>
      </Surface>
    </TouchableRipple>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filters}>
        <Chip
          selected={!filter}
          onPress={() => setFilter(undefined)}
          style={styles.filterChip}
          compact
        >
          {t('all', { ns: 'common' })}
        </Chip>
        {(['planned', 'completed', 'cancelled'] as SessionStatus[]).map((s) => (
          <Chip
            key={s}
            selected={filter === s}
            onPress={() => setFilter(filter === s ? undefined : s)}
            style={styles.filterChip}
            compact
          >
            {t(`statuses.${s}`)}
          </Chip>
        ))}
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        ListEmptyComponent={<EmptyState icon="calendar-blank" title={t('noSessions')} />}
        contentContainerStyle={sessions.length === 0 ? styles.empty : styles.list}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => {
          (navigation as any).navigate('AddSession' in route.params ? 'AddSession' : 'CalendarTab', {
            screen: 'AddSession',
            params: { clientId },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filters: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  filterChip: { marginRight: 4 },
  list: { paddingVertical: 4 },
  empty: { flex: 1 },
  sessionCard: { flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, borderRadius: 12, overflow: 'hidden' },
  statusBar: { width: 4 },
  sessionContent: { flex: 1, padding: 12 },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionDetails: { flexDirection: 'row', gap: 16, marginTop: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  sessionFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
});
