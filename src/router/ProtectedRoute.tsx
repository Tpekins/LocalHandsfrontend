
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentRole, currentUser, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Add a loading spinner page or component here
    return <div className="flex justify-center items-center h-screen"><p className="text-xl text-primary">Loading...</p></div>;
  }
  
  const isAuthenticated = !!currentUser;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentRole)) {
    // Redirect to a "Not Authorized" page or back to a default page based on role
    // For simplicity, redirecting to login. A better UX would be a dedicated "access denied" page or home.
    // Or redirect to their default dashboard if they have one.
    let defaultPath = "/";
    if (currentRole === Role.CLIENT) defaultPath = "/client/dashboard";
    else if (currentRole === Role.PROVIDER) defaultPath = "/provider/dashboard";
    else if (currentRole === Role.ADMIN) defaultPath = "/admin/dashboard";
    
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
    