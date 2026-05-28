import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

/*
 * ProtectedRoute – route guard that verifies the user is authenticated
 * and has the correct role before rendering child routes.
 *
 * How it works:
 *   1. Reads currentUser, currentRole, isLoading from AuthContext
 *   2. If still loading (e.g. rehydrating from token), shows a spinner
 *   3. If not authenticated, redirects to /login
 *   4. If authenticated but wrong role, redirects to their own dashboard
 *   5. If everything passes, renders <Outlet /> (the child route)
 *
 * Used in AppRouter (src/router/AppRouter.tsx) to wrap all dashboard routes:
 *   <Route element={<ProtectedRoute allowedRoles={[UserRole.CLIENT]} />}>
 *     <Route element={<ClientLayout />}>
 *       <Route path="/client/dashboard" element={<ClientDashboardPage />} />
 *       ...
 *     </Route>
 *   </Route>
 */

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