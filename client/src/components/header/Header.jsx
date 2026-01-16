// import React, { useState } from "react";
// import { Menu, X } from "lucide-react"; // install: npm install lucide-react

// const Header = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="w-full shadow-md bg-white fixed top-0 left-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

//         {/* Logo */}
//         <div className="text-2xl font-bold text-gray-900 cursor-pointer">
//           YourLogo
//         </div>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex gap-8 text-lg font-medium text-gray-700">
//           <a href="#" className="hover:text-blue-600 transition">Home</a>
//           <a href="#" className="hover:text-blue-600 transition">About</a>
//           <a href="#" className="hover:text-blue-600 transition">Services</a>
//           <a href="#" className="hover:text-blue-600 transition">Contact</a>
//         </nav>

//         {/* Desktop Buttons */}
//         <div className="hidden md:flex gap-4">
//           <button className="px-5 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
//             Login
//           </button>

//           <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
//             Sign In
//           </button>
//         </div>

//         {/* Mobile Menu Icon */}
//         <button
//           className="md:hidden"
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <X size={30} /> : <Menu size={30} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="md:hidden bg-white shadow-lg">
//           <nav className="flex flex-col gap-4 text-lg font-medium text-gray-700 px-6 py-4">
//             <a href="#" className="hover:text-blue-600">Home</a>
//             <a href="#" className="hover:text-blue-600">About</a>
//             <a href="#" className="hover:text-blue-600">Services</a>
//             <a href="#" className="hover:text-blue-600">Contact</a>

//             <div className="flex flex-col gap-3 mt-4">
//               <button className="px-5 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
//                 Login
//               </button>

//               <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
//                 Sign In
//               </button>
//             </div>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;


import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  // Detect scroll for sticky transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full  z-50 transition-all ${scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold text-gray-900 cursor-pointer w-40">
          <img
            src="/logo.png"
            alt="Logo"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-lg font-medium text-gray-700">

          {/* Example Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setDropdown("services")}
            onMouseLeave={() => setDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-blue-600 transition">
              Services <ChevronDown size={18} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdown === "services" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-48"
                >
                  <a className="block px-2 py-2 hover:bg-blue-50 rounded">Web Development</a>
                  <a className="block px-2 py-2 hover:bg-blue-50 rounded">Mobile Apps</a>
                  <a className="block px-2 py-2 hover:bg-blue-50 rounded">UI/UX Design</a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#" className="hover:text-blue-600 transition">About</a>
          <a href="#" className="hover:text-blue-600 transition">Contact</a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-4">
          <button className="px-5 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
            Login
          </button>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={30} /> : <Menu size={30} />}
        </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-xl"
          >
            <nav className="flex flex-col gap-4 text-lg font-medium text-gray-700 px-6 py-4">

              {/* Mobile Dropdown */}
              <div>
                <button
                  className="flex items-center justify-between w-full"
                  onClick={() =>
                    setDropdown(dropdown === "m-services" ? null : "m-services")
                  }
                >
                  Services <ChevronDown size={20} />
                </button>

                <AnimatePresence>
                  {dropdown === "m-services" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-2 flex flex-col gap-2"
                    >
                      <a className="hover:text-blue-600">Web Development</a>
                      <a className="hover:text-blue-600">Mobile Apps</a>
                      <a className="hover:text-blue-600">UI/UX Design</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a className="hover:text-blue-600">About</a>
              <a className="hover:text-blue-600">Contact</a>

              {/* Mobile Buttons */}
              <div className="flex flex-col gap-3 mt-4">
                <button className="px-5 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
                  Login
                </button>

                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Sign In
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
