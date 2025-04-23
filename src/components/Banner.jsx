import React, { useState, useEffect, memo } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from "lucide-react";

// Importar los estilos CSS de slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importar las imágenes directamente
import banner1 from '../assets/Banner1.jpg';
import banner2 from '../assets/Banner2.jpg';
import banner3 from '../assets/Banner3.jpg';
import banner4 from '../assets/Banner4.webp';
import banner6 from '../assets/Banner6.png';
import banner7 from '../assets/Banner7.webp';

const Banner = memo(() => {
  const slides = [
    {
      image: banner2,
      specialTitle: true,
      titleSmall: 'Bienvenido a',
      titleLarge: 'Garden Plus Morelos',
      subtitle: 'Transformamos espacios en experiencias únicas'
    },
    {
      image: banner1,
      title: 'Diseño Paisajístico',
      subtitle: 'Creamos jardines que inspiran'
    },
    {
      image: banner3,
      title: 'Servicios Profesionales',
      subtitle: 'Mantenimiento y cuidado experto'
    },
    {
      image: banner4,
      title: 'Jardines Verticales',
      subtitle: 'Soluciones innovadoras para maximizar espacios verdes'
    },
    {
      image: banner6,
      title: 'Chukum Premium',
      subtitle: 'Venta e instalación de acabados exclusivos con una técnica impecable'
    },
    {
      image: banner7,
      title: 'Terrazas y Roof Gardens',
      subtitle: 'Espacios elevados con diseño y funcionalidad'
    }
  ];

  const [isPaused, setIsPaused] = useState(false);
  const [sliderRef, setSliderRef] = useState(null);

  // Configuración para react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: !isPaused,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    pauseOnFocus: false,
    arrows: false,
    fade: true,
    cssEase: 'ease-out',
    beforeChange: () => {
      // Reiniciar animaciones de texto cuando cambia el slide
      const titles = document.querySelectorAll('.slide-title');
      const subtitles = document.querySelectorAll('.slide-subtitle');
      
      titles.forEach(title => {
        title.classList.remove('animate-in');
        title.classList.add('animate-out');
        setTimeout(() => {
          title.classList.remove('animate-out');
          title.classList.add('animate-in');
        }, 500);
      });
      
      subtitles.forEach(subtitle => {
        subtitle.classList.remove('animate-in');
        subtitle.classList.add('animate-out');
        setTimeout(() => {
          subtitle.classList.remove('animate-out');
          subtitle.classList.add('animate-in');
        }, 600);
      });
    },
    customPaging: (i) => (
      <div
        className={`h-3 rounded-full transition-all duration-300 cursor-pointer bg-white/50 hover:bg-white/75 hover:scale-110`}
        style={{
          width: '12px',
          height: '12px'
        }}
      />
    ),
    appendDots: dots => (
      <div className="absolute bottom-4 left-0 right-0">
        <ul className="flex items-center justify-center gap-2 m-0 p-0"> {dots} </ul>
      </div>
    )
  };

  // Manejar cambios de visibilidad de la página
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Componentes de navegación personalizados
  const PrevArrow = () => (
    <button
      onClick={() => sliderRef?.slickPrev()}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto h-12 w-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white transition-all duration-300 hover:scale-110 cursor-pointer"
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
  );

  const NextArrow = () => (
    <button
      onClick={() => sliderRef?.slickNext()}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-auto h-12 w-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white transition-all duration-300 hover:scale-110 cursor-pointer"
    >
      <ChevronRight className="h-6 w-6" />
    </button>
  );

  return (
    <div id="inicio" className="relative h-screen overflow-hidden bg-primary">
      <Slider ref={setSliderRef} {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="h-screen">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Capa de opacidad para mejorar la legibilidad del texto */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className=" px-8 py-6 rounded-lg max-w-3xl mx-auto">
                {slide.specialTitle ? (
                  <div className="slide-title">
                    <div className="text-white text-2xl md:text-3xl lg:text-4xl font-medium text-center drop-shadow-lg mb-0">
                      {slide.titleSmall}
                    </div>
                    <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-bold text-center drop-shadow-lg mb-2 md:mb-4">
                      {slide.titleLarge}
                    </h1>
                  </div>
                ) : (
                  <h1 
                    className="slide-title text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center drop-shadow-lg mb-2 md:mb-4"
                  >
                    {slide.title}
                  </h1>
                )}
                <p 
                  className="slide-subtitle text-white text-lg md:text-xl lg:text-2xl text-center drop-shadow-lg max-w-xs md:max-w-xl lg:max-w-2xl"
                >
                  {slide.subtitle}
                </p>
                <div className="mt-8 text-center">
                  <a 
                    href="#services" 
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.querySelector('h2[data-component-name="Services"]');
                      if (target) {
                        const headerOffset = 100; // Offset para tener en cuenta el encabezado fijo
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      } else {
                        console.warn('Target element not found');
                      }
                    }}
                    className="inline-block mt-4 bg-white text-primary px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105 hover:shadow-lg"
                  >
                    Descubrir Servicios
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      
      <PrevArrow />
      <NextArrow />

      <style>{`
        .animate-in {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .animate-out {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
      `}</style>
    </div>
  );
});

export default Banner;