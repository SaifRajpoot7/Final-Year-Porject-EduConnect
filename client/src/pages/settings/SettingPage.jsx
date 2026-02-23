import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../../contexts/AppContext";
import { toast } from "react-toastify";

const SettingsPage = () => {
  // 1. Get backendurl and token (if needed) from Context
  const { backendUrl } = useAppContext(); 
  
  const [activeTab, setActiveTab] = useState("general");
  const [dashboardType, setDashboardType] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const menu = [
    { key: "general", label: "General" },
  ];

  // 2. Updated Handler using Axios
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await axios.patch(
        `${backendUrl}/api/user/update-dashboard-type`,
        { dashboardType },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Optional: Update user context here if you have a setUser function
        // setUser(response.data.data);
      }
    } catch (error) {
      // console.error("Failed to update settings:", error);
      const errorMsg = error.response?.data?.message || "Failed to save changes.";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-white border-b px-6 py-4">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Settings
        </h1>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-lg shadow-sm transition ${
            isSaving
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r p-6">
          <nav className="space-y-2">
            {menu.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === item.key
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                General Preferences
              </h2>
              <div className="space-y-6 max-w-xl">
                
                {/* --- Dashboard View Setting --- */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dashboard View
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select the interface that best suits your role.
                  </p>
                  <select
                    value={dashboardType}
                    onChange={(e) => setDashboardType(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                  >
                    <option value="general">General (Standard View)</option>
                    <option value="student">Student Dashboard</option>
                    <option value="teacher">Teacher Dashboard</option>
                  </select>
                </div>
                {/* ----------------------------- */}

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border">
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Spanish</option>
                  </select>
                </div> */}
              </div>
            </section>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Notifications
              </h2>
              <div className="space-y-4 max-w-2xl">
                {[
                  {
                    label: "Email Notifications",
                    desc: "Receive updates via email.",
                  },
                  { label: "Push Notifications", desc: "Get instant push alerts." },
                  { label: "SMS Alerts", desc: "Receive alerts via text messages." },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div>
                      <p className="font-medium text-gray-700">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Account Settings
              </h2>
              <div className="space-y-6 max-w-xl">
                <button className="text-blue-600 hover:underline block">
                  Change Email
                </button>
                <button className="text-blue-600 hover:underline block">
                  Change Password
                </button>
                <button className="text-red-600 hover:underline block">
                  Delete Account
                </button>
              </div>
            </section>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Security
              </h2>
              <p className="text-gray-600 mb-4">
                Manage your login and authentication preferences.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Enable Two-Factor Authentication
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;