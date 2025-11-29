// import { Menu } from 'lucide-react'
// import { useAppContext } from "../../contexts/AppContext";
// import React from 'react'

// const Header = () => {
//     const { setIsSidebarOpen, isSidebarOpen } = useAppContext();
//     return (
//         <header className='flex h-16 bg-[#F9FAFB] p-4 rounded-2xl  border-2 border-[#E5E7EB] flex-row items-center justify-between'>
//             <div onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                 className='group cursor-pointer hover:bg-[#EFF6FF] rounded-full w-9 h-9 flex items-center justify-center transition-all'>
//                 <Menu className='text-[#111827] h-6 w-6 group-hover:text-[#339bfd] transition-colors' />
//             </div>
//             <p className='text-brand-hover-bg' >jjjj</p>
//         </header>
//     )
// }

// export default Header



import { Menu, User, LogOut } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import React, { useState, useRef, useEffect } from "react";

const DashboardHeader = () => {
  const { setIsSidebarOpen, isSidebarOpen } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = {
    name: "Saif ur Rehman", // dynamic from context
    avatar: "https://i.pravatar.cc/150?img=12", // stock avatar
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 bg-white p-4 rounded-2xl border border-gray-200 items-center justify-between shadow-sm">
      {/* Left - Menu Toggle */}
      <div
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="group cursor-pointer hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
      >
        <Menu className="text-gray-800 h-6 w-6 group-hover:text-blue-600 transition-colors" />
      </div>

      {/* Right - Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 transition"
        >
          <img
            src={user.avatar}
            alt="User Avatar"
            className="h-9 w-9 rounded-full border border-gray-300 object-cover"
          />
          <span className="hidden md:block font-medium text-gray-700">
            {user.name}
          </span>
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
              <User size={18} /> Profile
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;

