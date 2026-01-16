import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useParams } from "react-router";
import AssignmentSubmitModal from "../assignment/AssignmentSubmitModal"
import QuizSubmissionModal from "./QuizSubmissionModal";
import ComponentLoader from "../../components/ComponentLoader";

const CourseAllQuizzesPage = () => {
    const navigate = useNavigate()
    const { setMenuType, backendUrl, courseId } = useAppContext();

    const tabs = ["All", "Pending Submission", "Graded"];
    const [activeTab, setActiveTab] = useState("All");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [quizzes, setQuizzes] = useState([]);
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!courseId) return;
            setLoading(true);
            try {
                const res = await axios.get(`${backendUrl}/api/quiz/all/course?courseId=${courseId}`);
                if (res.data.success) {
                    setQuizzes(res.data.values || []);
                    setTitles(res.data.titles);
                    setIsAdmin(res.data.isCourseAdmin);
                } else {
                    setQuizzes([]);
                }
            } catch (error) {
                console.error("Error fetching Quizzes:", error);
                setQuizzes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [backendUrl, courseId]);

    const filteredQuizzes =
        activeTab === "All"
            ? quizzes
            : quizzes.filter((a) => {
                if (activeTab === "Pending Submission") return !a.result;
                if (activeTab === "Graded") return a.result != null;
                return true;
            });

    const startIndex = (page - 1) * limit;
    const pageData = filteredQuizzes.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filteredQuizzes.length / limit);

    useEffect(() => {
        setMenuType("course");
        return () => setMenuType("general");
    }, [setMenuType]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return `${date.toLocaleDateString()}`;
    };

    const openSubmitModal = (assignmentId) => {
        setSelectedCourseId(courseId)
        setSelectedQuizId(assignmentId);
        setShowModal(true);
    };
    return (
        <div className="p-4 ">
            <PageTitle title="Quiz" subtitle="Manage and track Quiz" />
            {loading ? <ComponentLoader />
                :
                <>
                    {!isAdmin && (
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
                    )}

                    <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 text-sm capitalize">
                                <tr>
                                    {titles && titles.length > 0 ? (
                                        titles.map((title, idx) => <th key={idx} className="px-4 py-3">{title}</th>)
                                    ) : (
                                        <th className="px-4 py-3">Quizzes</th>
                                    )}
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.length > 0 ?
                                    (
                                        pageData.map((quiz, index) => {
                                            const isDuePassed = quiz.dueDate ? new Date() > new Date(quiz.dueDate) : false;
                                            const dueDate = quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : "-"
                                            const submitDate = quiz.submissionDate ? new Date(quiz.submissionDate).toLocaleDateString() : "-"

                                            return (
                                                <tr key={index} className="border-t hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3">{quiz.Sr ?? "-"}</td>
                                                    <td className="px-4 py-3">{quiz.title ?? "-"}</td>
                                                    <td className="px-4 py-3 text-red-500">{dueDate ?? "-"}</td>
                                                    <td className="px-4 py-3">{quiz.maxMarks ?? "-"}</td>
                                                    {isAdmin && (
                                                        <td className="px-4 py-3">{quiz.totalSubmissions ?? "-"}</td>
                                                    )}
                                                    {!isAdmin && (
                                                        <>
                                                            <td className="px-4 py-3">{submitDate ?? "-"}</td>
                                                            <td className="px-4 py-3">{quiz.result ?? "-"}</td>
                                                        </>
                                                    )}
                                                    {!isAdmin && (
                                                        <td className="px-4 py-3">
                                                            {/* <button
                            disabled={isDuePassed}
                            onClick={() => !isDuePassed && openSubmitModal(quiz._id)}
                            className={`font-bold py-2 px-3 rounded ${isDuePassed
                              ? "bg-gray-300 text-gray-500 text-xs cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                              }`}
                          >
                            {isDuePassed ? "Due Passed" : "Attempt"}
                          </button> */}
                                                            <button
                                                                disabled={isDuePassed || quiz?.result}
                                                                onClick={() => {
                                                                    setSelectedQuestions(quiz.questions)
                                                                    !isDuePassed && !quiz?.result && openSubmitModal(quiz._id)
                                                                }
                                                                }
                                                                className={`font-bold py-2 px-3 rounded ${isDuePassed
                                                                    ? "bg-gray-300 text-gray-500 text-xs cursor-not-allowed"
                                                                    : quiz?.result
                                                                        ? "bg-green-500 text-white cursor-not-allowed"
                                                                        : "bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
                                                                    }`}>
                                                                {isDuePassed
                                                                    ? "Due Passed"
                                                                    : quiz?.result
                                                                        ? "Attempted"
                                                                        : "Attempt"}
                                                            </button>

                                                        </td>
                                                    )}

                                                    {isAdmin && (
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() => navigate(`${quiz._id}`)}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded cursor-pointer">
                                                                View Details
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center py-6 text-gray-500">No quizzes found</td>
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

            <QuizSubmissionModal open={showModal} onClose={() => setShowModal(false)} quizId={selectedQuizId} questions={selectedQuestions} courseId={selectedCourseId} />
        </div >
    );
};

export default CourseAllQuizzesPage;