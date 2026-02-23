import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router"; // Updated imports
import { useAppContext } from "../../contexts/AppContext";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // To track current route
  const { isLoggedIn } = useAppContext();

  // Define Menu Items
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Detect scroll for sticky transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  // Render Auth Buttons based on logic
  const renderAuthButtons = (isMobile = false) => {
    if (isLoggedIn) {
      return (
        <button
          onClick={() => {
            navigate("/dashboard");
            if (isMobile) setOpen(false);
          }}
          className={`px-5 py-2 bg-blue-600 cursor-pointer text-white rounded-lg font-medium hover:bg-blue-700 transition ${isMobile ? "w-full" : ""}`}
        >
          Dashboard
        </button>
      );
    }

    // Logic for Logged Out users
    const showSignIn = location.pathname !== "/signin";
    const showSignUp = location.pathname !== "/signup";

    return (
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}>
        {showSignIn && (
          <button
            onClick={() => {
              navigate("/signin");
              if (isMobile) setOpen(false);
            }}
            className={`px-5 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition ${isMobile ? "w-full" : ""}`}
          >
            Sign In
          </button>
        )}
        {showSignUp && (
          <button
            onClick={() => {
              navigate("/signup");
              if (isMobile) setOpen(false);
            }}
            className={`px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition ${isMobile ? "w-full" : ""}`}
          >
            Sign Up
          </button>
        )}
      </div>
    );
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`w-full z-50 transition-all ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-gray-900 cursor-pointer w-40"
        >
          <img src="/logo.png" alt="Logo" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-lg font-medium text-gray-700">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`transition hover:text-blue-600 ${
                isActive(item.path) ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:block">
          {renderAuthButtons(false)}
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
            className="md:hidden bg-white shadow-xl absolute w-full left-0 top-full"
          >
            <nav className="flex flex-col gap-4 text-lg font-medium text-gray-700 px-6 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`block transition hover:text-blue-600 ${
                    isActive(item.path) ? "text-blue-600 font-bold" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Buttons Logic */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {renderAuthButtons(true)}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;