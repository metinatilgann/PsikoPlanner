import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, useTheme, SegmentedButtons, Switch, HelperText, Menu, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { CalendarStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { createSession } from '../../services/database/sessionService';
import { getAllClients } from '../../services/database/clientService';
import { SESSION_TYPES, PAYMENT_METHODS } from '../../config/constants';
import { toISODate } from '../../utils/dateUtils';
import type { ClientWithStats } from '../../types/client';
import type { SessionType, PaymentMethod } from '../../types/session';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  navigation: StackNavigationProp<CalendarStackParamList, 'AddSession'>;
  route: RouteProp<CalendarStackParamList, 'AddSession'>;
};

export default function AddEditSessionScreen({ navigation, route }: Props) {
  const initialDate = route.params?.date || toISODate(new Date());
  const initialClientId = route.params?.clientId;
  const theme = useTheme();
  const { t } = useTranslation('sessions');
  const { db, isReady } = useDatabase();

  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [selectedClientId, setSelectedClientId] = useState(initialClientId || '');
  const [sessionDate, setSessionDate] = useState(initialDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:50');
  const [sessionType, setSessionType] = useState<SessionType>('individual');
  const [fee, setFee] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientMenuVisible, setClientMenuVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!db || !isReady) return;
    getAllClients(db, 'active').then((data) => {
      setClients(data);
      if (initialClientId) {
        const client = data.find((c) => c.id === initialClientId);
        if (client) setFee(client.sessionFee.toString());
      }
    });
  }, [db, isReady, initialClientId]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setClientMenuVisible(false);
    const client = clients.find((c) => c.id === clientId);
    if (client) setFee(client.sessionFee.toString());
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!selectedClientId) newErrors.client = t('selectClient');
    if (!sessionDate) newErrors.date = t('required', { ns: 'common' });
    if (!startTime) newErrors.startTime = t('required', { ns: 'common' });
    if (!endTime) newErrors.endTime = t('required', { ns: 'common' });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !db) return;
    setLoading(true);
    try {
      await createSession(db, {
        clientId: selectedClientId,
        sessionDate,
        startTime,
        endTime,
        sessionType,
        status: 'planned',
        fee: parseFloat(fee) || 0,
        isPaid,
        paymentMethod: isPaid ? paymentMethod : undefined,
        location: location.trim() || undefined,
      });
      navigation.goBack();
    } catch (err) {
      console.error('Save session error:', err);
    }
    setLoading(false);
  };

  const typeButtons = SESSION_TYPES.slice(0, 4).map((st) => ({
    value: st,
    label: t(`types.${st}`),
    style: styles.segBtn,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text variant="titleMedium" style={[styles.section, { color: theme.colors.primary }]}>
          {t('selectClient')}
        </Text>

        <Menu
          visible={clientMenuVisible}
          onDismiss={() => setClientMenuVisible(false)}
          anchor={
            <TouchableRipple onPress={() => setClientMenuVisible(true)}>
              <View style={[styles.clientSelect, { borderColor: errors.client ? theme.colors.error : theme.colors.outline, backgroundColor: theme.colors.surface }]}>
                <MaterialCommunityIcons name="account" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyLarge" style={{ flex: 1, color: selectedClient ? theme.colors.onSurface : theme.colors.onSurfaceVariant, marginLeft: 8 }}>
                  {selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : t('selectClient')}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color={theme.colors.onSurfaceVariant} />
              </View>
            </TouchableRipple>
          }
          style={styles.menu}
        >
          {clients.map((client) => (
            <Menu.Item
              key={client.id}
              title={`${client.firstName} ${client.lastName}`}
              onPress={() => handleClientSelect(client.id)}
            />
          ))}
        </Menu>
        {errors.client && <HelperText type="error">{errors.client}</HelperText>}

        <Text variant="titleMedium" style={[styles.section, { color: theme.colors.primary }]}>
          {t('sessionDetail')}
        </Text>

        <TextInput
          mode="outlined"
          label={`${t('sessionDate')} (YYYY-MM-DD)`}
          value={sessionDate}
          onChangeText={setSessionDate}
          left={<TextInput.Icon icon="calendar" />}
          style={styles.input}
        />

        <View style={styles.timeRow}>
          <TextInput
            mode="outlined"
            label={t('startTime')}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="HH:MM"
            left={<TextInput.Icon icon="clock-start" />}
            style={[styles.input, styles.flex]}
          />
          <View style={{ width: 12 }} />
          <TextInput
            mode="outlined"
            label={t('endTime')}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="HH:MM"
            left={<TextInput.Icon icon="clock-end" />}
            style={[styles.input, styles.flex]}
          />
        </View>

        <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
          {t('sessionType')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <SegmentedButtons
            value={sessionType}
            onValueChange={(v) => setSessionType(v as SessionType)}
            buttons={typeButtons}
            density="small"
          />
        </ScrollView>

        <TextInput
          mode="outlined"
          label={t('location')}
          value={location}
          onChangeText={setLocation}
          left={<TextInput.Icon icon="map-marker" />}
          style={styles.input}
        />

        <Text variant="titleMedium" style={[styles.section, { color: theme.colors.primary }]}>
          {t('fee')}
        </Text>

        <TextInput
          mode="outlined"
          label={t('fee')}
          value={fee}
          onChangeText={setFee}
          keyboardType="numeric"
          left={<TextInput.Icon icon="currency-try" />}
          style={styles.input}
        />

        <View style={styles.switchRow}>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>{t('paid')}</Text>
          <Switch value={isPaid} onValueChange={setIsPaid} color={theme.colors.primary} />
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          style={styles.saveBtn}
          contentStyle={styles.saveBtnContent}
          labelStyle={styles.saveBtnLabel}
        >
          {t('save', { ns: 'common' })}
        </Button>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  section: { fontWeight: '600', marginTop: 16, marginBottom: 12 },
  input: { marginBottom: 8 },
  label: { marginTop: 4, marginBottom: 4 },
  timeRow: { flexDirection: 'row' },
  clientSelect: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderRadius: 8 },
  menu: { width: '80%' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  segBtn: { minWidth: 72 },
  saveBtn: { marginTop: 24, borderRadius: 12 },
  saveBtnContent: { height: 52 },
  saveBtnLabel: { fontSize: 16, fontWeight: '600' },
});
