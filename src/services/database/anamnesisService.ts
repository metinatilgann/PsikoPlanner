import type { SQLiteDatabase } from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import type {
  FamilyHistory, MedicalHistory, PsychologicalHistory,
  Medication, PresentingProblem, AnamnesisCompletion
} from '../../types/anamnesis';

// ─── Family History ───
export async function upsertFamilyHistory(
  db: SQLiteDatabase, clientId: string, data: Partial<FamilyHistory>
): Promise<void> {
  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM anamnesis_family_history WHERE client_id = ?', clientId
  );
  const siblingsJson = data.siblingsInfo ? JSON.stringify(data.siblingsInfo) : null;

  if (existing) {
    await db.runAsync(
      `UPDATE anamnesis_family_history SET
        mother_info=?, father_info=?, siblings_info=?, family_psychiatric_history=?,
        family_medical_history=?, family_dynamics=?, childhood_environment=?,
        significant_events=?, updated_at=datetime('now') WHERE id=?`,
      data.motherInfo||null, data.fatherInfo||null, siblingsJson,
      data.familyPsychiatricHistory||null, data.familyMedicalHistory||null,
      data.familyDynamics||null, data.childhoodEnvironment||null,
      data.significantEvents||null, existing.id
    );
  } else {
    await db.runAsync(
      `INSERT INTO anamnesis_family_history (id, client_id, mother_info, father_info,
        siblings_info, family_psychiatric_history, family_medical_history,
        family_dynamics, childhood_environment, significant_events, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
      uuidv4(), clientId, data.motherInfo||null, data.fatherInfo||null, siblingsJson,
      data.familyPsychiatricHistory||null, data.familyMedicalHistory||null,
      data.familyDynamics||null, data.childhoodEnvironment||null, data.significantEvents||null
    );
  }
}

export async function getFamilyHistory(
  db: SQLiteDatabase, clientId: string
): Promise<FamilyHistory | null> {
  const row: any = await db.getFirstAsync(
    'SELECT * FROM anamnesis_family_history WHERE client_id = ?', clientId
  );
  if (!row) return null;
  return {
    id: row.id, clientId: row.client_id,
    motherInfo: row.mother_info||undefined, fatherInfo: row.father_info||undefined,
    siblingsInfo: row.siblings_info ? JSON.parse(row.siblings_info) : undefined,
    familyPsychiatricHistory: row.family_psychiatric_history||undefined,
    familyMedicalHistory: row.family_medical_history||undefined,
    familyDynamics: row.family_dynamics||undefined,
    childhoodEnvironment: row.childhood_environment||undefined,
    significantEvents: row.significant_events||undefined,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

// ─── Medical History ───
export async function upsertMedicalHistory(
  db: SQLiteDatabase, clientId: string, data: Partial<MedicalHistory>
): Promise<void> {
  const substanceJson = data.substanceUse ? JSON.stringify(data.substanceUse) : null;
  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM anamnesis_medical_history WHERE client_id = ?', clientId
  );

  if (existing) {
    await db.runAsync(
      `UPDATE anamnesis_medical_history SET
        chronic_conditions=?, past_surgeries=?, allergies=?,
        current_physical_complaints=?, sleep_patterns=?, appetite_changes=?,
        substance_use=?, head_injuries=?, neurological_history=?,
        updated_at=datetime('now') WHERE id=?`,
      data.chronicConditions||null, data.pastSurgeries||null, data.allergies||null,
      data.currentPhysicalComplaints||null, data.sleepPatterns||null,
      data.appetiteChanges||null, substanceJson, data.headInjuries||null,
      data.neurologicalHistory||null, existing.id
    );
  } else {
    await db.runAsync(
      `INSERT INTO anamnesis_medical_history (id, client_id, chronic_conditions,
        past_surgeries, allergies, current_physical_complaints, sleep_patterns,
        appetite_changes, substance_use, head_injuries, neurological_history,
        created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
      uuidv4(), clientId, data.chronicConditions||null, data.pastSurgeries||null,
      data.allergies||null, data.currentPhysicalComplaints||null, data.sleepPatterns||null,
      data.appetiteChanges||null, substanceJson, data.headInjuries||null,
      data.neurologicalHistory||null
    );
  }
}

export async function getMedicalHistory(
  db: SQLiteDatabase, clientId: string
): Promise<MedicalHistory | null> {
  const row: any = await db.getFirstAsync(
    'SELECT * FROM anamnesis_medical_history WHERE client_id = ?', clientId
  );
  if (!row) return null;
  return {
    id: row.id, clientId: row.client_id,
    chronicConditions: row.chronic_conditions||undefined,
    pastSurgeries: row.past_surgeries||undefined,
    allergies: row.allergies||undefined,
    currentPhysicalComplaints: row.current_physical_complaints||undefined,
    sleepPatterns: row.sleep_patterns||undefined,
    appetiteChanges: row.appetite_changes||undefined,
    substanceUse: row.substance_use ? JSON.parse(row.substance_use) : undefined,
    headInjuries: row.head_injuries||undefined,
    neurologicalHistory: row.neurological_history||undefined,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

// ─── Psychological History ───
export async function upsertPsychologicalHistory(
  db: SQLiteDatabase, clientId: string, data: Partial<PsychologicalHistory>
): Promise<void> {
  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM anamnesis_psychological_history WHERE client_id = ?', clientId
  );

  if (existing) {
    await db.runAsync(
      `UPDATE anamnesis_psychological_history SET
        previous_diagnoses=?, previous_treatments=?, previous_hospitalizations=?,
        suicide_self_harm_history=?, trauma_history=?, coping_mechanisms=?,
        strengths=?, social_support=?, educational_history=?, occupational_history=?,
        updated_at=datetime('now') WHERE id=?`,
      data.previousDiagnoses||null, data.previousTreatments||null,
      data.previousHospitalizations||null, data.suicideSelfHarmHistory||null,
      data.traumaHistory||null, data.copingMechanisms||null, data.strengths||null,
      data.socialSupport||null, data.educationalHistory||null,
      data.occupationalHistory||null, existing.id
    );
  } else {
    await db.runAsync(
      `INSERT INTO anamnesis_psychological_history (id, client_id, previous_diagnoses,
        previous_treatments, previous_hospitalizations, suicide_self_harm_history,
        trauma_history, coping_mechanisms, strengths, social_support,
        educational_history, occupational_history, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
      uuidv4(), clientId, data.previousDiagnoses||null, data.previousTreatments||null,
      data.previousHospitalizations||null, data.suicideSelfHarmHistory||null,
      data.traumaHistory||null, data.copingMechanisms||null, data.strengths||null,
      data.socialSupport||null, data.educationalHistory||null, data.occupationalHistory||null
    );
  }
}

export async function getPsychologicalHistory(
  db: SQLiteDatabase, clientId: string
): Promise<PsychologicalHistory | null> {
  const row: any = await db.getFirstAsync(
    'SELECT * FROM anamnesis_psychological_history WHERE client_id = ?', clientId
  );
  if (!row) return null;
  return {
    id: row.id, clientId: row.client_id,
    previousDiagnoses: row.previous_diagnoses||undefined,
    previousTreatments: row.previous_treatments||undefined,
    previousHospitalizations: row.previous_hospitalizations||undefined,
    suicideSelfHarmHistory: row.suicide_self_harm_history||undefined,
    traumaHistory: row.trauma_history||undefined,
    copingMechanisms: row.coping_mechanisms||undefined,
    strengths: row.strengths||undefined,
    socialSupport: row.social_support||undefined,
    educationalHistory: row.educational_history||undefined,
    occupationalHistory: row.occupational_history||undefined,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

// ─── Medications ───
export async function addMedication(
  db: SQLiteDatabase, clientId: string, data: Partial<Medication>
): Promise<void> {
  await db.runAsync(
    `INSERT INTO anamnesis_medications (id, client_id, medication_name, dosage,
      frequency, prescribing_doctor, start_date, end_date, purpose, side_effects,
      is_active, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
    uuidv4(), clientId, data.medicationName||'', data.dosage||null,
    data.frequency||null, data.prescribingDoctor||null, data.startDate||null,
    data.endDate||null, data.purpose||null, data.sideEffects||null,
    data.isActive !== false ? 1 : 0
  );
}

export async function updateMedication(
  db: SQLiteDatabase, id: string, data: Partial<Medication>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  const map: Record<string, string> = {
    medicationName: 'medication_name', dosage: 'dosage', frequency: 'frequency',
    prescribingDoctor: 'prescribing_doctor', startDate: 'start_date',
    endDate: 'end_date', purpose: 'purpose', sideEffects: 'side_effects',
  };
  for (const [k, col] of Object.entries(map)) {
    if (k in data) { fields.push(`${col}=?`); values.push((data as any)[k]||null); }
  }
  if ('isActive' in data) { fields.push('is_active=?'); values.push(data.isActive ? 1 : 0); }
  if (fields.length === 0) return;
  fields.push("updated_at=datetime('now')");
  values.push(id);
  await db.runAsync(`UPDATE anamnesis_medications SET ${fields.join(',')} WHERE id=?`, ...values);
}

export async function deleteMedication(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM anamnesis_medications WHERE id = ?', id);
}

export async function getMedicationsByClient(
  db: SQLiteDatabase, clientId: string
): Promise<Medication[]> {
  const rows = await db.getAllAsync(
    'SELECT * FROM anamnesis_medications WHERE client_id = ? ORDER BY is_active DESC, medication_name',
    clientId
  );
  return rows.map((r: any) => ({
    id: r.id, clientId: r.client_id, medicationName: r.medication_name,
    dosage: r.dosage||undefined, frequency: r.frequency||undefined,
    prescribingDoctor: r.prescribing_doctor||undefined,
    startDate: r.start_date||undefined, endDate: r.end_date||undefined,
    purpose: r.purpose||undefined, sideEffects: r.side_effects||undefined,
    isActive: !!r.is_active, createdAt: r.created_at, updatedAt: r.updated_at,
  }));
}

// ─── Presenting Problem ───
export async function upsertPresentingProblem(
  db: SQLiteDatabase, clientId: string, data: Partial<PresentingProblem>
): Promise<void> {
  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM anamnesis_presenting_problem WHERE client_id = ?', clientId
  );

  if (existing) {
    await db.runAsync(
      `UPDATE anamnesis_presenting_problem SET
        chief_complaint=?, onset_date=?, duration=?, severity=?, triggers=?,
        alleviating_factors=?, impact_on_daily_life=?, goals_for_therapy=?,
        previous_attempts=?, updated_at=datetime('now') WHERE id=?`,
      data.chiefComplaint||null, data.onsetDate||null, data.duration||null,
      data.severity??null, data.triggers||null, data.alleviatingFactors||null,
      data.impactOnDailyLife||null, data.goalsForTherapy||null,
      data.previousAttempts||null, existing.id
    );
  } else {
    await db.runAsync(
      `INSERT INTO anamnesis_presenting_problem (id, client_id, chief_complaint,
        onset_date, duration, severity, triggers, alleviating_factors,
        impact_on_daily_life, goals_for_therapy, previous_attempts, created_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,datetime('now'),datetime('now'))`,
      uuidv4(), clientId, data.chiefComplaint||null, data.onsetDate||null,
      data.duration||null, data.severity??null, data.triggers||null,
      data.alleviatingFactors||null, data.impactOnDailyLife||null,
      data.goalsForTherapy||null, data.previousAttempts||null
    );
  }
}

export async function getPresentingProblem(
  db: SQLiteDatabase, clientId: string
): Promise<PresentingProblem | null> {
  const row: any = await db.getFirstAsync(
    'SELECT * FROM anamnesis_presenting_problem WHERE client_id = ?', clientId
  );
  if (!row) return null;
  return {
    id: row.id, clientId: row.client_id,
    chiefComplaint: row.chief_complaint||undefined, onsetDate: row.onset_date||undefined,
    duration: row.duration||undefined, severity: row.severity??undefined,
    triggers: row.triggers||undefined, alleviatingFactors: row.alleviating_factors||undefined,
    impactOnDailyLife: row.impact_on_daily_life||undefined,
    goalsForTherapy: row.goals_for_therapy||undefined,
    previousAttempts: row.previous_attempts||undefined,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

// ─── Completion Check ───
export async function getAnamnesisCompletion(
  db: SQLiteDatabase, clientId: string
): Promise<AnamnesisCompletion> {
  const [fam, med, psy, meds, prob] = await Promise.all([
    db.getFirstAsync('SELECT id FROM anamnesis_family_history WHERE client_id=?', clientId),
    db.getFirstAsync('SELECT id FROM anamnesis_medical_history WHERE client_id=?', clientId),
    db.getFirstAsync('SELECT id FROM anamnesis_psychological_history WHERE client_id=?', clientId),
    db.getFirstAsync('SELECT id FROM anamnesis_medications WHERE client_id=? LIMIT 1', clientId),
    db.getFirstAsync('SELECT id FROM anamnesis_presenting_problem WHERE client_id=?', clientId),
  ]);

  const sections = [!!fam, !!med, !!psy, !!meds, !!prob];
  const completed = sections.filter(Boolean).length;

  return {
    familyHistory: !!fam,
    medicalHistory: !!med,
    psychologicalHistory: !!psy,
    medications: !!meds,
    presentingProblem: !!prob,
    percentage: Math.round((completed / 5) * 100),
  };
}
