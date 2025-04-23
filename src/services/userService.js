import { API_BASE_URL, COMPANY_ID, SITE_ID } from '../constants';
import { getAuthHeaders } from './config/config';

// User management functions
export const getUsers = async (companyId = COMPANY_ID, siteId = SITE_ID) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user?companyId=${companyId}&siteId=${siteId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta al obtener usuarios:', errorText);
      throw new Error(`Error al obtener usuarios: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al obtener usuario con id ${id}:`, errorText);
      throw new Error(`Error al obtener usuario: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    // Ensure companyId is set to 2
    const data = {
      ...userData,
      companyId: userData.companyId || COMPANY_ID,
      siteId: userData.siteId || SITE_ID
    };
    
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta al crear usuario:', errorText);
      throw new Error(`Error al crear usuario: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    // Ensure companyId is set to 2
    const data = {
      ...userData,
      companyId: userData.companyId || COMPANY_ID,
      siteId: userData.siteId || SITE_ID
    };
    
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al actualizar usuario con id ${id}:`, errorText);
      throw new Error(`Error al actualizar usuario: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al eliminar usuario con id ${id}:`, errorText);
      throw new Error(`Error al eliminar usuario: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
}; 