import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }
    
    // For demo purposes, accept any login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen pt-28 px-4 bg-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#1b676b]">Iniciar Sesión</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425] focus:border-transparent"
              placeholder="Ingresa tu usuario"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#88c425] focus:border-transparent"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1b676b] hover:bg-[#88c425] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c425] transition-colors duration-300"
            >
              Ingresar
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-[#1b676b] hover:text-[#88c425] transition-colors duration-300">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
