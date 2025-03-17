import React, { useState, useEffect, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner = memo(() => {
  const slides = [
    {
      image: '/src/assets/Banner1.jpg',
      title: 'Bienvenido a Garden Plus',
      subtitle: 'Transformamos espacios en experiencias únicas'
    },
    {
      image: '/src/assets/Banner2.jpg',
      title: 'Diseño Paisajístico',
      subtitle: 'Creamos jardines que inspiran'
    },
    {
      image: '/src/assets/Banner3.jpg',
      title: 'Servicios Profesionales',
      subtitle: 'Mantenimiento y cuidado experto'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slideCount = slides.length;
  const visibleSlides = [...slides, ...slides, ...slides, ...slides, ...slides];
  const startIndex = slideCount * 2;

  // Reset position when reaching edges
  const resetPosition = useCallback(() => {
    if (currentIndex <= slideCount || currentIndex >= visibleSlides.length - slideCount - 1) {
      setIsTransitioning(false);
      requestAnimationFrame(() => {
        setCurrentIndex(startIndex + ((currentIndex + visibleSlides.length) % slideCount));
      });
    } else {
      setIsTransitioning(false);
    }
  }, [currentIndex, slideCount, visibleSlides.length, startIndex]);

  const previousSlide = () => {
    if (!isTransitioning && !isPaused) {
      setIsTransitioning(true);
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextSlide = useCallback(() => {
    if (!isTransitioning && !isPaused) {
      setIsTransitioning(true);
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  }, [isTransitioning, isPaused]);

  const goToSlide = (index) => {
    if (!isTransitioning && !isPaused) {
      setIsTransitioning(true);
      const currentRelativeIndex = currentIndex % slideCount;
      const diff = index - currentRelativeIndex;
      setDirection(Math.sign(diff));
      setCurrentIndex(currentIndex + diff);
    }
  };

  // Auto-advance slides and handle visibility
  useEffect(() => {
    let timer;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
        clearInterval(timer);
      } else {
        setIsPaused(false);
        timer = setInterval(nextSlide, 3000);
      }
    };

    if (!isPaused) {
      timer = setInterval(nextSlide, 3000);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [nextSlide, isPaused]);

  const handleTransitionEnd = () => {
    resetPosition();
  };

  const actualIndex = ((currentIndex % slideCount) + slideCount) % slideCount;

  return (
    <div className="relative h-screen overflow-hidden bg-[#1b676b]">
      <div
        className={`flex h-full ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
        style={{
          transform: `translateX(${-currentIndex * 100}%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {visibleSlides.map((slide, index) => (
          <div key={index} className="flex-shrink-0 w-full h-full relative">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 " />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h1 
                className={`text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center drop-shadow-lg mb-2 md:mb-4 px-4
                  transition-all duration-500 transform
                  ${isTransitioning ? 'opacity-0 translate-y-32' : 'opacity-100 translate-y-0'}`}
              >
                {slide.title}
              </h1>
              <p 
                className={`text-white text-lg md:text-xl lg:text-2xl text-center drop-shadow-lg max-w-xs md:max-w-xl lg:max-w-2xl px-4
                  transition-all duration-500 delay-100 transform
                  ${isTransitioning ? 'opacity-0 translate-y-32' : 'opacity-100 translate-y-0'}`}
              >
                {slide.subtitle}
              </p>
              <div className="mt-8">
                <a 
                  href="#services" 
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector('h2[data-component-name="Services"]');
                    if (target) {
                      const headerOffset = 100; // Offset to account for fixed header
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
                  className="inline-block mt-4 bg-white text-[#1b676b] px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-[#1b676b] hover:text-white hover:scale-105 hover:shadow-lg"
                >
                  Descubrir Servicios
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
        <button
          onClick={previousSlide}
          className="pointer-events-auto h-12 w-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white transition-all duration-300 hover:scale-110 cursor-pointer disabled:opacity-50 disabled:hover:bg-white/20 disabled:hover:scale-100 disabled:cursor-default"
          disabled={isTransitioning || isPaused}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto h-12 w-12 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/40 text-white transition-all duration-300 hover:scale-110 cursor-pointer disabled:opacity-50 disabled:hover:bg-white/20 disabled:hover:scale-100 disabled:cursor-default"
          disabled={isTransitioning || isPaused}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 cursor-pointer disabled:cursor-default ${
              index === actualIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 w-3 hover:bg-white/75 hover:scale-110'
            } disabled:hover:scale-100 disabled:opacity-50`}
            disabled={isTransitioning || isPaused}
          />
        ))}
      </div>
    </div>
  );
});

export default Banner;