import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Image, Loader, Video, AlertTriangle } from 'lucide-react';

const FILE_SIZE_LIMIT_MB = 100; // 100MB
const ALLOWED_VIDEO_FORMATS = ['MP4', 'WebM', 'OGG', 'QuickTime'];

const ServiceForm = ({ 
  service, 
  onSubmit, 
  isSubmitting, 
  uploadProgress, 
  onCancel, 
  error, 
  isEditing = false 
}) => {
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '1',
    category: '',
    multimedia: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);

  // Initialize form when service data changes
  useEffect(() => {
    if (service) {
      setNewService({
        name: service.name || '',
        description: service.description || '',
        price: '1', // Always use 1 as default
        category: service.category || '',
        multimedia: service.multimedia || []
      });
    } else {
      setNewService({
        name: '',
        description: '',
        price: '1',
        category: '',
        multimedia: []
      });
    }
    setSelectedFiles([]);
    setSelectedFileTypes([]);
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validar tamaño de archivo
      const oversizedFiles = files.filter(file => file.size > FILE_SIZE_LIMIT_MB * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map(f => f.name).join(', ');
        alert(`Los siguientes archivos exceden el límite de ${FILE_SIZE_LIMIT_MB}MB: ${fileNames}`);
        return;
      }
      
      setSelectedFiles(files);
      
      // Detectar tipos de archivo automáticamente
      const types = files.map(file => {
        return file.type.startsWith('image/') ? 'image' : 'video';
      });
      setSelectedFileTypes(types);
    }
  };

  const handleFileTypeChange = (index, type) => {
    const updatedMultimedia = [...newService.multimedia];
    updatedMultimedia[index] = {
      ...updatedMultimedia[index],
      type
    };
    setNewService({
      ...newService,
      multimedia: updatedMultimedia
    });
  };
  
  const handleSelectedFileTypeChange = (index, type) => {
    const newTypes = [...selectedFileTypes];
    newTypes[index] = type;
    setSelectedFileTypes(newTypes);
  };

  const handleRemoveMultimedia = (index) => {
    const updatedMultimedia = [...newService.multimedia];
    updatedMultimedia.splice(index, 1);
    setNewService({
      ...newService,
      multimedia: updatedMultimedia
    });
  };
  
  const handleRemoveSelectedFile = (index) => {
    const newFiles = [...selectedFiles];
    const newTypes = [...selectedFileTypes];
    newFiles.splice(index, 1);
    newTypes.splice(index, 1);
    setSelectedFiles(newFiles);
    setSelectedFileTypes(newTypes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Make a copy of the service data to ensure price is a number
    const serviceData = {
      ...newService,
      price: 1 // Always set price to 1
    };
    
    // Pasar los tipos de archivos para usarlos en la subida
    onSubmit(serviceData, selectedFiles, selectedFileTypes);
  };

  const getFilePreview = (file, index, isSelected = false) => {
    const fileType = isSelected ? selectedFileTypes[index] : file.type;
    const isVideo = isSelected ? fileType === 'video' : fileType === 'video';
    
    if (isVideo) {
      return (
        <div className="w-full h-24 bg-gray-700 flex items-center justify-center rounded-md">
          <Video className="w-8 h-8 text-white" />
          {isSelected && (
            <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-bl px-1 py-0.5">
              {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
            </div>
          )}
        </div>
      );
    } else {
      // Si es una imagen seleccionada, mostrar preview
      if (isSelected && file instanceof File) {
        try {
          return (
            <div className="w-full h-24 bg-gray-200 rounded-md overflow-hidden relative">
              <img 
                src={URL.createObjectURL(file)} 
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
              />
            </div>
          );
        } catch (error) {
          console.error("Error creating object URL", error);
          return (
            <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-md">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
          );
        }
      } else if (!isSelected) {
        // Imagen existente
        return (
          <img 
            src={file.url} 
            alt={`Multimedia ${index + 1}`}
            className="w-full h-24 object-cover rounded-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              const parent = e.target.parentNode;
              if (parent) {
                const placeholder = document.createElement('div');
                placeholder.className = "w-full h-24 flex items-center justify-center bg-gray-200 rounded-md";
                placeholder.innerHTML = '<span class="text-gray-400">Imagen no disponible</span>';
                parent.appendChild(placeholder);
              }
            }}
          />
        );
      } else {
        return (
          <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-md">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newService.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Título del servicio"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={newService.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Descripción del servicio"
            required
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={newService.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder="Categoría del servicio"
            required
          />
        </div>
        
        {/* Price field is hidden but still in state */}
        <input type="hidden" name="price" value="1" />
        
        {/* Current multimedia files */}
        {newService.multimedia && newService.multimedia.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Multimedia actual</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {newService.multimedia.map((item, index) => (
                <div key={index} className="relative group">
                  {item.type === 'image' || item.type === 'imagen' ? (
                    getFilePreview(item, index)
                  ) : (
                    <div className="w-full h-24 bg-gray-700 flex items-center justify-center rounded-md">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <button
                      type="button"
                      onClick={() => handleRemoveMultimedia(index)}
                      className="bg-red-500 text-white p-1 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center">
                    <select
                      value={item.type}
                      onChange={(e) => handleFileTypeChange(index, e.target.value)}
                      className="text-xs w-full bg-gray-100 border border-gray-300 rounded-md px-1 py-0.5"
                    >
                      <option value="image">Imagen</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Selected files preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos seleccionados</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  {getFilePreview(file, index, true)}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedFile(index)}
                      className="bg-red-500 text-white p-1 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center">
                    <select
                      value={selectedFileTypes[index]}
                      onChange={(e) => handleSelectedFileTypeChange(index, e.target.value)}
                      className="text-xs w-full bg-gray-100 border border-gray-300 rounded-md px-1 py-0.5"
                    >
                      <option value="image">Imagen</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agregar Imágenes o Videos
          </label>
          <div className="flex flex-col items-center">
            <label className="cursor-pointer bg-white px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full">
              <div className="flex items-center justify-center">
                <div className="flex space-x-2 mr-2">
                  <Image className="w-5 h-5 text-gray-500" />
                  <Video className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-gray-700">Seleccionar archivos</span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            
            <div className="mt-2 text-xs text-gray-500 flex items-start w-full">
              <AlertTriangle className="w-4 h-4 mr-1 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>
                Límite: {FILE_SIZE_LIMIT_MB}MB por archivo. 
                Formatos de video permitidos: {ALLOWED_VIDEO_FORMATS.join(', ')}.
              </span>
            </div>
          </div>
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-secondary h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Subiendo archivos: {uploadProgress}%</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center space-x-3 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? 'Actualizando...' : 'Agregando...'}
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              {isEditing ? 'Actualizar Servicio' : 'Agregar Servicio'}
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ServiceForm; 