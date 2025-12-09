import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexts/AppContext";

const StudentsList = () => {
  const { backendUrl, courseId } = useAppContext();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/course/${courseId}/students`,
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to load students");
        setLoading(false);
        return;
      }

      setStudents(res.data.students);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching students");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchStudents();
  }, [courseId]);

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (!students.length)
    return (
      <p className="text-center text-gray-500 py-5">
        No students enrolled in this course.
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
            {students.map((s, idx) => (
              <tr
                key={s._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
};

export default StudentsList;
