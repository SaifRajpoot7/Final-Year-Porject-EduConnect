import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexts/AppContext";

const AssignmentSubmitModal = ({ open, onClose, assignmentId }) => {
  const { backendUrl, courseId } = useAppContext();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [assignmentSubmissionFile, setAssignmentSubmissionFile] = useState(null);

  // Dropzone for assignment file upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      setAssignmentSubmissionFile(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      );
    },
  });

  const onSubmit = async (data) => {
    try {
      if (!assignmentSubmissionFile) {
        toast.error("Please upload the assignment file.");
        return;
      }

      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("assignmentSubmissionFile", assignmentSubmissionFile);
      formData.append("assignmentId", assignmentId);

      const response = await axios.post(
        `${backendUrl}/api/assignment/submit?courseId=${courseId}&assignmentId=${assignmentId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Failed to submit assignment.");
      } else {
        toast.success("Assignment submitted successfully!");
        reset();
        setAssignmentSubmissionFile(null);
      }

      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || "Error submiting assignment.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Submit Assignment</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <label className="font-medium text-gray-700 mb-2 block">
              Assignment File
            </label>

            {/* Assignment Submission File */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
                }`}
            >
              <input {...getInputProps()} />
              {assignmentSubmissionFile ? (
                <div className="relative flex flex-col items-center">
                  <p className="text-sm text-gray-600">{assignmentSubmissionFile.name}</p>
                  <button
                    type="button"
                    onClick={() => setAssignmentSubmissionFile(null)}
                    className="absolute top-1 right-1 rounded-full cursor-pointer text-gray-500 hover:text-gray-600"
                  >
                    <Trash2 />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">
                  Drag & drop the assignment file here, or click to upload
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submiting.." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentSubmitModal;
