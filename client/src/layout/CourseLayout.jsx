import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { useAppContext } from "../contexts/AppContext";

const CourseLayout = () => {
  const { id } = useParams();
  const { setCourseId, getCourseData, courseId } = useAppContext();

  // Set courseId ONLY when param changes
  useEffect(() => {
    setCourseId(id);
  }, [id]);

  // Fetch course data when courseId is set
  useEffect(() => {
    if (courseId) {
      getCourseData();
    }
  }, [courseId]);

  return <Outlet />;
};

export default CourseLayout;
