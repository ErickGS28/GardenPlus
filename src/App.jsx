import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Menu from './components/Menu';
import WhatsAppButton from './components/WhatsAppButton';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const Home = lazy(() => import('./pages/public/Home'));
const ServicesPage = lazy(() => import('./pages/public/Services'));
const Blog = lazy(() => import('./pages/public/Blog'));
const About = lazy(() => import('./pages/public/About'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));

// Fallback loading component
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#1b676b] border-solid"></div>
  </div>
);

// ScrollToTop component to reset scroll position when route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Asegurar que la página se posicione en la parte superior al cargar/recargar
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Prevenir que el navegador restaure la posición del scroll al recargar
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Manejar el evento beforeunload para asegurar que al recargar se posicione arriba
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen border-0">
          <ScrollToTop />
          <Menu />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Suspense>
          <Footer />
          <WhatsAppButton phoneNumber="5218125410048" /> 
        </div>
      </BrowserRouter>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0',
            },
            iconTheme: {
              primary: '#10B981',
              secondary: '#ECFDF5',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#FEF2F2',
              color: '#B91C1C',
              border: '1px solid #FECACA',
            },
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FEF2F2',
            },
          },
        }}
      />
    </>
  );
};

export default App;
