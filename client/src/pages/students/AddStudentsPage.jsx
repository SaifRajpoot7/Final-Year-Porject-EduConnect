import React, { useEffect } from 'react'
import CreateAssignmentForm from "../../components/CreateAssignmentForm";
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import AddStudentsForm from './AddStudentsForm';

const AddStudentsPage = () => {
    const { setMenuType, setCourseId, userData } = useAppContext();
    const { id } = useParams();
    setCourseId(id)

    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2 min-h-screen">
            <PageTitle
                title="Add Students"
                subtitle=""
            />
            <AddStudentsForm />
        </div>
    )
}

export default AddStudentsPage
