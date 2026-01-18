// About.jsx
import React from 'react';
import { Link } from 'react-router';
import Footer from '../../components/footer/Footer';
import { CheckCircle, Code, Server, Database, Layers } from 'lucide-react';
import LecturesPage from "../../assets/images/LecturesPage.jpeg";

const AboutPage = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <div className="relative bg-indigo-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
            alt="Team working together"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Empowering Education Through Technology
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            EduConnect was built to solve a single problem: making virtual education as interactive and effective as being in a physical classroom.
          </p>
        </div>
      </div>

      {/* 2. Mission & Story Section (Split with Screenshot) */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column: Text Content */}
            <div>
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Mission</h2>
              <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Bridging the Digital Gap
              </h3>
              <p className="mt-4 text-lg text-gray-500">
                Traditional Learning Management Systems (LMS) are often clunky and disconnected. We wanted to build something different—a platform that feels alive.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong>Real-time Interaction:</strong> Live video streaming built directly into the browser.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong>Seamless Management:</strong> Teachers can manage lectures, attendance, and assignments in one dashboard.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-500">
                    <strong>Automated Workflow:</strong> From auto-attendance to instant grading, we save teachers time.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Screenshot Embed */}
            <div className="mt-12 lg:mt-0 relative">
               {/* Decorative Background Blob */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl blur-lg opacity-30"></div>
              
              {/* Browser Mockup */}
              <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 transform hover:scale-[1.02] transition-transform duration-300">
                 {/* Browser Header */}
                <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-4 space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                
                {/* ACTUAL SCREENSHOT: Lectures List */}
                <img
                  className="w-full h-auto"
                  src={LecturesPage}
                  alt="EduConnect Lectures Dashboard"
                />
              </div>
              <p className="mt-4 text-sm text-center text-gray-400 italic">
                Actual screenshot of the Teacher's Lecture Management Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tech Stack Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Built with Modern Technology</h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">React.js</h3>
              <p className="text-sm text-gray-500">Responsive Frontend</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Server className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Node.js</h3>
              <p className="text-sm text-gray-500">Robust Backend</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Express</h3>
              <p className="text-sm text-gray-500">API Framework</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-green-100 text-green-800 rounded-full flex items-center justify-center mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">MongoDB</h3>
              <p className="text-sm text-gray-500">Scalable Database</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Meet the Developers</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            This project is a result of dedication, coding, and testing by final year IT students at the University of Sargodha.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            {/* Team Member 1 */}
            <div className="group relative p-6 border border-gray-200 rounded-2xl hover:shadow-xl transition-all">
              <div className="h-24 w-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                SR
              </div>
              <h3 className="text-xl font-bold text-gray-900">Saif ur Rehman</h3>
              <p className="text-indigo-600 font-medium">Lead Developer & Planner</p>
              <p className="mt-4 text-gray-500 text-sm">
                Responsible for the full-stack MERN implementation, architectural design, and Stream.io integration.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="group relative p-6 border border-gray-200 rounded-2xl hover:shadow-xl transition-all">
              <div className="h-24 w-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl font-bold mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                HR
              </div>
              <h3 className="text-xl font-bold text-gray-900">Habib Rubani</h3>
              <p className="text-indigo-600 font-medium">Test Manager & Engineer</p>
              <p className="mt-4 text-gray-500 text-sm">
                Ensured system quality through rigorous testing, test case design, and bug tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;