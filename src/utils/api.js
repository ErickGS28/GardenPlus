// API utility functions
const API_BASE_URL = 'https://cambar.com.mx/api';

// Auth token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Headers with authentication
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

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

// Service management functions
export const getServices = async (companyId = 2, siteId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/service?companyId=${companyId}&siteId=${siteId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta al obtener servicios:', errorText);
      throw new Error(`Error al obtener servicios: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/service/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al obtener servicio con id ${id}:`, errorText);
      throw new Error(`Error al obtener servicio: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching service with id ${id}:`, error);
    throw error;
  }
};

export const addService = async (serviceData) => {
  try {
    // Asegurar que se incluyan los IDs estáticos
    const data = {
      ...serviceData,
      companyId: 2,
      siteId: 1
    };
    
    console.log('Enviando datos para crear servicio:', data);

    const response = await fetch(`${API_BASE_URL}/service/create`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log('Respuesta al crear servicio status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta al crear servicio:', errorText);
      throw new Error(`Error al crear servicio: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Respuesta al crear servicio:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (id, serviceData) => {
  try {
    // Asegurar que se incluyan los IDs estáticos
    const data = {
      ...serviceData,
      companyId: 2,
      siteId: 1
    };
    
    console.log(`Enviando datos para actualizar servicio ${id}:`, data);

    const response = await fetch(`${API_BASE_URL}/service/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log('Respuesta al actualizar servicio status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al actualizar servicio con id ${id}:`, errorText);
      throw new Error(`Error al actualizar servicio: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Respuesta al actualizar servicio:', responseData);
    return responseData;
  } catch (error) {
    console.error(`Error updating service with id ${id}:`, error);
    throw error;
  }
};

export const deleteService = async (id) => {
  try {
    console.log(`Eliminando servicio con id ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/service/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    console.log('Respuesta al eliminar servicio status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al eliminar servicio con id ${id}:`, errorText);
      throw new Error(`Error al eliminar servicio: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Respuesta al eliminar servicio:', responseData);
    return responseData;
  } catch (error) {
    console.error(`Error deleting service with id ${id}:`, error);
    throw error;
  }
};

// Post management functions
export const getPosts = async (companyId = 2, siteId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/post?companyId=${companyId}&siteId=${siteId}`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/post/${id}`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    throw error;
  }
};

export const addPost = async (postData) => {
  try {
    // Asegurar que se incluyan los IDs estáticos
    const data = {
      ...postData,
      companyId: 2,
      siteId: 1,
      authorId: 1
    };

    console.log('Enviando datos para crear post:', data);

    const response = await fetch(`${API_BASE_URL}/post`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Respuesta al crear post status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta al crear post:', errorText);
      throw new Error(`Error al crear post: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Respuesta al crear post:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    // Asegurar que se incluyan los IDs estáticos
    const data = {
      ...postData,
      companyId: 2,
      siteId: 1,
      authorId: 1
    };

    const response = await fetch(`${API_BASE_URL}/post/${id}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error updating post with id ${id}:`, error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/post/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error deleting post with id ${id}:`, error);
    throw error;
  }
};

// User management functions
export const getUsers = async (companyId = 1, siteId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user?companyId=${companyId}&siteId=${siteId}`, {
      headers: getAuthHeaders(),
    });
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
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
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
    return await response.json();
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};

// Gallery management functions
export const getGalleries = async (companyId = 1, siteId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery?companyId=${companyId}&siteId=${siteId}`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching galleries:', error);
    throw error;
  }
};

export const getGalleryById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching gallery with id ${id}:`, error);
    throw error;
  }
};

export const addGallery = async (galleryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galleryData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating gallery:', error);
    throw error;
  }
};

export const updateGallery = async (id, galleryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galleryData),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error updating gallery with id ${id}:`, error);
    throw error;
  }
};

export const deleteGallery = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error deleting gallery with id ${id}:`, error);
    throw error;
  }
};

export const updateGalleryMultimedia = async (id, multimediaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}/multimedia`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(multimediaData),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error updating gallery multimedia with id ${id}:`, error);
    throw error;
  }
};

// Cloudflare upload function
export const uploadToCloudflare = async (file) => {
  try {
    console.log('Iniciando carga de archivo a Cloudflare:', file.name, file.type, file.size);
    
    const formData = new FormData();
    formData.append('files', file);
    formData.append('companyId', '2');
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }
    
    console.log('Token de autenticación encontrado, longitud:', token.length);
    
    const response = await fetch(`${API_BASE_URL}/cloudflare/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    
    console.log('Respuesta de Cloudflare status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta de Cloudflare:', errorText);
      throw new Error(`Error al subir archivo: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Respuesta de Cloudflare:', data);
    
    if (Array.isArray(data) && data.length > 0 && data[0].url) {
      return { url: data[0].url };
    }
    return data;
  } catch (error) {
    console.error('Error uploading file to Cloudflare:', error);
    throw error;
  }
};
