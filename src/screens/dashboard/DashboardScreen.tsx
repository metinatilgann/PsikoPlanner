import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, FAB, Surface } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/dashboard/StatCard';
import SessionCard from '../../components/sessions/SessionCard';
import EmptyState from '../../components/common/EmptyState';
import { getSessionStats, getUpcomingSessions, getTodaySessionCount } from '../../services/database/sessionService';
import { getClientCount } from '../../services/database/clientService';
import { getMonthRange, getWeekRange } from '../../utils/dateUtils';
import type { SessionWithClient, SessionStats } from '../../types/session';

export default function DashboardScreen() {
  const theme = useTheme();
  const { t } = useTranslation('dashboard');
  const { db, isReady } = useDatabase();
  const { user } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const [todayCount, setTodayCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [weekStats, setWeekStats] = useState<SessionStats | null>(null);
  const [monthStats, setMonthStats] = useState<SessionStats | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<SessionWithClient[]>([]);

  const loadData = useCallback(async () => {
    if (!db || !isReady) return;
    try {
      const now = new Date();
      const week = getWeekRange(now);
      const month = getMonthRange(now.getFullYear(), now.getMonth() + 1);

      const [today, clients, wStats, mStats, upcoming] = await Promise.all([
        getTodaySessionCount(db),
        getClientCount(db, 'active'),
        getSessionStats(db, week.start, week.end),
        getSessionStats(db, month.start, month.end),
        getUpcomingSessions(db, 5),
      ]);

      setTodayCount(today);
      setClientCount(clients);
      setWeekStats(wStats);
      setMonthStats(mStats);
      setUpcomingSessions(upcoming);
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  }, [db, isReady]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const greeting = user?.email?.split('@')[0] || '';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
      >
        <View style={styles.header}>
          <View>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('greeting')},
            </Text>
            <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.onBackground }]}>
              {greeting}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="calendar-today"
            label={t('todaySessions')}
            value={todayCount}
            color={theme.colors.primary}
          />
          <StatCard
            icon="account-group"
            label={t('activeClients')}
            value={clientCount}
            color={theme.colors.secondary}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="calendar-week"
            label={t('weeklySessions')}
            value={weekStats?.totalSessions || 0}
            color={theme.colors.tertiary}
          />
          <StatCard
            icon="chart-line"
            label={t('monthlyRevenue')}
            value={`₺${monthStats?.paidRevenue || 0}`}
            color="#D97706"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            {t('upcomingSessions')}
          </Text>
        </View>

        {upcomingSessions.length > 0 ? (
          upcomingSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              showDate
              onPress={() => {
                (navigation as any).navigate('ClientsTab', {
                  screen: 'SessionDetail',
                  params: { sessionId: session.id },
                });
              }}
            />
          ))
        ) : (
          <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <EmptyState
              icon="calendar-blank"
              title={t('noUpcoming')}
            />
          </Surface>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => {
          (navigation as any).navigate('ClientsTab', {
            screen: 'AddEditClient',
            params: {},
          });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 16 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  name: { fontWeight: '700' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 12, marginTop: 4 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 8,
  },
  sectionTitle: { fontWeight: '600' },
  emptyCard: { marginHorizontal: 16, borderRadius: 12, paddingVertical: 24 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
});
