import React, { useEffect } from 'react'
import PageTitle from '../../components/other/PageTitle';
import { useParams } from 'react-router';
import { useAppContext } from '../../contexts/AppContext';
import DiscussionScreen from './DiscussionScreen';

const DiscussionBoardPage = () => {
    const { setMenuType } = useAppContext();
    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);
    return (
        <div className="p-2">
            <DiscussionScreen />
        </div>
    )
}

export default DiscussionBoardPage