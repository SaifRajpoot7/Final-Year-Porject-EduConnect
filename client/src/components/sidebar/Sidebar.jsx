import React, { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { generalMenu, courseMenu } from "./menuItems";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate();

  const { isSidebarOpen, menuType, toggleMenuType, logout, courseId, isCourseAdmin } = useAppContext();
  const [openMenus, setOpenMenus] = useState(null); // Track open submenus


  const toggleSubMenu = (index) => {
    // setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
    setOpenMenus(openMenus === index ? null : index);
  };
  const course_id = courseId;

  const menuItems = menuType == "general" ? generalMenu : courseMenu;

  const handleLogout = async () => {
    logout();
  }
  useEffect(() => {
    console.log("isCourseAdmin updated:", isCourseAdmin);
  }, [isCourseAdmin]);


  return (
    <aside
      className={`hidden sm:flex flex-col h-full ${isSidebarOpen ? "min-w-64" : "min-w-20"
        } bg-[var(--Background-primary)] p-4 rounded-2xl shadow-xl border-2 border-gray-200 transition-all duration-300 ease-in-out justify-between overflow-hidden hover:overflow-x-auto hover:overflow-y-scroll scrollbar-hide hover:scrollbar-hover`}
    >
      {/* Logo Section */}
      <div>
        <div className="flex w-full items-center justify-center mb-6">
          <img
            src={`${isSidebarOpen ? "/logo.png" : "/icon.png"
              }`}
            alt="Logo"
            className={`transition-all duration-300 ${isSidebarOpen ? "w-32" : "w-10"
              }`}
          />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2 mt-16">
          {menuType == "course" &&
            <button
              onClick={() =>
                toggleMenuType()
              }
              className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${isSidebarOpen ? "justify-between" : "justify-center"} hover:bg-[var(--Hover-BG-Tint)]  group mb-4`}
            >
              <div className="flex items-center gap-3">
                <ChevronLeft className="w-5 h-5 text-[var(--text-primary)] group-hover:text-[var(--Hover-Color)] transition-colors" />
                {isSidebarOpen && (
                  <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--Hover-Color)] transition-colors">
                    Main menu
                  </span>
                )}
              </div>
            </button>
          }

          {menuItems.map((item, index) => (
            <div key={index} className="relative group">
              {/* Main Item */}
              {item.sub ? (
                <button
                  onClick={() =>
                    isSidebarOpen ? toggleSubMenu(index) : null
                  }
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${isSidebarOpen ? "justify-between" : "justify-center"} hover:bg-[var(--Hover-BG-Tint)]  group`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[var(--text-primary)] group-hover:text-[var(--Hover-Color)] transition-colors" />
                    {isSidebarOpen && (
                      <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--Hover-Color)] transition-colors">
                        {item.text}
                      </span>
                    )}
                  </div>
                  {isSidebarOpen && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${openMenus === index ? "rotate-90" : ""
                        }`}
                    />
                  )}
                </button>
              ) : (
                <NavLink
                  to={menuType === "course"
                    ? `/course/${course_id}${item.link}`
                    : item.link}
                  className={({ isActive }) =>
                    `flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 ${isSidebarOpen ? "justify-start gap-3" : "justify-center"
                    } group ${isActive
                      ? "bg-[var(--Hover-BG-Tint)] text-[var(--Hover-Color)]  font-medium"
                      : "text-[var(--text-primary)] hover:bg-[var(--Hover-BG-Tint)] hover:text-[var(--Hover-Color)]  font-medium"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 transition-colors" />
                  {isSidebarOpen && (
                    <span className="text-sm">{item.text}</span>
                  )}
                </NavLink>
              )}

              {/* Sub Menu */}
              {isSidebarOpen && item.sub && openMenus === index && (
                <div className="ml-8 mt-1 flex flex-col gap-1">
                  {/* {item.sub.map((subItem) => (
                    isCourseAdmin == subItem.admin ? (
                      <NavLink
                        key={subItem.text}
                        to={menuType === "course"
                          ? `/course/${course_id}${subItem.link}`
                          : subItem.link}

                        className={({ isActive }) =>
                          `text-sm px-2 py-1 rounded-md transition-colors ${isActive
                            ? "text-[var(--Hover-Color)]"
                            : "text-[var(--text-primary)] hover:text-[var(--Hover-Color)]"
                          }`
                        }
                      >
                        {subItem.text}
                      </NavLink>) : null

                  ))} */}
                  {item.sub.map((subItem) => {

                    // show admin items only if isCourseAdmin is true
                    const shouldShow = !subItem.admin || (subItem.admin && isCourseAdmin);

                    return shouldShow ? (
                      <NavLink
                        key={subItem.text}
                        to={
                          menuType === "course"
                            ? `/course/${course_id}${subItem.link}`
                            : subItem.link
                        }
                        className={({ isActive }) =>
                          `text-sm px-2 py-1 rounded-md transition-colors ${isActive
                            ? "text-[var(--Hover-Color)]"
                            : "text-[var(--text-primary)] hover:text-[var(--Hover-Color)]"
                          }`
                        }
                      >
                        {subItem.text}
                      </NavLink>
                    ) : null;
                  })}

                </div>
              )}

              {/* Sub Menu on Hover */}

              {!isSidebarOpen && item.sub && (
                <div className="absolute left-full top-0 hidden group-hover:block bg-white border shadow-lg rounded-md w-48 p-2 z-50">
                  <ul className="space-y-1">
                    {item.sub.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink
                          to={menuType === "course"
                            ? `/course/${course_id}${subItem.link}`
                            : subItem.link}
                          className={({ isActive }) =>
                            `block px-2 py-1 text-sm rounded-md ${isActive
                              ? "bg-[var(--Hover-BG-Tint)] text-[var(--Hover-Color)] "
                              : "text-[var(--text-primary)] hover:bg-[var(--Hover-BG-Tint)]"
                            }`
                          }
                        >
                          {subItem.text}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div >
      <button
        onClick={() => handleLogout()}
        className={
          `flex items-center w-full px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${isSidebarOpen ? "justify-start gap-3" : "justify-center"} group text-[var(--text-primary)] hover:bg-red-100 hover:text-red-600  font-medium`
        }
      >
        <LogOut className="w-5 h-5 transition-colors" />
        {isSidebarOpen && (
          <span className="text-sm">Logout</span>
        )}
      </button>

    </aside >
  );
};

export default Sidebar;