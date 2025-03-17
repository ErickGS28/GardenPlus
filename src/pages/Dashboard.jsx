import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Image } from 'lucide-react';

// Service Management Component
const ManageServices = () => {
  const [services, setServices] = useState([
    { id: 1, title: 'Diseño de Jardines', description: 'Creamos jardines personalizados que reflejan tu estilo y necesidades.' },
    { id: 2, title: 'Mantenimiento', description: 'Servicio regular para mantener tu jardín en óptimas condiciones.' },
    { id: 3, title: 'Instalación de Sistemas de Riego', description: 'Sistemas eficientes para el cuidado automático de tus plantas.' }
  ]);

  const [newService, setNewService] = useState({
    title: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value
    });
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.title || !newService.description) return;
    
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    
    setServices([
      ...services,
      {
        id: newId,
        ...newService
      }
    ]);
    
    setNewService({
      title: '',
      description: ''
    });
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#1b676b] mb-6">Gestionar Servicios</h2>
      
      <form onSubmit={handleAddService} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-[#1b676b] mb-4">Agregar Nuevo Servicio</h3>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newService.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
              placeholder="Título del servicio"
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
        </div>
        
        <button
          type="submit"
          className="flex items-center justify-center px-4 py-2 bg-[#1b676b] text-white rounded-md hover:bg-[#88c425] transition-colors duration-300"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
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
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-[#1b676b]">{service.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
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
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      title: 'Consejos para un Jardín Saludable', 
      content: 'Aprende los mejores consejos para mantener tu jardín en óptimas condiciones...',
      image: null,
      date: '2025-03-10'
    },
    { 
      id: 2, 
      title: 'Plantas de Temporada', 
      content: 'Descubre qué plantas son ideales para cada época del año...',
      image: null,
      date: '2025-03-05'
    }
  ]);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value
    });
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    
    setPosts([
      ...posts,
      {
        id: newId,
        ...newPost,
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    
    setNewPost({
      title: '',
      content: '',
      image: null
    });
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#1b676b] mb-6">Gestionar Blog</h2>
      
      <form onSubmit={handleAddPost} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-[#1b676b] mb-4">Crear Nueva Publicación</h3>
        
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="post-title"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
              placeholder="Título de la publicación"
            />
          </div>
          
          <div>
            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-1">
              Contenido
            </label>
            <textarea
              id="post-content"
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425]"
              placeholder="Contenido de la publicación"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Image className="w-5 h-5 mr-2 text-gray-600" />
                <span>Subir Imagen</span>
              </button>
              <span className="text-sm text-gray-500">No se ha seleccionado ningún archivo</span>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="flex items-center justify-center px-4 py-2 bg-[#1b676b] text-white rounded-md hover:bg-[#88c425] transition-colors duration-300"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Publicar
        </button>
      </form>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#1b676b] mb-2">Publicaciones Existentes</h3>
        
        {posts.length === 0 ? (
          <p className="text-gray-500 italic">No hay publicaciones disponibles</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-[#1b676b]">{post.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">Publicado: {post.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{post.content}</p>
              </div>
            ))}
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
