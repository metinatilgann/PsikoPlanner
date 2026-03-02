import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Chip, Surface, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { formatTime } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';
import { getStatusColor } from '../../utils/colorUtils';
import type { SessionWithClient } from '../../types/session';

interface SessionCardProps {
  session: SessionWithClient;
  onPress: () => void;
  showDate?: boolean;
}

export default function SessionCard({ session, onPress, showDate }: SessionCardProps) {
  const theme = useTheme();
  const { t } = useTranslation('sessions');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <View style={[styles.timeBar, { backgroundColor: getStatusColor(session.status) }]} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
              {session.clientFirstName} {session.clientLastName}
            </Text>
            <Chip
              compact
              textStyle={{ fontSize: 11, color: '#fff' }}
              style={{ backgroundColor: getStatusColor(session.status) }}
            >
              {t(`statuses.${session.status}`)}
            </Chip>
          </View>
          <View style={styles.details}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t(`types.${session.sessionType}`)}
            </Text>
            <Text variant="bodySmall" style={{ color: session.isPaid ? theme.colors.secondary : theme.colors.error }}>
              {formatCurrency(session.fee)}
            </Text>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', marginHorizontal: 16, marginVertical: 4, borderRadius: 12, overflow: 'hidden' },
  timeBar: { width: 4 },
  content: { flex: 1, padding: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  details: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
