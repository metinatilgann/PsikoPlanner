import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
  route: RouteProp<AuthStackParamList, 'VerifyEmail'>;
};

export default function VerifyEmailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { t } = useTranslation('auth');
  const { email } = route.params;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.secondaryContainer }]}>
          <MaterialCommunityIcons name="email-check" size={56} color={theme.colors.secondary} />
        </View>

        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('verifyEmail')}
        </Text>

        <Text variant="bodyLarge" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {t('verifyEmailMessage')}
        </Text>

        <Text variant="bodyMedium" style={[styles.email, { color: theme.colors.primary }]}>
          {email}
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {t('login')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: {
    width: 112, height: 112, borderRadius: 56,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  title: { fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  message: { textAlign: 'center', lineHeight: 24 },
  email: { marginTop: 12, fontWeight: '600' },
  button: { marginTop: 32, borderRadius: 12, minWidth: 200 },
  buttonContent: { height: 48 },
});
