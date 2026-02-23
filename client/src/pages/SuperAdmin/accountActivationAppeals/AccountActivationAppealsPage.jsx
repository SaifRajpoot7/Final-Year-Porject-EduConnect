import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../../components/other/PageTitle";
import { useAppContext } from "../../../contexts/AppContext";
import ComponentLoader from "../../../components/ComponentLoader";
import ActivationAppealViewerModal from "./ActivationAppealViewerModal";
import { toast } from "react-toastify";

const AccountActivationAppealsPage = () => {
    const { backendUrl } = useAppContext();

    const tabs = ["All", "Pending", "Rejected"];
    const [activeTab, setActiveTab] = useState("All");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [appeals, setAppeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // NEW: Track which appeal is currently being processed to show loader on button
    const [processingId, setProcessingId] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedAppeal, setSelectedAppeal] = useState(null);

    useEffect(() => {
        const fetchAppeals = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${backendUrl}/api/super-admin/appeals`, { withCredentials: true });
                if (res.data.success) {
                    setAppeals(res.data.appeals);
                } else {
                    setAppeals([]);
                }
            } catch (error) {
                console.error("Error fetching appeals:", error);
                setAppeals([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAppeals();
    }, [backendUrl]);

    const filteredAppeals =
        activeTab === "All"
            ? appeals
            : appeals.filter((a) => {
                if (activeTab === "Pending") return a.status === "pending";
                if (activeTab === "Rejected") return a.status === "rejected";
                return true;
            });

    const startIndex = (page - 1) * limit;
    const pageData = filteredAppeals.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(filteredAppeals.length / limit);

    const getStatusBadge = (status) => {
        if (status === "pending") return "bg-blue-100 text-blue-700";
        if (status === "approved") return "bg-green-100 text-green-700"; // Added approved case
        if (status === "rejected") return "bg-red-500 text-white"; // Changed text color for readability
        return "bg-gray-100 text-gray-700";
    };

    const openSubmitModal = (appeal) => {
        setSelectedAppeal(appeal);
        setShowModal(true);
    };

    // --- CORRECTED FUNCTION ---
    const resolveAppeal = async (appealId, action) => {
        // 1. Set specific processing ID instead of global loading
        setProcessingId(appealId);

        try {
            const apiData = { appealId, action };

            const res = await axios.post(
                `${backendUrl}/api/super-admin/resolve-appeal`,
                apiData,
                { withCredentials: true }
            );

            if (!res.data.success) {
                toast.error(res.data.message || "Failed to update appeal.");
            } else {
                toast.success(`Appeal ${action}ed successfully!`);

                // 2. Optimistically update the UI (No need to refetch)
                setAppeals((prev) => prev.map((item) => {
                    if (item._id === appealId) {
                        return { ...item, status: action === 'approve' ? 'approved' : 'rejected' };
                    }
                    return item;
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating appeal status.");
        } finally {
            // 3. Clear processing ID
            setProcessingId(null);
        }
    };

    return (
        <div className="p-4">
            <PageTitle title="Account Activation Appeals" />
            {loading ? <ComponentLoader /> : (
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
                                    <th className="px-4 py-3">Appeal</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData.length > 0 ? (
                                    pageData.map((appeal, index) => {
                                        // Check if this specific row is loading
                                        const isProcessing = processingId === appeal._id;

                                        return (
                                            <tr key={index} className={`border-t hover:bg-gray-100 transition`}>
                                                <td className="px-4 py-3">{startIndex + index + 1}</td>
                                                <td className="px-4 py-3">{appeal.userId?.fullName ?? "-"}</td>
                                                <td className="px-4 py-3">{appeal.userId?.email ?? "-"}</td>
                                                <td
                                                    onClick={() => openSubmitModal(appeal)}
                                                    className="px-4 py-3 underline text-blue-500 cursor-pointer hover:text-blue-700"
                                                >
                                                    View
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(appeal.status)}`}>
                                                        {appeal.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 flex gap-2">
                                                    {appeal.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => resolveAppeal(appeal._id, "approve")}
                                                                disabled={isProcessing}
                                                                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-xs transition-all 
                                                                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                            >
                                                                {isProcessing ? '...' : 'Approve'}
                                                            </button>
                                                            <button
                                                                onClick={() => resolveAppeal(appeal._id, "reject")}
                                                                disabled={isProcessing}
                                                                className={`bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-2 rounded text-xs transition-all
                                                                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                            >
                                                                {isProcessing ? '...' : 'Reject'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">Resolved</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500">No Appeal found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className={`px-4 py-2 rounded-lg border ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Previous</button>
                    <span className="text-gray-600">Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className={`px-4 py-2 rounded-lg border ${page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Next</button>
                </div>
            )}

            <ActivationAppealViewerModal open={showModal} onClose={() => setShowModal(false)} appeal={selectedAppeal} />
        </div>
    );
};

export default AccountActivationAppealsPage;