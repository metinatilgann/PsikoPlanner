import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = { navigation: StackNavigationProp<AuthStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { t } = useTranslation('auth');
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    const result = await signIn(email.trim(), password);
    if (result.error) {
      setError(t('loginError'));
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <MaterialCommunityIcons name="brain" size={48} color={theme.colors.primary} />
            </View>
            <Text variant="headlineLarge" style={[styles.appName, { color: theme.colors.primary }]}>
              PsikoPlanner
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('welcomeSubtitle')}
            </Text>
          </View>

          <View style={styles.form}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
              {t('welcomeBack')}
            </Text>

            <TextInput
              mode="outlined"
              label={t('email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label={t('password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
            />

            {error ? (
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !email.trim() || !password.trim()}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {t('login')}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.linkButton}
            >
              {t('forgotPassword')}
            </Button>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: theme.colors.outlineVariant }]} />
            </View>

            <View style={styles.registerRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {t('dontHaveAccount')}
              </Text>
              <Button mode="text" onPress={() => navigation.navigate('Register')} compact>
                {t('register')}
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginTop: 48, marginBottom: 32 },
  logoCircle: {
    width: 96, height: 96, borderRadius: 48,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  appName: { fontWeight: '700', marginBottom: 4 },
  form: { flex: 1 },
  title: { fontWeight: '600', marginBottom: 24, textAlign: 'center' },
  input: { marginBottom: 12 },
  button: { marginTop: 8, borderRadius: 12 },
  buttonContent: { height: 52 },
  buttonLabel: { fontSize: 16, fontWeight: '600' },
  linkButton: { marginTop: 8 },
  divider: { marginVertical: 24, alignItems: 'center' },
  line: { height: 1, width: '100%' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
