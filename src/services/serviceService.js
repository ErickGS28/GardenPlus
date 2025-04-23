import { API_BASE_URL, COMPANY_ID, SITE_ID } from '../constants';
import { getAuthHeaders } from './config/config';
import { deleteFromCloudflare } from './cloudflareService';

// Service management functions
export const getServices = async (companyId = COMPANY_ID, siteId = SITE_ID) => {
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
      companyId: COMPANY_ID,
      siteId: SITE_ID
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
      companyId: COMPANY_ID,
      siteId: SITE_ID
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

// Helper function to get only active services
export const getActiveServices = async (companyId = COMPANY_ID, siteId = SITE_ID) => {
  try {
    const services = await getServices(companyId, siteId);
    return services.filter(service => service.active);
  } catch (error) {
    console.error('Error fetching active services:', error);
    throw error;
  }
}; 