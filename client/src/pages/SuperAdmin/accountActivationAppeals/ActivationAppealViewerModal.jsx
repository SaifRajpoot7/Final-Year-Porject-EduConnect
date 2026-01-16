// import React, { useState } from "react";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { X } from "lucide-react";
// import { toast } from "react-toastify";
// import { useAppContext } from "../../contexts/AppContext";

// const ActivationAppealViewerModal = ({ open, onClose }) => {
//     const { backendUrl } = useAppContext();
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset,
//     } = useForm();

//     const onSubmit = async (data) => {
//         try {
//             const apiData = {
//                 message: data.appealReason
//             }
//             console.log(apiData)
//             setIsSubmitting(true);

//             const response = await axios.post(
//                 `${backendUrl}/api/user/appeal-account-activation`,
//                 apiData,
//                 { withCredentials: true }
//             );

//             if (!response.data.success) {
//                 toast.error(response.data.message || "Failed to appeal account activation.");
//             } else {
//                 toast.success("Appeal submitted successfully!");
//                 reset();
//             }

//             setIsSubmitting(false);
//             onClose(); // close modal on success
//         } catch (error) {
//             setIsSubmitting(false);
//             toast.error(error.response?.data?.message || "Error appealing account activation.");
//         }
//     };

//     if (!open) return null;

//     return (
//         <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50 p-4">
//             <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative">
//                 <button
//                     onClick={onClose}
//                     className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
//                 >
//                     <X size={22} />
//                 </button>

//                 <h2 className="text-xl font-semibold mb-4">Account Activation Appeal</h2>
//                 <form
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="grid grid-cols-1 md:grid-cols-2 gap-6"
//                 >

//                     {/* Account Activation Appeal */}
//                     <div className="md:col-span-2">
//                         <label className="font-medium text-gray-700 mb-2 block">Reason for Appeal</label>
//                         <textarea
//                             {...register("appealReason", { required: "Appeal Reason is required" })}
//                             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 rows={4}
//                             />
//                             {errors.appealReason && (
//                                 <p className="text-red-500 text-sm mt-1">{errors.appealReason.message}</p>
//                             )}
//                         </div>

//                     {/* Submit */}
//                     <div className="md:col-span-2 flex justify-end">
//                         <button
//                             type="submit"
//                             className={` text-white font-medium px-6 py-2 rounded-lg shadow-md transition cursor-pointer bg-green-500 hover:bg-green-600`}
//                             disabled={isSubmitting}
//                         >
//                             {/* {userSuspensionCount < 5
//                                 ? (isSubmitting ? "Suspending..." : "Suspend")
//                                 : (isSubmitting ? "Blocking..." : "Block")
//                             } */}
//                             Appeal{`${isSubmitting ? "ing..." : ""}`}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ActivationAppealViewerModal;

import React from "react";
import { X, Calendar, Clock } from "lucide-react";

const ActivationAppealViewerModal = ({ open, onClose, appeal }) => {
    
    if (!open) return null;

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-fadeIn">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X size={22} />
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-4">
                    Appeal Details
                </h2>

                <div className="space-y-6">
                    
                    {/* Appeal Message Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            User Statement
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                {appeal?.message || "No message content available."}
                            </p>
                        </div>
                    </div>

                    {/* Metadata Section (Date & Status) */}
                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>Submitted on {formatDate(appeal?.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${appeal?.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                  appeal?.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                  'bg-amber-100 text-amber-700'}`}>
                                {appeal?.status || "Pending"}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Close/Action Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ActivationAppealViewerModal;