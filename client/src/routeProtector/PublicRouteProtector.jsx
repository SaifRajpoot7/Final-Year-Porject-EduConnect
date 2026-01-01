import React from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Navigate, Outlet } from 'react-router';
import FullPageLoaderComponent from '../components/FullPageLoaderComponent';


const PublicRouteProtector = ({ children }) => {
  const { isLoggedIn, isLoading, isVerified } = useAppContext();

  // While checking auth, render nothing or a loader
  if (isLoading) return <FullPageLoaderComponent />;

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;

  return <Outlet />;;
}

export default PublicRouteProtector
