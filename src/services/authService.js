import { API_BASE_URL } from '../constants';
import { getToken, setToken, removeToken, getAuthHeaders } from './config/config';

// Authentication functions
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error de autenticación');
    }
    
    if (data.access_token) {
      setToken(data.access_token);
    } else {
      throw new Error('No se recibió un token válido');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  removeToken();
  window.location.href = '/login';
};

export const isAuthenticated = async () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: getAuthHeaders(),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}; 