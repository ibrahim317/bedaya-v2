import { QueryPayload } from '@/types/Query';
import { IReport } from '@/models/main/Report';

const API_BASE_URL = '/api/reports';

export const getReports = async (): Promise<IReport[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }
  return response.json();
};

export const getReportById = async (id: string): Promise<IReport> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch report');
  }
  return response.json();
};

export const saveReport = async (report: {
  name: string;
  description: string;
  query: QueryPayload;
}): Promise<any> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save report');
  }

  return response.json();
};

export const updateReport = async (
  id: string,
  report: Partial<IReport>
): Promise<IReport> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update report');
  }

  return response.json();
};

export const deleteReport = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete report');
  }
};

export const deleteBulkReports = async (ids: string[]): Promise<void> => {
  const response = await fetch(API_BASE_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete reports');
  }
}; 