import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  // Verifica si el usuario tiene un token almacenado
  const isAuthenticated = !!sessionStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;