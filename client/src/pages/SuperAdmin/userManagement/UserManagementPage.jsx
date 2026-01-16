import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitle from "../../../components/other/PageTitle";
import { useAppContext } from "../../../contexts/AppContext";
import { useNavigate, useParams } from "react-router";
import UserUpdateModal from "./UserUpdateModal"
import ComponentLoader from "../../../components/ComponentLoader";

const UserManagementPage = () => {
  const navigate = useNavigate()
  const { setMenuType, backendUrl } = useAppContext();

  const tabs = ["All", "Active", "Suspended", "Blocked"];
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserSuspensionCount, setSelectedUserSuspensionCount] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState(null);
  const [selectedUserAction, setSelectedUserAction] = useState(null);
  const [selectedUserActionLabel, setSelectedUserActionLabel] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/super-admin/users`);
        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [backendUrl]);

  const filteredUsers =
    activeTab === "All"
      ? users
      : users.filter((a) => {
        if (activeTab === "Active") return a.status === "active";
        if (activeTab === "Suspended") return a.status === "suspended";
        if (activeTab === "Blocked") return a.status === "blocked";
        return true;
      });

  const startIndex = (page - 1) * limit;
  const pageData = filteredUsers.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredUsers.length / limit);

  const getStatusBadge = (status) => {
    if (status === "active")
      return "bg-green-100 text-green-700";
    if (status === "suspended")
      return "bg-red-500 text-red-200";
    if (status === "blocked")
      return "bg-red-500 text-red-200";
    return "bg-green-100 text-green-700";
  };

  const openSubmitModal = (userId, suspensionCount, userStatus, nextApiAction, visualLabel) => {
    setSelectedUserId(userId);
    setSelectedUserSuspensionCount(suspensionCount);
    setSelectedUserStatus(userStatus);
    setSelectedUserAction(nextApiAction);
    setSelectedUserActionLabel(visualLabel);
    setShowModal(true);
  };
  return (
    <div className="p-4">
      <PageTitle title="Users Management" />
      {loading ? <ComponentLoader />
        :
        <>
          <div className="flex gap-4 mb-6 border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`pb-2 px-2 font-medium transition ${activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm capitalize">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">User Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Suspension Count</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ?
                  (
                    pageData.map((user, index) => {

                      const actionLabel = user.status;
                      const action = user.suspensionCount >= 5 ? "Block" : "Suspend";
                       
                      let nextApiAction = "";
                      let visualLabel = "";

                      if (user.status === "active") {
                        // If they are active, we want to suspend them
                        nextApiAction = "suspend";

                        // Check if this next action will result in a BLOCK (5th strike)
                        // If they currently have 4, the next one is 5.
                        if (user.suspensionCount >= 4) {
                          visualLabel = "Block";
                        } else {
                          visualLabel = "Suspend";
                        }
                      } else {
                        // If they are suspended or blocked, we want to activate them
                        nextApiAction = "activate";
                        visualLabel = "Activate";
                      }

                      return (
                        <tr key={index} className={`border-t hover:bg-gray-100 transition ${user.status !== "active" && "bg-red-200 hover:bg-red-300"}`}>
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">{user.fullName ?? "-"}</td>
                          <td className="px-4 py-3">{user.email ?? "-"}</td>
                          <td className="px-4 py-3">{user.suspensionCount ?? "-"}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                                user.status
                              )}`}
                            >
                              {user.status.toUpperCase()}
                            </span>
                          </td>
                          {user.status !== "active" &&
                            <td className="px-4 py-3">
                              <button
                                onClick={() => openSubmitModal(user._id, user.suspensionCount, user.status, nextApiAction, visualLabel)}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded cursor-pointer">
                                Activate
                              </button>
                            </td>
                          }
                          {user.status === "active" &&
                            <td className="px-4 py-3">
                              <button
                                onClick={() => openSubmitModal(user._id, user.suspensionCount, user.status, nextApiAction, visualLabel)}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded cursor-pointer">
                                {visualLabel}
                              </button>
                            </td>
                          }
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-6 text-gray-500">No User found</td>
                    </tr>
                  )}
              </tbody>
            </table>

          </div>
        </>}

      {
        totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className={`px-4 py-2 rounded-lg border ${page === 1 ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Previous</button>
            <span className="text-gray-600">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className={`px-4 py-2 rounded-lg border ${page === totalPages ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"}`}>Next</button>
          </div>
        )
      }

      <UserUpdateModal open={showModal} onClose={() => setShowModal(false)} userId={selectedUserId} userSuspensionCount={selectedUserSuspensionCount} userStatus={selectedUserStatus} nextApiAction={selectedUserAction} visualLabel={selectedUserActionLabel} />
    </div >
  );
};

export default UserManagementPage;
