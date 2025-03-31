// API utility functions
const API_BASE_URL = 'https://cambar.com.mx/api';

// Auth token management
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Headers with authentication
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Authentication API calls
export const login = async (email, password) => {
  try {
    console.log('Logging in at:', `${API_BASE_URL}/auth/login`);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Login failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store the token
    if (data.access_token) {
      setAuthToken(data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  removeAuthToken();
};

// Services API calls
export const getProducts = async () => {
  try {
    console.log(`Fetching services from: ${API_BASE_URL}/service`);
    const response = await fetch(`${API_BASE_URL}/service`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error fetching services: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getActiveProducts = async (siteId = 1) => {
  try {
    console.log(`Fetching services by site ID from: ${API_BASE_URL}/service/site/${siteId}`);
    const response = await fetch(`${API_BASE_URL}/service/site/${siteId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error fetching services: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching services by site ID:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    console.log(`Fetching service by ID from: ${API_BASE_URL}/service/${id}`);
    const response = await fetch(`${API_BASE_URL}/service/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error fetching service: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};

export const addProduct = async (serviceData) => {
  try {
    console.log(`Creating service at: ${API_BASE_URL}/service/create`);
    
    // Prepare the data in the format expected by the API
    const payload = {
      name: serviceData.get('name'),
      description: serviceData.get('description'),
      price: parseFloat(serviceData.get('price') || 0),
      category: serviceData.get('category') || '',
      companyId: 1,
      siteId: 1,
      // For now, use a placeholder image if multimedia files are selected
      multimedia: []
    };
    
    // Add placeholder multimedia if files are selected
    if (serviceData.getAll('multimedia') && serviceData.getAll('multimedia').length > 0) {
      // Instead of blob URLs, use a placeholder image URL
      payload.multimedia = [{
        url: "https://placehold.co/600x400",
        type: "image/jpeg"
      }];
    }
    
    console.log('Sending payload:', payload);
    
    const response = await fetch(`${API_BASE_URL}/service/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error creating service: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateProduct = async (id, serviceData) => {
  try {
    console.log(`Updating service at: ${API_BASE_URL}/service/${id}`);
    
    // Prepare the data in the format expected by the API
    const payload = {
      name: serviceData.get('name'),
      description: serviceData.get('description'),
      price: parseFloat(serviceData.get('price') || 0),
      category: serviceData.get('category') || '',
      companyId: 1,
      siteId: 1,
      // For now, use a placeholder image if multimedia files are selected
      multimedia: []
    };
    
    // Add placeholder multimedia if files are selected
    if (serviceData.getAll('multimedia') && serviceData.getAll('multimedia').length > 0) {
      // Instead of blob URLs, use a placeholder image URL
      payload.multimedia = [{
        url: "https://placehold.co/600x400",
        type: "image/jpeg"
      }];
    }
    
    const response = await fetch(`${API_BASE_URL}/service/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error updating service: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    console.log(`Deleting service at: ${API_BASE_URL}/service/delete/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/service/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error deleting service: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    throw error;
  }
};

// Posts API calls
export const getPosts = async () => {
  try {
    console.log(`Fetching posts from: ${API_BASE_URL}/post`);
    
    const response = await fetch(`${API_BASE_URL}/post`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error fetching posts: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getActivePosts = async (siteId = 1) => {
  try {
    console.log(`Fetching posts by site ID from: ${API_BASE_URL}/post/site/${siteId}`);
    
    const response = await fetch(`${API_BASE_URL}/post/site/${siteId}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error fetching posts: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts by site ID:', error);
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    console.log(`Fetching post by ID from: ${API_BASE_URL}/post/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/post/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error fetching post: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    throw error;
  }
};

export const addPost = async (postData) => {
  try {
    console.log(`Creating post at: ${API_BASE_URL}/post`);
    
    // Prepare the data in the format expected by the API
    const payload = {
      title: postData.get('title'),
      content: postData.get('content'),
      previewUrl: postData.get('previewUrl') || '',
      iframe: postData.get('iframe') || '',
      type: postData.get('type') || 'instagram',
      authorId: 1, // Hardcoded for now, should come from user context in a real app
      companyId: 1, // Hardcoded for now, should be configurable
      siteId: 1 // Hardcoded for now, should be configurable
    };
    
    console.log('Sending payload:', payload);
    
    const response = await fetch(`${API_BASE_URL}/post`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error creating post: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  try {
    console.log(`Updating post at: ${API_BASE_URL}/post/${id}`);
    
    // Prepare the data in the format expected by the API
    const payload = {
      title: postData.get('title'),
      content: postData.get('content'),
      previewUrl: postData.get('previewUrl') || '',
      iframe: postData.get('iframe') || '',
      type: postData.get('type') || 'instagram',
      authorId: 1, // Hardcoded for now, should come from user context in a real app
      companyId: 1, // Hardcoded for now, should be configurable
      siteId: 1 // Hardcoded for now, should be configurable
    };
    
    const response = await fetch(`${API_BASE_URL}/post/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error updating post: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating post with ID ${id}:`, error);
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    console.log(`Deleting post at: ${API_BASE_URL}/post/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/post/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server response: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Error deleting post: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting post with ID ${id}:`, error);
    throw error;
  }
};
