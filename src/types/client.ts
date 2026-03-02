export type EducationLevel = 'none' | 'primary' | 'secondary' | 'high_school' | 'associate' | 'bachelor' | 'master' | 'doctorate';
export type LivingWith = 'alone' | 'spouse' | 'family' | 'roommate' | 'other';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationalId?: string;
  nationality?: string;
  occupation?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'other';
  educationLevel?: EducationLevel;
  numberOfChildren?: number;
  address?: string;
  city?: string;
  livingWith?: LivingWith;
  insuranceInfo?: string;
  referralSource?: string;
  referralDetail?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  notes?: string;
  // Health summary (intake-level)
  hasChronicIllness?: boolean;
  chronicIllnessSummary?: string;
  currentMedications?: string;
  hasAllergies?: boolean;
  allergySummary?: string;
  // Family summary (intake-level)
  numberOfSiblings?: number;
  birthOrder?: number;
  motherAlive?: boolean;
  fatherAlive?: boolean;
  parentMaritalStatus?: string;
  familyPsychiatricNote?: string;
  // Therapy history summary
  hasPreviousTherapy?: boolean;
  previousTherapySummary?: string;
  hasPsychiatricMedication?: boolean;
  psychiatricMedicationNote?: string;
  therapyExpectations?: string;
  // System fields
  status: 'active' | 'archived';
  sessionFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientWithStats extends Client {
  totalSessions: number;
  nextSessionDate?: string;
  lastSessionDate?: string;
  anamnesisCompletion: number;
}

export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
