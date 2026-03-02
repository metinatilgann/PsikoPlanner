export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: { email: string };
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  DashboardTab: undefined;
  CalendarTab: undefined;
  ClientsTab: undefined;
  SettingsTab: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type CalendarStackParamList = {
  Calendar: undefined;
  DayDetail: { date: string };
  AddSession: { date?: string; clientId?: string };
};

export type ClientStackParamList = {
  ClientList: undefined;
  AddEditClient: { clientId?: string };
  ClientDetail: { clientId: string };
  ClientSessions: { clientId: string };
  AnamnesisOverview: { clientId: string };
  FamilyHistory: { clientId: string };
  MedicalHistory: { clientId: string };
  PsychologicalHistory: { clientId: string };
  Medications: { clientId: string };
  PresentingProblem: { clientId: string };
  SessionDetail: { sessionId: string };
  SessionNotes: { sessionId: string };
  SessionEvaluation: { sessionId: string };
  SessionSummary: { clientId: string };
  ReportSelection: { clientId: string };
  ReportPreview: { reportType: string; clientId: string; sessionId?: string };
  ArchivedClients: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Security: undefined;
  NotificationSettings: undefined;
  BackupRestore: undefined;
  Language: undefined;
  Theme: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
};
