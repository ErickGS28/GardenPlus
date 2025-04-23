import { API_BASE_URL, COMPANY_ID } from '../constants';
import { getAuthHeaders } from './config/config';

// Configuraciones
const FILE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime'
];

// Cloudflare upload function
export const uploadToCloudflare = async (file) => {
  try {
    console.log('Iniciando carga de archivo a Cloudflare:', file.name, file.type, file.size);
    
    // Verificar tamaño del archivo
    if (file.size > FILE_SIZE_LIMIT) {
      throw new Error(`El archivo es demasiado grande. El límite es de ${FILE_SIZE_LIMIT / (1024 * 1024)}MB.`);
    }
    
    // Validación adicional para videos
    const isVideo = file.type.startsWith('video/');
    if (isVideo && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
      throw new Error(`Tipo de video no soportado: ${file.type}. Los formatos permitidos son: MP4, WebM, OGG y QuickTime.`);
    }
    
    const formData = new FormData();
    formData.append('files', file);
    formData.append('companyId', String(COMPANY_ID));
    
    // Agregar tipo de archivo para que el backend sepa cómo manejarlo
    formData.append('fileType', isVideo ? 'video' : 'image');
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación disponible');
    }
    
    console.log('Token de autenticación encontrado, longitud:', token.length);
    console.log('Subiendo archivo como:', isVideo ? 'video' : 'image');
    
    // Para videos grandes, aumentar el timeout
    const timeoutDuration = isVideo ? 120000 : 30000; // 120 segundos para videos, 30 para imágenes
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    try {
      const response = await fetch(`${API_BASE_URL}/cloudflare/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('La subida del archivo ha expirado. Esto puede ocurrir con archivos muy grandes o problemas de conexión.');
      }
      throw fetchError;
    }
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