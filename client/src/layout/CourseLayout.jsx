// import React, { useEffect } from "react";
// import { Outlet, useParams } from "react-router";
// import { useAppContext } from "../contexts/AppContext";

// const CourseLayout = () => {
//   const { id } = useParams();
//   const { setCourseId, getCourseData, courseId, setMenuType } = useAppContext();

//   // Set courseId ONLY when param changes
//   useEffect(() => {
//     setCourseId(id);
//   }, [id]);

//   // Fetch course data when courseId is set
//   useEffect(() => {
//     if (courseId) {
//       getCourseData(id);
//     }
//   }, [courseId]);
//   useEffect(() => {
//     setMenuType("course");
//     return () => setMenuType("general");
//   }, [setMenuType]);

//   return <Outlet />;
// };

// export default CourseLayout;


import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { useAppContext } from "../contexts/AppContext";

const CourseLayout = () => {
  const { id } = useParams();
  const { setCourseId, getCourseData, setMenuType } = useAppContext();

useEffect(() => {
  if (!id) return;

  setCourseId(id);
  getCourseData(id);
  setMenuType("course");
}, [id]);


  return <Outlet />;
};

export default CourseLayout;
