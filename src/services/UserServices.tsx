import axios, { AxiosResponse } from 'axios';
import { User } from '../interfaces/User';

const BASE_URL = 'https://back-deployp1.onrender.com/api/user'

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export class UserServices {
  // Método para obtener todos los usuarios
  static async getAllUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await axios.get(`${BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Método para registrar un nuevo usuario
  static async registerUser(userData: RegisterRequest): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axios.post(`${BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Método para iniciar sesión
  static async loginUser(credentials: LoginRequest): Promise<{ token: string }> {
    try {
      const response: AxiosResponse<{ token: string }> = await axios.post(`${BASE_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async getByEmail(email: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axios.get(`${BASE_URL}/get-by-email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Método para obtener el perfil del usuario autenticado
  static async getProfile(token: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Método para actualizar los datos del usuario
  static async updateUser(userId: number, updatedData: Partial<User>, token: string): Promise<User> {
    try {
      const response: AxiosResponse<User> = await axios.put(`${BASE_URL}/users/${userId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Método para eliminar un usuario
  static async deleteUser(userId: number, token: string): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}