import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useUser } from '../contexts/UserContext';
import Spinner from '../views/spinner/Spinner';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = '/auth/login' }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;