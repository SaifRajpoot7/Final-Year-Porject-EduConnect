import React from 'react';
import { Link } from 'react-router';
import Footer from '../../components/footer/Footer';
import { Video, BookOpen, FileText, Users, ArrowRight } from 'lucide-react';
import AllCourse from '../../assets/images/AllCourse.jpeg'; // Ensure this path is correct

const IndexPage = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Students studying"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-48 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            The Future of Virtual Learning is Here
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            EduConnect bridges the gap between physical classrooms and digital education.
            Experience seamless live lectures, intuitive assignments, and real-time collaboration.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 transition-colors"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Key Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to teach & learn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Live Classes</h3>
              <p className="mt-2 text-gray-500">High-quality video lectures with auto-attendance tracking.</p>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Course Management</h3>
              <p className="mt-2 text-gray-500">Organize study materials, videos, and notes in one place.</p>
            </div>
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Assignments & Quizzes</h3>
              <p className="mt-2 text-gray-500">Create assessments and track student progress easily.</p>
            </div>
            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Real-time Collaboration</h3>
              <p className="mt-2 text-gray-500">Engage with students through interactive features.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Showcase Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Intuitive Interface</h2>
             <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
               A powerful dashboard for everyone
             </p>
             <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
               Navigate your courses, lectures, and assignments from a single, modern dashboard.
             </p>
           </div>
          <div className="relative mt-10">
            {/* Decorative background blobs */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 transform -skew-y-2"></div>
            {/* Browser Mockup Frame */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              {/* Replace 'image_2.png' with the actual path to your image file */}
              <img
                className="w-full h-auto"
                src={AllCourse}
                alt="EduConnect All Courses Dashboard"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-xl text-indigo-100 leading-6">
            Join EduConnect today and transform your learning experience.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
            >
              Join EduConnect Today
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndexPage;
