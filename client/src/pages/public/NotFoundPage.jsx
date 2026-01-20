import React from 'react';
import { Link } from 'react-router'; // Keeping your routing import consistent
import Footer from '../../components/footer/Footer'; // Reusing your existing footer
import { Home, MoveLeft, FileQuestion } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className=" bg-gray-50 flex flex-col min-h-screen">

            {/* Background Decor - Matches your 'Screenshot Showcase' aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            {/* Main Content Area */}
            <div className="my-6 flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">

                <div className="max-w-max mx-auto text-center relative z-10">

                    {/* Icon Representation */}
                    <div className="flex justify-center mb-6">
                        <div className="h-24 w-24 bg-white rounded-2xl shadow-xl flex items-center justify-center transform -rotate-6">
                            <FileQuestion className="h-12 w-12 text-indigo-600" />
                        </div>
                    </div>

                    <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">404 Error</p>
                    <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        Page not found.
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 max-w-lg mx-auto">
                        Sorry, we couldn’t find the page you’re looking for. It might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        {/* Primary 'Go Home' Button - Matches your Hero Section button style */}
                        <Link
                            to="/"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Go back home
                        </Link>

                        {/* Secondary 'Contact' or 'Back' Button */}
                        <Link
                            to="/contact" // Or define a goBack function
                            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <MoveLeft className="mr-2 h-5 w-5" />
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default NotFoundPage;