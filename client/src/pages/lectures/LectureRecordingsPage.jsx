import React, { useState, useEffect } from "react";
import LectureCard from "../../components/LectureCard";
import PageTitle from "../../components/other/PageTitle";
import LectureRecordings from "./LectureRecordings";
import { useParams } from "react-router";
import { useAppContext } from "../../contexts/AppContext";

const LectureRecordingsPage = () => {
    const { lectureId } = useParams()

    const { setMenuType } = useAppContext();
    //Menu
    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);

    return (
        <div className="p-2">
            <PageTitle title="Lecture Recordings" subtitle="Get Lecture Recordings" />
            <LectureRecordings lectureId={lectureId} />
        </div>
    );
};

export default LectureRecordingsPage;
