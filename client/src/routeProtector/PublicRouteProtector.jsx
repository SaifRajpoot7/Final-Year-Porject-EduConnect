import React from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Navigate, Outlet } from 'react-router';
import FullPageLoaderComponent from '../components/FullPageLoaderComponent';


const PublicRouteProtector = ({ children }) => {
  const { isLoggedIn, isLoading, userData, isSuperAdmin, isVerified } = useAppContext();

  // While checking auth, render nothing or a loader
  if (isLoading) return <FullPageLoaderComponent />;
  
  if (isLoggedIn && !isSuperAdmin) return <Navigate to="/dashboard" replace />;
  if (isLoggedIn && isSuperAdmin) return <Navigate to="/admin-dashboard" replace />;

  return <Outlet />;;
}

export default PublicRouteProtector
