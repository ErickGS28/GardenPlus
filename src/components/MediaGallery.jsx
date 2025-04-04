import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../Blog.css';

const MediaGallery = ({ media = [], onClose = null }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!media || media.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No hay multimedia disponible</p>
      </div>
    );
  }
  
  const currentItem = media[currentIndex];
  const totalItems = media.length;
  
  const goToNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };
  
  const goToPrevious = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };
  
  return (
    <div className="media-gallery-container">
      <div className="media-gallery-item">
        {currentItem.type === 'image' || currentItem.type === 'imagen' ? (
          <img 
            src={currentItem.url} 
            alt={`Multimedia ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        ) : currentItem.type === 'video' ? (
          <video 
            src={currentItem.url} 
            controls
            className="w-full h-full max-h-full"
          />
        ) : (
          <div className="text-white">Formato no soportado</div>
        )}
      </div>
      
      {totalItems > 1 && (
        <div className="media-navigation">
          <button onClick={goToPrevious} className="nav-button">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goToNext} className="nav-button">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      
      {totalItems > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="bg-black/50 px-3 py-1 rounded-full text-xs text-white">
            {currentIndex + 1} / {totalItems}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery; 