import React, { useState, useEffect } from 'react';
import { getPosts } from '../utils/api';
import { Instagram, Twitter, Heart, MessageCircle, Share2, Play, Eye, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../Blog.css'; // Importar desde la ubicación correcta

const SocialIcon = ({ network, className = '' }) => {
  // El backend solo acepta 'instagram' como valor válido para 'type'
  // así que ajustamos todo para usar ese valor
  const finalNetwork = network || 'instagram';
  
  const icons = {
    instagram: Instagram,
    twitter: Twitter
  };
  const Icon = icons[finalNetwork] || Instagram;
  
  const bgColors = {
    instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    twitter: 'bg-[#1DA1F2]'
  };

  return (
    <div className={`${bgColors[finalNetwork] || bgColors.instagram} p-1.5 rounded-full ${className}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
};

const SocialStats = ({ post }) => {
  // Valores aleatorios para estadísticas si no vienen en el post
  const likes = post.likes || Math.floor(Math.random() * 100) + 10;
  const comments = post.comments || Math.floor(Math.random() * 20) + 5;
  const views = post.views || Math.floor(Math.random() * 1000) + 100;

  return (
    <div className="flex items-center gap-4 text-white/80 text-sm">
      <div className="flex items-center gap-1">
        <Heart className="w-4 h-4" />
        <span>{likes}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="w-4 h-4" />
        <span>{comments}</span>
      </div>
      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4" />
        <span>{views}</span>
      </div>
    </div>
  );
};

// Componente de Popover para mostrar el iframe
const PostPopover = ({ post, onClose }) => {
  if (!post) return null;

  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    // Bloquear el scroll del body cuando el popover está abierto
    document.body.style.overflow = 'hidden';
    
    // Generar una nueva key cada vez que se abre el popover
    setIframeKey(Date.now());
    
    // Si hay un iframe con un script de Twitter, necesitamos cargarlo
    if (getIframeContent()) {
      // Limpiar cualquier elemento de script previo para evitar duplicados
      const existingScripts = document.querySelectorAll('script[data-twitter-script]');
      existingScripts.forEach(script => script.remove());
      
      // Crear y añadir el nuevo script de Twitter
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.charset = 'utf-8';
      script.async = true;
      script.setAttribute('data-twitter-script', 'true');
      script.onload = () => {
        if (window.twttr) {
          window.twttr.widgets.load();
        }
      };
      document.body.appendChild(script);
    }

    // Limpiar cuando se cierre el popover
    return () => {
      document.body.style.overflow = '';
    };
  }, [post]);

  const getIframeContent = () => {
    if (post.iframe) return post.iframe;
    if (!post.content) return null;
    
    const iframeMatch = post.content.match(/<iframe[^>]*>[\s\S]*?<\/iframe>/);
    return iframeMatch ? iframeMatch[0] : null;
  };

  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };

  const network = post.type || 'instagram';

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 modal-overlay" 
      onClick={handleClose}
    >
      <div 
        className="relative bg-gray-100 rounded-xl w-full max-w-4xl m-4 overflow-hidden flex flex-col modal-content"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
          <div className="mr-3">
            <SocialIcon network={network} />
          </div>
          <button 
            className="bg-white/20 backdrop-blur-sm text-gray-800 p-1.5 rounded-full hover:bg-white/40 transition-colors"
            onClick={handleClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
          
          {getIframeContent() ? (
            <div className="iframe-wrapper mb-6">
              <div 
                className="iframe-container" 
                data-key={iframeKey}
                dangerouslySetInnerHTML={{ __html: getIframeContent() }}
              />
            </div>
          ) : post.previewUrl ? (
            <div className="w-full flex justify-center mb-6">
              <img 
                src={post.previewUrl} 
                alt={post.title}
                className="max-w-full h-auto rounded-lg object-cover"
                style={{ maxHeight: '50vh' }}
              />
            </div>
          ) : null}
          
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 whitespace-pre-line">
              {post.content && getIframeContent() 
                ? post.content.replace(getIframeContent(), '') 
                : post.content}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const SocialCard = ({ post, className = '', onClick }) => {
  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl blog-card ${className} transition-transform duration-300 hover:scale-105 cursor-pointer h-[260px]`}
      onClick={onClick}
    >
      <div className="absolute inset-0">
        {post.previewUrl && (
          <img 
            src={post.previewUrl} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className={`absolute inset-0 ${!post.previewUrl ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-t from-black/80 via-black/50 to-black/20'}`} />
      </div>

      <div className="relative h-full p-4 flex flex-col">
        <div className="flex items-center mb-2">
          <SocialIcon network="instagram" />
        </div>

        <div className="mt-auto">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#bef202] transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-white/80 text-xs mb-3 line-clamp-2">
            {post.content}
          </p>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('No se pudieron cargar las publicaciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleOpenPost = (post) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 px-4 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 px-4 bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">❌ {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-emerald-900">Nuestro Blog</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Mantente al día con nuestros últimos artículos, consejos de jardinería y proyectos destacados.
        </p>
        
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No hay publicaciones disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post) => (
              <SocialCard 
                key={post._id || post.numericId} 
                post={post} 
                onClick={() => handleOpenPost(post)}
              />
            ))}
          </div>
        )}
      </div>
      
      {selectedPost && (
        <PostPopover post={selectedPost} onClose={handleClosePost} />
      )}
    </div>
  );
};

export default Blog;
