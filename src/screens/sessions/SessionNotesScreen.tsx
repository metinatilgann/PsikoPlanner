import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, SegmentedButtons, Surface } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { getNotesBySession, upsertNote } from '../../services/database/noteService';
import type { SessionNote, NoteType } from '../../types/session';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'SessionNotes'>;
  route: RouteProp<ClientStackParamList, 'SessionNotes'>;
};

const NOTE_TYPES: NoteType[] = ['general', 'subjective', 'objective', 'assessment', 'plan'];

export default function SessionNotesScreen({ navigation, route }: Props) {
  const { sessionId } = route.params;
  const theme = useTheme();
  const { t } = useTranslation('sessions');
  const { db, isReady } = useDatabase();

  const [activeType, setActiveType] = useState<NoteType>('general');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!db || !isReady) return;
    const data = await getNotesBySession(db, sessionId);
    const noteMap: Record<string, string> = {};
    data.forEach((n) => { noteMap[n.noteType] = n.content; });
    setNotes(noteMap);
  }, [db, isReady, sessionId]);

  useFocusEffect(useCallback(() => { loadNotes(); }, [loadNotes]));

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    try {
      for (const [type, content] of Object.entries(notes)) {
        if (content.trim()) {
          await upsertNote(db, sessionId, type as NoteType, content.trim());
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save notes error:', err);
    }
    setSaving(false);
  };

  const noteTypeButtons = NOTE_TYPES.map((nt) => ({
    value: nt,
    label: t(`noteTypes.${nt}`),
    style: styles.segBtn,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
        <SegmentedButtons
          value={activeType}
          onValueChange={(v) => setActiveType(v as NoteType)}
          buttons={noteTypeButtons}
          density="small"
        />
      </ScrollView>

      <Surface style={[styles.noteHeader, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
        <Text variant="titleSmall" style={{ color: theme.colors.onPrimaryContainer }}>
          {t(`noteTypes.${activeType}`)}
        </Text>
        {activeType !== 'general' && (
          <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.7 }}>
            SOAP - {activeType.charAt(0).toUpperCase()}
          </Text>
        )}
      </Surface>

      <ScrollView style={styles.flex} contentContainerStyle={styles.noteContent}>
        <TextInput
          mode="outlined"
          value={notes[activeType] || ''}
          onChangeText={(text) => setNotes({ ...notes, [activeType]: text })}
          multiline
          numberOfLines={12}
          placeholder={`${t(`noteTypes.${activeType}`)} ${t('notes').toLowerCase()}...`}
          style={styles.textArea}
        />
      </ScrollView>

      <View style={styles.footer}>
        {saved && (
          <Text variant="bodySmall" style={{ color: theme.colors.secondary, marginBottom: 8, textAlign: 'center' }}>
            {t('success', { ns: 'common' })}
          </Text>
        )}
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={styles.saveBtn}
          contentStyle={styles.saveBtnContent}
        >
          {t('save', { ns: 'common' })}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  typeScroll: { paddingHorizontal: 16, paddingTop: 12, maxHeight: 52 },
  segBtn: { minWidth: 72 },
  noteHeader: { marginHorizontal: 16, marginTop: 12, padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noteContent: { paddingHorizontal: 16, paddingTop: 12, flex: 1 },
  textArea: { flex: 1, minHeight: 300 },
  footer: { padding: 16 },
  saveBtn: { borderRadius: 12 },
  saveBtnContent: { height: 48 },
});
