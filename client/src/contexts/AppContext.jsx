import { createContext, useContext, useState } from "react";

// 1. Create Context
const AppContext = createContext();

// 2. Create Provider
export const AppProvider = ({ children }) => {
    // Sidebar state (can add more later like theme, user, etc.)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Toggle function
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // Context values (scalable: add more later)
    const value = {
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 3. Custom Hook (for easy usage)
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
