import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentRole, currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl text-primary">Loading...</p></div>;
  }
  
  const isAuthenticated = !!currentUser;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    let defaultPath = "/";
    if (currentRole === UserRole.CLIENT) defaultPath = "/client/dashboard";
    else if (currentRole === UserRole.PROVIDER) defaultPath = "/provider/dashboard";
    else if (currentRole === UserRole.ADMIN) defaultPath = "/admin/dashboard";
    
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;