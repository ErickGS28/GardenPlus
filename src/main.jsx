import React from 'react'
import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'

// Asegurar que la página siempre se posicione en la parte superior al cargar o recargar
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Scroll to top on page load/reload
window.onload = function() {
  window.scrollTo(0, 0);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
