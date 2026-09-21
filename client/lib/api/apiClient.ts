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

  const handleUnauthorized = async () => {
    if (typeof window !== 'undefined') {
      try {
        await fetch(`${baseUrl}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch {}

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  };

  let response = await fetch(`${baseUrl}${endpoint}`, config);

  if (response.status === 401 && endpoint !== '/auth/refresh') {
    const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshResponse.ok) {
      await handleUnauthorized();
      throw new Error('Session expired');
    }

    response = await fetch(`${baseUrl}${endpoint}`, config);
  }

  if (!response.ok) {
    if (response.status === 401) {
      await handleUnauthorized();
    }

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
