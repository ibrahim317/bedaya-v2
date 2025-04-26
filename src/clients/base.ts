interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class HttpError extends Error {
  constructor(public response: Response, message?: string) {
    super(message ?? `HTTP Error ${response.status}`);
  }
}

export async function fetchJson<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Add query parameters if they exist
  if (params) {
    const searchParams = new URLSearchParams(params);
    url = `${url}?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
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