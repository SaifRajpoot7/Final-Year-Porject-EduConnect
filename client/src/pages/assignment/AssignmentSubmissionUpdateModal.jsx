import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexts/AppContext";

const AssignmentSubmissionUpdateModal = ({ open, onClose, submissionId, maxMarks }) => {
  const { backendUrl, courseId } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const obtainedMarks = Number(data.obtainedMarks);
      if (obtainedMarks > maxMarks) {
        toast.error(`Obtained marks cannot exceed max marks (${maxMarks}).`);
        return;
      }

      setIsSubmitting(true);

      const response = await axios.patch(
        `${backendUrl}/api/assignment/grade/${submissionId}?courseId=${courseId}`,
        {
          marksObtained: obtainedMarks,
          feedback: data.feedback,
        },
        { withCredentials: true }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to update submission.");
      } else {
        toast.success("Submission updated successfully!");
        reset();
      }

      setIsSubmitting(false);
      onClose(); // close modal on success
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || "Error updating submission.");
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

        <h2 className="text-xl font-semibold mb-4">Update Submission</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Obtained Marks */}
          <div className="md:col-span-2">
            <label className="font-medium text-gray-700 mb-2 block">
              Obtained Marks (Max: {maxMarks})
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={maxMarks}
              {...register("obtainedMarks", {
                required: "Obtained marks are required",
                max: { value: maxMarks, message: `Cannot exceed ${maxMarks}` },
              })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.obtainedMarks && (
              <p className="text-red-500 text-sm mt-1">
                {errors.obtainedMarks.message}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div className="md:col-span-2">
            <label className="font-medium text-gray-700 mb-2 block">Feedback</label>
            <textarea
              {...register("feedback", { required: "Feedback is required" })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            {errors.feedback && (
              <p className="text-red-500 text-sm mt-1">{errors.feedback.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentSubmissionUpdateModal;
