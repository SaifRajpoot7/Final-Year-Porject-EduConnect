// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useDropzone } from "react-dropzone";

// const CreateCourseForm = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [thumbnail, setThumbnail] = useState(null);

//   // Dropzone for drag & drop
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: { "image/*": [] },
//     multiple: false,
//     onDrop: (acceptedFiles) => {
//       setThumbnail(
//         Object.assign(acceptedFiles[0], {
//           preview: URL.createObjectURL(acceptedFiles[0]),
//         })
//       );
//     },
//   });

//   const onSubmit = (data) => {
//     console.log({ ...data, thumbnail });
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Course</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {/* Course Title */}
//         <div className="flex flex-col">
//           <label className="font-medium text-gray-700 mb-1">Course Title</label>
//           <input
//             {...register("title", { required: "Course title is required" })}
//             type="text"
//             placeholder="Enter course title"
//             className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//         </div>

//         {/* Course Code */}
//         <div className="flex flex-col">
//           <label className="font-medium text-gray-700 mb-1">Course Code</label>
//           <input
//             {...register("code", { required: "Course code is required" })}
//             type="text"
//             placeholder="e.g. CS101"
//             className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
//         </div>

//         {/* Short Description */}
//         <div className="flex flex-col md:col-span-2">
//           <label className="font-medium text-gray-700 mb-1">Short Description</label>
//           <textarea
//             {...register("description", { required: "Description is required" })}
//             placeholder="Write a short description..."
//             rows={3}
//             className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
//         </div>

//         {/* Thumbnail Upload */}
//         <div className="md:col-span-2">
//           <label className="font-medium text-gray-700 mb-2 block">Course Thumbnail</label>
//           <div
//             {...getRootProps()}
//             className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
//               isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
//             }`}
//           >
//             <input {...getInputProps()} />
//             {thumbnail ? (
//               <div className="flex flex-col items-center">
//                 <img
//                   src={thumbnail.preview}
//                   alt="Preview"
//                   className="h-32 object-cover rounded-md mb-2"
//                 />
//                 <p className="text-sm text-gray-600">{thumbnail.name}</p>
//               </div>
//             ) : (
//               <p className="text-gray-500">Drag & drop an image here, or click to upload</p>
//             )}
//           </div>

//           {/* OR URL */}
//           <div className="mt-3">
//             <input
//               {...register("thumbnailUrl")}
//               type="url"
//               placeholder="Or enter image URL"
//               className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="md:col-span-2 flex justify-end">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md"
//           >
//             Create Course
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateCourseForm;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Trash2 } from "lucide-react";

const CreateCourseForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [thumbnail, setThumbnail] = useState(null);
  const [inputType, setInputType] = useState("upload"); // "upload" | "placeholder"

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

  const onSubmit = (data) => {
    console.log({
      ...data,
      thumbnail: inputType === "upload" ? thumbnail : data.placeholderTitle,
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Course</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Course Title */}
        <div className="flex flex-col">
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

        {/* Course Code */}
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">Course Code</label>
          <input
            {...register("code", { required: "Course code is required" })}
            type="text"
            placeholder="e.g. CS101"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
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
                value="upload"
                checked={inputType === "upload"}
                onChange={() => setInputType("upload")}
              />
              Upload Image
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="placeholder"
                checked={inputType === "placeholder"}
                onChange={() => setInputType("placeholder")}
              />
              Placeholder Title
            </label>
          </div>

          {/* Conditional Rendering */}
          {inputType === "upload" ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                isDragActive
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
                required: "Placeholder title is required",
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseForm;