import React, { useState, useEffect, memo } from 'react';
import { getServices } from '../services/config/api';
import { Loader, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import '../Blog.css';

// Service Popover Component with built-in carousel
const ServicePopover = memo(({ service, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMedia = service.multimedia && service.multimedia.length > 0;
  const mediaItems = hasMedia ? service.multimedia : [];
  
  // Manejar el scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  // Función de cierre con limpieza adicional
  const handleClose = (e) => {
    e?.stopPropagation();
    document.body.style.overflow = '';
    onClose();
  };

  // Navegación del carousel
  const goToNextImage = (e) => {
    e?.stopPropagation();
    if (mediaItems.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % mediaItems.length);
  };
  
  const goToPreviousImage = (e) => {
    e?.stopPropagation();
    if (mediaItems.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  // Render appropriate media component
  const renderMedia = () => {
    if (!hasMedia) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <p className="text-gray-400">No hay imágenes disponibles</p>
        </div>
      );
    }

    const currentMedia = mediaItems[currentImageIndex];
    const isVideo = currentMedia.type === 'video';

    if (isVideo) {
      return (
        <video 
          src={currentMedia.url} 
          className="w-full h-full object-cover"
          controls
          autoPlay
        />
      );
    } else {
      return (
        <img 
          src={currentMedia.url} 
          alt={service.name}
          className="w-full h-full object-cover"
        />
      );
    }
  };
  
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6 modal-overlay"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media section */}
        <div className="relative bg-white w-full" style={{ height: '350px' }}>
          {renderMedia()}
          
          {/* Navigation arrows */}
          {mediaItems.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
              <button 
                onClick={goToPreviousImage} 
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 pointer-events-auto"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={goToNextImage} 
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 pointer-events-auto"
                aria-label="Siguiente imagen"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
          
          {/* Indicators */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex space-x-2 bg-black/50 rounded-full px-3 py-1.5">
                {mediaItems.map((_, idx) => (
                  <button
                    key={`indicator-${idx}`}
                    className={`w-2.5 h-2.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    aria-label={`Ver imagen ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content section */}
        <div className="p-6 overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.name}</h3>
          
          <div className="prose prose-base max-w-none mb-5">
            <p className="text-gray-600 whitespace-pre-line text-base">{service.description}</p>
          </div>
          
          {service.category && (
            <div className="mt-4 inline-block bg-[#88c425]/20 text-[#1b676b] px-4 py-1.5 rounded-full text-sm font-medium">
              {service.category}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
});

// Service Card Component
const ServiceCard = memo(({ service, onClick }) => {
  // Get first media or use fallback
  const firstMedia = service.multimedia && service.multimedia.length > 0 
    ? service.multimedia[0] 
    : null;
  
  const fallbackUrl = 'https://placehold.co/600x400?text=Servicio';
  const isVideo = firstMedia && firstMedia.type === 'video';
  
  return (
    <div 
      className="bg-[#ECFDF5] rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer h-full flex flex-col service-card"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden h-32 sm:h-36 lg:h-32 xl:h-36 flex-shrink-0 service-card-image">
        {isVideo ? (
          <video 
            src={firstMedia.url} 
            className="w-full h-full object-cover"
            muted
            autoPlay={false}
            loop
            playsInline
          />
        ) : (
          <img 
            src={firstMedia ? firstMedia.url : fallbackUrl} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="p-3 flex-grow flex flex-col service-card-content">
        <h3 className="text-base font-semibold text-gray-800 mb-1">{service.name}</h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-2 flex-grow">
          {service.description}
        </p>
        
        <div className="flex items-center justify-end text-sm mt-auto">
          {service.category && (
            <span className="bg-[#88c425]/20 text-[#1b676b] px-2 py-0.5 rounded-full text-xs">
              {service.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// Main Services Component
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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

  const openPopover = (service) => {
    setSelectedService(service);
    setIsPopoverOpen(true);
  };

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

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

  return (
    <section id="services" className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1b676b]">Nuestros Servicios</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Ofrecemos soluciones completas para tus espacios verdes, desde diseño hasta mantenimiento.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {services.map((service) => (
            <ServiceCard 
              key={service.id || service._id || `service-${service.title}`} 
              service={service} 
              onClick={() => openPopover(service)}
            />
          ))}
        </div>

        {selectedService && (
          <ServicePopover 
            service={selectedService} 
            isOpen={isPopoverOpen} 
            onClose={closePopover} 
          />
        )}
      </div>
    </section>
  );
};

export default Services;
