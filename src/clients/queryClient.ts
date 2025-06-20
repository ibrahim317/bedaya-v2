import { QueryPayload } from '@/types/Query';

const API_BASE_URL = '/api/query';

export const getAvailableCollections = async (): Promise<string[]> => {
  const response = await fetch(API_BASE_URL, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }
  return response.json();
};

export const getCollectionSchema = async (
  collectionName: string
): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}?collection=${collectionName}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch collection schema');
  }
  return response.json();
};

export const getQueryResults = async (payload: QueryPayload): Promise<any[]> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch query results');
  }
  return response.json();
}; 