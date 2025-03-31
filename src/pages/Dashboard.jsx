import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Image, Loader } from 'lucide-react';
import { 
  getProducts, addProduct, updateProduct, deleteProduct,
  getPosts, addPost, updatePost, deletePost
} from '../utils/api';

// Service Management Component
const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setServices(data);
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

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price) return;
    
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', newService.name);
      if (newService.description) {
        formData.append('description', newService.description);
      }
      formData.append('price', newService.price);
      formData.append('category', newService.category);
      
      // Add multimedia files
      selectedFiles.forEach(file => {
        formData.append('multimedia', file);
      });
      
      const newServiceData = await addProduct(formData);
      
      setServices([...services, newServiceData]);
      
      // Reset form
      setNewService({
        name: '',
        description: '',
        price: '',
        category: ''
      });
      setSelectedFiles([]);
      
    } catch (err) {
      setError('Error al crear el servicio. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await deleteProduct(id);
        setServices(services.filter(service => service._id !== id));
      } catch (err) {
        setError('Error al eliminar el servicio. Por favor, intenta de nuevo.');
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
      <h2 className="text-2xl font-bold text-[#1b676b] mb-6">Gestionar Servicios</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleAddService} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-[#1b676b] mb-4">Agregar Nuevo Servicio</h3>
        
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imágenes o Videos
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                <Image className="w-5 h-5 mr-2 text-gray-600" />
                <span>Seleccionar Archivos</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,video/*"
                />
              </label>
              <span className="text-sm text-gray-500">
                {selectedFiles.length > 0 
                  ? `${selectedFiles.length} archivo(s) seleccionado(s)` 
                  : 'No se ha seleccionado ningún archivo'}
              </span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="flex items-center justify-center px-4 py-2 bg-[#1b676b] text-white rounded-md hover:bg-[#88c425] transition-colors duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <PlusCircle className="w-5 h-5 mr-2" />
          )}
          Agregar Servicio
        </button>
      </form>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#1b676b] mb-2">Servicios Existentes</h3>
        
        {services.length === 0 ? (
          <p className="text-gray-500 italic">No hay servicios disponibles</p>
        ) : (
          <div className="space-y-4">
            {services.map(service => (
              <div key={service._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-[#1b676b]">{service.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {service.multimedia && service.multimedia.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.multimedia.map((media, index) => (
                      <div key={`${service._id}-media-${index}`} className="relative group">
                        {media.tipo === "imagen" ? (
                          <img 
                            src={media.url} 
                            alt={`Imagen ${index + 1}`} 
                            className="w-24 h-24 object-cover rounded border border-gray-200"
                          />
                        ) : (
                          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded border border-gray-200">
                            <span className="text-xs text-gray-500">Video</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Blog Management Component
const ManageBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPost, setNewPost] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        // Asegurarse de que data sea un array
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

  const handlePreviewChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewFile(e.target.files[0]);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!newPost.name || !newPost.description) return;
    
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('name', newPost.name);
      formData.append('description', newPost.description);
      
      if (previewFile) {
        formData.append('preview', previewFile);
      }
      
      const newPostData = await addPost(formData);
      
      // Verificar que newPostData sea válido antes de agregarlo
      if (newPostData && newPostData._id) {
        setPosts([...posts, newPostData]);
        
        // Reset form
        setNewPost({
          name: '',
          description: ''
        });
        setPreviewFile(null);
      } else {
        throw new Error('La respuesta del servidor no contiene datos válidos');
      }
      
    } catch (err) {
      setError('Error al crear la publicación. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!postId) return;
    
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      return;
    }
    
    try {
      // Aquí iría la llamada a la API para eliminar el post
      // await deletePost(postId);
      
      // Actualizar el estado local
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      setError('Error al eliminar la publicación. Por favor, intenta de nuevo.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-40">
          <Loader className="w-8 h-8 text-[#1b676b] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-[#1b676b] mb-6">Gestionar Blog</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#1b676b] mb-4">Agregar Nueva Publicación</h3>
        
        <form onSubmit={handleAddPost} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newPost.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1b676b] focus:border-[#1b676b]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Contenido (HTML permitido)
            </label>
            <textarea
              id="description"
              name="description"
              value={newPost.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1b676b] focus:border-[#1b676b]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="preview" className="block text-sm font-medium text-gray-700 mb-1">
              Imagen de Previsualización
            </label>
            <input
              type="file"
              id="preview"
              name="preview"
              onChange={handlePreviewChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1b676b] focus:border-[#1b676b]"
              accept="image/*"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1b676b] text-white px-4 py-2 rounded-md hover:bg-[#145256] focus:outline-none focus:ring-2 focus:ring-[#1b676b] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Agregando...' : 'Agregar Publicación'}
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-[#1b676b] mb-2">Publicaciones Existentes</h3>
        
        {!Array.isArray(posts) || posts.length === 0 ? (
          <p className="text-gray-500 italic">No hay publicaciones disponibles</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => post && post._id ? (
              <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#1b676b]">{post.name || 'Sin título'}</h4>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {post.preview && (
                    <div>
                      <img 
                        src={post.preview} 
                        alt={post.name || 'Imagen de publicación'} 
                        className="w-full h-40 object-cover rounded border border-gray-200"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Contenido:</h5>
                    <div className="text-gray-600 text-sm mt-2 border border-gray-200 rounded p-2 bg-gray-50 overflow-hidden max-h-36">
                      {post.description && post.description.length > 150 
                        ? post.description.substring(0, 150) + '...' 
                        : post.description || 'Sin contenido'}
                    </div>
                  </div>
                </div>
              </div>
            ) : null)}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <div className="min-h-screen pt-28 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#1b676b]">Panel de Administración</h1>
        
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'services'
                  ? 'bg-[#1b676b] text-white'
                  : 'bg-white text-[#1b676b] hover:bg-gray-100'
              } transition-colors duration-300`}
              onClick={() => setActiveTab('services')}
            >
              Gestionar Servicios
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'blog'
                  ? 'bg-[#1b676b] text-white'
                  : 'bg-white text-[#1b676b] hover:bg-gray-100'
              } transition-colors duration-300`}
              onClick={() => setActiveTab('blog')}
            >
              Gestionar Blog
            </button>
          </div>
        </div>
        
        {activeTab === 'services' ? <ManageServices /> : <ManageBlog />}
      </div>
    </div>
  );
};

export default Dashboard;
