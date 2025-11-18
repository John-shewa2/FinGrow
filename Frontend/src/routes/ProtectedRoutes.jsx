import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

/**
 * Protects routes for all logged-in users.
 * If not logged in, redirects to /login.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * Protects routes for ADMIN users only.
 * If not logged in, redirects to /login.
 * If logged in but NOT admin, redirects to borrower dashboard ('/').
 */
export const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace /> // Redirect non-admins to home/dashboard
  );
};
