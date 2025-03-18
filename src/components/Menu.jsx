import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const NavLink = ({ to, children }) => {
    return (
      <Link 
        to={to} 
        className="text-white px-2 md:px-4 py-2 rounded-lg transition-all duration-300 
        hover:bg-garden-chartreuse/20 hover:text-[#bef202] hover:scale-105 relative 
        group text-sm md:text-base overflow-hidden"
      >
        <span className="relative z-10">{children}</span>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-garden-chartreuse 
        transition-all duration-300 group-hover:w-full"></span>
        <span className="absolute inset-0 w-full h-full bg-garden-chartreuse/0 
        group-hover:bg-garden-chartreuse/10 scale-0 group-hover:scale-100 
        transition-transform duration-300 origin-bottom"></span>
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1b676b]/90 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center group cursor-pointer">
            <div className="w-10 h-10 mr-2 overflow-hidden transition-transform duration-700 group-hover:rotate-360">
              <img src={logo} alt="Garden Plus Morelos Logo" className="w-full h-full object-contain" />
            </div>
            <Link to="/" className="text-white font-bold text-lg md:text-xl lg:text-2xl group-hover:scale-105 transition-transform">
              Garden <span className="text-[#bef202]">Plus</span> Morelos <span className="text-white inline-block transition-transform duration-700">+</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white hover:text-[#bef202] focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-2 md:space-x-4">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/services">Servicios</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/about">Nosotros</NavLink>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1b676b]/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link to="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-[#bef202]/20 hover:text-[#bef202]" onClick={toggleMenu}>Inicio</Link>
            <Link to="/services" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-[#bef202]/20 hover:text-[#bef202]" onClick={toggleMenu}>Servicios</Link>
            <Link to="/blog" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-[#bef202]/20 hover:text-[#bef202]" onClick={toggleMenu}>Blog</Link>
            <Link to="/about" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-[#bef202]/20 hover:text-[#bef202]" onClick={toggleMenu}>Nosotros</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Menu;
