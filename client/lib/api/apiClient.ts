export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  let response = await fetch(`${baseUrl}${endpoint}`, config);

  if (response.status === 401 && endpoint !== '/auth/refresh') {
    const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshResponse.ok) {
      throw new Error('Session expired');
    }

    response = await fetch(`${baseUrl}${endpoint}`, config);
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
