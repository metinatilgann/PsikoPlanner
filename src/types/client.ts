export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  occupation?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'other';
  referralSource?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
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
