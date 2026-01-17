import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexts/AppContext";

const TeacherTable = () => {
  const { backendUrl, courseId } = useAppContext();
  const [teacher, setTeacher] = useState();
  const [loading, setLoading] = useState(true);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/course/${courseId}/teacher`,
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to load teacher");
        setLoading(false);
        return;
      }

      setTeacher(res.data.teacher);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching teacher");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchTeacher();
  }, [courseId]);

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (!teacher)
    return (
      <p className="text-center text-gray-500 py-5">
        No teacher assigned to this course.
      </p>
    );

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
            <th className="px-4 py-3">Sr</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
          </tr>
        </thead>

        <tbody>
          
            <tr
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3">{1}</td>
              <td className="px-4 py-3">{teacher.fullName}</td>
              <td className="px-4 py-3">{teacher.email}</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
