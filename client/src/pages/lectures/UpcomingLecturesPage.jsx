import React, { act, useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ComponentLoader from "../../components/ComponentLoader"


const UpcomingLecturesPage = () => {
  const navigate = useNavigate();
  const { backendUrl, userData } = useAppContext();

  const tabs = ["From My Creation", "From Enrollment"];
  const [activeTab, setActiveTab] = useState("From My Creation");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [lecturesFromMyCreation, setLecturesFromMyCreation] = useState([]);
  const [lecturesFromEnrollment, setLecturesFromEnrollment] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${backendUrl}/api/lectures/all`
        );

        if (res.data.success) {
          setLecturesFromMyCreation(res.data.lecturesFromMyCreation || []);
          setLecturesFromEnrollment(res.data.lecturesFromEnrollment || []);
          console.log('lecturesFromMyCreation', lecturesFromMyCreation)
          console.log('lecturesFromEnrollment', lecturesFromEnrollment)
        } else {
          setLecturesFromMyCreation([]);
          setLecturesFromEnrollment([]);
        }
      } catch (err) {
        console.error("Error fetching lectures:", err);
        setLecturesFromMyCreation([]);
        setLecturesFromEnrollment([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [backendUrl]);

  const filteredLectures =
    activeTab === "From My Creation"
      ? lecturesFromMyCreation
      : lecturesFromEnrollment

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
    let lectureStatus = "upcoming";
    if (activeTab === "From My Creation" && status === "upcoming") {
      const haveToStart = now > lectureTime;
      if (haveToStart) {
        lectureStatus = "Start Now"
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

    // Students cannot start upcoming lectures
    if (activeTab === "From Enrollment") {
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



  return (
    <div className="p-4">
      <PageTitle
        title="Upcoming Lectures"
        subtitle="Join and manage live lectures"
      />

      {loading ? <ComponentLoader />
        :
        <>
          <div className="flex gap-4 mb-6">
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
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Start Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="w-full">
                {pageData.length ? (
                  pageData.map((lecture, index) => {
                    return (
                      <tr
                        key={lecture._id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {lecture.course.title}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {lecture.title}
                        </td>
                        <td className="px-4 py-3">
                          {formatDateTime(lecture.scheduledStart)}
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
                        <td className="px-4 py-3">
                          <button
                            disabled={disableButton(lecture)}
                            onClick={() => navigate(`/lecture/live/${lecture._id}`)}
                            className={`px-3 py-2 rounded text-white
    ${disableButton(lecture) ? "cursor-not-allowed opacity-60 bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}
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

export default UpcomingLecturesPage;
