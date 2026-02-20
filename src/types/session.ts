export type SessionType = 'individual' | 'couple' | 'family' | 'group' | 'online' | 'assessment';
export type SessionStatus = 'planned' | 'completed' | 'cancelled' | 'no_show';
export type NoteType = 'general' | 'subjective' | 'objective' | 'assessment' | 'plan';
export type RiskLevel = 'none' | 'low' | 'moderate' | 'high' | 'critical';
export type PaymentMethod = 'cash' | 'credit_card' | 'bank_transfer' | 'insurance' | 'other';

export interface Session {
  id: string;
  clientId: string;
  sessionNumber: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  sessionType: SessionType;
  status: SessionStatus;
  fee: number;
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
  location?: string;
  notificationId?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionWithClient extends Session {
  clientFirstName: string;
  clientLastName: string;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  noteType: NoteType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionEvaluation {
  id: string;
  sessionId: string;
  clientMood?: number;
  clientEngagement?: number;
  therapeuticAlliance?: number;
  progressRating?: number;
  riskLevel?: RiskLevel;
  techniquesUsed?: string[];
  homeworkAssigned?: string;
  homeworkCompleted?: string;
  nextSessionFocus?: string;
  therapistObservations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionSummary {
  id: string;
  clientId: string;
  periodStart: string;
  periodEnd: string;
  totalSessions: number;
  summaryText: string;
  progressNotes?: string;
  recommendations?: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionFormData = Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'sessionNumber'>;

export interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  totalRevenue: number;
  paidRevenue: number;
}
