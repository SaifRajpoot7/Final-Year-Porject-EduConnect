import React from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Navigate, Outlet } from 'react-router';
import FullPageLoaderComponent from '../components/FullPageLoaderComponent';
import ErrorPage from '../pages/error pages/ErrorPage';


const PrivateRouteProtectorForSuperAdmins = ({ children }) => {
  const { isLoggedIn, isLoading, isVerified, isSuperAdmin } = useAppContext();

  // While checking auth, render nothing or a loader

  if (isLoading) return <FullPageLoaderComponent />;
  if (!isLoggedIn) return <Navigate to="/signin" replace />;
  if (!isSuperAdmin) return <ErrorPage title="403 Access Forbiden " desc="Your are not allowed to access this content" />;
  if (!isVerified) return <Navigate to="/account-verification" replace />;

  return <Outlet />;
}

export default PrivateRouteProtectorForSuperAdmins
