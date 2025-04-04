import React from 'react';
import Banner from '../components/Banner';
import Services from '../components/Services';
import Values from '../components/Values';
import SocialFeed from '../components/SocialFeed';

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b676b] mb-6">Expertos en Jardinería y Construcción</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              En <span className="font-semibold text-emerald-700">Garden Plus Morelos</span>, transformamos espacios ordinarios en extraordinarios oasis verdes. Nuestro equipo de profesionales combina creatividad y tecnología para crear ambientes naturales que perduran.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#88c425] flex items-center justify-center mt-1">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <p className="ml-3 text-gray-700">Soluciones de riego automatizado con tecnología <span className="font-semibold">RainBird</span>, líder mundial en sistemas de irrigación</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#88c425] flex items-center justify-center mt-1">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <p className="ml-3 text-gray-700">Diseño e instalación de jardines inteligentes que optimizan el uso del agua</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#88c425] flex items-center justify-center mt-1">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <p className="ml-3 text-gray-700">Materiales y equipos de la más alta calidad para garantizar durabilidad y belleza</p>
              </div>
            </div>
            
            <div className="inline-block">
              <a 
                href="tel:8125410048" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1b676b] hover:bg-[#1b676b]/90 transition-colors shadow-md"
              >
                Contáctanos
              </a>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[#1b676b] mb-3">Soluciones Sostenibles</h3>
              <p className="text-gray-700">
                Los sistemas de riego automático reducen el consumo de agua hasta un 40% comparado con métodos tradicionales, mientras mantienen tus áreas verdes en condiciones óptimas durante todo el año.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[#1b676b] mb-3">Diseño Personalizado</h3>
              <p className="text-gray-700">
                Cada proyecto es único. Desde terrazas roof garden hasta sistemas de nebulización para restaurantes, creamos soluciones adaptadas perfectamente a tus necesidades y espacio disponible.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[#1b676b] mb-3">Materiales Premium</h3>
              <p className="text-gray-700">
                Trabajamos con productos de primera calidad como paneles de sistema ligero, adoquín y equipos RainBird, garantizando instalaciones duraderas y de bajo mantenimiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectShowcase = () => {
  const handleScrollToServices = (e) => {
    e.preventDefault();
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-[#1b676b] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transformamos tu Espacio</h2>
          <div className="w-24 h-1 bg-[#88c425] mx-auto mb-6"></div>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Cada proyecto es una oportunidad para crear un ambiente único que refleje tu estilo y necesidades.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 bg-[#88c425] rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Jardines Inteligentes</h3>
            <p className="text-white/80 mb-4">
              Integramos tecnología y naturaleza para crear espacios verdes que se adaptan a las condiciones ambientales y optimizan recursos.
            </p>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Sensores de humedad
              </li>
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Programación por zonas
              </li>
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Control remoto
              </li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 bg-[#88c425] rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Jardines Verticales</h3>
            <p className="text-white/80 mb-4">
              Aprovechamos cada centímetro disponible para crear impresionantes muros verdes que transforman espacios urbanos en oasis naturales.
            </p>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Sistemas modulares
              </li>
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Bajo mantenimiento
              </li>
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Aislamiento térmico
              </li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg hover:bg-white/15 transition-colors">
            <div className="w-12 h-12 bg-[#88c425] rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Nebulización</h3>
            <p className="text-white/80 mb-4">
              Sistemas de nebulización para terrazas, restaurantes y áreas recreativas que crean ambientes frescos y confortables en días calurosos.
            </p>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Reducción de temperatura
              </li>
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Ahorro energético
              </li>
              <li className="flex items-center">
                <span className="text-[#88c425] mr-2">•</span> Diseño personalizado
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-xl font-light italic text-white/90 max-w-3xl mx-auto">
            "Creamos espacios que respiran vida, donde la naturaleza y la tecnología se encuentran para ofrecerte lo mejor de ambos mundos."
          </p>
          <div className="mt-8">
            <a 
              href="#services" 
              onClick={handleScrollToServices}
              className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-[#1b676b] transition-colors"
            >
              Explora Nuestros Servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactBanner = () => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 rounded-xl p-6 shadow-sm">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold text-[#1b676b] mb-2">¿Listo para transformar tu espacio?</h3>
            <p className="text-gray-600">Contáctanos hoy mismo para una consulta</p>
          </div>
          <div className="flex space-x-4">
            <a 
              href="tel:8125410048" 
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[#1b676b] hover:bg-[#1b676b]/90 transition-colors shadow-sm"
            >
              Llamar ahora
            </a>
            <a 
              href="https://wa.me/5218125410048" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2 border border-[#88c425] text-base font-medium rounded-md text-[#88c425] hover:bg-[#88c425]/10 transition-colors shadow-sm"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div>
      <Banner />
      <Services />
      <Values />
      <SocialFeed />
      <CallToAction />
      <ProjectShowcase />
      <ContactBanner />
    </div>
  );
};

export default Home;
