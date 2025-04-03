import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Home from './pages/Home';
import ServicesPage from './pages/Services';
import Blog from './pages/Blog';
import About from './pages/About';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WhatsAppButton from './components/WhatsAppButton';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen border-0">
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
        <WhatsAppButton phoneNumber="5218125410048" /> 
      </div>
    </BrowserRouter>
  );
};

export default App;
