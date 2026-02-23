import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Camera, Save, Lock, User as UserIcon, Mail } from "lucide-react";
import PageTitle from "../../components/other/PageTitle";
import { useAppContext } from "../../contexts/AppContext";

const ProfilePage = () => {
  const { userData, setUserData, backendUrl } = useAppContext();
  
  // State specifically for the *newly selected* file preview
  // We initialize it as null so we can fall back to userData or default
  const [previewImage, setPreviewImage] = useState(null);

  // Form 1: Profile Info
  const { register: registerInfo, handleSubmit: submitInfo, formState: { isSubmitting: infoSubmitting } } = useForm({
    defaultValues: { fullName: userData?.fullName }
  });

  // Form 2: Password
  const { register: registerPass, handleSubmit: submitPass, reset: resetPass, watch, formState: { errors: passErrors, isSubmitting: passSubmitting } } = useForm();

  // --- Handle Profile Update ---
  const onUpdateProfile = async (data) => {
    try {
      const formData = new FormData();
      
      // 1. FIX: Correctly append fields one by one
      formData.append("fullName", data.fullName);
      
      // 2. Only append image if the user actually picked one
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await axios.put(`${backendUrl}/api/user/update-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Profile updated!");
        
        // Update global context with new data (including new profile pic url)
        setUserData(res.data.user); 
        
        // Clear the manual blob preview so we switch to using the real URL from backend
        setPreviewImage(null); 
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // --- Handle Password Change ---
  const onChangePassword = async (data) => {
    try {
      const res = await axios.put(`${backendUrl}/api/user/change-password`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }, { withCredentials: true });

      if (res.data.success) {
        toast.success("Password changed successfully!");
        resetPass();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  // Helper for image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary URL for the selected file
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageTitle title="My Profile" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        
        {/* LEFT COLUMN: Identity & Info */}
        <div className="md:col-span-1 space-y-6">
            
          {/* 1. Profile Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <form onSubmit={submitInfo(onUpdateProfile)} className="w-full flex flex-col items-center">
                
                {/* Image Upload Circle */}
                <div className="relative group cursor-pointer mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                    {/* LOGIC:
                        1. Is there a new file preview? Show it.
                        2. If not, does user have a saved picture? Show it.
                        3. If neither, show /user.png
                    */}
                    <img 
                      src={previewImage || userData?.profilePicture || "/user.png"} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                  
                  {/* Hidden Input */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    {...registerInfo("image", { onChange: handleImageChange })}
                  />
                </div>

                {/* Name Input */}
                <div className="w-full mb-4">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block text-left">Full Name</label>
                   <div className="relative">
                      <UserIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        defaultValue={userData?.fullName} // Use defaultValue for react-hook-form
                        {...registerInfo("fullName", { required: "Name is required" })}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                   </div>
                </div>

                {/* Email (Read Only) */}
                <div className="w-full mb-6">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block text-left">Email Address</label>
                   <div className="relative">
                      <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        value={userData?.email || ""}
                        disabled
                        className="w-full pl-10 pr-4 py-2 border bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                      />
                   </div>
                </div>

                <button 
                  disabled={infoSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save size={18} />
                  {infoSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Security */}
        <div className="md:col-span-2">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Lock className="text-blue-600" size={20} />
                Change Password
              </h3>

              <form onSubmit={submitPass(onChangePassword)} className="space-y-5 max-w-lg">
                  
                  {/* Old Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                      type="password"
                      {...registerPass("oldPassword", { required: "Current password is required" })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {passErrors.oldPassword && <p className="text-red-500 text-xs mt-1">{passErrors.oldPassword.message}</p>}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password"
                      {...registerPass("newPassword", { 
                        required: "New password is required",
                        minLength: { value: 6, message: "Must be at least 6 characters" }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {passErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passErrors.newPassword.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password"
                      {...registerPass("confirmPassword", { 
                        validate: (val) => {
                          if (watch('newPassword') !== val) {
                            return "Passwords do not match";
                          }
                        }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {passErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passErrors.confirmPassword.message}</p>}
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={passSubmitting}
                      className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      {passSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
              </form>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;