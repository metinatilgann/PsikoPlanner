import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Surface, TouchableRipple, Divider, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { SettingsStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_VERSION, APP_BUILD_NUMBER } from '../../config/env';
import i18next from 'i18next';

interface SettingsItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  iconColor?: string;
}

function SettingsItem({ icon, label, value, onPress, trailing, iconColor }: SettingsItemProps) {
  const theme = useTheme();
  const content = (
    <View style={settingsItemStyles.container}>
      <View style={[settingsItemStyles.iconContainer, { backgroundColor: (iconColor || theme.colors.primary) + '18' }]}>
        <MaterialCommunityIcons name={icon} size={22} color={iconColor || theme.colors.primary} />
      </View>
      <View style={settingsItemStyles.textContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>{label}</Text>
        {value && (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{value}</Text>
        )}
      </View>
      {trailing || (
        <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.outline} />
      )}
    </View>
  );

  if (onPress) {
    return <TouchableRipple onPress={onPress}>{content}</TouchableRipple>;
  }
  return content;
}

const settingsItemStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 12 },
});

export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation('settings');
  const navigation = useNavigation<StackNavigationProp<SettingsStackParamList>>();
  const { signOut, user } = useAuth();
  const { themeMode, setThemeMode, isDark } = useThemeMode();

  const currentLang = i18next.language === 'tr' ? t('turkish') : t('english');
  const currentTheme = themeMode === 'light' ? t('lightTheme') : themeMode === 'dark' ? t('darkTheme') : t('systemTheme');

  const toggleLanguage = () => {
    const newLang = i18next.language === 'tr' ? 'en' : 'tr';
    i18next.changeLanguage(newLang);
  };

  const cycleTheme = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = modes.indexOf(themeMode);
    setThemeMode(modes[(idx + 1) % modes.length]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
            {t('title')}
          </Text>
        </View>

        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.profileCard}>
            <View style={[styles.avatarCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons name="account" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {user?.email?.split('@')[0] || 'Terapist'}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.email}
              </Text>
            </View>
          </View>
        </Surface>

        <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
          {t('account')}
        </Text>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <SettingsItem icon="account-edit" label={t('therapistProfile')} onPress={() => navigation.navigate('Profile')} />
        </Surface>

        <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
          {t('appearance')}
        </Text>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <SettingsItem icon="translate" label={t('language')} value={currentLang} onPress={toggleLanguage} iconColor="#7C3AED" />
          <Divider />
          <SettingsItem icon="theme-light-dark" label={t('theme')} value={currentTheme} onPress={cycleTheme} iconColor="#D97706" />
        </Surface>

        <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
          {t('data')}
        </Text>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <SettingsItem icon="backup-restore" label={t('backup')} onPress={() => {}} iconColor="#059669" />
        </Surface>

        <Text variant="labelLarge" style={[styles.sectionLabel, { color: theme.colors.onSurfaceVariant }]}>
          {t('about')}
        </Text>
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <SettingsItem
            icon="information"
            label={t('version')}
            trailing={<Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{APP_VERSION} ({APP_BUILD_NUMBER})</Text>}
            iconColor="#0891B2"
          />
          <Divider />
          <SettingsItem icon="shield-check" label={t('privacyPolicy')} onPress={() => navigation.navigate('PrivacyPolicy')} iconColor="#0891B2" />
        </Surface>

        <Surface style={[styles.card, { backgroundColor: theme.colors.surface, marginTop: 16 }]} elevation={1}>
          <SettingsItem
            icon="logout"
            label={t('logout', { ns: 'auth' })}
            onPress={signOut}
            iconColor={theme.colors.error}
            trailing={null}
          />
        </Surface>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontWeight: '700' },
  card: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  profileInfo: { flex: 1, marginLeft: 12 },
  sectionLabel: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, fontWeight: '600' },
});
