import { useEffect, useState } from 'react';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    title?: string;
    username: string;
    email: string;
    phone: string;
    image?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    emailVerified?: string;
    phoneVerified: boolean;
    subscribeNewsletter: boolean;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const user = await response.json();
                    setState({
                        user,
                        isLoading: false,
                        isAuthenticated: true,
                        error: null,
                    });
                } else {
                    setState({
                        user: null,
                        isLoading: false,
                        isAuthenticated: false,
                        error: null,
                    });
                }
            } catch (err) {
                setState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                    error: err instanceof Error ? err.message : 'Failed to fetch user',
                });
            }
        };

        fetchUser();
    }, []);

    return state;
}
