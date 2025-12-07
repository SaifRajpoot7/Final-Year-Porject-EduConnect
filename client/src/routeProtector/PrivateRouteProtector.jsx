import React from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Navigate, Outlet } from 'react-router';


const PrivateRouteProtector = ({ children }) => {
  const { isLoggedIn, isLoading, isVerified } = useAppContext();

  // While checking auth, render nothing or a loader
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/signin" replace />;
  if (!isVerified) return <Navigate to="/account-verification" replace />;

  return <Outlet />;
}

export default PrivateRouteProtector
