import axios from 'axios';
import { UserRegister } from '../interfaces/User';

const API_URL = 'https://back-deployp1.onrender.com/auth'

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        sessionStorage.setItem('token', response.data.access_token)
        sessionStorage.setItem('user_id', response.data.user_id)
        sessionStorage.setItem('user_email', response.data.user_email)
        return response.data; // Token or user data  
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (user: UserRegister) => {
    try {
        const response = await axios.post(`${API_URL}/register`, user);
        return response.data; // Confirmation or user data
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const logout = () => {
    // Clear local storage or cookies
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_email');
};

export const getCurrentUser = () => {
    //const token = localStorage.getItem('token');
    const user = sessionStorage.getItem('user_id')
    if (!user) return null;

    // Decode token or fetch user data
    return parseInt(user);
};

export const getHeaders = () => {
    const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local

    // Define los encabezados base
    const headers = {
        'Content-Type': 'application/json', // Indica que se envía/recibe JSON
    };

    // Si hay un token, añádelo al encabezado "Authorization"
    if (token) {
        return {
            ...headers,
            Authorization: `Bearer ${token}`, // Añade el token en el formato Bearer
        };
    }

    // Si no hay token, devuelve solo los encabezados base
    return headers;
};