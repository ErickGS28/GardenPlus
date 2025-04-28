import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader, ImageIcon, X } from 'lucide-react';
import { uploadToCloudflare } from '../../../services/config/api';
import toast from 'react-hot-toast';

const PostForm = ({ 
  post, 
  onSubmit, 
  isSubmitting, 
  uploadProgress, 
  onCancel, 
  error,
  isEditing 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'post',
    previewUrl: '',
    iframe: ''
  });
  const [previewImage, setPreviewImage] = useState('');
  const [imageRemoved, setImageRemoved] = useState(false);

  // Initialize form data when post prop changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        type: post.type || 'post',
        previewUrl: post.previewUrl || '',
        iframe: post.iframe || ''
      });
      
      if (post.previewUrl) {
        setPreviewImage(post.previewUrl);
      }
    } else {
      // Reset form when creating a new post
      setFormData({
        title: '',
        content: '',
        type: 'post',
        previewUrl: '',
        iframe: ''
      });
      setPreviewImage('');
    }
    setSelectedFile(null);
    setImageRemoved(false);
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImageRemoved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewImage('');
    setImageRemoved(true);
    
    // También actualizar formData para eliminar la previewUrl
    setFormData(prev => ({
      ...prev,
      previewUrl: ''
    }));
  };

  const uploadFileToCloudflare = async (file) => {
    try {
      const response = await uploadToCloudflare(file);
      if (response && response.url) {
        return response.url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.content) {
      return;
    }

    let finalData = { ...formData };

    try {
      // Si se ha quitado la imagen, asegurarse de que previewUrl sea vacío
      if (imageRemoved) {
        finalData.previewUrl = '';
      }
      
      // Upload preview image if selected
      if (selectedFile) {
        try {
          const previewUrl = await uploadFileToCloudflare(selectedFile);
          if (previewUrl) {
            finalData.previewUrl = previewUrl;
          } else {
            // Si no se obtuvo una URL, mostrar error y detener el envío
            toast.error('No se pudo subir la imagen. Intente nuevamente.');
            return;
          }
        } catch (uploadError) {
          console.error('Error al subir la imagen:', uploadError);
          toast.error('Error al subir la imagen. Intente nuevamente.');
          return;
        }
      }

      // Call the parent component's onSubmit with the file
      await onSubmit(finalData, selectedFile ? [selectedFile] : []);

    } catch (err) {
      console.error('Error in PostForm submission:', err);
      toast.error('Error al enviar el formulario. Intente nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
          Título*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Título de la publicación"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900">
          Contenido*
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          rows="4"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Escribe el contenido aquí..."
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">
          Tipo de Red Social
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="twitter">Twitter</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
        </select>
      </div>

      <div>
        <label htmlFor="iframe" className="block mb-2 text-sm font-medium text-gray-900">
          iFrame (opcional)
        </label>
        <textarea
          id="iframe"
          name="iframe"
          value={formData.iframe}
          onChange={handleInputChange}
          rows="3"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Pega el código iframe aquí si es necesario..."
        />
        <div className="mt-1 text-xs text-gray-500">
          <p>Puedes incluir un iframe de YouTube, Instagram, Facebook, etc.</p>
          {formData.type === 'tiktok' ? (
            <div className="mt-1 p-2 bg-blue-50 text-blue-700 rounded border border-blue-200">
              <p className="font-medium">Para TikTok:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Para tiktok pega el enlace del video en vez del iframe</li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-900">
            Imagen de Portada (opcional)
          </label>
          {isEditing && previewImage && !selectedFile && (
            <button
              type="button"
              onClick={removeSelectedFile}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Quitar imagen actual
            </button>
          )}
        </div>
        
        {previewImage ? (
          <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={previewImage} 
              alt="Vista previa" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.classList.add('hidden');
                const parent = e.target.parentNode;
                if (parent) {
                  const placeholder = document.createElement('div');
                  placeholder.className = "w-full h-full flex items-center justify-center bg-gray-200";
                  placeholder.innerHTML = '<span class="text-gray-400">Error al cargar la imagen</span>';
                  parent.appendChild(placeholder);
                }
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
              {selectedFile ? 'Nueva imagen seleccionada' : 'Imagen actual'}
            </div>
            <button 
              type="button"
              onClick={removeSelectedFile}
              className="absolute top-2 right-2 bg-white text-gray-700 p-1 rounded-full shadow-md hover:bg-gray-100"
              title="Eliminar imagen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <label className="flex justify-center w-full h-48 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex flex-col items-center justify-center space-y-2">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                {imageRemoved 
                  ? 'Imagen eliminada. Haz clic para seleccionar una nueva' 
                  : 'Arrastra una imagen aquí o haz clic para seleccionar'}
              </span>
            </span>
            <input 
              type="file" 
              name="file" 
              className="hidden" 
              onChange={handleFileSelect} 
              accept="image/*"
            />
          </label>
        )}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          <p className="text-xs text-center mt-1">Subiendo... {uploadProgress}%</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !formData.title || !formData.content}
          className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              <span>{isEditing ? 'Actualizando...' : 'Creando...'}</span>
            </>
          ) : (
            <span>{isEditing ? 'Actualizar' : 'Crear'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm; 