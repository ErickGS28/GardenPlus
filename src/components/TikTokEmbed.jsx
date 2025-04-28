import React, { useEffect, useState, useRef } from 'react';

const TikTokEmbed = ({ videoUrl, maxWidth = 605, minWidth = 325 }) => {
  const [videoId, setVideoId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (!videoUrl) {
      setError('URL de TikTok no proporcionada');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Procesando URL de TikTok:', videoUrl);
      
      // Extraer el username y videoId de la URL
      const urlPattern = /https:\/\/(www\.)?tiktok\.com\/@([^\/]+)\/video\/(\d+)/i;
      const match = videoUrl.match(urlPattern);
      
      if (match && match[2] && match[3]) {
        setUsername(match[2]);
        setVideoId(match[3]);
        setError(null);
      } else {
        setError('Formato de URL de TikTok no válido');
      }
    } catch (err) {
      console.error('Error al procesar la URL de TikTok:', err);
      setError('No se pudo procesar la URL de TikTok');
    } finally {
      setLoading(false);
    }
  }, [videoUrl]);

  // Manejar el evento cuando el iframe termina de cargar
  const handleIframeLoad = () => {
    console.log('TikTok iframe cargado correctamente');
    setLoading(false);
  };

  // Método alternativo: usar un iframe directo a la URL de embed de TikTok
  const renderIframe = () => {
    if (!videoId) return null;
    
    // URL de embed directa - esta es la forma más confiable
    const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
    
    return (
      <iframe
        ref={iframeRef}
        src={embedUrl}
        style={{
          width: '100%',
          height: '750px',
          maxWidth: `${maxWidth}px`,
          minWidth: `${minWidth}px`,
          border: 'none',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
        allowFullScreen
        allow="encrypted-media;"
        onLoad={handleIframeLoad}
        title={`TikTok de @${username}`}
      />
    );
  };

  // Método de respaldo: usar el método tradicional de blockquote
  const renderBlockquote = () => {
    if (!videoId || !username) return null;

    const embedHtml = `
      <blockquote 
        class="tiktok-embed" 
        cite="https://www.tiktok.com/@${username}/video/${videoId}" 
        data-video-id="${videoId}" 
        style="max-width: ${maxWidth}px; min-width: ${minWidth}px;"
      >
        <section></section>
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js"></script>
    `;

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        style={{ width: '100%', maxWidth: `${maxWidth}px` }}
      />
    );
  };

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 text-red-500 rounded-md text-center">
        {error}
        <div className="mt-2 text-xs text-gray-500 break-all">URL proporcionada: {videoUrl}</div>
      </div>
    );
  }

  return (
    <div className="tiktok-embed-container w-full mx-auto">
      {/* Intentar primero con iframe directo */}
      {renderIframe()}
      
      {loading && (
        <div className="w-full p-4 text-center">
          <div className="animate-pulse bg-gray-200 h-48 rounded flex items-center justify-center">
            <p className="text-gray-500">Cargando TikTok...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokEmbed; 