import React, { useState, useEffect, memo } from 'react';
import { getServices } from '../utils/api';
import { Loader, AlertCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import MediaGallery from './MediaGallery';
import '../Blog.css';

// Service Popover Component
const ServicePopover = memo(({ service, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const hasMedia = service.multimedia && service.multimedia.length > 0;
  
  // Manejar el scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  
  // Función de cierre con limpieza adicional
  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };
  
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 modal-overlay"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-sm shadow-xl flex flex-col modal-content service-popover overflow-hidden"
        style={{ maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sección de imágenes - arriba (carousel) */}
        <div className="w-full h-48 sm:h-56 bg-white flex-shrink-0">
          {hasMedia ? (
            <MediaGallery media={service.multimedia} onClose={null} />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">No hay imágenes disponibles</p>
            </div>
          )}
        </div>
        
        {/* Sección de información - abajo (card body) */}
        <div className="p-4 overflow-y-auto w-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 card-title">{service.name}</h3>
            <button 
              onClick={handleClose}
              className="bg-gray-100 rounded-full p-1 flex-shrink-0 hover:bg-gray-200 transition-colors"
            >
              <X size={18} className="text-gray-700" />
            </button>
          </div>
          
          <div className="prose max-w-none mb-2">
            <p className="text-gray-600 whitespace-pre-line text-sm card-body">{service.description}</p>
          </div>
          
          {service.category && (
            <div className="mt-2 inline-block bg-[#88c425]/20 text-[#1b676b] px-3 py-1 rounded-full text-xs">
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
const ServiceCard = memo(({ service }) => {
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
        className="bg-[#ECFDF5] rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer h-full flex flex-col service-card"
        onClick={openPopover}
      >
        <div className="aspect-video overflow-hidden h-40 sm:h-44 lg:h-36 xl:h-40 flex-shrink-0 service-card-image">
          <img 
            src={firstMedia} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-3 sm:p-4 flex-grow flex flex-col service-card-content">
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
      
      <ServicePopover 
        service={service} 
        isOpen={isPopoverOpen} 
        onClose={closePopover} 
      />
    </>
  );
});

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

  return (
    <div className="py-10 px-4 sm:px-6 md:px-8 lg:px-12 bg-white" id="services">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#1b676b] mb-8 md:mb-12" data-component-name="Services">
          Nuestros Servicios
        </h2>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-12 h-12 text-[#1b676b] animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
            <div className="flex">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && (!services || services.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            No hay servicios disponibles en este momento.
          </div>
        )}
        
        {!loading && !error && services && services.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id || service.numericId || service._id || `service-${service.name}`} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
