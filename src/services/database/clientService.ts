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
    nationalId: row.national_id || undefined,
    nationality: row.nationality || undefined,
    occupation: row.occupation || undefined,
    maritalStatus: row.marital_status || undefined,
    educationLevel: row.education_level || undefined,
    numberOfChildren: row.number_of_children ?? undefined,
    address: row.address || undefined,
    city: row.city || undefined,
    livingWith: row.living_with || undefined,
    insuranceInfo: row.insurance_info || undefined,
    referralSource: row.referral_source || undefined,
    referralDetail: row.referral_detail || undefined,
    emergencyContactName: row.emergency_contact_name || undefined,
    emergencyContactPhone: row.emergency_contact_phone || undefined,
    emergencyContactRelation: row.emergency_contact_relation || undefined,
    notes: row.notes || undefined,
    hasChronicIllness: row.has_chronic_illness === 1 ? true : row.has_chronic_illness === 0 ? false : undefined,
    chronicIllnessSummary: row.chronic_illness_summary || undefined,
    currentMedications: row.current_medications || undefined,
    hasAllergies: row.has_allergies === 1 ? true : row.has_allergies === 0 ? false : undefined,
    allergySummary: row.allergy_summary || undefined,
    numberOfSiblings: row.number_of_siblings ?? undefined,
    birthOrder: row.birth_order ?? undefined,
    motherAlive: row.mother_alive === 1 ? true : row.mother_alive === 0 ? false : undefined,
    fatherAlive: row.father_alive === 1 ? true : row.father_alive === 0 ? false : undefined,
    parentMaritalStatus: row.parent_marital_status || undefined,
    familyPsychiatricNote: row.family_psychiatric_note || undefined,
    hasPreviousTherapy: row.has_previous_therapy === 1 ? true : row.has_previous_therapy === 0 ? false : undefined,
    previousTherapySummary: row.previous_therapy_summary || undefined,
    hasPsychiatricMedication: row.has_psychiatric_medication === 1 ? true : row.has_psychiatric_medication === 0 ? false : undefined,
    psychiatricMedicationNote: row.psychiatric_medication_note || undefined,
    therapyExpectations: row.therapy_expectations || undefined,
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
      gender, national_id, nationality, occupation, marital_status,
      education_level, number_of_children, address, city, living_with,
      insurance_info, referral_source, referral_detail,
      emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
      notes, has_chronic_illness, chronic_illness_summary, current_medications,
      has_allergies, allergy_summary, number_of_siblings, birth_order,
      mother_alive, father_alive, parent_marital_status, family_psychiatric_note,
      has_previous_therapy, previous_therapy_summary, has_psychiatric_medication,
      psychiatric_medication_note, therapy_expectations,
      session_fee, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    data.firstName,
    data.lastName,
    data.phone || null,
    data.email || null,
    data.dateOfBirth || null,
    data.gender || null,
    data.nationalId || null,
    data.nationality || null,
    data.occupation || null,
    data.maritalStatus || null,
    data.educationLevel || null,
    data.numberOfChildren ?? null,
    data.address || null,
    data.city || null,
    data.livingWith || null,
    data.insuranceInfo || null,
    data.referralSource || null,
    data.referralDetail || null,
    data.emergencyContactName || null,
    data.emergencyContactPhone || null,
    data.emergencyContactRelation || null,
    data.notes || null,
    data.hasChronicIllness != null ? (data.hasChronicIllness ? 1 : 0) : null,
    data.chronicIllnessSummary || null,
    data.currentMedications || null,
    data.hasAllergies != null ? (data.hasAllergies ? 1 : 0) : null,
    data.allergySummary || null,
    data.numberOfSiblings ?? null,
    data.birthOrder ?? null,
    data.motherAlive != null ? (data.motherAlive ? 1 : 0) : null,
    data.fatherAlive != null ? (data.fatherAlive ? 1 : 0) : null,
    data.parentMaritalStatus || null,
    data.familyPsychiatricNote || null,
    data.hasPreviousTherapy != null ? (data.hasPreviousTherapy ? 1 : 0) : null,
    data.previousTherapySummary || null,
    data.hasPsychiatricMedication != null ? (data.hasPsychiatricMedication ? 1 : 0) : null,
    data.psychiatricMedicationNote || null,
    data.therapyExpectations || null,
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
    nationalId: 'national_id',
    nationality: 'nationality',
    occupation: 'occupation',
    maritalStatus: 'marital_status',
    educationLevel: 'education_level',
    numberOfChildren: 'number_of_children',
    address: 'address',
    city: 'city',
    livingWith: 'living_with',
    insuranceInfo: 'insurance_info',
    referralSource: 'referral_source',
    referralDetail: 'referral_detail',
    emergencyContactName: 'emergency_contact_name',
    emergencyContactPhone: 'emergency_contact_phone',
    emergencyContactRelation: 'emergency_contact_relation',
    notes: 'notes',
    hasChronicIllness: 'has_chronic_illness',
    chronicIllnessSummary: 'chronic_illness_summary',
    currentMedications: 'current_medications',
    hasAllergies: 'has_allergies',
    allergySummary: 'allergy_summary',
    numberOfSiblings: 'number_of_siblings',
    birthOrder: 'birth_order',
    motherAlive: 'mother_alive',
    fatherAlive: 'father_alive',
    parentMaritalStatus: 'parent_marital_status',
    familyPsychiatricNote: 'family_psychiatric_note',
    hasPreviousTherapy: 'has_previous_therapy',
    previousTherapySummary: 'previous_therapy_summary',
    hasPsychiatricMedication: 'has_psychiatric_medication',
    psychiatricMedicationNote: 'psychiatric_medication_note',
    therapyExpectations: 'therapy_expectations',
    sessionFee: 'session_fee',
  };

  const boolFields = new Set([
    'hasChronicIllness', 'hasAllergies', 'motherAlive', 'fatherAlive',
    'hasPreviousTherapy', 'hasPsychiatricMedication',
  ]);

  for (const [key, column] of Object.entries(fieldMap)) {
    if (key in data) {
      fields.push(`${column} = ?`);
      let val = (data as any)[key] ?? null;
      if (boolFields.has(key) && val != null) val = val ? 1 : 0;
      values.push(val);
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
