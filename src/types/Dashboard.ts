export interface DashboardStats {
  patientCount: number;
  userCount: number;
  clinicCount: number;
  drugCount: number;
  dispensedMedicationCount: number;
  dailyPatientCounts: {
    date: string;
    count: number;
  }[];
} 