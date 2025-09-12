import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 mt-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        {/* Left side - Copyright */}
        <p>© {new Date().getFullYear()} EduConnect. All rights reserved.</p>

        {/* Right side - Owner/Org */}
        <p className="mt-2 sm:mt-0">
          Design & Developed by{" "}
          <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
            Saif ur Rehman
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
