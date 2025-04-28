import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, PlusCircle, Edit, Trash2, 
  Loader, Search as SearchIcon
} from 'lucide-react';
import {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  uploadToCloudflare
} from '../../../services/config/api';
import Modal from "../Modal";
import PostForm from "./PostForm";
import ConfirmDialog from '../../../components/ConfirmDialog';
import toast from 'react-hot-toast';
import TikTokEmbed from '../../../components/TikTokEmbed';

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Estado para el diálogo de confirmación
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  
  // Estado para previsualización de post
  const [previewPost, setPreviewPost] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Error al cargar las publicaciones. Por favor, intenta de nuevo.');
        toast.error('No se pudieron cargar las publicaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Nuevo efecto para manejar carga de scripts cuando se abre el modal de previsualización
  useEffect(() => {
    if (isPreviewModalOpen && previewPost) {
      // Generar una nueva key cada vez que se abre el popover
      setIframeKey(Date.now());
      setIframeLoaded(false);
      
      // Si hay un iframe pero no es TikTok, cargar los scripts necesarios
      if (getIframeContent(previewPost) && !isTikTokPost(previewPost)) {
        // Limpiar scripts previos
        const existingScripts = document.querySelectorAll('script[data-social-script]');
        existingScripts.forEach(script => script.remove());
        
        // Cargar scripts según el tipo de contenido
        if (containsTwitterContent(previewPost)) {
          const script = document.createElement('script');
          script.src = 'https://platform.twitter.com/widgets.js';
          script.charset = 'utf-8';
          script.async = true;
          script.setAttribute('data-social-script', 'true');
          script.onload = () => {
            if (window.twttr) {
              window.twttr.widgets.load();
              setIframeLoaded(true);
            }
          };
          document.body.appendChild(script);
        } 
        // Para Instagram y Facebook
        else if (containsInstagramContent(previewPost) || containsFacebookContent(previewPost)) {
          const script = document.createElement('script');
          script.src = 'https://www.instagram.com/embed.js';
          script.async = true;
          script.defer = true;
          script.setAttribute('data-social-script', 'true');
          script.onload = () => {
            if (window.instgrm) {
              window.instgrm.Embeds.process();
              setIframeLoaded(true);
            }
          };
          document.body.appendChild(script);
        } else {
          // Para otros iframes, marcar como cargado
          setIframeLoaded(true);
        }
      } else {
        setIframeLoaded(true);
      }
    }

    // Limpiar cuando se cierre el modal
    return () => {
      if (!isPreviewModalOpen) {
        const scripts = document.querySelectorAll('script[data-social-script]');
        scripts.forEach(script => script.remove());
      }
    };
  }, [isPreviewModalOpen, previewPost]);

  // Funciones auxiliares para detectar tipos de contenido
  const containsTwitterContent = (post) => {
    return (post.content && post.content.includes('twitter')) || 
           (post.iframe && post.iframe.includes('twitter')) ||
           post.type === 'twitter';
  };

  const containsInstagramContent = (post) => {
    return (post.content && post.content.includes('instagram')) || 
           (post.iframe && post.iframe.includes('instagram')) ||
           post.type === 'instagram';
  };

  const containsFacebookContent = (post) => {
    return (post.content && post.content.includes('facebook')) || 
           (post.iframe && post.iframe.includes('facebook')) ||
           post.type === 'facebook';
  };

  const getIframeContent = (post) => {
    if (post.iframe) return post.iframe;
    if (!post.content) return null;
    
    const iframeMatch = post.content.match(/<iframe[^>]*>[\s\S]*?<\/iframe>/);
    return iframeMatch ? iframeMatch[0] : null;
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
      toast.error('Error al subir la imagen');
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handlePostSubmit = async (postData, files) => {
    if (!postData.title || !postData.content) {
      setError('Por favor completa todos los campos requeridos.');
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setUploadProgress(0);
      setError(null);
      
      // Process multimedia files if any
      let multimedia = [...(postData.multimedia || [])];
      
      // Upload new files if selected
      if (files && files.length > 0) {
        setUploadProgress(10);
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const fileUrl = await uploadFileToCloudflare(file);
            if (fileUrl) {
              // Determine type based on file mimetype
              const type = file.type.startsWith('image/') ? 'image' : 'video';
              multimedia.push({ url: fileUrl, type });
            } else {
              toast.error('Error al subir la imagen. No se recibió una URL válida.');
              setIsSubmitting(false);
              return;
            }
            // Update progress incrementally
            setUploadProgress(10 + Math.floor((i + 1) / files.length * 80));
          } catch (uploadError) {
            console.error(`Error uploading file ${i + 1}:`, uploadError);
            toast.error('Error al subir la imagen. Por favor, intente de nuevo.');
            setIsSubmitting(false);
            return;
          }
        }
      }
      
      // Prepare post data for API
      const apiPostData = {
        title: postData.title,
        content: postData.content,
        type: postData.type || 'instagram',
        category: postData.category || 'General',
        multimedia: multimedia,
        companyId: 2,
        siteId: 1,
        previewUrl: postData.previewUrl || '',
        iframe: postData.iframe || ''
      };
      
      let postResponse;
      
      // Update existing post or create new one
      if (editingPost) {
        const postId = editingPost.id || editingPost.numericId;
        console.log(`Updating post with ID: ${postId}`, apiPostData);
        postResponse = await updatePost(postId, apiPostData);
        
        // Update posts list
        setPosts(posts.map(post => 
          (post.id || post.numericId) === postId ? postResponse : post
        ));
        
        setIsEditModalOpen(false);
        setEditingPost(null);
        toast.success(`Publicación "${postData.title}" actualizada correctamente`);
      } else {
        console.log('Creating new post:', apiPostData);
        postResponse = await addPost(apiPostData);
        
        // Add the new post to the list
        setPosts([...posts, postResponse]);
        setIsCreateModalOpen(false);
        toast.success(`Publicación "${postData.title}" creada correctamente`);
      }
      
      setUploadProgress(0);
      
    } catch (err) {
      const action = editingPost ? 'actualizar' : 'crear';
      setError(`Error al ${action} la publicación. Por favor, intenta de nuevo.`);
      toast.error(`Error al ${action} la publicación. Por favor, intenta de nuevo.`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handlePreviewPost = (post) => {
    setPreviewPost(post);
    setIsPreviewModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
    setError(null);
    setUploadProgress(0);
  };
  
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setError(null);
    setUploadProgress(0);
  };
  
  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewPost(null);
    setIframeLoaded(false);
  };

  const confirmDeletePost = (id, title) => {
    setPostToDelete({ id, title });
    setIsConfirmDialogOpen(true);
  };
  
  const handleDeleteConfirmed = async () => {
    if (!postToDelete) return;
    
    try {
      console.log(`Deleting post with ID: ${postToDelete.id}`);
      await deletePost(postToDelete.id);
      setPosts(posts.filter(post => 
        (post.id || post.numericId) !== postToDelete.id
      ));
      setError(null);
      toast.success(`Publicación "${postToDelete.title}" eliminada correctamente`);
    } catch (err) {
      setError('Error al eliminar la publicación. Por favor, intenta de nuevo.');
      toast.error('Error al eliminar la publicación');
      console.error('Error deleting post:', err);
    } finally {
      setIsConfirmDialogOpen(false);
      setPostToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setPostToDelete(null);
  };

  // Filtrar publicaciones según la búsqueda
  const filteredPosts = () => {
    if (!searchQuery.trim()) return posts;
    
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.title?.toLowerCase().includes(query) || 
      post.content?.toLowerCase().includes(query)
    );
  };
  
  // Comprobar si un post es de TikTok basado en su tipo o URL
  const isTikTokPost = (post) => {
    return post.type === 'tiktok' || 
           (post.previewUrl && post.previewUrl.includes('tiktok.com')) ||
           (post.iframe && post.iframe.includes('tiktok.com')) ||
           (post.content && post.content.includes('tiktok.com'));
  };
  
  // Renderizar contenido del post según su tipo
  const renderPostContent = (post) => {
    // Caso especial para TikTok
    if (isTikTokPost(post)) {
      // Priorizar el contenido del iframe sobre previewUrl
      let tikTokUrl = null;
      
      // Intentar extraer la URL de TikTok del campo iframe primero
      if (post.iframe) {
        // Intentar extraer la URL de un atributo cite en el iframe
        const citeMatch = post.iframe.match(/cite="([^"]+)"/);
        if (citeMatch && citeMatch[1]) {
          tikTokUrl = citeMatch[1];
        } 
        // Si no hay cite, buscar cualquier URL de TikTok en el iframe
        else {
          const urlMatch = post.iframe.match(/(https:\/\/[^"'\s]*tiktok\.com[^"'\s]*)/);
          if (urlMatch && urlMatch[1]) {
            tikTokUrl = urlMatch[1];
          }
        }
      }
      
      // Si no se encontró en iframe, buscar en el contenido
      if (!tikTokUrl && post.content) {
        const contentMatch = post.content.match(/(https:\/\/[^"'\s]*tiktok\.com[^"'\s]*)/);
        if (contentMatch && contentMatch[1]) {
          tikTokUrl = contentMatch[1];
        }
      }
      
      // Como último recurso, usar previewUrl si contiene tiktok.com
      if (!tikTokUrl && post.previewUrl && post.previewUrl.includes('tiktok.com')) {
        tikTokUrl = post.previewUrl;
      }
      
      console.log('URL de TikTok encontrada:', tikTokUrl);
      
      if (tikTokUrl) {
        return <TikTokEmbed videoUrl={tikTokUrl} maxWidth={500} minWidth={325} />;
      } else {
        return (
          <div className="w-full p-4 bg-red-50 text-red-500 rounded-md text-center">
            No se pudo encontrar una URL válida de TikTok en este post.
          </div>
        );
      }
    } 
    // Para otros iframes (no TikTok)
    else if (getIframeContent(post)) {
      return (
        <div>
          <div 
            key={iframeKey}
            className="iframe-container w-full"
            dangerouslySetInnerHTML={{ __html: getIframeContent(post) }}
          />
          {!iframeLoaded && (
            <div className="w-full p-4 text-center my-4">
              <div className="animate-pulse bg-gray-200 h-48 rounded flex items-center justify-center">
                <p className="text-gray-500">Cargando contenido...</p>
              </div>
            </div>
          )}
        </div>
      );
    }
    // Para posts que solo tienen imágenes de previsualización
    else if (post.previewUrl) {
      return (
        <div className="w-full flex justify-center">
          <img
            src={post.previewUrl}
            alt={post.title}
            className="max-w-full h-auto rounded-lg object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Gestionar Publicaciones</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nueva Publicación
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
              placeholder="Buscar publicaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 italic mb-4">No hay publicaciones disponibles</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center mx-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Crear tu primera publicación
            </button>
          </div>
        ) : filteredPosts().length === 0 ? (
          <p className="text-gray-500 italic">No se encontraron publicaciones con tu búsqueda</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts().map((post) => (
              <div key={post.id || post.numericId} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-primary">{post.title}</h4>
                      {post.type === 'featured' && (
                        <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          Destacado
                        </div>
                      )}
                      {post.type && (
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {post.type}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3 mb-2">
                      {isTikTokPost(post) ? (
                        <div className="w-full cursor-pointer" onClick={() => handlePreviewPost(post)}>
                          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md text-xs text-gray-500">
                            TikTok Preview
                          </div>
                        </div>
                      ) : post.previewUrl ? (
                        <img 
                          src={post.previewUrl} 
                          alt={post.title}
                          className="w-20 h-20 object-cover rounded-md flex-shrink-0 cursor-pointer"
                          onClick={() => handlePreviewPost(post)}
                          onError={(e) => {
                            e.target.onerror = null;
                            // Fallback styling if image fails to load
                            const parent = e.target.parentNode;
                            if (parent) {
                              parent.className = "w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md";
                              e.target.replaceWith(document.createElement('div'));
                            }
                          }}
                        />
                      ) : null}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {post.content && post.content.replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3 justify-end">
                    <button
                      onClick={() => handlePreviewPost(post)}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors flex items-center"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors flex items-center"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDeletePost(post.id || post.numericId, post.title)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors flex items-center"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Create Post Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Crear Nueva Publicación"
      >
        <PostForm
          post={null}
          onSubmit={handlePostSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          onCancel={handleCloseCreateModal}
          error={error}
          isEditing={false}
        />
      </Modal>
      
      {/* Edit Post Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Publicación"
      >
        <PostForm
          post={editingPost}
          onSubmit={handlePostSubmit}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          onCancel={handleCloseEditModal}
          error={error}
          isEditing={true}
        />
      </Modal>
      
      {/* Preview Post Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreviewModal}
        title={previewPost?.title || "Vista previa"}
      >
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{previewPost?.title}</h3>
            <p className="text-gray-600 whitespace-pre-line mb-4">
              {previewPost?.content && getIframeContent(previewPost)
                ? previewPost.content.replace(getIframeContent(previewPost), '') 
                : previewPost?.content}
            </p>
            
            {/* Renderizar contenido según el tipo */}
            <div className="w-full flex justify-center my-4">
              {previewPost && renderPostContent(previewPost)}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleClosePreviewModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteConfirmed}
        title="Eliminar Publicación"
        message={postToDelete ? `¿Estás seguro de que deseas eliminar la publicación "${postToDelete.title}"? Esta acción no se puede deshacer.` : ''}
      />
    </div>
  );
};

export default ManagePosts; 