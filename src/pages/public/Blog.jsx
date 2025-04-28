import React, { useState, useEffect } from 'react';
import { getPosts } from '../../services/config/api';
import { Heart, MessageCircle, Share2, Play, Eye, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../../Blog.css'; // Importar desde la ubicación correcta
import TikTokEmbed from '../../components/TikTokEmbed';

// Importar los iconos de redes sociales
import instagramIcon from '../../assets/smIcons/instagram.png';
import facebookIcon from '../../assets/smIcons/facebook.png';
import twitterIcon from '../../assets/smIcons/twitter.png';
import youtubeIcon from '../../assets/smIcons/youtube.png';
import tiktokIcon from '../../assets/smIcons/tik-tok.png';

const SocialIcon = ({ network, className = '' }) => {
  // Mapa de iconos de redes sociales
  const icons = {
    instagram: instagramIcon,
    twitter: twitterIcon,
    facebook: facebookIcon,
    youtube: youtubeIcon,
    tiktok: tiktokIcon,
  };
  
  // El backend solo acepta ciertos valores para 'type'
  const finalNetwork = network || 'instagram';
  const networkIcon = icons[finalNetwork] || instagramIcon; // Default to Instagram if network not found
  
  return (
    <div className={`bg-white p-1.5 rounded-full flex items-center justify-center ${className}`}>
      <img src={networkIcon} alt={`${finalNetwork} icon`} className="w-5 h-5 object-contain" />
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
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Bloquear el scroll del body cuando el popover está abierto
    document.body.style.overflow = 'hidden';
    
    // Generar una nueva key cada vez que se abre el popover
    setIframeKey(Date.now());
    setIframeLoaded(false);
    
    // Si hay un iframe con un script de Twitter, necesitamos cargarlo
    if (getIframeContent() && !isTikTokPost()) {
      // Limpiar cualquier elemento de script previo para evitar duplicados
      const existingScripts = document.querySelectorAll('script[data-twitter-script]');
      existingScripts.forEach(script => script.remove());
      
      // Crear y añadir el nuevo script de Twitter para tweets
      if (post.content?.includes('twitter') || post.iframe?.includes('twitter')) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.charset = 'utf-8';
        script.async = true;
        script.setAttribute('data-twitter-script', 'true');
        script.onload = () => {
          if (window.twttr) {
            window.twttr.widgets.load();
            setIframeLoaded(true);
          }
        };
        document.body.appendChild(script);
      } 
      // Para Instagram y Facebook
      else if (post.content?.includes('instagram') || post.iframe?.includes('instagram') ||
               post.content?.includes('facebook') || post.iframe?.includes('facebook')) {
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
    }

    // Limpiar cuando se cierre el popover
    return () => {
      document.body.style.overflow = '';
      
      // Eliminar scripts añadidos
      const scripts = document.querySelectorAll('script[data-twitter-script], script[data-social-script]');
      scripts.forEach(script => script.remove());
    };
  }, [post]);

  const isTikTokPost = () => {
    return post.type === 'tiktok' || 
           (post.previewUrl && post.previewUrl.includes('tiktok.com')) ||
           (post.iframe && post.iframe.includes('tiktok.com')) ||
           (post.content && post.content.includes('tiktok.com'));
  };

  const getTikTokUrl = () => {
    // Array para almacenar posibles URLs encontradas
    let possibleUrls = [];
    
    // 1. Intentar extraer de iframe primero (mayor prioridad)
    if (post.iframe) {
      // Buscar en atributo cite
      const citeMatch = post.iframe.match(/cite="([^"]+)"/);
      if (citeMatch && citeMatch[1] && citeMatch[1].includes('tiktok.com')) {
        possibleUrls.push(citeMatch[1]);
      }
      
      // Buscar cualquier URL de TikTok en el iframe
      const iframeUrlMatch = post.iframe.match(/(https:\/\/[^"'\s]*tiktok\.com[^"'\s]*)/i);
      if (iframeUrlMatch && iframeUrlMatch[1]) {
        possibleUrls.push(iframeUrlMatch[1]);
      }
    }
    
    // 2. Buscar URL en el contenido (segunda prioridad)
    if (post.content) {
      // Patrón mejorado para capturar URLs de TikTok
      const urlMatches = post.content.match(/(https:\/\/(?:www\.|vm\.)?tiktok\.com(?:\/[@a-zA-Z0-9_.]+)?\/video\/[0-9]+[^\s'"]*)/gi);
      if (urlMatches) {
        possibleUrls = [...possibleUrls, ...urlMatches];
      }
    }
    
    // 3. Verificar previewUrl (última prioridad)
    if (post.previewUrl && post.previewUrl.includes('tiktok.com')) {
      possibleUrls.push(post.previewUrl);
    }
    
    // Buscar una URL que parezca ser de un video de TikTok
    // Preferimos URLs que tengan el formato @usuario/video/id
    const videoUrlPattern = /tiktok\.com\/@[\w.-]+\/video\/\d+/i;
    const bestMatch = possibleUrls.find(url => videoUrlPattern.test(url));
    
    if (bestMatch) {
      console.log('URL de TikTok encontrada (Blog):', bestMatch);
      return bestMatch;
    }
    
    // Si no encontramos un formato ideal, devolver la primera URL encontrada
    if (possibleUrls.length > 0) {
      console.log('URL de TikTok alternativa (Blog):', possibleUrls[0]);
      return possibleUrls[0];
    }
    
    console.log('No se encontró URL de TikTok');
    return null;
  };

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
          
          {/* Renderizado condicional basado en el tipo de contenido */}
          {isTikTokPost() ? (
            <div className="w-full flex justify-center mb-6">
              <TikTokEmbed videoUrl={getTikTokUrl()} maxWidth={500} minWidth={300} />
            </div>
          ) : getIframeContent() ? (
            <div className="iframe-wrapper mb-6">
              <div 
                className="iframe-container" 
                data-key={iframeKey}
                dangerouslySetInnerHTML={{ __html: getIframeContent() }}
              />
              {!iframeLoaded && (
                <div className="w-full p-4 text-center my-4">
                  <div className="animate-pulse bg-gray-200 h-48 rounded flex items-center justify-center">
                    <p className="text-gray-500">Cargando contenido...</p>
                  </div>
                </div>
              )}
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
              {post.content && getIframeContent() && !isTikTokPost()
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
  // Determine social network type based on post type
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
  
  // Determinar si es un post de TikTok para renderizar diferente
  const isTikTokPost = () => {
    return network === 'tiktok' || 
           (post.previewUrl && post.previewUrl.includes('tiktok.com')) ||
           (post.iframe && post.iframe.includes('tiktok.com'));
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl blog-card ${className} transition-transform duration-300 hover:scale-105 cursor-pointer h-[260px]`}
      onClick={onClick}
    >
      <div className="absolute inset-0">
        {post.previewUrl && !isTikTokPost() && (
          <img 
            src={post.previewUrl} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        {isTikTokPost() && (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-10">
              <Play className="w-10 h-10 text-white mb-2" />
              <span className="text-white text-sm">TikTok Video</span>
            </div>
          </div>
        )}
        <div className={`absolute inset-0 ${!post.previewUrl ? 'bg-gradient-to-br from-primary to-primary/70' : 'bg-gradient-to-t from-black/80 via-black/50 to-black/20'}`} />
      </div>

      <div className="relative h-full p-4 flex flex-col">
        <div className="flex items-center mb-2">
          <SocialIcon network={network} className="w-8 h-8 shadow-md" />
        </div>

        <div className="mt-auto">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-secondary transition-colors duration-300 line-clamp-2">
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 px-4 bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">❌ {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-primary">Nuestro Blog</h1>
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
