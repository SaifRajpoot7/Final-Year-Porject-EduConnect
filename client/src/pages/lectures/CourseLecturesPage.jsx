import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router";
import LoaderComponent from "../../components/FullPageLoaderComponent"
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { toast } from "react-toastify";
import ComponentLoader from "../../components/ComponentLoader";


const CourseLecturesPage = () => {
  const navigate = useNavigate();
  const { backendUrl, courseId, setMenuType, userData } = useAppContext();

  const tabs = ["All", "Upcoming", "Live", "Ended"];
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const client = useStreamVideoClient();

  useEffect(() => {
    setMenuType("course");
    return () => setMenuType("general");
  }, [setMenuType]);


  useEffect(() => {
    const fetchLectures = async () => {
      if (!courseId) return;
      setLoading(true);

      try {
        const res = await axios.get(
          `${backendUrl}/api/lectures/course/${courseId}?courseId=${courseId}`
        );

        if (res.data.success) {
          setLectures(res.data.lectures || []);
          setIsAdmin(res.data.isCourseAdmin);
        } else {
          setLectures([]);
        }
      } catch (err) {
        console.error("Error fetching lectures:", err);
        setLectures([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [backendUrl, courseId]);


  const createLecture = async (lecture) => {
    try {
      const call = await client.call('default', lecture._id);
      if (!call) throw new Error('Failed to create meeting');
      const startsAt = new Date(Date.now()).toISOString();
      // values.dateTime.toISOString() || 
      const title = lecture.title;
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            title,
          },
        },
      });
      // setCallDetail(call);
      if (!call) {
        console.log('gg')
      }
      navigate(`/lecture/live/${call.id}`);

      // toast.success('Meeting Created');
    } catch (error) {
      console.error(error);
      // toast.error('Failed to create Meeting');
    }
  };

  const filteredLectures =
    activeTab === "All"
      ? lectures
      : lectures.filter((l) => {
        if (activeTab === "Upcoming") return l.status === "upcoming";
        if (activeTab === "Live") return l.status === "live";
        if (activeTab === "Ended") return l.status === "ended";
        return true;
      });

  const startIndex = (page - 1) * limit;
  const pageData = filteredLectures.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredLectures.length / limit);

  const getStatusBadge = (status) => {
    if (status === "live")
      return "bg-green-100 text-green-700";
    if (status === "ended")
      return "bg-gray-200 text-gray-700";
    if (status === "missed")
      return "bg-red-200 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  const canJoinLecture = (lecture) => lecture.status === "live";

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

  const lectureStartStatus = (status, time) => {
    const now = Date.now();
    const lectureTime = new Date(time).getTime();
    let lectureStatus = status;
    if (isAdmin && status === "upcoming") {
      const haveToStart = now > lectureTime;
      if (haveToStart) {
        lectureStatus = "Start"
      }
    }
    if (status === "live") {
      lectureStatus = "Join";
    }
    return lectureStatus;
  }

  const disableButton = (lecture) => {
    const now = Date.now();
    const lectureTime = new Date(lecture.scheduledStart).getTime();
    const haveToStart = now > lectureTime;

    if (!haveToStart) {
      return true;
    }
    // Students cannot start upcoming lectures
    if (!isAdmin) {
      if (lecture.status === "upcoming") {
        return true;
      }
    }

    // Ended or missed lectures should always be disabled
    if (lecture.status === "ended" || lecture.status === "missed") {
      return true;
    }

    return false;
  };
  const disableButton2 = (lecture) => {

    if (lecture.status !== "ended") {
      return true;
    }

    return false;
  };
  return (
    <div className="p-4">
      <PageTitle
        title="Lectures"
        subtitle="Join and manage live lectures"
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
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Start Time</th>
                  <th className="px-4 py-3">End Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3">Recordings</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="w-full">
                {pageData.length ? (
                  pageData.map((lecture, index) => {
                    // 1. Find the specific attendance record for the CURRENT user
                    const userAttendance = lecture.attendance?.find(
                      (a) => a.student === userData?._id
                    );

                    // 2. Determine if they were present
                    const isPresent = userAttendance?.present;

                    return (
                      <tr
                        key={lecture._id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {lecture.title}
                        </td>
                        <td className="px-4 py-3">
                          {formatDateTime(lecture.scheduledStart)}
                        </td>
                        <td className="px-4 py-3">
                          {formatDateTime(lecture.scheduledEnd)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                              lecture.status
                            )}`}
                          >
                            {lecture.status.toUpperCase()}
                          </span>
                        </td>

                        {!isAdmin && (
                          <td className="px-4 py-3">
                            {lecture.status === "ended" ? (
                              // If lecture is ended, show status
                              isPresent ? (
                                <span className="text-green-600 font-medium">Present</span>
                              ) : (
                                <span className="text-red-600 font-medium">Absent</span>
                              )
                            ) : (
                              // If lecture is NOT ended (upcoming/live), show dash
                              <span className="text-gray-400 font-medium">-</span>
                            )}
                          </td>
                        )}

                        {isAdmin && (
                          <td className="px-4 py-3">
                            <button
                              disabled={disableButton2(lecture)}
                              onClick={() => navigate(`${lecture._id}/attendance`)}
                              className={`px-3 py-2 rounded capitalize bg-blue-500 hover:bg-blue-600 text-white ${disableButton2(lecture)
                                ? "cursor-not-allowed opacity-60 bg-gray-500 hover:bg-gray-600 text-white" : ""}`}
                            >
                              View
                            </button>

                          </td>
                        )}
                        <td className="px-4 py-3">
                          <button
                            disabled={disableButton2(lecture)}
                            onClick={() => navigate(`${lecture._id}/recordings`)}
                            className={`px-3 py-2 rounded capitalize bg-blue-500 hover:bg-blue-600 text-white ${disableButton2(lecture)
                              ? "cursor-not-allowed opacity-60 bg-gray-500 hover:bg-gray-600 text-white" : ""}`}
                          >
                            View
                          </button>

                        </td>

                        <td className="px-4 py-3">
                          <button
                            disabled={disableButton(lecture)}
                            onClick={() => navigate(`/lecture/live/${lecture._id}`)}
                            className={`px-3 py-2 rounded capitalize 
  ${lecture.status === 'missed'
                                ? "cursor-not-allowed bg-red-300 text-red-700 font-semibold" // Missed Style
                                : disableButton(lecture)
                                  ? "cursor-not-allowed opacity-60 bg-gray-500 text-white" // Disabled (Upcoming/Ended) Style
                                  : "bg-blue-500 hover:bg-blue-600 text-white" // Active (Join/Start) Style
                              }
`}
                          >
                            {lectureStartStatus(lecture.status, lecture.scheduledStart)}
                          </button>

                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-6">
                      No lectures found
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

export default CourseLecturesPage;
