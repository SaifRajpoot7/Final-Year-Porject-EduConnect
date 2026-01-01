import React, { useEffect } from 'react'
import PageTitle from '../../components/other/PageTitle';
import CreateLectureForm from '../../components/CreateLectureForm';
import { useAppContext } from '../../contexts/AppContext';

const CreateLecturePage = () => {
      const { setMenuType } = useAppContext();
    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2">
            <PageTitle
                title="Create New Lecture"
                subtitle=""
            />
            <CreateLectureForm />
        </div>
    )
}

export default CreateLecturePage
