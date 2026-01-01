import React, { useEffect } from 'react'
import CreateAssignmentForm from "../../components/CreateAssignmentForm";
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import StudentsList from './StudentsList';
import axios from 'axios';

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
            <StudentsList />
        </div>
    )
}

export default CourseMatesPage
