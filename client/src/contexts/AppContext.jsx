import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

axios.defaults.withCredentials = true;


// 1. Create Context
const AppContext = createContext();

// 2. Create Provider
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const userId = 453;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("user")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [menuType, setMenuType] = useState("general");

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleMenuType = () =>
    setMenuType((prev) => (prev === "general" ? "course" : "general"));

  const checkIsLoggedIn = async () => {
    // setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/user/is-auth`);
      // const data = response.data;
      if (response.data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/signin')
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || error.message || "Auth check failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`);
      const data = response.data;
      if (data.success) {
        setUserData(data.userData);
        setIsVerified(data.userData.isVerified);
        // setRole(data.userData.role);
      } else {
        setUserData(null);
        setIsVerified(false);
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/logout`);
      if (res.data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success(res.data.message || "Logged out");
        if (window.location.pathname !== "/signin") {
          navigate("/signin");
        }
      } else {
        toast.error(res.data.message || "Logout failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout error");
    }
  };

  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    menuType,
    setMenuType,
    toggleMenuType,
    userId,
    backendUrl,
    checkIsLoggedIn,
    isLoggedIn,
    userData,
    isVerified,
    isLoading,
    getUserData,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ 3. Custom hook for easy usage
export const useAppContext = () => useContext(AppContext);
