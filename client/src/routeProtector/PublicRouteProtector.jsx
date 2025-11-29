import React from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Navigate, Outlet } from 'react-router';


const PublicRouteProtector = ({ children }) => {
  const { isLoggedIn, isLoading, isVerified } = useAppContext();

  // While checking auth, render nothing or a loader
  if (isLoading) return <div>Loading...</div>;

  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  if (isVerified) return <Navigate to="/dashboard" replace />;


  return <Outlet />;;
}

export default PublicRouteProtector
