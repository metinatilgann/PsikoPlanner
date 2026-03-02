import type { SQLiteDatabase } from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import type { SessionNote, NoteType } from '../../types/session';

function mapRow(row: any): SessionNote {
  return {
    id: row.id,
    sessionId: row.session_id,
    noteType: row.note_type,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertNote(
  db: SQLiteDatabase,
  sessionId: string,
  noteType: NoteType,
  content: string
): Promise<SessionNote> {
  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM session_notes WHERE session_id = ? AND note_type = ?',
    sessionId, noteType
  );

  if (existing) {
    await db.runAsync(
      "UPDATE session_notes SET content = ?, updated_at = datetime('now') WHERE id = ?",
      content, existing.id
    );
    const row = await db.getFirstAsync('SELECT * FROM session_notes WHERE id = ?', existing.id);
    return mapRow(row);
  }

  const id = uuidv4();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO session_notes (id, session_id, note_type, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)`,
    id, sessionId, noteType, content, now, now
  );
  return { id, sessionId, noteType, content, createdAt: now, updatedAt: now };
}

export async function getNotesBySession(
  db: SQLiteDatabase,
  sessionId: string
): Promise<SessionNote[]> {
  const rows = await db.getAllAsync(
    'SELECT * FROM session_notes WHERE session_id = ? ORDER BY note_type',
    sessionId
  );
  return rows.map(mapRow);
}

export async function deleteNote(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await db.runAsync('DELETE FROM session_notes WHERE id = ?', id);
}
