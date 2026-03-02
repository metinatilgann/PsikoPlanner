import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { CalendarStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getSessionsByDate } from '../../services/database/sessionService';
import SessionCard from '../../components/sessions/SessionCard';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/dateUtils';
import type { SessionWithClient } from '../../types/session';

type Props = {
  navigation: StackNavigationProp<CalendarStackParamList, 'DayDetail'>;
  route: RouteProp<CalendarStackParamList, 'DayDetail'>;
};

export default function DayDetailScreen({ navigation, route }: Props) {
  const { date } = route.params;
  const theme = useTheme();
  const { t, i18n } = useTranslation('sessions');
  const { db, isReady } = useDatabase();

  const [sessions, setSessions] = useState<SessionWithClient[]>([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: formatDate(date, i18n.language) });
  }, [navigation, date, i18n.language]);

  const loadSessions = useCallback(async () => {
    if (!db || !isReady) return;
    try {
      const data = await getSessionsByDate(db, date);
      setSessions(data);
    } catch (err) {
      console.error('Day detail load error:', err);
    }
  }, [db, isReady, date]);

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => {
              (navigation as any).navigate('ClientsTab', {
                screen: 'SessionDetail',
                params: { sessionId: item.id },
              });
            }}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-blank"
            title={t('noSessions')}
            actionLabel={t('addSession')}
            onAction={() => navigation.navigate('AddSession', { date })}
          />
        }
        contentContainerStyle={sessions.length === 0 ? styles.empty : styles.list}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('AddSession', { date })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingVertical: 8 },
  empty: { flex: 1 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
});
