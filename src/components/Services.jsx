import React, { useState } from 'react';
import { services } from '../data/services';

const ServicePopover = ({ service, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 w-11/12 max-w-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="h-64 overflow-hidden rounded-lg mb-6">
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-emerald-900">{service.title}</h3>
        <p className="text-gray-700 leading-relaxed mb-6">{service.extendedDescription}</p>
        <button 
          onClick={onClose}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

const ServiceCard = ({ service }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
        <div className="h-44 overflow-hidden">
          {service.type === 'image' ? (
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <video 
              src={service.video} 
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop
            />
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-3 text-emerald-800">{service.title}</h3>
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
  return (
    <section id="services" className="bg-gray-50 py-16 pt-24">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
        <h2 className="text-4xl font-bold mb-3 text-center text-emerald-900" data-component-name="Services">Nuestros Servicios</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Descubre nuestra amplia gama de servicios diseñados para crear y mantener el jardín de tus sueños
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
