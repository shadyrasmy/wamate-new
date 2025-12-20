export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Socket URL logic:
// 1. Use NEXT_PUBLIC_SOCKET_URL if provided
// 2. If API_URL is absolute, use its base
// 3. Fallback to empty string (will use same origin via proxy)
export const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    (API_URL.startsWith('http') ? API_URL.replace(/\/api\/?$/, '') : '');

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json();

    if (!res.ok) {
        if (res.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        throw new Error(data.message || 'API Error');
    }

    return data;
}

export async function uploadFile(file: File) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/chat/upload`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
}
