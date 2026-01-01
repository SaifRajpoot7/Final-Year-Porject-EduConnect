import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";
import FormSubmitOverlay from "./FormSubmitOverlay";

const CreateCourseForm = () => {
  const { backendUrl } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailType, setThumbnailType] = useState("courseImage"); // "courseImage" | "placeholder"

  // Dropzone for drag & drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setThumbnail(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      );
    },
  });

  const onSubmit = async (data) => {
    try {

      setIsSubmitting(true)
      const formData = new FormData();

      // Add basic fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("thumbnailType", thumbnailType);

      // Add thumbnail or placeholder
      if (thumbnailType === "courseImage") {
        if (!thumbnail) {
          alert("Please upload a course thumbnail image.");
          return;
        }
        formData.append("courseImage", thumbnail); // thumbnail should be a File object
      } else {
        formData.append("placeholderTitle", data.placeholderTitle);
      }
      // API Request
      const response = await axios.post(`${backendUrl}/api/course/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );


      if (!response.data.success) {
        toast.error(response.data.message || "Failed to create course.");
      }
      setIsSubmitting(false);
      reset();
      setThumbnail(null);
      toast.success("Course created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating course.");
    }
  };


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
      >
        <FormSubmitOverlay isSubmitting={isSubmitting} text="Creating Course" />
        {/* Course Title */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-medium text-gray-700 mb-1">Course Title</label>
          <input
            {...register("title", { required: "Course title is required" })}
            type="text"
            placeholder="Enter course title"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-medium text-gray-700 mb-1">
            Short Description
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Write a short description..."
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Thumbnail Input Type Toggle */}
        <div className="md:col-span-2">
          <label className="font-medium text-gray-700 mb-2 block">
            Course Thumbnail
          </label>

          <div className="flex items-center gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="courseImageUpload"
                checked={thumbnailType === "courseImage"}
                onChange={() => setThumbnailType("courseImage")}
              />
              Upload Image
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="placeholder"
                checked={thumbnailType === "placeholder"}
                onChange={() => setThumbnailType("placeholder")}
              />
              Placeholder Title
            </label>
          </div>

          {/* Conditional Rendering */}
          {thumbnailType === "courseImage" ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
                }`}
            >
              <input {...getInputProps()} />
              {thumbnail ? (
                <div className="relative flex flex-col items-center">
                  {/* Preview Image */}
                  <img
                    src={thumbnail.preview}
                    alt="Preview"
                    className="h-32 object-cover rounded-md mb-2"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => setThumbnail(null)}
                    className="absolute top-1 right-1 rounded-full cursor-pointer text-gray-500 hover:text-gray-600"
                  >
                    <Trash2 />
                  </button>

                  <p className="text-sm text-gray-600">{thumbnail.name}</p>
                </div>
              ) : (
                <p className="text-gray-500">
                  Drag & drop an image here, or click to upload
                </p>
              )}
            </div>
          ) : (
            <input
              {...register("placeholderTitle", {
                required: "Thumbanil placeholder is required",
              })}
              type="text"
              placeholder="Enter Placeholder Title"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseForm;