import type { SQLiteDatabase } from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import type { Client, ClientFormData, ClientWithStats } from '../../types/client';

function mapRow(row: any): Client {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone || undefined,
    email: row.email || undefined,
    dateOfBirth: row.date_of_birth || undefined,
    gender: row.gender || undefined,
    occupation: row.occupation || undefined,
    maritalStatus: row.marital_status || undefined,
    referralSource: row.referral_source || undefined,
    emergencyContactName: row.emergency_contact_name || undefined,
    emergencyContactPhone: row.emergency_contact_phone || undefined,
    notes: row.notes || undefined,
    status: row.status,
    sessionFee: row.session_fee || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createClient(
  db: SQLiteDatabase,
  data: ClientFormData
): Promise<Client> {
  const id = uuidv4();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO clients (id, first_name, last_name, phone, email, date_of_birth,
      gender, occupation, marital_status, referral_source,
      emergency_contact_name, emergency_contact_phone, notes,
      session_fee, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    data.firstName,
    data.lastName,
    data.phone || null,
    data.email || null,
    data.dateOfBirth || null,
    data.gender || null,
    data.occupation || null,
    data.maritalStatus || null,
    data.referralSource || null,
    data.emergencyContactName || null,
    data.emergencyContactPhone || null,
    data.notes || null,
    data.sessionFee || 0,
    now,
    now
  );

  return { id, ...data, status: 'active', createdAt: now, updatedAt: now };
}

export async function updateClient(
  db: SQLiteDatabase,
  id: string,
  data: Partial<ClientFormData>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  const fieldMap: Record<string, string> = {
    firstName: 'first_name',
    lastName: 'last_name',
    phone: 'phone',
    email: 'email',
    dateOfBirth: 'date_of_birth',
    gender: 'gender',
    occupation: 'occupation',
    maritalStatus: 'marital_status',
    referralSource: 'referral_source',
    emergencyContactName: 'emergency_contact_name',
    emergencyContactPhone: 'emergency_contact_phone',
    notes: 'notes',
    sessionFee: 'session_fee',
  };

  for (const [key, column] of Object.entries(fieldMap)) {
    if (key in data) {
      fields.push(`${column} = ?`);
      values.push((data as any)[key] ?? null);
    }
  }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(id);

  await db.runAsync(
    `UPDATE clients SET ${fields.join(', ')} WHERE id = ?`,
    ...values
  );
}

export async function getClientById(
  db: SQLiteDatabase,
  id: string
): Promise<Client | null> {
  const row = await db.getFirstAsync('SELECT * FROM clients WHERE id = ?', id);
  return row ? mapRow(row) : null;
}

export async function getAllClients(
  db: SQLiteDatabase,
  status: 'active' | 'archived' = 'active'
): Promise<ClientWithStats[]> {
  const rows = await db.getAllAsync(
    `SELECT c.*,
      COALESCE(s.total_sessions, 0) as total_sessions,
      s.next_session_date,
      s.last_session_date
    FROM clients c
    LEFT JOIN (
      SELECT client_id,
        COUNT(*) as total_sessions,
        MIN(CASE WHEN session_date >= date('now') AND status = 'planned' THEN session_date END) as next_session_date,
        MAX(CASE WHEN status = 'completed' THEN session_date END) as last_session_date
      FROM sessions
      GROUP BY client_id
    ) s ON c.id = s.client_id
    WHERE c.status = ?
    ORDER BY c.last_name, c.first_name`,
    status
  );

  return rows.map((row: any) => ({
    ...mapRow(row),
    totalSessions: row.total_sessions || 0,
    nextSessionDate: row.next_session_date || undefined,
    lastSessionDate: row.last_session_date || undefined,
    anamnesisCompletion: 0,
  }));
}

export async function searchClients(
  db: SQLiteDatabase,
  query: string
): Promise<ClientWithStats[]> {
  const searchTerm = `%${query}%`;
  const rows = await db.getAllAsync(
    `SELECT c.*,
      COALESCE(s.total_sessions, 0) as total_sessions,
      s.next_session_date,
      s.last_session_date
    FROM clients c
    LEFT JOIN (
      SELECT client_id,
        COUNT(*) as total_sessions,
        MIN(CASE WHEN session_date >= date('now') AND status = 'planned' THEN session_date END) as next_session_date,
        MAX(CASE WHEN status = 'completed' THEN session_date END) as last_session_date
      FROM sessions
      GROUP BY client_id
    ) s ON c.id = s.client_id
    WHERE c.status = 'active'
      AND (c.first_name LIKE ? OR c.last_name LIKE ? OR c.phone LIKE ? OR c.email LIKE ?)
    ORDER BY c.last_name, c.first_name`,
    searchTerm,
    searchTerm,
    searchTerm,
    searchTerm
  );

  return rows.map((row: any) => ({
    ...mapRow(row),
    totalSessions: row.total_sessions || 0,
    nextSessionDate: row.next_session_date || undefined,
    lastSessionDate: row.last_session_date || undefined,
    anamnesisCompletion: 0,
  }));
}

export async function archiveClient(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await db.runAsync(
    "UPDATE clients SET status = 'archived', updated_at = datetime('now') WHERE id = ?",
    id
  );
}

export async function unarchiveClient(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await db.runAsync(
    "UPDATE clients SET status = 'active', updated_at = datetime('now') WHERE id = ?",
    id
  );
}

export async function deleteClient(
  db: SQLiteDatabase,
  id: string
): Promise<void> {
  await db.runAsync('DELETE FROM clients WHERE id = ?', id);
}

export async function getClientCount(
  db: SQLiteDatabase,
  status?: 'active' | 'archived'
): Promise<number> {
  const query = status
    ? 'SELECT COUNT(*) as count FROM clients WHERE status = ?'
    : 'SELECT COUNT(*) as count FROM clients';
  const args = status ? [status] : [];
  const result = await db.getFirstAsync<{ count: number }>(query, ...args);
  return result?.count || 0;
}
