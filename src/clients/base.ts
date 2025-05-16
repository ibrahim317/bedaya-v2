interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class HttpError extends Error {
  constructor(public response: Response, message?: string) {
    super(message ?? `HTTP Error ${response.status}`);
  }
}

// Helper to get the base URL for API calls
function getBaseUrl() {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  // Client-side
  return window.location.origin;
}

export async function fetchJson<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Ensure URL is absolute
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Add query parameters if they exist
  let finalUrl = fullUrl;
  if (params) {
    const searchParams = new URLSearchParams(params);
    finalUrl = `${fullUrl}?${searchParams.toString()}`;
  }

  const response = await fetch(finalUrl, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  // Handle non-2xx responses
  if (!response.ok) {
    throw new HttpError(response);
  }

  // Parse JSON response
  const data = await response.json();
  return data as T;
} 