import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MD3Theme } from 'react-native-paper';

interface FormSectionProps {
  icon: string;
  title: string;
}

export default function FormSection({ icon, title }: FormSectionProps) {
  const theme = useTheme<MD3Theme>();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon as any}
        size={22}
        color={theme.colors.primary}
      />
      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.primary }]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  title: {
    marginLeft: 8,
  },
});
