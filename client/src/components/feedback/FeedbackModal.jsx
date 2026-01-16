import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { X, Upload, Star, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexts/AppContext";

const FeedbackModal = ({ open, onClose }) => {
    const { backendUrl } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Custom States for rich features
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    // Reset states when modal opens/closes
    useEffect(() => {
        if (!open) {
            setRating(0);
            setHoverRating(0);
            setSelectedImage(null);
            setPreviewUrl(null);
            reset();
        }
    }, [open, reset]);

    // Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    };

    // Handle Drag & Drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const processFile = (file) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file.");
            return;
        }
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    const onSubmit = async (data) => {
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Use FormData for File Uploads
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.detail);
            formData.append("rating", rating);
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const response = await axios.post(
                `${backendUrl}/api/feedback/submit`, // Adjust endpoint as needed
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            if (response.data.success) {
                toast.success("Thank you for your feedback!");
                onClose();
            } else {
                toast.error(response.data.message || "Failed to submit feedback.");
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Error submitting feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative flex flex-col max-h-[90vh]">

                <div className="flex justify-between items-center shrink-0">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    >
                        <X size={24} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Send Feedback</h2>
                        <p className="text-sm text-gray-500 mb-6">We'd love to hear your thoughts or suggestions.</p>
                    </div>
                </div>
                <div className="overflow-y-auto p-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* 1. Title Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                {...register("title", { required: "Title is required" })}
                                placeholder="Short summary of your feedback"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        {/* 2. Star Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">How would you rate your experience?</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={28}
                                            className={`${star <= (hoverRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                                } transition-colors duration-200`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Detail Textarea */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                            <textarea
                                {...register("detail", { required: "Please provide some details" })}
                                placeholder="Tell us more about your experience..."
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            />
                            {errors.detail && <p className="text-red-500 text-xs mt-1">{errors.detail.message}</p>}
                        </div>

                        {/* 4. Drag & Drop Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>

                            {!previewUrl ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-gray-50
                                    ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-100"}`}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="file-upload"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                            <Upload className="text-blue-500" size={24} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">Click to upload or drag and drop</span>
                                        <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max 5MB)</span>
                                    </label>
                                </div>
                            ) : (
                                // Image Preview Mode
                                <div className="relative border rounded-xl overflow-hidden group">
                                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded-lg text-white font-semibold text-sm shadow-md transition-all
                                ${isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
                                    }`}
                            >
                                {isSubmitting ? "Sending Feedback..." : "Submit Feedback"}
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;