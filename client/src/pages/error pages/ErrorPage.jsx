import React from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, ArrowLeft } from 'lucide-react'; // Optional: using lucide-react or any icon lib

const ErrorPage = ({ title, desc }) => {
  const navigate = useNavigate();

  // Function to handle going back to the previous URL
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        
        {/* Icon Section */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        {/* Text Content */}
        <div className="mt-4">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {title || "Access Denied"}
          </h2>
          <p className="mt-2 text-base text-gray-500">
            {desc || "You do not have the necessary permissions to view this page or the resource does not exist."}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 w-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ErrorPage;