import React, { useEffect } from 'react'
import CreateAssignmentForm from "../../components/CreateAssignmentForm";
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import StudentsList from './StudentsList';
import axios from 'axios';
import TeacherTable from './TeacherTable';

const CourseMatesPage = () => {
    const { setMenuType } = useAppContext();

    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2 min-h-screen">
            <PageTitle
                title="My Classmates"
                subtitle="Your Classmates"
            />
            <h2 className="text-lg font-semibold mt-6 mb-2">Your Teacher</h2>
            <TeacherTable />
            <h2 className="text-lg font-semibold mt-6 mb-2">Your Classmates</h2>
            <StudentsList />
        </div>
    )
}

export default CourseMatesPage
