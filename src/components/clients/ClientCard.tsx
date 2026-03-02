import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import ClientAvatar from './ClientAvatar';
import type { ClientWithStats } from '../../types/client';
import { getRelativeDate } from '../../utils/dateUtils';

interface ClientCardProps {
  client: ClientWithStats;
  onPress: () => void;
}

export default function ClientCard({ client, onPress }: ClientCardProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('clients');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <ClientAvatar firstName={client.firstName} lastName={client.lastName} size={48} />
        <View style={styles.info}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {client.firstName} {client.lastName}
          </Text>
          <View style={styles.row}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('totalSessions')}: {client.totalSessions}
            </Text>
            {client.nextSessionDate && (
              <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                {getRelativeDate(client.nextSessionDate, i18n.language)}
              </Text>
            )}
          </View>
        </View>
        <MaterialIcon name="chevron-right" size={24} color={theme.colors.outline} />
      </Surface>
    </TouchableOpacity>
  );
}

import { MaterialCommunityIcons as MaterialIcon } from '@expo/vector-icons';

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, marginHorizontal: 16, marginVertical: 4, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
});
