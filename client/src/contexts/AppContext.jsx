import { createContext, useContext, useState } from "react";

// 1. Create Context
const AppContext = createContext();

// 2. Create Provider
export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [menuType, setMenuType] = useState("general");
  const userId = 453;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleMenuType = () =>
    setMenuType((prev) => (prev === "general" ? "course" : "general"));

  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    menuType,
    setMenuType,
    toggleMenuType,
    userId,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ 3. Custom hook for easy usage
export const useAppContext = () => useContext(AppContext);
