import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { useLocation } from "react-router";

axios.defaults.withCredentials = true;

// 1. Create Context
const AppContext = createContext();

// 2. Create Provider
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [courseId, setCourseId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [menuType, setMenuType] = useState("general");
  const [isCourseAdmin, setIsCourseAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isBlockedOrSuspended, setIsBlockedOrSuspended] = useState(false);

  // 🔥 SOCKET STATE
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Feedback Modal state
  const [showModal, setShowModal] = useState(false);

  /* =========================
     SOCKET CONNECTION
  ========================== */
  const connectSocket = (user) => {
    if (!user?._id || socket) return;

    const newSocket = io(backendUrl, {
      query: { userId: user._id },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);
  };

  /* =========================
     AUTH
  ========================== */
  // const checkIsLoggedIn = async () => {
  //   try {
  //     console.log("this is it")
  //     const res = await axios.get(`${backendUrl}/api/user/is-auth`);
  //     if (res.data.success) {
  //       setIsLoggedIn(true);
  //       await getUserData();
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   } catch {
  //     setIsLoggedIn(false);
  //     console.log("this is it")
  //     navigate("/signin");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const checkIsLoggedIn = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/is-auth`);
      if (!res.data.success) return false;

      await getUserData();
      setIsLoggedIn(true);
      return true;
    } catch {
      setIsLoggedIn(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const getUserData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/profile`);
      if (res.data.success) {
        setUserData(res.data.userData);
        setIsVerified(res.data.userData.isVerified);
        setIsSuperAdmin(res.data.userData.role === 'super_admin');
        setIsBlockedOrSuspended(res.data.userData.status !== 'active');
        connectSocket(res.data.userData);
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch {
      toast.error("Failed to fetch user data");
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/logout`);
      if (res.data.success) {
        socket?.disconnect();
        setSocket(null);
        setUserData(null);
        setOnlineUsers([]);
        setIsLoggedIn(false);
        navigate("/signin");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  /* =========================
     COURSE
  ========================== */
  const getCourseData = async (course) => {
    try {
      const res = await axios.get(`${backendUrl}/api/course/${course}`,
      );
      if (res.data.success) {
        setCourseData(res.data.courseData);
      }
    } catch {
      toast.error("Failed to fetch course data");
    }
  };

  const toggleMenuType = () => {
    setMenuType((prev) => (prev === "general" ? "course" : "general"));
  }

  const openFeedbackModal = () => {
    setShowModal(true);
  };

  /* =========================
     EFFECTS
  ========================== */


  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsCourseAdmin(userData._id === courseData.teacher._id);
    }
  }, [userData, courseData]);

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  /* =========================
     CONTEXT VALUE
  ========================== */
  const value = {
    backendUrl,
    isLoggedIn,
    isLoading,
    userData,
    isVerified,
    courseId,
    setCourseId,
    courseData,
    getCourseData,
    isCourseAdmin,
    socket,
    onlineUsers,
    logout,
    isSidebarOpen,
    setIsSidebarOpen,
    menuType,
    setMenuType,
    setIsCourseAdmin,
    toggleMenuType,
    checkIsLoggedIn,
    isSuperAdmin,
    setIsSuperAdmin,
    isBlockedOrSuspended,
    openFeedbackModal,
    showModal,
    setShowModal,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 3. Hook
export const useAppContext = () => useContext(AppContext);
