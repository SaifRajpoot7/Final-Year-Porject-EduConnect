import React, { useEffect } from 'react'
import CreateAssignmentForm from "../../components/CreateAssignmentForm";
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import AnnouncementScreen from './AnnouncementScreen';

const AnnouncementPage = () => {
    const { setMenuType, setCourseId, userData } = useAppContext();
    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2">
            <AnnouncementScreen />
        </div>
    )
}

export default AnnouncementPage