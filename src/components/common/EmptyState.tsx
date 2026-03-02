import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={64} color={theme.colors.outline} />
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurfaceVariant }]}>
        {title}
      </Text>
      {description && (
        <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.outline }]}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { marginTop: 16, textAlign: 'center' },
  description: { marginTop: 8, textAlign: 'center' },
  button: { marginTop: 24 },
});
