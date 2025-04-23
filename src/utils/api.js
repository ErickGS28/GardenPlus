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

// Authentication functionsr
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
    console.log(`Fetching services for companyId=${companyId}, siteId=${siteId}`);
    
    const response = await fetch(`${API_BASE_URL}/service?companyId=${companyId}&siteId=${siteId}`, {
      headers: getAuthHeaders(),
    });
    
    console.log('Response when getting services status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta al obtener servicios:', errorText);
      throw new Error(`Error al obtener servicios: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Services fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    console.log(`Fetching service with id ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/service/${id}`, {
      headers: getAuthHeaders(),
    });
    
    console.log(`Response status from getServiceById:`, response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al obtener servicio con id ${id}:`, errorText);
      throw new Error(`Error al obtener servicio: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Service with id ${id} fetched successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching service with id ${id}:`, error);
    throw error;
  }
};

export const addService = async (serviceData) => {
  try {
    // Ensure static IDs are included
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
  if (!id) throw new Error('updateService: id is undefined');

  try {
    // Clean multimedia fields that the API doesn't want
    const cleanMultimedia = serviceData.multimedia?.map(({ url, type }) => ({ url, type })) || [];

    const data = {
      name: serviceData.name,
      description: serviceData.description,
      price: serviceData.price || 1,
      multimedia: cleanMultimedia,
      category: serviceData.category,
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
    
    console.log('Response when updating service status:', response);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al actualizar servicio con id ${id}:`, errorText);
      throw new Error(`updateService ${id} → ${response.status}: ${errorText}`);
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
    
    // First, get the service to extract image URLs
    const service = await getServiceById(id);
    
    // Extract image URLs from the service multimedia
    if (service && service.multimedia && service.multimedia.length > 0) {
      const files = service.multimedia.map(item => ({ url: item.url }));
      
      // Delete files from Cloudflare
      if (files.length > 0) {
        try {
          await deleteFromCloudflare(files);
          console.log('Successfully deleted service images from Cloudflare');
        } catch (cloudflareError) {
          console.error('Error deleting service images from Cloudflare:', cloudflareError);
          // Continue with service deletion even if Cloudflare deletion fails
        }
      }
    }
    
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
    console.log(`Fetching posts for companyId=${companyId}, siteId=${siteId}`);
    
    const response = await fetch(`${API_BASE_URL}/post?companyId=${companyId}&siteId=${siteId}`, {
      headers: getAuthHeaders()
    });
    
    console.log('Response when getting posts status:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        const errorJson = await response.json();
        errorText = JSON.stringify(errorJson);
      } catch (e) {
        errorText = await response.text();
      }
      
      console.error('Error en la respuesta al obtener posts:', errorText);
      throw new Error(`Error al obtener posts: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Posts fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    console.log(`Fetching post with id ${id}, type: ${typeof id}`);
    
    if (!id) {
      throw new Error('Post ID is missing or undefined');
    }
    
    // Ensure id is treated as a number if it's numeric
    const postId = isNaN(id) ? id : Number(id);
    
    const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
      headers: getAuthHeaders(),
    });
    
    console.log(`Response status from getPostById:`, response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        // Try to parse error response as JSON
        const errorJson = await response.json();
        errorText = JSON.stringify(errorJson);
      } catch (e) {
        // If not JSON, get as text
        errorText = await response.text();
      }
      
      console.error(`Error en la respuesta al obtener post con id ${postId}:`, errorText);
      throw new Error(`Error al obtener post: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Post with id ${postId} fetched successfully:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    throw error;
  }
};

export const addPost = async (postData) => {
  try {
    console.log('Creating new post:', postData);
    
    // Ensure we have all required fields
    const data = {
      ...postData,
      companyId: 2,
      siteId: 1,
      authorId: 1
    };
    
    // Validate the type field - now supporting multiple social networks
    const validTypes = ['instagram', 'youtube', 'facebook', 'tiktok', 'twitter'];
    if (!data.type || !validTypes.includes(data.type)) {
      console.log(`Correcting post type from "${data.type}" to "instagram" (default)`);
      data.type = "instagram";
    }
    
    console.log('Formatted post data for API:', data);
    
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
      let errorText;
      try {
        // Try to parse error response as JSON
        const errorJson = await response.json();
        errorText = JSON.stringify(errorJson);
      } catch (e) {
        // If not JSON, get as text
        errorText = await response.text();
      }
      
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
    console.log(`Updating post with id ${id}`, postData);
    
    if (!id) {
      throw new Error('Post ID is missing or undefined');
    }
    
    // Ensure id is treated as a number if it's numeric
    const postId = isNaN(id) ? id : Number(id);
    
    // Ensure we have all required fields
    const data = {
      ...postData,
      companyId: 2,
      siteId: 1,
      authorId: 1
    };
    
    // Validate the type field - now supporting multiple social networks
    const validTypes = ['instagram', 'youtube', 'facebook', 'tiktok', 'twitter'];
    if (!data.type || !validTypes.includes(data.type)) {
      console.log(`Correcting post type from "${data.type}" to "instagram" (default)`);
      data.type = "instagram";
    }
    
    console.log('Formatted post data for API:', data);
    
    const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log('Respuesta al actualizar post status:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        // Try to parse error response as JSON
        const errorJson = await response.json();
        errorText = JSON.stringify(errorJson);
      } catch (e) {
        // If not JSON, get as text
        errorText = await response.text();
      }
      
      console.error(`Error en la respuesta al actualizar post con id ${postId}:`, errorText);
      throw new Error(`Error al actualizar post: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Respuesta al actualizar post:', responseData);
    return responseData;
  } catch (error) {
    console.error(`Error updating post with id ${id}:`, error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    console.log(`Deleting post with id ${id}, type: ${typeof id}`);
    
    if (!id) {
      throw new Error('Post ID is missing or undefined');
    }
    
    // Ensure id is treated as a number if it's numeric
    const postId = isNaN(id) ? id : Number(id);
    
    // First, get the post to extract the preview image URL
    try {
      const post = await getPostById(postId);
      
      // Delete preview image from Cloudflare if it exists
      if (post && post.previewUrl) {
        try {
          await deleteFromCloudflare([{ url: post.previewUrl }]);
          console.log('Successfully deleted post preview image from Cloudflare');
        } catch (cloudflareError) {
          console.error('Error deleting post preview image from Cloudflare:', cloudflareError);
          // Continue with post deletion even if Cloudflare deletion fails
        }
      }
    } catch (getError) {
      console.error(`Error getting post before deletion:`, getError);
      // Continue with deletion attempt even if we couldn't get the post
    }
    
    const response = await fetch(`${API_BASE_URL}/post/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    console.log('Respuesta al eliminar post status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en la respuesta al eliminar post con id ${postId}:`, errorText);
      throw new Error(`Error al eliminar post: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Respuesta al eliminar post:', responseData);
    return responseData;
  } catch (error) {
    console.error(`Error deleting post with id ${id}:`, error);
    throw error;
  }
};

// User management functions
export const getUsers = async (companyId = 2, siteId = 1) => {
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
      companyId: userData.companyId || 2,
      siteId: userData.siteId || 1
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
      companyId: userData.companyId || 2,
      siteId: userData.siteId || 1
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
    
    // Detailed review of the response for debugging
    if (Array.isArray(data)) {
      console.log('Response is an array with length:', data.length);
      if (data.length > 0) {
        console.log('First item in array:', data[0]);
        if (data[0].url) {
          console.log('URL found in first item:', data[0].url);
          return { url: data[0].url };
        }
      } else {
        console.error('Response array is empty');
        throw new Error('Empty response from Cloudflare upload');
      }
    } else if (data && typeof data === 'object') {
      console.log('Response is an object:', data);
      if (data.url) {
        console.log('URL found in object:', data.url);
        return { url: data.url };
      } else if (data.result && data.result.variants && data.result.variants.length > 0) {
        console.log('URL found in variants:', data.result.variants[0]);
        return { url: data.result.variants[0] };
      }
    }
    
    console.error('No URL found in response:', data);
    throw new Error('Failed to extract URL from Cloudflare response');
  } catch (error) {
    console.error('Error uploading file to Cloudflare:', error);
    throw error;
  }
};

// Cloudflare delete function
export const deleteFromCloudflare = async (files) => {
  try {
    console.log('Deleting files from Cloudflare:', files);
    
    const response = await fetch(`${API_BASE_URL}/cloudflare/delete`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files }),
    });
    
    console.log('Response when deleting files from Cloudflare status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error in response when deleting files from Cloudflare:', errorText);
      throw new Error(`Error deleting files from Cloudflare: ${response.status} ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('Response when deleting files from Cloudflare:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error deleting files from Cloudflare:', error);
    throw error;
  }
};

// Helper function to get only active services
export const getActiveServices = async (companyId = 2, siteId = 1) => {
  try {
    const services = await getServices(companyId, siteId);
    return services.filter(service => service.active);
  } catch (error) {
    console.error('Error fetching active services:', error);
    throw error;
  }
};

// Helper function to get only active posts
export const getActivePosts = async (companyId = 2, siteId = 1) => {
  try {
    const posts = await getPosts(companyId, siteId);
    return posts.filter(post => post.active);
  } catch (error) {
    console.error('Error fetching active posts:', error);
    throw error;
  }
};
