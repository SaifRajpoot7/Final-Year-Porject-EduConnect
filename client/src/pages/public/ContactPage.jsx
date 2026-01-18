import React from 'react';
import Footer from '../../components/footer/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      
      {/* 1. Hero / Header Section */}
      <div className="bg-indigo-700 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-base font-semibold text-indigo-200 tracking-wide uppercase">Contact Us</h2>
          <p className="mt-1 text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Let's Talk
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-indigo-100">
            Have questions about the platform? Need technical support? We are here to help you connect.
          </p>
        </div>
      </div>

      {/* 2. Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Info Cards */}
          <div className="space-y-4">
            {/* Card 1: Email */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                <p className="mt-1 text-gray-500 text-sm">
                  For general inquiries and support.
                </p>
                <a href="mailto:support@educonnect.com" className="mt-2 block text-indigo-600 font-medium hover:underline">
                  support@educonnect.com
                </a>
              </div>
            </div>

            {/* Card 2: Phone */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <Phone className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                <p className="mt-1 text-gray-500 text-sm">
                  Available Mon-Fri, 9am - 5pm.
                </p>
                <a href="tel:+923001234567" className="mt-2 block text-indigo-600 font-medium hover:underline">
                  +92 300 1234567
                </a>
              </div>
            </div>

            {/* Card 3: Location */}
            <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Visit Campus</h3>
                <p className="mt-1 text-gray-500 text-sm">
                  Department of CS & IT, University of Sargodha.
                </p>
                <p className="mt-2 text-gray-600 font-medium">Sargodha, Pakistan</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <div className="flex items-center space-x-2 mb-6">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-900">Send us a message</h3>
            </div>
            
            <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md border"
                    placeholder="Saif"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md border"
                    placeholder="Rehman"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md border"
                    placeholder="you@university.edu.pk"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <div className="mt-1">
                  <select
                    id="subject"
                    name="subject"
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md border"
                  >
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Report a Bug</option>
                    <option>Feedback</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md border"
                    placeholder="How can we help you?"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 3. FAQ Section */}
      <div className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                How do I reset my password?
              </h3>
              <p className="mt-2 text-gray-500">
                You can reset your password by clicking "Forgot Password" on the login screen. An email will be sent to your registered university address.
              </p>
            </div> */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                How does attendance tracking work?
              </h3>
              <p className="mt-2 text-gray-500">
                Attendance is marked automatically when you join a live lecture. You must stay in the class for at least 50% of the duration.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                Can I upload assignments after the due date?
              </h3>
              <p className="mt-2 text-gray-500">
                Late submissions are not allowed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                Is the platform mobile friendly?
              </h3>
              <p className="mt-2 text-gray-500">
                Yes! EduConnect is built with a responsive MERN stack design that works on phones, tablets, and desktops.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;