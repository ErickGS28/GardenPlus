import { API_BASE_URL, COMPANY_ID } from '../constants';
import { getAuthHeaders } from './config/config';

// Configuraciones
const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB - Ajustado a un límite más bajo para evitar error 413
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
      throw new Error(`El archivo es demasiado grande. El servidor acepta hasta ${FILE_SIZE_LIMIT / (1024 * 1024)}MB.`);
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
    
    console.log('Endpoint:', `${API_BASE_URL}/cloudflare/upload`);
    console.log('Token de autenticación encontrado, longitud:', token.length);
    console.log('Subiendo archivo como:', isVideo ? 'video' : 'image');
    console.log('Tamaño del archivo:', (file.size / (1024 * 1024)).toFixed(2), 'MB');
    
    // Para videos grandes, aumentar el timeout
    const timeoutDuration = isVideo ? 120000 : 30000; // 120 segundos para videos, 30 para imágenes
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
    
    try {
      // Intentar detectar problemas de red antes de hacer la petición
      if (!navigator.onLine) {
        throw new Error('No hay conexión a Internet');
      }
      
      console.log('Enviando solicitud a Cloudflare...');
      // Hacemos un log de las cabeceras que estamos enviando
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      console.log('Headers:', headers);
      
      // Intentar usar XMLHttpRequest en lugar de fetch para tener más detalles sobre el error
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            console.log(`Progreso de carga: ${Math.round((e.loaded / e.total) * 100)}%`);
          }
        };
        
        xhr.onreadystatechange = function() {
          console.log(`Estado de la petición: ${xhr.readyState}, Status: ${xhr.status}`);
          
          if (xhr.readyState === 4) {
            clearTimeout(timeoutId);
            
            // Manejar específicamente el error 413
            if (xhr.status === 413) {
              console.error('Error 413: Archivo demasiado grande para el servidor');
              reject(new Error('El archivo es demasiado grande para el servidor. El límite del servidor es inferior a ' + 
                Math.round(file.size / (1024 * 1024)) + 'MB. Por favor, usa un archivo más pequeño o comprime el video.'));
              return;
            }
            
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                console.log('Respuesta de Cloudflare:', data);
                
                // Procesamiento de la respuesta
                if (Array.isArray(data)) {
                  console.log('Response is an array with length:', data.length);
                  if (data.length > 0) {
                    console.log('First item in array:', data[0]);
                    if (data[0].url) {
                      console.log('URL found in first item:', data[0].url);
                      resolve({ url: data[0].url });
                      return;
                    }
                  } else {
                    console.error('Response array is empty');
                    reject(new Error('Empty response from Cloudflare upload'));
                    return;
                  }
                } else if (data && typeof data === 'object') {
                  console.log('Response is an object:', data);
                  if (data.url) {
                    console.log('URL found in object:', data.url);
                    resolve({ url: data.url });
                    return;
                  } else if (data.result && data.result.variants && data.result.variants.length > 0) {
                    console.log('URL found in variants:', data.result.variants[0]);
                    resolve({ url: data.result.variants[0] });
                    return;
                  }
                }
                
                console.error('No URL found in response:', data);
                reject(new Error('Failed to extract URL from Cloudflare response'));
              } catch (parseError) {
                console.error('Error parsing response:', parseError, 'Raw response:', xhr.responseText);
                reject(new Error(`Error al procesar la respuesta del servidor: ${parseError.message}`));
              }
            } else {
              let errorMessage = '';
              try {
                const errorData = JSON.parse(xhr.responseText);
                errorMessage = errorData.message || `Error ${xhr.status}: ${xhr.statusText}`;
                console.error('Error en la respuesta de Cloudflare:', errorData);
              } catch (e) {
                errorMessage = `Error ${xhr.status}: ${xhr.statusText || xhr.responseText || 'Sin detalles'}`;
                console.error('Error en la respuesta de Cloudflare (texto plano):', xhr.responseText);
              }
              reject(new Error(errorMessage));
            }
          }
        };
        
        xhr.onerror = function(e) {
          clearTimeout(timeoutId);
          console.error('Error de red al comunicarse con Cloudflare:', e);
          reject(new Error('Error de red al comunicarse con el servidor. Verifica tu conexión a Internet.'));
        };
        
        xhr.ontimeout = function() {
          clearTimeout(timeoutId);
          reject(new Error('La petición a Cloudflare ha expirado. El servidor puede estar sobrecargado o inaccesible.'));
        };
        
        xhr.open('POST', `${API_BASE_URL}/cloudflare/upload`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.timeout = timeoutDuration;
        
        // Enviar la petición
        xhr.send(formData);
      });
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('La subida del archivo ha expirado. Esto puede ocurrir con archivos muy grandes o problemas de conexión.');
      }
      console.error('Error detallado:', fetchError);
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