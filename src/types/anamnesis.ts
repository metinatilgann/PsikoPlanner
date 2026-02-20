export interface SiblingInfo {
  name: string;
  age?: number;
  relationshipQuality?: string;
}

export interface SubstanceUse {
  alcohol: string;
  tobacco: string;
  drugs: string;
  details: string;
}

export interface FamilyHistory {
  id: string;
  clientId: string;
  motherInfo?: string;
  fatherInfo?: string;
  siblingsInfo?: SiblingInfo[];
  familyPsychiatricHistory?: string;
  familyMedicalHistory?: string;
  familyDynamics?: string;
  childhoodEnvironment?: string;
  significantEvents?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalHistory {
  id: string;
  clientId: string;
  chronicConditions?: string;
  pastSurgeries?: string;
  allergies?: string;
  currentPhysicalComplaints?: string;
  sleepPatterns?: string;
  appetiteChanges?: string;
  substanceUse?: SubstanceUse;
  headInjuries?: string;
  neurologicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PsychologicalHistory {
  id: string;
  clientId: string;
  previousDiagnoses?: string;
  previousTreatments?: string;
  previousHospitalizations?: string;
  suicideSelfHarmHistory?: string;
  traumaHistory?: string;
  copingMechanisms?: string;
  strengths?: string;
  socialSupport?: string;
  educationalHistory?: string;
  occupationalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  clientId: string;
  medicationName: string;
  dosage?: string;
  frequency?: string;
  prescribingDoctor?: string;
  startDate?: string;
  endDate?: string;
  purpose?: string;
  sideEffects?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PresentingProblem {
  id: string;
  clientId: string;
  chiefComplaint?: string;
  onsetDate?: string;
  duration?: string;
  severity?: number;
  triggers?: string;
  alleviatingFactors?: string;
  impactOnDailyLife?: string;
  goalsForTherapy?: string;
  previousAttempts?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnamnesisCompletion {
  familyHistory: boolean;
  medicalHistory: boolean;
  psychologicalHistory: boolean;
  medications: boolean;
  presentingProblem: boolean;
  percentage: number;
}
