import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/config/api';
import ManageServices from './manageServices/ManageServices';
import ManagePosts from './managePosts/ManagePosts';

// Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-32 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1b676b]">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-white px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Cerrar sesión</span>
          </button>
        </div>
        
        <div className="mb-8">
          <div className="flex border-b border-gray-200 justify-center">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-b-2 border-[#1b676b] text-[#1b676b]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-b-2 border-[#1b676b] text-[#1b676b]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Publicaciones
            </button>
          </div>
        </div>
        
        {activeTab === 'services' ? <ManageServices /> : <ManagePosts />}
      </div>
    </div>
  );
};

export default Dashboard;
