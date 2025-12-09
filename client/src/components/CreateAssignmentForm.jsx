import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";

const CreateAssignmentForm = () => {
    const { backendUrl, courseId } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [assignmentFile, setAssignmentFile] = useState(null);

    // Dropzone for assignment file upload
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        onDrop: (acceptedFiles) => {
            setAssignmentFile(
                Object.assign(acceptedFiles[0], {
                    preview: URL.createObjectURL(acceptedFiles[0]),
                })
            );
        },
    });

    const onSubmit = async (data) => {
        try {
            if (!assignmentFile) {
                toast.error("Please upload the assignment file.");
                return;
            }

            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("dueDate", data.dueDate);
            formData.append("maxMarks", data.maxMarks);
            formData.append("assignmentFile", assignmentFile);
            formData.append("courseId", courseId);

            const response = await axios.post(
                `${backendUrl}/api/assignment/create?courseId=${courseId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );

            if (!response.data.success) {
                toast.error(response.data.message || "Failed to create assignment.");
            } else {
                toast.success("Assignment created successfully!");
                reset();
                setAssignmentFile(null);
            }

            setIsSubmitting(false);
        } catch (error) {
            setIsSubmitting(false);
            toast.error(error.response?.data?.message || "Error creating assignment.");
        }
    };

    // Inside your component, before return
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0]; // format YYYY-MM-DD


    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Assignment Title */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Title</label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        type="text"
                        placeholder="Enter assignment title"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title.message}</p>
                    )}
                </div>

                {/* Max Marks */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Max Marks</label>
                    <input
                        {...register("maxMarks", { required: "Max marks are required", valueAsNumber: true })}
                        type="number"
                        placeholder="e.g. 100"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {errors.maxMarks && (
                        <p className="text-red-500 text-sm">{errors.maxMarks.message}</p>
                    )}
                </div>

                {/* Due Date */}
                {/* Due Date */}
                <div className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                        {...register("dueDate", { required: "Due date is required" })}
                        type="date"
                        min={minDate} // Restrict to tomorrow onwards
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {errors.dueDate && (
                        <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
                    )}
                </div>


                {/* Assignment File */}
                <div className="md:col-span-2">
                    <label className="font-medium text-gray-700 mb-2 block">
                        Assignment File
                    </label>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-gray-50"
                            }`}
                    >
                        <input {...getInputProps()} />
                        {assignmentFile ? (
                            <div className="relative flex flex-col items-center">
                                <p className="text-sm text-gray-600">{assignmentFile.name}</p>
                                <button
                                    type="button"
                                    onClick={() => setAssignmentFile(null)}
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
                        {isSubmitting ? "Creating Assignment" : "Create Assignment"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAssignmentForm;
