import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router";
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import ComponentLoader from "../../components/ComponentLoader";


const LectureAttendancePage = () => {
    const navigate = useNavigate();
    const { backendUrl, setMenuType, userData } = useAppContext();
    const { lectureId } = useParams();

    const tabs = ["All", "Present", "Absent"];
    const [activeTab, setActiveTab] = useState("All");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lecture, setLecture] = useState(null);
    const client = useStreamVideoClient();

    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);


    useEffect(() => {
        const fetchAttendance = async () => {
            if (!lectureId) return;
            setLoading(true);

            try {
                const res = await axios.get(
                    `${backendUrl}/api/lectures/${lectureId}/attendance`
                );

                if (res.data.success) {
                    console.log("Lecture Data:", res.data.lecture);
                    setAttendance(res.data.lecture.attendance || []);
                    setLecture(res.data.lecture);
                } else {
                    setAttendance([]);
                }
            } catch (err) {
                console.error("Error fetching attendance:", err);
                setAttendance([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [backendUrl, lectureId]);



    const filteredAttendance =
        activeTab === "All"
            ? attendance
            : attendance.filter((a) => {
                if (activeTab === "Present") return a.present;
                if (activeTab === "Absent") return !a.present;
                return true;
            });

    const startIndex = (page - 1) * limit;
    const pageData = filteredAttendance.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filteredAttendance.length / limit);

    const getStatusBadge = (present) => {
        if (present)
            return "bg-green-100 text-green-700";
        return "bg-red-200 text-red-700";
    };

    const formatDateTime = (date) => {
        if (!date) return "-";
        const d = new Date(date);

        // Format time: 12:20 PM
        const time = d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        // Format date: Sunday, 13 Dec, 2025
        const day = d.toLocaleDateString("en-US", { weekday: "long" });
        const dayNum = d.getDate();
        const month = d.toLocaleDateString("en-US", { month: "short" });
        const year = d.getFullYear();

        return `${time} ${day}, ${dayNum} ${month}, ${year}`;
    };
    if (lecture) {
        const start = new Date(lecture.startsAt).getTime();
        const end = new Date(lecture.endedAt).getTime();
        var totalDuration = end - start;
    }

    return (
        <div className="p-4">
            <PageTitle
                title="Lecture Attendance"
                subtitle={`${lecture ? lecture.title : ""} Attendance`}
            />

            {loading ? <ComponentLoader />
                :
                <>
                    <div className="flex gap-4 mb-6 border-b">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setPage(1);
                                }}
                                className={`pb-2 px-2 font-medium transition ${activeTab === tab
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Lecture Title</th>
                                    <th className="px-4 py-3">Student Name</th>
                                    <th className="px-4 py-3">Student Email</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Joined Time(%age)</th>
                                </tr>
                            </thead>

                            <tbody className="w-full">
                                {pageData.length ? (
                                    pageData.slice(1).map((attendance, index) => {

                                        return (
                                            <tr
                                                key={attendance.student}
                                                className="border-t hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3">
                                                    {startIndex + index + 1}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {lecture.title}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {attendance.student.fullName}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {attendance.student.email}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                                            attendance.present
                                                        )}`}
                                                    >
                                                        {attendance.present ? "PRESENT" : "ABSENT"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-medium">

                                                    {/* Percentage Calculation */}
                                                    {(() => {
                                                        // 2. Calculate Percentage (Prevent division by zero)
                                                        let percentage = 0;
                                                        if (totalDuration > 0) {
                                                            percentage = Math.round((attendance.totalJoinedMs / totalDuration) * 100);
                                                        }

                                                        // 3. Cap at 100% (in case of slight timer mismatches)
                                                        percentage = Math.min(100, percentage);

                                                        // 4. Color Logic
                                                        let colorClass = "text-red-600"; // Default Red (< 50%)
                                                        if (percentage >= 75) colorClass = "text-green-600";
                                                        else if (percentage >= 50) colorClass = "text-yellow-600";

                                                        return (
                                                            <div className={`text-xs mt-0.5 font-bold ${colorClass}`}>
                                                                {percentage}% Participated
                                                            </div>
                                                        );
                                                    })()}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center py-6">
                                            No Attendance Record Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            }

            {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-gray-600">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default LectureAttendancePage;