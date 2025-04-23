import { API_BASE_URL, COMPANY_ID, SITE_ID } from '../constants';
import { getAuthHeaders } from './config/config';
import { deleteFromCloudflare } from './cloudflareService';

// Post management functions
export const getPosts = async (companyId = COMPANY_ID, siteId = SITE_ID) => {
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
      companyId: COMPANY_ID,
      siteId: SITE_ID,
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
      companyId: COMPANY_ID,
      siteId: SITE_ID,
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

// Helper function to get only active posts
export const getActivePosts = async (companyId = COMPANY_ID, siteId = SITE_ID) => {
  try {
    const posts = await getPosts(companyId, siteId);
    return posts.filter(post => post.active);
  } catch (error) {
    console.error('Error fetching active posts:', error);
    throw error;
  }
}; 