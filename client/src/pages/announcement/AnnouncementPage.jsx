import React, { useEffect } from 'react'
import CreateAssignmentForm from "../../components/CreateAssignmentForm";
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import ChatScreen from '../../components/chat/ChatScreen';

const AnnouncementPage = () => {
    const { setMenuType, setCourseId, userData } = useAppContext();
    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2 max-h-full">
            <ChatScreen />
        </div>
    )
}

export default AnnouncementPage