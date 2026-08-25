let refreshPromise: Promise<Response> | null = null;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const fullUrl = `${BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  let response = await fetch(fullUrl, config);

  if (response.status === 401 && !endpoint.startsWith('/auth/')) {
    if (!refreshPromise) {
      refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      }).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshRes = await refreshPromise;

    if (refreshRes.ok) {
      response = await fetch(fullUrl, config);
    } else {
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      errorMessage = Array.isArray(errorData.message)
        ? errorData.message[0]
        : errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
