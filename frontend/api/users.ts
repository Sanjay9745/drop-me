import api from './api';

interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
    };
    success: boolean;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/users/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        } else {
            throw new Error('Login failed');
        }
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const signup = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string // Add phone number
): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/users/signup', {
            name,
            email,
            password,
            phoneNumber, // Include phone number in the request
        });
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        } else {
            throw new Error('Signup failed');
        }
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};