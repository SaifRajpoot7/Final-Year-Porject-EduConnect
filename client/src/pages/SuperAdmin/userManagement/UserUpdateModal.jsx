import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../../contexts/AppContext";

const UserUpdateModal = ({ open, onClose, userId, userSuspensionCount, userStatus, nextApiAction, visualLabel }) => {
    const { backendUrl } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const apiData = {
                userId: userId,
                reason: data.suspensionReason,
                action: nextApiAction
            }
            setIsSubmitting(true);

            const response = await axios.post(
                `${backendUrl}/api/super-admin/change-user-status`,
                apiData,
                { withCredentials: true }
            );

            if (!response.data.success) {
                toast.error(response.data.message || "Failed to update user status.");
            } else {
                toast.success("User status updated successfully!");
                reset();
            }

            setIsSubmitting(false);
            onClose(); // close modal on success
        } catch (error) {
            setIsSubmitting(false);
            toast.error(error.response?.data?.message || "Error updating user status.");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={22} />
                </button>

                <h2 className="text-xl font-semibold mb-4">{visualLabel} User</h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                    {/* Suspension/Blocking Message */}
                    {nextApiAction !== "activate" && (
                        <div className="md:col-span-2">
                        <label className="font-medium text-gray-700 mb-2 block">{nextApiAction == "suspend" ? "Suspension" : "Blocking"} Reason</label>
                            <textarea
                                {...register("suspensionReason", { required: "Suspension/Blocking Reason is required" })}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                            />
                            {errors.suspensionReason && (
                                <p className="text-red-500 text-sm mt-1">{errors.suspensionReason.message}</p>
                            )}
                        </div>
                    )}

                    {/* Submit */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className={` text-white font-medium px-6 py-2 rounded-lg shadow-md transition cursor-pointer ${nextApiAction === "activate" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
                            disabled={isSubmitting}
                        >
                            {/* {userSuspensionCount < 5
                                ? (isSubmitting ? "Suspending..." : "Suspend")
                                : (isSubmitting ? "Blocking..." : "Block")
                            } */}
                            {`${visualLabel}${isSubmitting ? "ing..." : ""}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserUpdateModal;
