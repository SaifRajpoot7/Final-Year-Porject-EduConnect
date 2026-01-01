import React, { useEffect } from 'react'
import CreateAssignmentForm from "../../components/CreateAssignmentForm";
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import StudentsList from './StudentsList';
import axios from 'axios';

const StudentsPage = () => {
    const { setMenuType } = useAppContext();

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
