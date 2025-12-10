import React, { useEffect } from 'react'
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import CreateQuizForm from '../../components/CreateQuizForm';

const CreateQuizPage = () => {
    const { setMenuType, setCourseId, userData } = useAppContext();

    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2 min-h-screen">
            <PageTitle
                title="Create New Quiz"
                subtitle=""
            />
            <CreateQuizForm />
        </div>
    )
}

export default CreateQuizPage
