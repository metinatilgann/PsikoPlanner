import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Button, Surface, Chip, Divider, Menu, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getSessionById, updateSession, deleteSession } from '../../services/database/sessionService';
import { getNotesBySession } from '../../services/database/noteService';
import { getEvaluationBySession } from '../../services/database/evaluationService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ClientAvatar from '../../components/clients/ClientAvatar';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';
import { getStatusColor } from '../../utils/colorUtils';
import type { SessionWithClient, SessionNote, SessionEvaluation, SessionStatus } from '../../types/session';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'SessionDetail'>;
  route: RouteProp<ClientStackParamList, 'SessionDetail'>;
};

export default function SessionDetailScreen({ navigation, route }: Props) {
  const { sessionId } = route.params;
  const theme = useTheme();
  const { t, i18n } = useTranslation('sessions');
  const { db, isReady } = useDatabase();

  const [session, setSession] = useState<SessionWithClient | null>(null);
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [evaluation, setEvaluation] = useState<SessionEvaluation | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const loadData = useCallback(async () => {
    if (!db || !isReady) return;
    const [sessionData, notesData, evalData] = await Promise.all([
      getSessionById(db, sessionId),
      getNotesBySession(db, sessionId),
      getEvaluationBySession(db, sessionId),
    ]);
    setSession(sessionData);
    setNotes(notesData);
    setEvaluation(evalData);
  }, [db, isReady, sessionId]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
        >
          <Menu.Item
            onPress={() => { setMenuVisible(false); setDeleteDialogVisible(true); }}
            title={t('delete', { ns: 'common' })}
            leadingIcon="delete"
            titleStyle={{ color: theme.colors.error }}
          />
        </Menu>
      ),
    });
  }, [navigation, menuVisible, t, theme]);

  const handleStatusChange = async (newStatus: SessionStatus) => {
    if (!db || !session) return;
    await updateSession(db, sessionId, { status: newStatus });
    loadData();
  };

  const handleDelete = async () => {
    if (!db) return;
    await deleteSession(db, sessionId);
    navigation.goBack();
  };

  if (!session) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <View style={styles.clientRow}>
          <ClientAvatar firstName={session.clientFirstName} lastName={session.clientLastName} size={48} />
          <View style={styles.clientInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {session.clientFirstName} {session.clientLastName}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('sessionNumber')}: {session.sessionNumber}
            </Text>
          </View>
          <Chip
            compact
            textStyle={{ fontSize: 11, color: '#fff' }}
            style={{ backgroundColor: getStatusColor(session.status) }}
          >
            {t(`statuses.${session.status}`)}
          </Chip>
        </View>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{t('sessionDate')}</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {formatDate(session.sessionDate, i18n.language)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {t('startTime')} - {t('endTime')}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {formatTime(session.startTime)} - {formatTime(session.endTime)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="timer-outline" size={20} color={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{t('duration')}</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {session.durationMinutes} {t('minutes')}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="tag-outline" size={20} color={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{t('sessionType')}</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {t(`types.${session.sessionType}`)}
            </Text>
          </View>
        </View>

        <Divider style={{ marginVertical: 12 }} />

        <View style={styles.paymentRow}>
          <View>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{t('fee')}</Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
              {formatCurrency(session.fee)}
            </Text>
          </View>
          <Chip
            icon={session.isPaid ? 'check-circle' : 'close-circle'}
            textStyle={{ color: session.isPaid ? theme.colors.secondary : theme.colors.error }}
            style={{ backgroundColor: session.isPaid ? theme.colors.secondaryContainer : theme.colors.errorContainer }}
          >
            {session.isPaid ? t('paid') : t('unpaid')}
          </Chip>
        </View>
      </Surface>

      {session.status === 'planned' && (
        <View style={styles.statusActions}>
          <Button
            mode="contained"
            icon="check"
            onPress={() => handleStatusChange('completed')}
            style={[styles.statusBtn, { backgroundColor: '#059669' }]}
          >
            {t('statuses.completed')}
          </Button>
          <Button
            mode="outlined"
            icon="close"
            onPress={() => handleStatusChange('cancelled')}
            style={styles.statusBtn}
            textColor={theme.colors.error}
          >
            {t('cancelSession')}
          </Button>
        </View>
      )}

      <View style={styles.actionButtons}>
        <Button
          mode="contained-tonal"
          icon="note-text"
          onPress={() => navigation.navigate('SessionNotes', { sessionId })}
          style={styles.actionBtn}
        >
          {t('notes')} {notes.length > 0 ? `(${notes.length})` : ''}
        </Button>
        <Button
          mode="contained-tonal"
          icon="chart-bar"
          onPress={() => navigation.navigate('SessionEvaluation', { sessionId })}
          style={styles.actionBtn}
        >
          {t('evaluation')} {evaluation ? '✓' : ''}
        </Button>
      </View>

      {notes.length > 0 && (
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            {t('notes')}
          </Text>
          {notes.map((note) => (
            <View key={note.id} style={styles.noteItem}>
              <Chip compact style={styles.noteChip}>
                {t(`noteTypes.${note.noteType}`)}
              </Chip>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginTop: 4 }}>
                {note.content}
              </Text>
            </View>
          ))}
        </Surface>
      )}

      <View style={{ height: 32 }} />

      <ConfirmDialog
        visible={deleteDialogVisible}
        title={t('delete', { ns: 'common' })}
        message={t('deleteConfirm', { ns: 'common' })}
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { marginHorizontal: 16, marginTop: 12, borderRadius: 12, padding: 16 },
  cardTitle: { fontWeight: '600', marginBottom: 8 },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  clientInfo: { flex: 1 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  detailItem: { width: '45%', gap: 2 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusActions: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, gap: 8 },
  statusBtn: { flex: 1, borderRadius: 12 },
  actionButtons: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12, gap: 8 },
  actionBtn: { flex: 1, borderRadius: 12 },
  noteItem: { paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0' },
  noteChip: { alignSelf: 'flex-start' },
});
