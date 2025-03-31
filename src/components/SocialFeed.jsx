import React, { useState, useEffect } from 'react';
import { Instagram, Twitter, Heart, MessageCircle, Share2, Play, Eye, Loader, X } from 'lucide-react';
import { getPosts } from '../utils/api';
import { createPortal } from 'react-dom';

const SocialIcon = ({ network, className = '' }) => {
  const icons = {
    instagram: Instagram,
    twitter: Twitter
  };
  const Icon = icons[network];
  
  const bgColors = {
    instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    twitter: 'bg-[#1DA1F2]'
  };

  return (
    <div className={`${bgColors[network]} p-1.5 rounded-full ${className}`}>
      <Icon className="w-4 h-4 text-white" />
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
  if (!post) return null;

  // Extraer el contenido iframe si existe
  const getIframeContent = () => {
    if (!post.description) return null;
    
    const iframeMatch = post.description.match(/<iframe[^>]*>[\s\S]*?<\/iframe>/);
    return iframeMatch ? iframeMatch[0] : null;
  };

  const iframeContent = getIframeContent();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-10"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.name}</h2>
          
          {iframeContent ? (
            <div 
              className="w-full aspect-video mb-6 rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ __html: iframeContent }}
            />
          ) : post.preview ? (
            <img 
              src={post.preview} 
              alt={post.name}
              className="w-full aspect-video mb-6 rounded-lg object-cover"
            />
          ) : null}
          
          <div className="prose prose-sm max-w-none">
            {post.description && (
              <div dangerouslySetInnerHTML={{ 
                __html: post.description.replace(iframeContent || '', '') 
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
  // Determinar el tipo de red social basado en el contenido
  const determineNetwork = () => {
    if (post.description && post.description.includes('instagram')) {
      return 'instagram';
    } else if (post.description && post.description.includes('twitter')) {
      return 'twitter';
    }
    return 'instagram'; // Default
  };
  
  const network = post.network || determineNetwork();
  
  const formattedDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl h-full cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="absolute inset-0">
        {post.preview ? (
          <>
            <img 
              src={post.preview} 
              alt={post.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </>
        ) : (
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 h-full w-full"></div>
        )}
        <div className={`absolute inset-0 ${!post.preview ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-t from-black/80 via-black/50 to-black/20'}`} />
      </div>

      <div className="relative h-full p-4 sm:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <SocialIcon network={network} />
          <span className="text-white/60 text-xs sm:text-sm">
            {formattedDate}
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
            {post.name}
          </h3>
          <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
            {post.description && post.description.replace(/<[^>]*>?/gm, '')}
          </p>
          <div className="flex items-center justify-between">
            <SocialStats post={post} />
            <button className="bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
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
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        setPosts(data);
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

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-[#1b676b] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No hay publicaciones disponibles.</p>
      </div>
    );
  }

  // Determinar el número de columnas basado en la cantidad de posts
  const getGridCols = () => {
    if (posts.length === 1) return 'grid-cols-1';
    if (posts.length === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestro Blog</h2>
          <p className="text-gray-600">Mantente al día con nuestras últimas noticias y actualizaciones</p>
        </div>
        
        <div className={`grid ${getGridCols()} gap-6`}>
          {posts.map((post) => (
            <SocialCard 
              key={post._id} 
              post={post} 
              onClick={() => handlePostClick(post)}
            />
          ))}
        </div>
      </div>

      {selectedPost && (
        <PostModal 
          post={selectedPost}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default SocialFeed;
