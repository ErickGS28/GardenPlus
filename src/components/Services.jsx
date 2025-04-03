import React, { useState, useEffect } from 'react';
import { getServices } from '../utils/api';
import { Loader, AlertCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

// Media Gallery Component for displaying images and videos
const MediaGallery = ({ media = [], onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia?.url?.includes('.mp4') || currentMedia?.url?.includes('.mov');

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <div className="relative w-full h-full">
      {isVideo ? (
        <video 
          src={currentMedia.url} 
          controls 
          className="w-full h-full object-contain"
        />
      ) : (
        <img 
          src={currentMedia.url} 
          alt={currentMedia.alt || 'Service media'} 
          className="w-full h-full object-contain"
        />
      )}
      
      {media.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            &#10094;
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            &#10095;
          </button>
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
            {currentIndex + 1} / {media.length}
          </div>
        </>
      )}
      
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full"
      >
        <X size={20} />
      </button>
    </div>
  );
};

// Service Popover Component
const ServicePopover = ({ service, isOpen, onClose }) => {
  const [showGallery, setShowGallery] = useState(false);
  
  if (!isOpen) return null;
  
  const handleOpenGallery = (e) => {
    e.stopPropagation();
    setShowGallery(true);
  };
  
  const handleCloseGallery = () => {
    setShowGallery(false);
  };
  
  const hasMedia = service.multimedia && service.multimedia.length > 0;
  const firstMedia = hasMedia ? service.multimedia[0] : null;
  const isFirstMediaVideo = firstMedia?.url?.includes('.mp4') || firstMedia?.url?.includes('.mov');
  
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {showGallery ? (
          <div className="flex-1 bg-black flex items-center justify-center">
            <MediaGallery 
              media={service.multimedia} 
              onClose={handleCloseGallery}
            />
          </div>
        ) : (
          <>
            <div className="relative">
              {hasMedia ? (
                isFirstMediaVideo ? (
                  <video 
                    src={firstMedia.url} 
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={handleOpenGallery}
                  />
                ) : (
                  <img 
                    src={firstMedia.url} 
                    alt={service.name} 
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={handleOpenGallery}
                  />
                )
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No hay imágenes disponibles</p>
                </div>
              )}
              
              <button 
                onClick={onClose}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              >
                <X size={24} className="text-gray-700" />
              </button>
              
              {hasMedia && service.multimedia.length > 1 && (
                <button
                  onClick={handleOpenGallery}
                  className="absolute bottom-2 right-2 bg-white text-gray-800 px-3 py-1 rounded-full text-sm shadow-md"
                >
                  Ver {service.multimedia.length} imágenes
                </button>
              )}
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{service.name}</h2>
              
              {service.price && (
                <p className="text-lg font-semibold text-[#1b676b] mb-4">
                  ${service.price.toLocaleString('es-MX')}
                </p>
              )}
              
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line">{service.description}</p>
              </div>
              
              {service.category && (
                <div className="mt-4 inline-block bg-[#88c425]/20 text-[#1b676b] px-3 py-1 rounded-full text-sm">
                  {service.category}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

// Service Card Component
const ServiceCard = ({ service }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const openPopover = () => {
    setIsPopoverOpen(true);
  };
  
  const closePopover = () => {
    setIsPopoverOpen(false);
  };
  
  // Get first media or use fallback
  const firstMedia = service.multimedia && service.multimedia.length > 0 
    ? service.multimedia[0].url 
    : 'https://placehold.co/600x400?text=Servicio';
  
  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        onClick={openPopover}
      >
        <div className="aspect-video overflow-hidden">
          <img 
            src={firstMedia} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
          
          <p className="text-gray-600 line-clamp-2 mb-4">
            {service.description}
          </p>
          
          <div className="flex items-center justify-between">
            {service.price ? (
              <span className="font-medium text-[#1b676b]">
                ${service.price.toLocaleString('es-MX')}
              </span>
            ) : (
              <span className="text-gray-500">Precio a consultar</span>
            )}
            
            {service.category && (
              <span className="bg-[#88c425]/20 text-[#1b676b] px-3 py-1 rounded-full text-sm">
                {service.category}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <ServicePopover 
        service={service} 
        isOpen={isPopoverOpen} 
        onClose={closePopover} 
      />
    </>
  );
};

// Main Services Component
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('No se pudieron cargar los servicios. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
        <Loader className="w-12 h-12 text-[#1b676b] animate-spin" />
        <p className="mt-4 text-gray-600">Cargando servicios...</p>
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

  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
        <p className="text-gray-600">No hay servicios disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1b676b]">Nuestros Servicios</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios de jardinería y paisajismo para satisfacer todas tus necesidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
