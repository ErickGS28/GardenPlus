import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Image, Loader } from 'lucide-react';
import { 
  getServices, addService, updateService, deleteService,
  getPosts, addPost, updatePost, deletePost,
  uploadToCloudflare
} from '../utils/api';

// Service Management Component
const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingService, setEditingService] = useState(null);

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    multimedia: []
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        setServices(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Error al cargar los servicios. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
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

  const uploadFilesToCloudflare = async (files) => {
    const uploadedFiles = [];
    let progress = 0;
    
    for (const file of files) {
      try {
        // Upload file to Cloudflare
        const response = await uploadToCloudflare(file);
        
        if (response && response.url) {
          // Determine file type (image or video)
          const fileType = file.type.startsWith('video/') ? 'video' : 'image';
          
          uploadedFiles.push({
            url: response.url,
            type: fileType
          });
        }
        
        // Update progress
        progress += (1 / files.length) * 100;
        setUploadProgress(Math.round(progress));
        
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }
    
    return uploadedFiles;
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price) {
      setError('Por favor completa al menos el nombre y el precio del servicio.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setUploadProgress(0);
      setError(null);
      
      let multimedia = [...newService.multimedia];
      
      // Upload files if any are selected
      if (selectedFiles.length > 0) {
        const uploadedFiles = await uploadFilesToCloudflare(selectedFiles);
        multimedia = [...multimedia, ...uploadedFiles];
      }
      
      // Prepare service data
      const serviceData = {
        name: newService.name,
        description: newService.description,
        price: parseFloat(newService.price),
        category: newService.category,
        multimedia: multimedia,
        companyId: 2,
        siteId: 1
      };
      
      // Create or update service
      let serviceResponse;
      if (editingService) {
        serviceResponse = await updateService(editingService.id || editingService.numericId, serviceData);
        
        // Update the services list
        setServices(services.map(service => 
          (service.id || service.numericId) === (editingService.id || editingService.numericId) ? serviceResponse : service
        ));
        
        setEditingService(null);
      } else {
        serviceResponse = await addService(serviceData);
        
        // Add the new service to the list
        setServices([...services, serviceResponse]);
      }
      
      // Reset form
      setNewService({
        name: '',
        description: '',
        price: '',
        category: '',
        multimedia: []
      });
      setSelectedFiles([]);
      setUploadProgress(0);
      
    } catch (err) {
      setError(`Error al ${editingService ? 'actualizar' : 'crear'} el servicio. Por favor, intenta de nuevo.`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      category: service.category,
      multimedia: service.multimedia || []
    });
    setSelectedFiles([]);
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setNewService({
      name: '',
      description: '',
      price: '',
      category: '',
      multimedia: []
    });
    setSelectedFiles([]);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await deleteService(id);
        setServices(services.filter(service => (service.id || service.numericId) !== id));
      } catch (err) {
        setError('Error al eliminar el servicio. Por favor, intenta de nuevo.');
        console.error(err);
      }
    }
  };

  const handleRemoveMultimedia = (index) => {
    const updatedMultimedia = [...newService.multimedia];
    updatedMultimedia.splice(index, 1);
    setNewService({
      ...newService,
      multimedia: updatedMultimedia
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-[#1b676b] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#1b676b] mb-6">Gestionar Servicios</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleAddService} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-[#1b676b] mb-4">
          {editingService ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
        </h3>
        
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
              placeholder="Descripción del servicio"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={newService.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
                placeholder="0.00"
                min="0"
                step="0.01"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
                placeholder="Categoría del servicio"
                required
              />
            </div>
          </div>
          
          {/* Current multimedia files */}
          {newService.multimedia && newService.multimedia.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Multimedia actual</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {newService.multimedia.map((item, index) => (
                  <div key={index} className="relative group">
                    {item.type === 'image' || item.type === 'imagen' ? (
                      <img 
                        src={item.url} 
                        alt={`Multimedia ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-md">
                        <span className="text-gray-500">Video</span>
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agregar Imágenes o Videos
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex-1 cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-center">
                  <Image className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">Seleccionar archivos</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Archivos seleccionados: {selectedFiles.length}</p>
                <ul className="text-xs text-gray-500 space-y-1 ml-2">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="truncate">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-[#88c425] h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">Subiendo archivos: {uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1b676b] text-white px-4 py-2 rounded-md hover:bg-[#145256] transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                {editingService ? 'Actualizando...' : 'Agregando...'}
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                {editingService ? 'Actualizar Servicio' : 'Agregar Servicio'}
              </>
            )}
          </button>
          
          {editingService && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      <div>
        <h3 className="text-lg font-semibold text-[#1b676b] mb-4">Servicios Existentes</h3>
        
        {services.length === 0 ? (
          <p className="text-gray-500 italic">No hay servicios disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.id || service.numericId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#1b676b]">{service.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{service.description}</p>
                    
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-sm font-medium">${service.price.toFixed(2)}</span>
                      {service.category && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                          {service.category}
                        </span>
                      )}
                    </div>
                    
                    {service.multimedia && service.multimedia.length > 0 && (
                      <div className="flex mt-2 space-x-1 overflow-x-auto">
                        {service.multimedia.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-12 h-12 flex-shrink-0">
                            {item.type === 'image' || item.type === 'imagen' ? (
                              <img 
                                src={item.url} 
                                alt={`Multimedia ${idx + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                                <span className="text-xs text-gray-500">Video</span>
                              </div>
                            )}
                          </div>
                        ))}
                        {service.multimedia.length > 3 && (
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded-md">
                            <span className="text-xs text-gray-600">+{service.multimedia.length - 3}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id || service.numericId)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Post Management Component
const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingPost, setEditingPost] = useState(null);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    type: 'instagram',
    previewUrl: '',
    iframe: ''
  });

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Error al cargar las publicaciones. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFileToCloudflare = async (file) => {
    try {
      setUploadProgress(10);
      const response = await uploadToCloudflare(file);
      setUploadProgress(100);
      
      if (response && response.url) {
        return response.url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      setError('Por favor completa al menos el título y el contenido de la publicación.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setUploadProgress(0);
      setError(null);
      
      let previewUrl = newPost.previewUrl;
      
      // Upload preview image if selected
      if (selectedFile) {
        previewUrl = await uploadFileToCloudflare(selectedFile);
      }
      
      // Prepare post data
      const postData = {
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
        previewUrl: previewUrl,
        iframe: newPost.iframe,
        companyId: 2,
        siteId: 1,
        authorId: 1
      };
      
      // Create or update post
      let postResponse;
      if (editingPost) {
        postResponse = await updatePost(editingPost.id || editingPost.numericId, postData);
        
        // Update the posts list
        setPosts(posts.map(post => 
          (post.id || post.numericId) === (editingPost.id || editingPost.numericId) ? postResponse : post
        ));
        
        setEditingPost(null);
      } else {
        postResponse = await addPost(postData);
        
        // Add the new post to the list
        setPosts([...posts, postResponse]);
      }
      
      // Reset form
      setNewPost({
        title: '',
        content: '',
        type: 'instagram',
        previewUrl: '',
        iframe: ''
      });
      setSelectedFile(null);
      setUploadProgress(0);
      
    } catch (err) {
      setError(`Error al ${editingPost ? 'actualizar' : 'crear'} la publicación. Por favor, intenta de nuevo.`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      type: post.type || 'instagram',
      previewUrl: post.previewUrl || '',
      iframe: post.iframe || ''
    });
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setNewPost({
      title: '',
      content: '',
      type: 'instagram',
      previewUrl: '',
      iframe: ''
    });
    setSelectedFile(null);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      try {
        await deletePost(id);
        setPosts(posts.filter(post => (post.id || post.numericId) !== id));
      } catch (err) {
        setError('Error al eliminar la publicación. Por favor, intenta de nuevo.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-[#1b676b] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#1b676b] mb-6">Gestionar Publicaciones</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleAddPost} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-[#1b676b] mb-4">
          {editingPost ? 'Editar Publicación' : 'Agregar Nueva Publicación'}
        </h3>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
              placeholder="Título de la publicación"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Contenido
            </label>
            <textarea
              id="content"
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
              placeholder="Contenido de la publicación. Puedes incluir HTML para embeber contenido."
              required
            />
          </div>
          
          <div>
            <label htmlFor="iframe" className="block text-sm font-medium text-gray-700 mb-1">
              Código Embebido (iframe)
            </label>
            <textarea
              id="iframe"
              name="iframe"
              value={newPost.iframe}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425] font-mono text-sm"
              placeholder='<iframe src="..."></iframe>'
            />
            <p className="text-xs text-gray-500 mt-1">Ingresa el código iframe para embeber contenido de redes sociales (opcional)</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Red Social
              </label>
              <select
                id="type"
                name="type"
                value={newPost.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
                <option value="blog">Blog</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen de Vista Previa
            </label>
            <div className="flex flex-col space-y-2">
              {newPost.previewUrl && (
                <div className="relative w-full max-w-xs h-40 mb-2 group">
                  <img 
                    src={newPost.previewUrl} 
                    alt="Vista previa" 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <button
                      type="button"
                      onClick={() => setNewPost({...newPost, previewUrl: ''})}
                      className="bg-red-500 text-white p-1.5 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <label className="flex-1 cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-center">
                  <Image className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">Seleccionar imagen</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[#88c425] h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Subiendo imagen: {uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1b676b] text-white px-4 py-2 rounded-md hover:bg-[#145256] transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                {editingPost ? 'Actualizando...' : 'Agregando...'}
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 mr-2" />
                {editingPost ? 'Actualizar Publicación' : 'Agregar Publicación'}
              </>
            )}
          </button>
          
          {editingPost && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      <div>
        <h3 className="text-lg font-semibold text-[#1b676b] mb-4">Publicaciones Existentes</h3>
        
        {posts.length === 0 ? (
          <p className="text-gray-500 italic">No hay publicaciones disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post.id || post.numericId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-[#1b676b]">{post.title}</h4>
                      {post.type && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          post.type === 'instagram' ? 'bg-pink-100 text-pink-800' :
                          post.type === 'twitter' ? 'bg-blue-100 text-blue-800' :
                          post.type === 'facebook' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.type}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-3 mb-2">
                      {post.previewUrl && (
                        <img 
                          src={post.previewUrl} 
                          alt={post.title}
                          className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                        />
                      )}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {post.content && post.content.replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id || post.numericId)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1b676b] mb-8">Panel de Administración</h1>
        
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-b-2 border-[#1b676b] text-[#1b676b]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-b-2 border-[#1b676b] text-[#1b676b]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Publicaciones
            </button>
          </div>
        </div>
        
        {activeTab === 'services' ? <ManageServices /> : <ManagePosts />}
      </div>
    </div>
  );
};

export default Dashboard;
