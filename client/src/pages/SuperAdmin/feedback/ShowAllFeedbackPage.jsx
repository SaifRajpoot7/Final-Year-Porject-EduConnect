import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../../components/other/PageTitle";
import { useAppContext } from "../../../contexts/AppContext";
import ComponentLoader from "../../../components/ComponentLoader";
import FeedbackViewModal from "./FeedbackViewModal";

const ShowAllFeedbackPage = () => {
    const { backendUrl } = useAppContext();

    const tabs = ["All", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"];
    const [activeTab, setActiveTab] = useState("All");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedbackTitle, setSelectedFeedbackTitle] = useState(null);
    const [selectedFeedbackRating, setSelectedFeedbackRating] = useState(null);
    const [selectedFeedbackDescription, setSelectedFeedbackDescription] = useState(null);
    const [selectedFeedbackImageUrl, setSelectedFeedbackImageUrl] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${backendUrl}/api/feedback/get-all`);
                if (res.data.success) {
                    setFeedbacks(res.data.feedbacks);
                    console.log("Fetched feedbacks:", res.data.feedbacks);
                } else {
                    setFeedbacks([]);
                }
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
                setFeedbacks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [backendUrl]);

    const filteredFeedbacks =
        activeTab === "All"
            ? feedbacks
            : feedbacks.filter((a) => {
                if (activeTab === "5 Stars") return a.rating === 5;
                if (activeTab === "4 Stars") return a.rating === 4;
                if (activeTab === "3 Stars") return a.rating === 3;
                if (activeTab === "2 Stars") return a.rating === 2;
                if (activeTab === "1 Star") return a.rating === 1;
                return true;
            });

    const startIndex = (page - 1) * limit;
    const pageData = filteredFeedbacks.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filteredFeedbacks.length / limit);

    //   const getStatusBadge = (status) => {
    //     if (status === "active")
    //       return "bg-green-100 text-green-700";
    //     if (status === "suspended")
    //       return "bg-red-500 text-red-200";
    //     if (status === "blocked")
    //       return "bg-red-500 text-red-200";
    //     return "bg-green-100 text-green-700";
    //   };

    const openFeedbackViewModal = (feedbackTitle, feedbackRating, feedbackDescription, feedbackImage) => {
        setSelectedFeedbackTitle(feedbackTitle);
        setSelectedFeedbackRating(feedbackRating);
        setSelectedFeedbackDescription(feedbackDescription);
        setSelectedFeedbackImageUrl(feedbackImage);
        setShowModal(true);
    };
    return (
        <div className="p-4">
            <PageTitle title="User Feedbacks" />
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
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">User Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Star Rating</th>
                                    <th className="px-4 py-3">Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.length > 0 ?
                                    (
                                        pageData.map((feedback, index) => {

                                            return (
                                                <tr key={index} className={`border-t hover:bg-gray-100 transition`}>
                                                    <td className="px-4 py-3">{index + 1}</td>
                                                    <td className="px-4 py-3">{feedback.userId.fullName ?? "-"}</td>
                                                    <td className="px-4 py-3">{feedback.userId.email ?? "-"}</td>
                                                    <td className="px-4 py-3">{feedback.rating ?? "-"}</td>

                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => openFeedbackViewModal(feedback.title, feedback.rating, feedback.description, feedback.imageUrl)}
                                                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded cursor-pointer">
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center py-6 text-gray-500">No User found</td>
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

            <FeedbackViewModal open={showModal} onClose={() => setShowModal(false)} title={selectedFeedbackTitle} description={selectedFeedbackDescription} rating={selectedFeedbackRating} imageUrl={selectedFeedbackImageUrl} />
        </div >
    );
};

export default ShowAllFeedbackPage;
