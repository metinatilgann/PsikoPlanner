import type { SQLiteDatabase } from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import type { SessionEvaluation } from '../../types/session';

function mapRow(row: any): SessionEvaluation {
  return {
    id: row.id,
    sessionId: row.session_id,
    clientMood: row.client_mood ?? undefined,
    clientEngagement: row.client_engagement ?? undefined,
    therapeuticAlliance: row.therapeutic_alliance ?? undefined,
    progressRating: row.progress_rating ?? undefined,
    riskLevel: row.risk_level || undefined,
    techniquesUsed: row.techniques_used ? JSON.parse(row.techniques_used) : undefined,
    homeworkAssigned: row.homework_assigned || undefined,
    homeworkCompleted: row.homework_completed || undefined,
    nextSessionFocus: row.next_session_focus || undefined,
    therapistObservations: row.therapist_observations || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function upsertEvaluation(
  db: SQLiteDatabase,
  sessionId: string,
  data: Partial<SessionEvaluation>
): Promise<SessionEvaluation> {
  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM session_evaluations WHERE session_id = ?',
    sessionId
  );

  const techniques = data.techniquesUsed ? JSON.stringify(data.techniquesUsed) : null;

  if (existing) {
    await db.runAsync(
      `UPDATE session_evaluations SET
        client_mood = ?, client_engagement = ?, therapeutic_alliance = ?,
        progress_rating = ?, risk_level = ?, techniques_used = ?,
        homework_assigned = ?, homework_completed = ?, next_session_focus = ?,
        therapist_observations = ?, updated_at = datetime('now')
      WHERE id = ?`,
      data.clientMood ?? null, data.clientEngagement ?? null,
      data.therapeuticAlliance ?? null, data.progressRating ?? null,
      data.riskLevel || null, techniques,
      data.homeworkAssigned || null, data.homeworkCompleted || null,
      data.nextSessionFocus || null, data.therapistObservations || null,
      existing.id
    );
    const row = await db.getFirstAsync('SELECT * FROM session_evaluations WHERE id = ?', existing.id);
    return mapRow(row);
  }

  const id = uuidv4();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO session_evaluations (id, session_id, client_mood, client_engagement,
      therapeutic_alliance, progress_rating, risk_level, techniques_used,
      homework_assigned, homework_completed, next_session_focus,
      therapist_observations, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, sessionId, data.clientMood ?? null, data.clientEngagement ?? null,
    data.therapeuticAlliance ?? null, data.progressRating ?? null,
    data.riskLevel || null, techniques,
    data.homeworkAssigned || null, data.homeworkCompleted || null,
    data.nextSessionFocus || null, data.therapistObservations || null,
    now, now
  );

  return { id, sessionId, ...data, createdAt: now, updatedAt: now };
}

export async function getEvaluationBySession(
  db: SQLiteDatabase,
  sessionId: string
): Promise<SessionEvaluation | null> {
  const row = await db.getFirstAsync(
    'SELECT * FROM session_evaluations WHERE session_id = ?',
    sessionId
  );
  return row ? mapRow(row) : null;
}

export async function getEvaluationsByClient(
  db: SQLiteDatabase,
  clientId: string
): Promise<SessionEvaluation[]> {
  const rows = await db.getAllAsync(
    `SELECT e.* FROM session_evaluations e
    JOIN sessions s ON e.session_id = s.id
    WHERE s.client_id = ?
    ORDER BY s.session_date ASC`,
    clientId
  );
  return rows.map(mapRow);
}
