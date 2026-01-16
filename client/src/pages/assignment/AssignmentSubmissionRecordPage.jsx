import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";
import { useParams } from "react-router";
import AssignmentSubmissionUpdateModal from "./AssignmentSubmissionUpdateModal";

const AssignmentSubmissionRecordPage = () => {
  const { setMenuType, setCourseId, backendUrl, courseId } = useAppContext();
  const { assignmentId } = useParams();


  const tabs = ["All", "Pending Result", "Graded"];
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [assignmentsSubmissions, setAssignmentsSubmissions] = useState([]);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [assignmentSubmissionUpdateModal, setAssignmentSubmissionUpdateModal] = useState(null);
  const [modalMaxMarks, setModalMaxMarks] = useState(null);

  useEffect(() => {
    const fetchAssignmentsSubmissions = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/assignment/all/${assignmentId}?courseId=${courseId}`);
        if (res.data.success) {
          setAssignmentsSubmissions(res.data.submissions || []);
        } else {
          setAssignmentsSubmissions([]);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setAssignmentsSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignmentsSubmissions();
  }, [backendUrl, courseId]);

  const filteredAssignmentsSubmissions =
    activeTab === "All"
      ? assignmentsSubmissions
      : assignmentsSubmissions.filter((a) => {
        if (activeTab === "Pending Result") return !a.result;
        if (activeTab === "Graded") return a.result != null;
        return true;
      });

  const startIndex = (page - 1) * limit;
  const pageData = filteredAssignmentsSubmissions.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredAssignmentsSubmissions.length / limit);

  useEffect(() => {
    setMenuType("course");
    return () => setMenuType("general");
  }, [setMenuType]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()}`;
  };

  const openSubmissionUpdateModal = (submissionId, maxMarks) => {
    setAssignmentSubmissionUpdateModal(submissionId);
    setModalMaxMarks(maxMarks);
    setShowModal(true);
  };
  return (
    <div className="p-4">
      <PageTitle title="Assignment Submissions" subtitle="Manage and track assignments submissions" />
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
                className={`pb-2 px-2 font-medium transition ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm capitalize">
                <tr>
                  <th className="px-4 py-3">Sr</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Assignment File</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Total Marks</th>
                  <th className="px-4 py-3">Submission</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">Feedback</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ?
                  (
                    pageData.map((assignment, index) => {
                      const isDuePassed = assignment.dueDate ? new Date() > new Date(assignment.dueDate) : false;
                      const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "-"
                      const submitDate = assignment.submissionDate ? new Date(assignment.submissionDate).toLocaleDateString() : "-"

                      return (
                        <tr key={index} className="border-t hover:bg-gray-50 transition">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">{assignment.studentName}</td>
                          <td className="px-4 py-3">{assignment.title ?? "-"}</td>
                          <td className="px-4 py-3">
                            {assignment.assignmentFile && assignment.assignmentFile ? (
                              <a
                                href={assignment.assignmentFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Assignment File
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-red-500">{dueDate ?? "-"}</td>
                          <td className="px-4 py-3">{assignment.maxMarks ?? "-"}</td>
                          <td className="px-4 py-3">
                            {assignment.submissionFile ? (
                              <a
                                href={assignment.submissionFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                Submission File
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td className="px-4 py-3">{submitDate ?? "-"}</td>

                          <td className="px-4 py-3">{assignment.result ?? "-"}</td>
                          <td className="px-4 py-3">{assignment.feedback ?? "-"}</td>
                          <td className="px-4 py-3">
                            <button
                              disabled={!isDuePassed || assignment.result}
                              onClick={() => (isDuePassed & assignment.result) && openSubmissionUpdateModal(assignment.submissionId, assignment.maxMarks)}
                              className={`font-bold py-2 px-3 rounded ${!isDuePassed || assignment.result
                                ? "bg-gray-300 text-gray-500 text-xs cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                                }`}
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-6 text-gray-500">No assignments found</td>
                    </tr>
                  )}
              </tbody>
            </table>

          </div>
        </>}

      {
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className={`px-4 py-2 rounded-lg border ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Previous</button>
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className={`px-4 py-2 rounded-lg border ${page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Next</button>
          </div>
        )
      }

      <AssignmentSubmissionUpdateModal open={showModal} onClose={() => setShowModal(false)} submissionId={assignmentSubmissionUpdateModal} maxMarks={modalMaxMarks} />
    </div>
  );
};

export default AssignmentSubmissionRecordPage;
