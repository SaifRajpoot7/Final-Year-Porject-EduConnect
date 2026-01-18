import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, Twitter, Facebook, Linkedin, Github, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Brand & Mission */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
             {/* If you have a logo image, uncomment the line below and remove the text header */}
             <img src="/logo-white.png" alt="EduConnect Logo" className="h-15" />
             {/* <span className="text-2xl font-bold text-white">EduConnect</span> */}
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Bridging the gap between physical classrooms and digital education. 
            Your centralized platform for real-time learning and collaboration.
          </p>
        </div>

        {/* Column 2: Quick Links (Simplified) */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="hover:text-white transition-colors flex items-center">
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors flex items-center">
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full mr-2"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors flex items-center">
                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info & Socials */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 text-indigo-500 flex-shrink-0" />
              <span className="text-sm">University of Sargodha, Pakistan</span>
            </li>
            <li className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-indigo-500 flex-shrink-0" />
              <a href="mailto:contact@educonnect.com" className="hover:text-white transition-colors">contact@educonnect.com</a>
            </li>
            <li className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-indigo-500 flex-shrink-0" />
              <a href="tel:+923001234567" className="hover:text-white transition-colors">+92 300 1234567</a>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-gray-400 hover:text-white hover:bg-indigo-600 p-2 rounded-full transition-all">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white hover:bg-indigo-600 p-2 rounded-full transition-all">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white hover:bg-indigo-600 p-2 rounded-full transition-all">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white hover:bg-indigo-600 p-2 rounded-full transition-all">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Strip */}
      <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>© {currentYear} EduConnect. Final Year Project. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;