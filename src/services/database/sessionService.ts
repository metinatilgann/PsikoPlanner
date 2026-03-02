import type { SQLiteDatabase } from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import type { Session, SessionFormData, SessionWithClient, SessionStats, SessionStatus } from '../../types/session';

function mapRow(row: any): Session {
  return {
    id: row.id,
    clientId: row.client_id,
    sessionNumber: row.session_number,
    sessionDate: row.session_date,
    startTime: row.start_time,
    endTime: row.end_time,
    durationMinutes: row.duration_minutes,
    sessionType: row.session_type,
    status: row.status,
    fee: row.fee || 0,
    isPaid: !!row.is_paid,
    paymentMethod: row.payment_method || undefined,
    location: row.location || undefined,
    notificationId: row.notification_id || undefined,
    cancellationReason: row.cancellation_reason || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapRowWithClient(row: any): SessionWithClient {
  return {
    ...mapRow(row),
    clientFirstName: row.first_name || row.client_first_name || '',
    clientLastName: row.last_name || row.client_last_name || '',
  };
}

function calculateDuration(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

export async function createSession(
  db: SQLiteDatabase,
  data: SessionFormData
): Promise<Session> {
  const id = uuidv4();
  const now = new Date().toISOString();

  const maxResult = await db.getFirstAsync<{ max_num: number }>(
    'SELECT COALESCE(MAX(session_number), 0) as max_num FROM sessions WHERE client_id = ?',
    data.clientId
  );
  const sessionNumber = (maxResult?.max_num || 0) + 1;
  const duration = calculateDuration(data.startTime, data.endTime);

  await db.runAsync(
    `INSERT INTO sessions (id, client_id, session_number, session_date, start_time, end_time,
      duration_minutes, session_type, status, fee, is_paid, payment_method, location,
      notification_id, cancellation_reason, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, data.clientId, sessionNumber, data.sessionDate, data.startTime, data.endTime,
    duration, data.sessionType, data.status, data.fee || 0, data.isPaid ? 1 : 0,
    data.paymentMethod || null, data.location || null,
    data.notificationId || null, data.cancellationReason || null, now, now
  );

  return {
    id, ...data, sessionNumber, durationMinutes: duration,
    createdAt: now, updatedAt: now,
  };
}

export async function updateSession(
  db: SQLiteDatabase,
  id: string,
  data: Partial<SessionFormData>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  const fieldMap: Record<string, string> = {
    sessionDate: 'session_date',
    startTime: 'start_time',
    endTime: 'end_time',
    sessionType: 'session_type',
    status: 'status',
    fee: 'fee',
    paymentMethod: 'payment_method',
    location: 'location',
    notificationId: 'notification_id',
    cancellationReason: 'cancellation_reason',
  };

  for (const [key, column] of Object.entries(fieldMap)) {
    if (key in data) {
      fields.push(`${column} = ?`);
      values.push((data as any)[key] ?? null);
    }
  }

  if ('isPaid' in data) {
    fields.push('is_paid = ?');
    values.push(data.isPaid ? 1 : 0);
  }

  if (data.startTime && data.endTime) {
    fields.push('duration_minutes = ?');
    values.push(calculateDuration(data.startTime, data.endTime));
  }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await db.runAsync(
    `UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`,
    ...values
  );
}

export async function getSessionById(
  db: SQLiteDatabase,
  id: string
): Promise<SessionWithClient | null> {
  const row = await db.getFirstAsync(
    `SELECT s.*, c.first_name, c.last_name
    FROM sessions s
    JOIN clients c ON s.client_id = c.id
    WHERE s.id = ?`,
    id
  );
  return row ? mapRowWithClient(row) : null;
}

export async function getSessionsByClient(
  db: SQLiteDatabase,
  clientId: string,
  status?: SessionStatus
): Promise<Session[]> {
  const query = status
    ? 'SELECT * FROM sessions WHERE client_id = ? AND status = ? ORDER BY session_date DESC, start_time DESC'
    : 'SELECT * FROM sessions WHERE client_id = ? ORDER BY session_date DESC, start_time DESC';
  const args = status ? [clientId, status] : [clientId];
  const rows = await db.getAllAsync(query, ...args);
  return rows.map(mapRow);
}

export async function getSessionsByDate(
  db: SQLiteDatabase,
  date: string
): Promise<SessionWithClient[]> {
  const rows = await db.getAllAsync(
    `SELECT s.*, c.first_name, c.last_name
    FROM sessions s
    JOIN clients c ON s.client_id = c.id
    WHERE s.session_date = ?
    ORDER BY s.start_time ASC`,
    date
  );
  return rows.map(mapRowWithClient);
}

export async function getSessionsByDateRange(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<SessionWithClient[]> {
  const rows = await db.getAllAsync(
    `SELECT s.*, c.first_name, c.last_name
    FROM sessions s
    JOIN clients c ON s.client_id = c.id
    WHERE s.session_date BETWEEN ? AND ?
    ORDER BY s.session_date ASC, s.start_time ASC`,
    startDate, endDate
  );
  return rows.map(mapRowWithClient);
}

export async function getSessionDatesForMonth(
  db: SQLiteDatabase,
  year: number,
  month: number
): Promise<Record<string, SessionStatus[]>> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const rows = await db.getAllAsync<{ session_date: string; status: SessionStatus }>(
    `SELECT session_date, status FROM sessions
    WHERE session_date BETWEEN ? AND ?
    ORDER BY session_date`,
    startDate, endDate
  );

  const result: Record<string, SessionStatus[]> = {};
  for (const row of rows) {
    if (!result[row.session_date]) result[row.session_date] = [];
    result[row.session_date].push(row.status);
  }
  return result;
}

export async function deleteSession(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await db.runAsync('DELETE FROM sessions WHERE id = ?', id);
}

export async function getSessionStats(
  db: SQLiteDatabase,
  startDate: string,
  endDate: string
): Promise<SessionStats> {
  const result = await db.getFirstAsync<any>(
    `SELECT
      COUNT(*) as total_sessions,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_sessions,
      SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) as no_show_sessions,
      SUM(fee) as total_revenue,
      SUM(CASE WHEN is_paid = 1 THEN fee ELSE 0 END) as paid_revenue
    FROM sessions
    WHERE session_date BETWEEN ? AND ?`,
    startDate, endDate
  );

  return {
    totalSessions: result?.total_sessions || 0,
    completedSessions: result?.completed_sessions || 0,
    cancelledSessions: result?.cancelled_sessions || 0,
    noShowSessions: result?.no_show_sessions || 0,
    totalRevenue: result?.total_revenue || 0,
    paidRevenue: result?.paid_revenue || 0,
  };
}

export async function getTodaySessionCount(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM sessions WHERE session_date = date('now') AND status = 'planned'"
  );
  return result?.count || 0;
}

export async function getUpcomingSessions(
  db: SQLiteDatabase,
  limit: number = 5
): Promise<SessionWithClient[]> {
  const rows = await db.getAllAsync(
    `SELECT s.*, c.first_name, c.last_name
    FROM sessions s
    JOIN clients c ON s.client_id = c.id
    WHERE s.session_date >= date('now') AND s.status = 'planned'
    ORDER BY s.session_date ASC, s.start_time ASC
    LIMIT ?`,
    limit
  );
  return rows.map(mapRowWithClient);
}
