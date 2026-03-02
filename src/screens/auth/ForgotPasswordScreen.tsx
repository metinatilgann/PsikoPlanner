import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = { navigation: StackNavigationProp<AuthStackParamList, 'ForgotPassword'> };

export default function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useTheme();
  const { t } = useTranslation('auth');
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email.includes('@')) {
      setError(t('invalidEmail'));
      return;
    }
    setLoading(true);
    setError('');
    const result = await resetPassword(email.trim());
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.secondaryContainer }]}>
            <MaterialCommunityIcons name="email-send" size={48} color={theme.colors.secondary} />
          </View>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
            {t('resetPassword')}
          </Text>
          <Text variant="bodyLarge" style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
            {t('resetPasswordMessage')}
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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.container}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
            <MaterialCommunityIcons name="lock-reset" size={48} color={theme.colors.primary} />
          </View>

          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
            {t('resetPassword')}
          </Text>

          <TextInput
            mode="outlined"
            label={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.input}
          />

          {error ? (
            <HelperText type="error" visible={!!error}>{error}</HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleReset}
            loading={loading}
            disabled={loading || !email.trim()}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {t('resetPassword')}
          </Button>

          <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton}>
            {t('login')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 48,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24, alignSelf: 'center',
  },
  title: { fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  message: { textAlign: 'center', lineHeight: 24 },
  input: { marginBottom: 8 },
  button: { marginTop: 16, borderRadius: 12 },
  buttonContent: { height: 48 },
  backButton: { marginTop: 16 },
});
