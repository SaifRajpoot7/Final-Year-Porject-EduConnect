import React, { useState } from "react";
import { Mail, Phone, MapPin, Settings, User, Activity } from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const user = {
    name: "Saif ur Rehman",
    role: "MERN Stack Developer",
    avatar: "https://i.pravatar.cc/150?img=12",
    cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    email: "saif@example.com",
    phone: "+92 300 1234567",
    location: "Sialkot, Pakistan",
    bio: "Passionate developer with a focus on building scalable web applications using the MERN stack. Always eager to learn new technologies and solve real-world problems.",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Cover + Avatar */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden">
        <div
          className="h-40 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${user.cover})` }}
        />
        <div className="relative px-6 pb-6">
          <div className="absolute -top-12">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
          </div>
          <div className="pt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.role}</p>
            </div>
            <button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Details + Tabs */}
      <div className="w-full max-w-5xl mt-6 bg-white rounded-2xl shadow-md p-6">
        {/* Bio + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">{user.bio}</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={18} /> {user.email}
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={18} /> {user.phone}
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin size={18} /> {user.location}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <div className="flex gap-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 pb-2 ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <User size={18} /> Overview
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex items-center gap-2 pb-2 ${
                activeTab === "activity"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Activity size={18} /> Activity
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 pb-2 ${
                activeTab === "settings"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Settings size={18} /> Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "overview" && (
              <p className="text-gray-600">
                Welcome to your profile overview. Here you can see your
                information, bio, and contact details.
              </p>
            )}
            {activeTab === "activity" && (
              <p className="text-gray-600">
                Recent activity will be displayed here (e.g., completed
                courses, assignments, quizzes).
              </p>
            )}
            {activeTab === "settings" && (
              <p className="text-gray-600">
                Profile settings and preferences go here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
