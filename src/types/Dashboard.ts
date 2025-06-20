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
  adultPatientCount: number;
  childPatientCount: number;
  labTestStats: {
    [patientType: string]: {
      [labTestName: string]: {
        total: number;
        statuses: {
          [status: string]: number;
        };
      };
    };
  };
} 