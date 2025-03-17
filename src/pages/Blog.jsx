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
      className={`group relative overflow-hidden rounded-2xl ${className} transition-transform duration-300 hover:scale-105`}
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
                <div className="bg-black/50 p-4 rounded-full">
                  <Play className="w-8 h-8 text-white" fill="currentColor" />
                </div>
              </div>
            )}
          </>
        )}
        <div className={`absolute inset-0 ${post.type === 'text' ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-t from-black/80 via-black/50 to-black/20'}`} />
      </div>

      <div className="relative h-full p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <SocialIcon network={post.network} />
          <span className="text-white/60 text-sm">
            {formattedDate}
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#bef202] transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-white/80 text-sm mb-4 line-clamp-3">
            {post.content}
          </p>
          <SocialStats post={post} />
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  return (
    <div className="min-h-screen pt-28 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-emerald-900">Nuestro Blog</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Mantente al día con nuestros últimos artículos, consejos de jardinería y proyectos destacados.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {socialPosts.map((post) => (
            <SocialCard key={post.id} post={post} className="h-[350px]" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
