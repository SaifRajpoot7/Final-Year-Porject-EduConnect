// import { createContext, useContext, useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router";
// import { io } from "socket.io-client";

// axios.defaults.withCredentials = true;


// // 1. Create Context
// const AppContext = createContext();

// // 2. Create Provider
// export const AppProvider = ({ children }) => {

//   const navigate = useNavigate();

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [courseId, setCourseId] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [courseData, setCourseData] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [role, setRole] = useState("user")
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [menuType, setMenuType] = useState("general");
//   const [isCourseAdmin, setIsCourseAdmin] = useState(false)
//   const [socket, setSocket] = useState(null)
//   const [onlineUsers, setOnlineUsers] = useState([])
//   const [socketId, setSocketId] = useState(null)

//   setSocket(useMemo(
//     () =>
//       io(backendUrl),
//     []
//   )
//   )

//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
//   const toggleMenuType = () =>
//     setMenuType((prev) => (prev === "general" ? "course" : "general"));

//   const checkIsLoggedIn = async () => {
//     // setIsLoading(true);
//     try {
//       const response = await axios.get(`${backendUrl}/api/user/is-auth`);
//       // const data = response.data;
//       if (response.data.success) {
//         setIsLoggedIn(true);
//         await getUserData();
//       } else {
//         setIsLoggedIn(false);
//         setUserData(null);
//         navigate('/signin')
//       }
//     } catch (error) {
//       // toast.error(error.response?.data?.message || error.message || "Auth check failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getUserData = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/user/profile`);
//       const data = response.data;
//       if (data.success) {
//         setUserData(data.userData);
//         setIsVerified(data.userData.isVerified);
//         connectSocket(data.userData);
//         // setRole(data.userData.role);
//       } else {
//         setUserData(null);
//         setIsVerified(false);
//         toast.error(data.message || "Failed to fetch user data");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch user data");
//     }
//   };

//   const logout = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/user/logout`);
//       if (res.data.success) {
//         setIsLoggedIn(false);
//         setUserData(null);
//         setOnlineUsers([]);
//         socket.disconnect();
//         toast.success(res.data.message || "Logged out");
//         if (window.location.pathname !== "/signin") {
//           navigate("/signin");
//         }
//       } else {
//         toast.error(res.data.message || "Logout failed");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Logout error");
//     }
//   };


// const connectSocket = (user) => {
//     if (socket || !user?._id) return;

//     const newSocket = io(backendUrl, {
//         query: { userId: user._id }
//     });

//     setSocket(newSocket);

//     newSocket.on("getOnlineUsers", setOnlineUsers);
// };

// useEffect(() => {
//     return () => {
//         socket?.disconnect();
//     };
// }, [socket]);




//   const getCourseData = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/course/${courseId}`);
//       const data = response.data;

//       if (data.success) {
//         setCourseData(data.courseData);
//       } else {
//         toast.error(data.message || "Failed to fetch course data");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to fetch course data");
//     }
//   };



//   useEffect(() => {
//     checkIsLoggedIn();
//   }, []);
//   useEffect(() => {
//     if (userData && courseData) {
//       const isAdmin = userData._id === courseData.teacher._id;
//       setIsCourseAdmin(isAdmin);
//     }
//   }, [userData, courseData]);

//   useEffect(() => {
//     socket.on("connect", () => {
//       setSocketId(socket.id);
//       console.log("connected", socket.id);
//     });

//     socket.on("receive-message", (data) => {
//       console.log(data);
//       setMessages((messages) => [...messages, data]);
//     });

//     socket.on("welcome", (s) => {
//       console.log(s);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);



//     const value = {
//       isSidebarOpen,
//       setIsSidebarOpen,
//       toggleSidebar,
//       menuType,
//       setMenuType,
//       toggleMenuType,
//       backendUrl,
//       checkIsLoggedIn,
//       isLoggedIn,
//       userData,
//       isVerified,
//       isLoading,
//       getUserData,
//       logout,
//       courseId,
//       setCourseId,
//       courseData,
//       setCourseData,
//       getCourseData,
//       isCourseAdmin,
//       setIsCourseAdmin
//     };

//     return (
//       <AppContext.Provider value={value}>
//         {children}
//       </AppContext.Provider>
//     );
//   };

//   // ✅ 3. Custom hook for easy usage
//   export const useAppContext = () => useContext(AppContext);


import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";

axios.defaults.withCredentials = true;

// 1. Create Context
const AppContext = createContext();

// 2. Create Provider
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
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

  // 🔥 SOCKET STATE
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

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
  const checkIsLoggedIn = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/is-auth`);
      if (res.data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
        navigate("/signin");
      }
    } catch {
      setIsLoggedIn(false);
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
  const getCourseData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/course/${courseId}`);
      if (res.data.success) {
        setCourseData(res.data.courseData);
      }
    } catch {
      toast.error("Failed to fetch course data");
    }
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
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// 3. Hook
export const useAppContext = () => useContext(AppContext);
