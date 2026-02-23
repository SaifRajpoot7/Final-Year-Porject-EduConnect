import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Added axios import
import { Ban, AlertTriangle, Mail, LogOut } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext'; 
import { Navigate } from 'react-router';
import AccountActivationAppealModal from './AccountActivationAppealModal';

const AccountBlockOrSuspendPage = () => {
    // 1. Get backendUrl from context
    const { userData, logout, backendUrl } = useAppContext();

    // 2. State to store appeal status
    const [appeal, setAppeal] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 3. API Request on Page Load
    useEffect(() => {
        const fetchAppealStatus = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/user/my-appeal`, { 
                    withCredentials: true 
                });
                if (res.data.success) {
                    setAppeal(res.data.appeal);
                }
            } catch (error) {
                console.error("Error fetching appeal status:", error);
            }
        };

        if (backendUrl) {
            fetchAppealStatus();
        }
    }, [backendUrl]);


    if (!userData) return null;

    if (userData.status === 'active') {
        return <Navigate to="/dashboard" />;
    }
    
    const isBlocked = userData.status === 'blocked';
    const isAppealPending = appeal?.status === 'pending';

    // Dynamic Styles & Text based on status
    const theme = {
        color: isBlocked ? 'text-red-600' : 'text-amber-600', // Changed suspended color to amber for better distinction
        bgColor: isBlocked ? 'bg-red-50' : 'bg-amber-50',
        borderColor: isBlocked ? 'border-red-100' : 'border-amber-100',
        icon: isBlocked ? <Ban className="w-12 h-12 text-red-600" /> : <AlertTriangle className="w-12 h-12 text-amber-600" />,
        title: isBlocked ? 'Account Permanently Blocked' : 'Account Suspended',
        description: isBlocked
            ? 'Your account has been permanently restricted due to multiple violations of our terms of service.'
            : 'Your account has been temporarily suspended. You cannot access the dashboard at this time.'
    };

    const openSubmitModal = () => {
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            <div className={`max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden border ${theme.borderColor}`}>

                {/* Header Section */}
                <div className={`p-8 flex flex-col items-center text-center border-b ${theme.borderColor} ${theme.bgColor}`}>
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        {theme.icon}
                    </div>
                    <h1 className={`text-2xl font-bold ${theme.color} mb-2`}>
                        {theme.title}
                    </h1>
                    <p className="text-gray-600">
                        {theme.description}
                    </p>
                </div>

                {/* Reason Section */}
                <div className="p-8 space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Reason for action
                        </h3>
                        <p className="text-gray-800 font-medium">
                            "{userData.statusMessage || "No specific reason provided."}"
                        </p>
                    </div>

                    {/* Show previous appeal rejection note if applicable */}
                    {appeal?.status === 'rejected' && (
                         <div className="bg-red-50 rounded-lg p-3 border border-red-100 text-sm text-red-700 text-center">
                            Your previous appeal was rejected. You may submit a new one if you have additional details.
                         </div>
                    )}

                    <div className="text-sm text-gray-500 text-center">
                        If you believe this was a mistake, you can submit an appeal request to our administration team.
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            disabled={isAppealPending}
                            onClick={() => !isAppealPending && openSubmitModal()}
                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold transition-colors shadow-sm 
                                ${isAppealPending 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-green-600 hover:bg-green-700 cursor-pointer"
                                }`}
                        >
                            <Mail className="w-5 h-5" />
                            {isAppealPending ? "Appeal Under Review" : "Request an Appeal"}
                        </button>

                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer / Help Text */}
            <p className="mt-8 text-sm text-gray-400">
                EduConnect Support &copy; {new Date().getFullYear()}
            </p>

            <AccountActivationAppealModal open={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default AccountBlockOrSuspendPage;