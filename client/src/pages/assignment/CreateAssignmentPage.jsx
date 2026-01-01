import React, { useEffect } from 'react'
import CreateAssignmentForm from "../../components/CreateAssignmentForm";
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';

const CreateAssignmentPage = () => {
    const { setMenuType, setCourseId, userData } = useAppContext();
    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2">
            <PageTitle
                title="Create New Assignment"
                subtitle=""
            />
            <CreateAssignmentForm />
        </div>
    )
}

export default CreateAssignmentPage
