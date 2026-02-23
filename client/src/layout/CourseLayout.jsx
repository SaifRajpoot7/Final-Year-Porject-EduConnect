import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router";
import axios from "axios"; // Ensure axios is imported
import { useAppContext } from "../contexts/AppContext";
import FullPageLoaderComponent from "../components/FullPageLoaderComponent";
import ErrorPage from "../pages/error pages/ErrorPage";

const CourseLayout = () => {
  const { id } = useParams();
  const { setCourseId, getCourseData, setMenuType, backendUrl } = useAppContext();
  
  // State to handle the check
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccessAndInit = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        // 1. Initialize Context Data
        setCourseId(id);
        setMenuType("course");
        
        // Optional: You might want to wait to get data until auth is confirmed, 
        // but keeping your original flow here:
        getCourseData(id); 

        // 2. Run the Authorization Check
        // Note: You likely need to pass the 'id' to the backend so it knows WHICH course to check
        const response = await axios.get(`${backendUrl}/api/course/course-member?courseId=${id}`);

        if (response.data.success) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }

      } catch (error) {
        console.error("Authorization check failed:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccessAndInit();
  }, [id]); // Runs whenever the URL 'id' changes

  // 1. Loading State (Optional: Simple text or a Spinner component)
  if (isLoading) {
    return <FullPageLoaderComponent />
  }

  // 2. Unauthorized State
  if (!isAuthorized) {
    return (
      <ErrorPage 
        title="403 - Access Restricted" 
        desc="It looks like you are not part of this course. Access is reserved for registered members only."
      />
    );
  }

  // 3. Authorized State
  return <Outlet />;
};

export default CourseLayout;