import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CalendarStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getSessionDatesForMonth } from '../../services/database/sessionService';
import { toISODate } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/colorUtils';

type MarkedDates = Record<string, { dots: { key: string; color: string }[]; selected?: boolean; selectedColor?: string }>;

export default function CalendarScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { db, isReady } = useDatabase();
  const navigation = useNavigation<StackNavigationProp<CalendarStackParamList>>();

  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [currentMonth, setCurrentMonth] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });

  const loadMonth = useCallback(async (year: number, month: number) => {
    if (!db || !isReady) return;
    try {
      const sessionDates = await getSessionDatesForMonth(db, year, month);
      const marks: MarkedDates = {};
      for (const [date, statuses] of Object.entries(sessionDates)) {
        const uniqueStatuses = [...new Set(statuses)];
        marks[date] = {
          dots: uniqueStatuses.map((s) => ({ key: s, color: getStatusColor(s) })),
        };
      }
      setMarkedDates(marks);
    } catch (err) {
      console.error('Calendar load error:', err);
    }
  }, [db, isReady]);

  useFocusEffect(
    useCallback(() => {
      loadMonth(currentMonth.year, currentMonth.month);
    }, [loadMonth, currentMonth])
  );

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    navigation.navigate('DayDetail', { date: day.dateString });
  };

  const handleMonthChange = (month: { year: number; month: number }) => {
    setCurrentMonth({ year: month.year, month: month.month });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Takvim
        </Text>
      </View>

      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markingType="multi-dot"
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || { dots: [] }),
            selected: true,
            selectedColor: theme.colors.primary,
          },
        }}
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.background,
          textSectionTitleColor: theme.colors.onSurfaceVariant,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.onPrimary,
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.onBackground,
          textDisabledColor: theme.colors.outline,
          monthTextColor: theme.colors.onBackground,
          arrowColor: theme.colors.primary,
          textMonthFontWeight: '600',
          textDayFontSize: 15,
          textMonthFontSize: 17,
        }}
        style={styles.calendar}
      />

      <View style={styles.legend}>
        {(['planned', 'completed', 'cancelled', 'no_show'] as const).map((status) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: getStatusColor(status) }]} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t(`sessions:statuses.${status}`)}
            </Text>
          </View>
        ))}
      </View>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('AddSession', { date: selectedDate })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontWeight: '700' },
  calendar: { marginHorizontal: 8 },
  legend: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, paddingTop: 16, gap: 16,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 16 },
});
