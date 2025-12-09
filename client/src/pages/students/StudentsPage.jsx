import React, { useEffect } from 'react'
import CreateAssignmentForm from "../../components/CreateAssignmentForm";
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import StudentsList from './StudentsList';
import axios from 'axios';

const StudentsPage = () => {
    const { setMenuType, setCourseId, userData, setIsCourseAdmin, courseId, getCourseData, courseData } = useAppContext();
    const { id } = useParams();
    setCourseId(id)

    //course admin
    useEffect(() => {
    if (courseId) {
       // set in context

      axios.get(`/api/course/${courseId}`)
        .then(res => {
          const courseData = res.data;
          const isAdmin = userData._id === courseData.teacher._id;
          setIsCourseAdmin(isAdmin);
        })
        .catch(err => {
          console.error("Error fetching course:", err);
          setIsCourseAdmin(false); // fallback
        });
    }
  }, [courseId, setCourseId, setIsCourseAdmin, userData]);
    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2 min-h-screen">
            <PageTitle
                title="Student"
                subtitle="All Students of current course"
            />
            <StudentsList />
        </div>
    )
}

export default StudentsPage
