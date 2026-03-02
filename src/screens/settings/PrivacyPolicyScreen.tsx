import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { MD3Theme } from 'react-native-paper';

export default function PrivacyPolicyScreen() {
  const theme = useTheme<MD3Theme>();
  const { t } = useTranslation('settings');

  const sections = t('privacyContent', { returnObjects: true }) as {
    title: string;
    body: string;
  }[];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineSmall" style={[styles.mainTitle, { color: theme.colors.primary }]}>
        {t('privacyPolicyTitle')}
      </Text>
      <Text variant="bodySmall" style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
        {t('privacyLastUpdated')}
      </Text>

      {Array.isArray(sections) &&
        sections.map((section, index) => (
          <React.Fragment key={index}>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              {section.title}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.body, { color: theme.colors.onSurfaceVariant }]}
            >
              {section.body}
            </Text>
          </React.Fragment>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  mainTitle: { fontWeight: '700', marginBottom: 4 },
  date: { marginBottom: 20 },
  sectionTitle: { fontWeight: '600', marginTop: 20, marginBottom: 8 },
  body: { lineHeight: 22 },
});
