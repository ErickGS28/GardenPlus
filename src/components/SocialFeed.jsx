import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/config/api';
import { Loader, AlertCircle, Heart, MessageCircle, Share2, Play, Eye, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../Blog.css'; // Importar los estilos CSS

// Importar los iconos de redes sociales
import instagramIcon from '../assets/smIcons/instagram.png';
import facebookIcon from '../assets/smIcons/facebook.png';
import twitterIcon from '../assets/smIcons/twitter.png';
import youtubeIcon from '../assets/smIcons/youtube.png';
import tiktokIcon from '../assets/smIcons/tik-tok.png';
import linkedinIcon from '../assets/smIcons/linkedin.png';

const SocialIcon = ({ network, className = '' }) => {
  // Mapa de iconos de redes sociales
  const icons = {
    instagram: instagramIcon,
    twitter: twitterIcon,
    facebook: facebookIcon,
    youtube: youtubeIcon,
    tiktok: tiktokIcon,
    linkedin: linkedinIcon
  };
  
  // Asegurarse de que el network esté en minúsculas y sea válido
  const normalizedNetwork = (network || '').toLowerCase();
  const networkIcon = icons[normalizedNetwork] || instagramIcon; // Default to Instagram if network not found

  return (
    <div className={`bg-white p-1.5 rounded-full flex items-center justify-center ${className}`}>
      <img src={networkIcon} alt={`${normalizedNetwork} icon`} className="w-5 h-5 object-contain" />
    </div>
  );
};

const SocialStats = ({ post }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        <Heart className="w-4 h-4 text-white" />
        <span className="text-white text-xs">{post.likes || Math.floor(Math.random() * 100) + 10}</span>
      </div>
      <div className="flex items-center space-x-1">
        <MessageCircle className="w-4 h-4 text-white" />
        <span className="text-white text-xs">{post.comments || Math.floor(Math.random() * 20) + 5}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Share2 className="w-4 h-4 text-white" />
        <span className="text-white text-xs">{post.shares || Math.floor(Math.random() * 10) + 2}</span>
      </div>
    </div>
  );
};

const PostModal = ({ post, onClose }) => {
  const [iframeKey, setIframeKey] = useState(Date.now());

  useEffect(() => {
    // Bloquear el scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    // Generar una nueva key cada vez que se abre el modal
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

    // Limpiar cuando se cierre el modal
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

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 modal-overlay" 
      onClick={handleClose}
    >
      <div 
        className="relative bg-white rounded-xl w-full max-w-4xl m-4 overflow-hidden flex flex-col modal-content"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-gray-800 p-1.5 rounded-full hover:bg-white/40 transition-colors"
          onClick={handleClose}
        >
          <X className="w-6 h-6" />
        </button>
        
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
            {post.content && (
              <div dangerouslySetInnerHTML={{ 
                __html: post.content.replace(getIframeContent() || '', '') 
              }} />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const SocialCard = ({ post, className = '', onClick }) => {
  // Determine social network type based on content
  const determineNetwork = () => {
    if (post.type) return post.type.toLowerCase();
    if (post.content && post.content.includes('instagram')) {
      return 'instagram';
    } else if (post.content && post.content.includes('twitter')) {
      return 'twitter';
    } else if (post.content && post.content.includes('facebook')) {
      return 'facebook';
    } else if (post.content && post.content.includes('youtube')) {
      return 'youtube';
    } else if (post.content && post.content.includes('tiktok')) {
      return 'tiktok';
    }
    return 'instagram'; // Default
  };
  
  const network = determineNetwork();

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl blog-card h-full cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="absolute inset-0">
        {post.previewUrl ? (
          <>
            <img 
              src={post.previewUrl} 
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </>
        ) : (
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 h-full w-full"></div>
        )}
        <div className={`absolute inset-0 ${!post.previewUrl ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-t from-black/80 via-black/50 to-black/20'}`} />
      </div>

      <div className="relative h-full p-4 flex flex-col">
        <div className="flex items-start mb-2">
          <SocialIcon network={network} className="w-9 h-9 shadow-lg" />
        </div>

        <div className="mt-auto">
          <h3 className="text-lg font-bold text-white mb-1">
            {post.title}
          </h3>
          <p className="text-white/80 text-xs mb-3 line-clamp-2">
            {post.content && post.content.replace(/<[^>]*>?/gm, '')}
          </p>
        </div>
      </div>
    </div>
  );
};

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('No se pudieron cargar las publicaciones. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
        <Loader className="w-12 h-12 text-[#1b676b] animate-spin" />
        <p className="mt-4 text-gray-600">Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
        <p className="text-gray-600">No hay publicaciones disponibles en este momento.</p>
      </div>
    );
  }

  // Determine grid layout based on number of posts
  const getGridClass = () => {
    const count = posts.length;
    if (count === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto';
    if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto';
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1b676b]">Síguenos en Redes Sociales</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Mantente al día con nuestras últimas noticias, eventos y promociones a través de nuestras redes sociales.
          </p>
        </div>

        <div className={`grid ${getGridClass()} gap-8 ${posts.length === 1 ? 'min-h-[300px] items-center' : ''}` }>
          {posts.map((post) => (
            <SocialCard 
              key={post.id || post.numericId || post._id || `post-${post.title}`} 
              post={post} 
              onClick={() => handlePostClick(post)}
              className="h-[280px]"
            />
          ))}
        </div>
        
        {selectedPost && (
          <PostModal post={selectedPost} onClose={closeModal} />
        )}
      </div>
    </section>
  );
};

export default SocialFeed;
