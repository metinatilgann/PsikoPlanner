import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}

export default function StatCard({ icon, label, value, color }: StatCardProps) {
  const theme = useTheme();

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
      <View style={[styles.iconContainer, { backgroundColor: color + '18' }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1}>
        {label}
      </Text>
      <Text variant="headlineSmall" style={[styles.value, { color: theme.colors.onSurface }]}>
        {value}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: 16, borderRadius: 12, margin: 4 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  value: { fontWeight: '700', marginTop: 4 },
});
