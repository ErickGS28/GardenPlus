import React from 'react';
import { socialPosts } from '../data/socialPosts';
import { Instagram, Twitter, Heart, MessageCircle, Share2, Play, Eye } from 'lucide-react';

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
  if (post.network === 'instagram') {
    return (
      <div className="flex items-center gap-4 text-white/80 text-sm">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span>{post.likes}</span>
        </div>
        {post.comments && (
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments}</span>
          </div>
        )}
        {post.views && (
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
        )}
      </div>
    );
  }

  if (post.network === 'twitter') {
    return (
      <div className="flex items-center gap-4 text-white/80 text-sm">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span>{post.likes}</span>
        </div>
        {post.retweets && (
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>{post.retweets}</span>
          </div>
        )}
      </div>
    );
  }
};

const SocialCard = ({ post, className = '' }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl h-full ${className}`}
    >
      <div className="absolute inset-0">
        {post.type !== 'text' && (
          <>
            <img 
              src={post.media} 
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {post.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 p-3 sm:p-4 rounded-full">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" />
                </div>
              </div>
            )}
          </>
        )}
        <div className={`absolute inset-0 ${post.type === 'text' ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-t from-black/80 via-black/50 to-black/20'}`} />
      </div>

      <div className="relative h-full p-4 sm:p-6 flex flex-col">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <SocialIcon network={post.network} />
          <span className="text-white/60 text-xs sm:text-sm">
            {formattedDate}
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
            {post.title}
          </h3>
          <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
            {post.content}
          </p>
          <SocialStats post={post} />
        </div>
      </div>
    </div>
  );
};

const SocialFeed = () => {
  return (
    <section className="py-10 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-3 sm:mb-4">
            Síguenos en Redes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Mantente al día con nuestros últimos proyectos, consejos de jardinería y más en nuestras redes sociales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-6 auto-rows-[250px] sm:auto-rows-[280px]">
          {/* Featured Instagram post - spans 8 columns and 2 rows on larger screens */}
          <SocialCard 
            post={socialPosts[0]} 
            className="sm:col-span-2 sm:row-span-2 md:col-span-6 md:row-span-2 lg:col-span-8 lg:row-span-2"
          />
          
          {/* Twitter text post */}
          <SocialCard 
            post={socialPosts[1]}
            className="sm:col-span-1 md:col-span-3 lg:col-span-4"
          />
          
          {/* Instagram video post */}
          <SocialCard 
            post={socialPosts[2]}
            className="sm:col-span-1 md:col-span-3 lg:col-span-4"
          />
          
          {/* Wide Instagram post */}
          <SocialCard 
            post={socialPosts[3]} 
            className="sm:col-span-1 md:col-span-3 lg:col-span-5"
          />
          
          {/* Twitter post with image */}
          <SocialCard 
            post={socialPosts[4]}
            className="sm:col-span-1 md:col-span-3 lg:col-span-7"
          />
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
