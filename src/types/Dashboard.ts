export interface DashboardStats {
  patientCount: number;
  userCount: number;
  clinicCount: number;
  drugCount: number;
  dispensedMedicationCount: number;
  patientsPerClinic: {
    clinicName: string;
    patientCount: number;
    type: string;
  }[];
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
  labTotals: {
    [patientType: string]: {
      labTotalIn: number;
      labTotalOut: number;
      labTotalNotRequested: number;
    };
  };
}