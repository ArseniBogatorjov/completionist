export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const fullUrl = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        }
    }

    let response = await fetch(fullUrl, config);

    if(response.status === 401 && !endpoint.startsWith('/auth/')) {
        const refreshRes = await fetch(fullUrl, {method: "POST", credentials: 'include'})

        if(refreshRes.ok) {
            response = await fetch(`${BASE_URL}/auth/refresh`, config)
        } else {
            window.location.href = '/login';
            throw new Error('Session expired');
        }
    }


    if(!response.ok) {
        throw new Error('Unable to retrieve response from API');
    }

    return response.json();
}