import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Image, Loader, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getServices, addService, updateService, deleteService,
  uploadToCloudflare
} from '../../../services/config/api';
import Modal from '../Modal';
import ServiceForm from './ServiceForm';
import ConfirmDialog from '../../../components/ConfirmDialog';

const ServiceCard = ({ service, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultimedia = service.multimedia && service.multimedia.length > 0;
  const hasMultipleItems = hasMultimedia && service.multimedia.length > 1;
  
  // Determine multimedia array (both images and videos)
  const multimedia = hasMultimedia ? service.multimedia : [];
  
  const navigateMultimedia = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % multimedia.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + multimedia.length) % multimedia.length);
    }
  };

  const currentItem = multimedia.length > 0 ? multimedia[currentImageIndex] : null;
  const isVideo = currentItem && (currentItem.type === 'video');

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden h-[420px] flex flex-col">
      {/* Title */}
      <div className="p-4 border-b bg-gray-50">
        <h4 className="font-semibold text-[#1b676b] text-lg truncate">{service.name}</h4>
        {service.type === 'featured' && (
          <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full mt-1">
            Destacado
          </span>
        )}
      </div>
      
      {/* Multimedia Gallery */}
      <div className="w-full h-48 relative bg-gray-100">
        {multimedia.length > 0 ? (
          <div className="w-full h-full relative overflow-hidden">
            {isVideo ? (
              <video 
                src={currentItem.url} 
                controls
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  const parent = e.target.parentNode;
                  if (parent) {
                    const placeholder = document.createElement('div');
                    placeholder.className = "w-full h-full flex items-center justify-center bg-gray-200 absolute inset-0";
                    placeholder.innerHTML = '<span class="text-gray-400">Video no disponible</span>';
                    parent.appendChild(placeholder);
                  }
                }}
              />
            ) : (
              <img 
                src={currentItem.url} 
                alt={`${service.name} - multimedia ${currentImageIndex + 1}`}
                className="w-full h-full object-cover absolute inset-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  const parent = e.target.parentNode;
                  if (parent) {
                    const placeholder = document.createElement('div');
                    placeholder.className = "w-full h-full flex items-center justify-center bg-gray-200 absolute inset-0";
                    placeholder.innerHTML = '<span class="text-gray-400">Imagen no disponible</span>';
                    parent.appendChild(placeholder);
                  }
                }}
              />
            )}
            
            {/* Navigation arrows for multiple items */}
            {hasMultipleItems && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateMultimedia('prev');
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-1 text-white transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateMultimedia('next');
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-1 text-white transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* Media counter and type indicator */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs rounded-full px-2 py-1 z-10 flex items-center">
                  {isVideo ? <Video className="w-3 h-3 mr-1" /> : <Image className="w-3 h-3 mr-1" />}
                  {currentImageIndex + 1} / {multimedia.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-12 h-12 text-gray-300" />
          </div>
        )}
      </div>
      
      {/* Description */}
      <div className="p-4 flex-grow overflow-y-auto">
        <p className="text-sm text-gray-600">
          {service.description && service.description.replace(/<[^>]*>?/gm, '')}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 border-t flex justify-end space-x-2">
        <button
          onClick={() => onEdit(service)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors flex items-center"
        >
          <Edit className="w-3.5 h-3.5 mr-1" />
          Editar
        </button>
        <button
          onClick={() => onDelete(service.id || service.numericId)}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors flex items-center"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Estado para el diálogo de confirmación
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  // Clave para forzar la actualización de los componentes hijos
  const [updateKey, setUpdateKey] = useState(0);

  // Función para cargar los servicios
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los servicios. Por favor, intenta de nuevo.');
      toast.error('No se pudieron cargar los servicios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const uploadFileToCloudflare = async (file) => {
    try {
      console.log('Iniciando subida a Cloudflare para:', file.name, file.type, file.size);
      setUploadProgress(10);
      const response = await uploadToCloudflare(file);
      setUploadProgress(100);
      
      if (response && response.url) {
        console.log('Subida exitosa. URL:', response.url);
        return response.url;
      }
      console.error('Respuesta sin URL:', response);
      toast.error('El servidor no devolvió una URL válida');
      return null;
    } catch (error) {
      // Mostrar mensaje de error específico y más detallado
      console.error('Error detallado al subir archivo:', error);
      
      // Verificar tipo de error
      let errorMessage = 'Error al subir el archivo';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Errores específicos de red
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a Internet o contacta al administrador.';
        
        // Verificar si la API está accesible
        try {
          const isOnline = navigator.onLine;
          if (!isOnline) {
            errorMessage = 'No hay conexión a Internet. Verifica tu red y vuelve a intentarlo.';
          }
        } catch (e) {
          console.error('Error al verificar conexión:', e);
        }
      }
      
      toast.error(errorMessage);
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleServiceSubmit = async (serviceData, files, selectedFileTypes = []) => {
    if (!serviceData.name || !serviceData.description) {
      setError('Por favor completa todos los campos requeridos.');
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setUploadProgress(0);
      setError(null);
      
      // Process multimedia files if any
      let multimedia = [...(serviceData.multimedia || [])];
      
      // Upload new files if selected
      if (files && files.length > 0) {
        setUploadProgress(10);
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const fileUrl = await uploadFileToCloudflare(file);
            if (fileUrl) {
              // Determine type based on selected file types or fallback to mimetype
              const type = selectedFileTypes[i] || (file.type.startsWith('image/') ? 'image' : 'video');
              multimedia.push({ url: fileUrl, type });
            }
            // Update progress incrementally
            setUploadProgress(10 + Math.floor((i + 1) / files.length * 80));
          } catch (uploadError) {
            console.error(`Error uploading file ${i + 1}:`, uploadError);
            // No lanzar el error, sino continuar con los otros archivos
            // Informar al usuario sobre este archivo específico
            toast.error(`No se pudo subir el archivo ${file.name}`);
          }
        }
      }
      
      // Prepare service data for API
      const apiServiceData = {
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price || 1,
        category: serviceData.category || 'General',
        multimedia: multimedia,
        companyId: 2,
        siteId: 1,
      };
      
      let serviceResponse;
      
      // Update existing service or create new one
      if (editingService) {
        const serviceId = editingService.id || editingService.numericId;
        console.log(`Updating service with ID: ${serviceId}`, apiServiceData);
        serviceResponse = await updateService(serviceId, apiServiceData);
        
        // Update services list
        setServices(services.map(service => 
          (service.id || service.numericId) === serviceId ? serviceResponse : service
        ));
        
        setIsEditModalOpen(false);
        setEditingService(null);
        toast.success(`Servicio "${serviceData.name}" actualizado correctamente`);
        
        // Forzar la actualización del componente
        setUpdateKey(prev => prev + 1);
        
        // Recargar los servicios para asegurar datos actualizados
        await loadServices();
      } else {
        console.log('Creating new service:', apiServiceData);
        serviceResponse = await addService(apiServiceData);
        
        // Add the new service to the list
        setServices(prevServices => [...prevServices, serviceResponse]);
        setIsCreateModalOpen(false);
        toast.success(`Servicio "${serviceData.name}" creado correctamente`);
        
        // Forzar la actualización del componente
        setUpdateKey(prev => prev + 1);
      }
      
      setUploadProgress(0);
      
    } catch (err) {
      const action = editingService ? 'actualizar' : 'crear';
      setError(`Error al ${action} el servicio. Por favor, intenta de nuevo.`);
      toast.error(`Error al ${action} el servicio. Por favor, intenta de nuevo.`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingService(null);
    setError(null);
    setUploadProgress(0);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setError(null);
    setUploadProgress(0);
  };

  const confirmDeleteService = (id, name) => {
    setServiceToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };
  
  const handleDeleteConfirmed = async () => {
    if (!serviceToDelete) return;
    
    try {
      console.log(`Deleting service with ID: ${serviceToDelete.id}`);
      await deleteService(serviceToDelete.id);
      setServices(services.filter(service => 
        (service.id || service.numericId) !== serviceToDelete.id
      ));
      setError(null);
      toast.success(`Servicio "${serviceToDelete.name}" eliminado correctamente`);
    } catch (err) {
      setError('Error al eliminar el servicio. Por favor, intenta de nuevo.');
      toast.error('Error al eliminar el servicio');
      console.error('Error deleting service:', err);
    } finally {
      setIsConfirmDialogOpen(false);
      setServiceToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setServiceToDelete(null);
  };

  // Filtrar servicios según la búsqueda
  const filteredServices = () => {
    if (!searchQuery.trim()) return services;
    
    const query = searchQuery.toLowerCase();
    return services.filter(service => 
      service.name?.toLowerCase().includes(query) || 
      service.description?.toLowerCase().includes(query)
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-[#1b676b] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1b676b]">Gestionar Servicios</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#1b676b] text-white px-4 py-2 rounded-md hover:bg-[#145256] transition-colors flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nuevo Servicio
        </button>
      </div>
      
      {error && !isCreateModalOpen && !isEditModalOpen && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425] pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {services.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 italic mb-4">No hay servicios disponibles</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#1b676b] text-white px-4 py-2 rounded-md hover:bg-[#145256] transition-colors flex items-center mx-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Crear tu primer servicio
            </button>
          </div>
        ) : filteredServices().length === 0 ? (
          <p className="text-gray-500 italic">No se encontraron servicios con tu búsqueda</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={updateKey}>
            {filteredServices().map((service) => (
              <ServiceCard 
                key={`${service.id || service.numericId}-${updateKey}`}
                service={service}
                onEdit={handleEditService}
                onDelete={(id) => confirmDeleteService(id, service.name)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Create Service Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Crear Nuevo Servicio"
      >
        <ServiceForm
          service={null}
          onSubmit={handleServiceSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          onCancel={handleCloseCreateModal}
          error={error}
          isEditing={false}
        />
      </Modal>
      
      {/* Edit Service Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Servicio"
      >
        <ServiceForm
          service={editingService}
          onSubmit={handleServiceSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          onCancel={handleCloseEditModal}
          error={error}
          isEditing={true}
        />
      </Modal>
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Servicio"
        message={serviceToDelete ? `¿Estás seguro de que deseas eliminar el servicio "${serviceToDelete.name}"? Esta acción no se puede deshacer.` : ''}
      />
    </div>
  );
};

export default ManageServices; 