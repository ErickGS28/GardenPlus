import React, { useState, useEffect } from 'react';

const WhatsAppButton = ({ phoneNumber }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [animationState, setAnimationState] = useState('visible'); // 'visible', 'hiding', 'hidden', 'showing'
  
  const messages = [
    '\u00a1Cont\u00e1ctanos ahora!',
    '\u00bfNecesitas ayuda con tu jard\u00edn?',
    'Sistemas de riego profesionales',
    'Dise\u00f1o y mantenimiento de jardines',
    'Presupuesto sin compromiso'
  ];

  useEffect(() => {
    let currentIndex = 0;
    setCurrentMessage(messages[currentIndex]);
    
    // Ciclo de animación: visible (1.5s) -> hiding (0.5s) -> hidden (0.2s) -> showing (0.5s) -> visible
    // Duración total del ciclo: 2.7 segundos
    
    const animationCycle = () => {
      // Fase 1: Mensaje visible por 1.5 segundos
      setAnimationState('visible');
      
      setTimeout(() => {
        // Fase 2: Ocultar mensaje (0.5 segundos de transición)
        setAnimationState('hiding');
        
        setTimeout(() => {
          // Fase 3: Mensaje oculto, cambiar al siguiente (0.2 segundos)
          setAnimationState('hidden');
          currentIndex = (currentIndex + 1) % messages.length;
          setCurrentMessage(messages[currentIndex]);
          
          setTimeout(() => {
            // Fase 4: Mostrar nuevo mensaje (0.5 segundos de transición)
            setAnimationState('showing');
            
            // Volver al inicio del ciclo
          }, 200);
        }, 500);
      }, 1500);
    };
    
    // Iniciar el primer ciclo
    animationCycle();
    
    // Configurar intervalo para ciclos subsecuentes (2.7 segundos por ciclo)
    const interval = setInterval(animationCycle, 2700);
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const message = encodeURIComponent('\u00a1Hola! Me gustar\u00eda obtener m\u00e1s informaci\u00f3n sobre sus servicios.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  // Determinar las clases de CSS según el estado de animación
  const getAnimationClasses = () => {
    switch (animationState) {
      case 'visible':
        return 'opacity-100 scale-100';
      case 'hiding':
        return 'opacity-0 scale-95';
      case 'hidden':
        return 'opacity-0 scale-90';
      case 'showing':
        return 'opacity-100 scale-100';
      default:
        return 'opacity-100 scale-100';
    }
  };

  return (
    <div 
      className="fixed right-6 bottom-6 z-50 flex items-center gap-3"
    >
      <div 
        className={`
          bg-white text-garden-teal px-4 py-2 rounded-full shadow-lg font-medium
          transform transition-all duration-300 origin-right
          flex items-center whitespace-nowrap
          ${getAnimationClasses()}
        `}
        data-component-name="WhatsAppButton"
      >
        {currentMessage}
      </div>
      <button
        onClick={handleClick}
        className="bg-[#25D366] p-3.5 rounded-full shadow-lg hover:bg-[#20ba59] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <svg 
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
    </div>
  );
};

export default WhatsAppButton;
