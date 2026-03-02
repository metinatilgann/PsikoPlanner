import type { SQLiteDatabase } from 'expo-sqlite';

interface Migration {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
}

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db: SQLiteDatabase) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS clients (
          id TEXT PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          date_of_birth TEXT,
          gender TEXT CHECK(gender IN ('male','female','other','prefer_not_to_say')),
          occupation TEXT,
          marital_status TEXT CHECK(marital_status IN ('single','married','divorced','widowed','separated','other')),
          referral_source TEXT,
          emergency_contact_name TEXT,
          emergency_contact_phone TEXT,
          notes TEXT,
          status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','archived')),
          session_fee REAL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
        CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(last_name, first_name);

        CREATE TABLE IF NOT EXISTS anamnesis_family_history (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          mother_info TEXT,
          father_info TEXT,
          siblings_info TEXT,
          family_psychiatric_history TEXT,
          family_medical_history TEXT,
          family_dynamics TEXT,
          childhood_environment TEXT,
          significant_events TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE(client_id)
        );

        CREATE TABLE IF NOT EXISTS anamnesis_medical_history (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          chronic_conditions TEXT,
          past_surgeries TEXT,
          allergies TEXT,
          current_physical_complaints TEXT,
          sleep_patterns TEXT,
          appetite_changes TEXT,
          substance_use TEXT,
          head_injuries TEXT,
          neurological_history TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE(client_id)
        );

        CREATE TABLE IF NOT EXISTS anamnesis_psychological_history (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          previous_diagnoses TEXT,
          previous_treatments TEXT,
          previous_hospitalizations TEXT,
          suicide_self_harm_history TEXT,
          trauma_history TEXT,
          coping_mechanisms TEXT,
          strengths TEXT,
          social_support TEXT,
          educational_history TEXT,
          occupational_history TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE(client_id)
        );

        CREATE TABLE IF NOT EXISTS anamnesis_medications (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          medication_name TEXT NOT NULL,
          dosage TEXT,
          frequency TEXT,
          prescribing_doctor TEXT,
          start_date TEXT,
          end_date TEXT,
          purpose TEXT,
          side_effects TEXT,
          is_active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_medications_client ON anamnesis_medications(client_id);

        CREATE TABLE IF NOT EXISTS anamnesis_presenting_problem (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          chief_complaint TEXT,
          onset_date TEXT,
          duration TEXT,
          severity INTEGER CHECK(severity BETWEEN 1 AND 10),
          triggers TEXT,
          alleviating_factors TEXT,
          impact_on_daily_life TEXT,
          goals_for_therapy TEXT,
          previous_attempts TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE(client_id)
        );

        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          session_number INTEGER NOT NULL,
          session_date TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          duration_minutes INTEGER,
          session_type TEXT NOT NULL DEFAULT 'individual'
            CHECK(session_type IN ('individual','couple','family','group','online','assessment')),
          status TEXT NOT NULL DEFAULT 'planned'
            CHECK(status IN ('planned','completed','cancelled','no_show')),
          fee REAL DEFAULT 0,
          is_paid INTEGER NOT NULL DEFAULT 0,
          payment_method TEXT CHECK(payment_method IN ('cash','credit_card','bank_transfer','insurance','other')),
          location TEXT,
          notification_id TEXT,
          cancellation_reason TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_sessions_client ON sessions(client_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
        CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

        CREATE TABLE IF NOT EXISTS session_notes (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
          note_type TEXT NOT NULL DEFAULT 'general'
            CHECK(note_type IN ('general','subjective','objective','assessment','plan')),
          content TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE(session_id, note_type)
        );

        CREATE TABLE IF NOT EXISTS session_evaluations (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
          client_mood INTEGER CHECK(client_mood BETWEEN 1 AND 10),
          client_engagement INTEGER CHECK(client_engagement BETWEEN 1 AND 10),
          therapeutic_alliance INTEGER CHECK(therapeutic_alliance BETWEEN 1 AND 10),
          progress_rating INTEGER CHECK(progress_rating BETWEEN 1 AND 10),
          risk_level TEXT CHECK(risk_level IN ('none','low','moderate','high','critical')),
          techniques_used TEXT,
          homework_assigned TEXT,
          homework_completed TEXT,
          next_session_focus TEXT,
          therapist_observations TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE(session_id)
        );

        CREATE TABLE IF NOT EXISTS session_summaries (
          id TEXT PRIMARY KEY,
          client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
          period_start TEXT NOT NULL,
          period_end TEXT NOT NULL,
          total_sessions INTEGER NOT NULL,
          summary_text TEXT NOT NULL,
          progress_notes TEXT,
          recommendations TEXT,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_summaries_client ON session_summaries(client_id);

        CREATE TABLE IF NOT EXISTS backup_log (
          id TEXT PRIMARY KEY,
          backup_date TEXT NOT NULL DEFAULT (datetime('now')),
          file_name TEXT NOT NULL,
          file_size INTEGER,
          status TEXT NOT NULL CHECK(status IN ('success','failed')),
          notes TEXT
        );
      `);
    },
  },
  {
    version: 2,
    up: async (db: SQLiteDatabase) => {
      await db.execAsync(`
        ALTER TABLE clients ADD COLUMN national_id TEXT;
        ALTER TABLE clients ADD COLUMN nationality TEXT;
        ALTER TABLE clients ADD COLUMN education_level TEXT CHECK(education_level IN ('none','primary','secondary','high_school','associate','bachelor','master','doctorate'));
        ALTER TABLE clients ADD COLUMN number_of_children INTEGER;
        ALTER TABLE clients ADD COLUMN address TEXT;
        ALTER TABLE clients ADD COLUMN city TEXT;
        ALTER TABLE clients ADD COLUMN living_with TEXT CHECK(living_with IN ('alone','spouse','family','roommate','other'));
        ALTER TABLE clients ADD COLUMN insurance_info TEXT;
        ALTER TABLE clients ADD COLUMN referral_detail TEXT;
        ALTER TABLE clients ADD COLUMN emergency_contact_relation TEXT;
      `);
    },
  },
  {
    version: 3,
    up: async (db: SQLiteDatabase) => {
      await db.execAsync(`
        ALTER TABLE clients ADD COLUMN has_chronic_illness INTEGER DEFAULT 0;
        ALTER TABLE clients ADD COLUMN chronic_illness_summary TEXT;
        ALTER TABLE clients ADD COLUMN current_medications TEXT;
        ALTER TABLE clients ADD COLUMN has_allergies INTEGER DEFAULT 0;
        ALTER TABLE clients ADD COLUMN allergy_summary TEXT;
        ALTER TABLE clients ADD COLUMN number_of_siblings INTEGER;
        ALTER TABLE clients ADD COLUMN birth_order INTEGER;
        ALTER TABLE clients ADD COLUMN mother_alive INTEGER;
        ALTER TABLE clients ADD COLUMN father_alive INTEGER;
        ALTER TABLE clients ADD COLUMN parent_marital_status TEXT;
        ALTER TABLE clients ADD COLUMN family_psychiatric_note TEXT;
        ALTER TABLE clients ADD COLUMN has_previous_therapy INTEGER DEFAULT 0;
        ALTER TABLE clients ADD COLUMN previous_therapy_summary TEXT;
        ALTER TABLE clients ADD COLUMN has_psychiatric_medication INTEGER DEFAULT 0;
        ALTER TABLE clients ADD COLUMN psychiatric_medication_note TEXT;
        ALTER TABLE clients ADD COLUMN therapy_expectations TEXT;
      `);
    },
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const result = await db.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM schema_version'
  );
  const currentVersion = result?.version || 0;

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      await db.withTransactionAsync(async () => {
        await migration.up(db);
        await db.runAsync(
          'INSERT INTO schema_version (version) VALUES (?)',
          migration.version
        );
      });
    }
  }
}
