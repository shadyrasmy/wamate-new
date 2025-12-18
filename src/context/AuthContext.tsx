'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    plan: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
    checkAuth: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse user', e);
                localStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    const checkAuth = () => {
        return !!localStorage.getItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
