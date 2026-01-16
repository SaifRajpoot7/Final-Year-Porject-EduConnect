import React from "react";
import { X, Star, Image as ImageIcon } from "lucide-react";

const FeedbackViewModal = ({ open, onClose, title, description, rating, imageUrl }) => {
    
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            
            {/* Modal Container - constrained height for scrolling */}
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[85vh]">
                
                {/* 1. Fixed Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Feedback Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* 2. Scrollable Content Body */}
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-6">
                        
                        {/* Title & Rating Section */}
                        <div>
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={20}
                                        className={`${
                                            star <= rating 
                                                ? "fill-yellow-400 text-yellow-400" 
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                                <span className="ml-2 text-sm text-gray-500 font-medium">
                                    ({rating}/5)
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 leading-snug">
                                {title || "No Title Provided"}
                            </h3>
                        </div>

                        {/* Description Section */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Description
                            </h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {description || "No description available."}
                            </p>
                        </div>

                        {/* Image Attachment Section */}
                        {imageUrl ? (
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <ImageIcon size={14} /> Attachment
                                </h4>
                                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                    <img 
                                        src={imageUrl} 
                                        alt="Feedback Attachment" 
                                        className="w-full h-auto object-contain max-h-64 bg-gray-50"
                                    />
                                </div>
                            </div>
                        ) : (
                             <div className="text-sm text-gray-400 italic flex items-center gap-2">
                                <ImageIcon size={16} /> No image attached
                             </div>
                        )}

                    </div>
                </div>

                {/* 3. Fixed Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FeedbackViewModal;