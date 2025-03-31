import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getProducts } from '../utils/api';
import { Loader } from 'lucide-react';

const MediaGallery = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalItems = media.length;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
    if (media[index].type === 'video') {
      setIsPlaying(false);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Previene que los clics en los controles cierren el popover
  const handleControlClick = (e) => {
    e.stopPropagation();
  };

  const currentItem = media[currentIndex];

  return (
    <div className="relative h-64 md:h-80 overflow-hidden rounded-lg mb-6">
      {/* Media display */}
      <div className="w-full h-full transition-opacity duration-300">
        {currentItem.type === 'image' ? (
          <img 
            src={currentItem.url} 
            alt={currentItem.alt || 'Imagen de servicio'}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="relative w-full h-full">
            <video 
              src={currentItem.url} 
              poster={currentItem.poster}
              className="w-full h-full object-cover"
              controls={isPlaying}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
            />
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20"
                onClick={() => {
                  const videoElement = document.querySelector('video');
                  if (videoElement) {
                    videoElement.play();
                  }
                }}
              >
                <div className="bg-black/50 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-6 h-6">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation controls */}
      {totalItems > 1 && (
        <>
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-md transition-all duration-200 cursor-pointer hover:scale-110"
            onClick={(e) => {
              handleControlClick(e);
              goToPrevious();
            }}
            aria-label="Anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-900">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-md transition-all duration-200 cursor-pointer hover:scale-110"
            onClick={(e) => {
              handleControlClick(e);
              goToNext();
            }}
            aria-label="Siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-900">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {totalItems > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {media.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
              }`}
              onClick={(e) => {
                handleControlClick(e);
                goToIndex(index);
              }}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Media type indicator */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {currentIndex + 1}/{totalItems} • {currentItem.type === 'image' ? 'Imagen' : 'Video'}
      </div>
    </div>
  );
};

const ServicePopover = ({ service, isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Bloquear el scroll del body cuando el popover está abierto
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar el scroll cuando se cierra
      document.body.style.overflow = '';
      
      // Añadir un pequeño retraso antes de eliminar completamente el componente del DOM
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Debe coincidir con la duración de la transición
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Si no está abierto y no está animando, no renderizar nada
  if (!isOpen && !isAnimating) return null;

  // Función para detener la propagación de eventos
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  // Preparar multimedia para el servicio
  const serviceMedia = service.multimedia ? service.multimedia.map(item => ({
    type: item.tipo === 'imagen' ? 'image' : 'video',
    url: item.url,
    alt: service.name,
    poster: item.tipo === 'video' ? item.url : undefined
  })) : [];

  // Crear el contenido del portal
  const popoverContent = (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-md z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />
      
      {/* Popover */}
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 z-50 w-11/12 max-w-2xl transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={stopPropagation}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-50 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {serviceMedia.length > 0 ? (
          <MediaGallery media={serviceMedia} />
        ) : (
          <div className="h-64 overflow-hidden rounded-lg mb-6 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No hay imágenes disponibles</span>
          </div>
        )}
        
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-emerald-900">{service.name}</h3>
        <p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">{service.description}</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </>
  );

  // Usar createPortal para renderizar el popover fuera del árbol de componentes normal
  return createPortal(popoverContent, document.body);
};

const ServiceCard = ({ service }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // Obtener la primera imagen para la tarjeta
  const getCardImage = () => {
    if (service.multimedia && service.multimedia.length > 0) {
      const firstImage = service.multimedia.find(item => item.tipo === 'imagen');
      if (firstImage) return firstImage.url;
    }
    return 'https://via.placeholder.com/300x200?text=No+imagen';
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="h-44 overflow-hidden">
          <img 
            src={getCardImage()} 
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-3 text-emerald-800">{service.name}</h3>
          <p className="text-gray-600 leading-relaxed mb-4 text-sm">{service.description}</p>
          <button
            onClick={() => setIsPopoverOpen(true)}
            className="bg-[#88c425] text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-[#1b676b] transition-colors text-sm"
          >
            Ver detalles
          </button>
        </div>
      </div>
      <ServicePopover 
        service={service} 
        isOpen={isPopoverOpen} 
        onClose={() => setIsPopoverOpen(false)}
      />
    </>
  );
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <section id="services" className="bg-gray-50 py-16 pt-24">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <h2 className="text-4xl font-bold mb-3 text-center text-emerald-900" data-component-name="Services">Nuestros Servicios</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Descubre nuestra amplia gama de servicios diseñados para crear y mantener el jardín de tus sueños
        </p>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto text-center">
            {error}
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No hay servicios disponibles en este momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
