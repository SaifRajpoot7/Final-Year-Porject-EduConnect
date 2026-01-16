import React, { useEffect, useState } from "react";
import OverviewCard from "../../../components/OverviewCard";
import { BookOpen, CalendarDays, FileText, HelpCircle, Users } from "lucide-react";
import StudentPerformanceOverTime from "../../../components/StudentPerformanceOverTime";
import StudentActivityBreakdown from "../../../components/StudentActivityBreakdown";
import TeacherPerformanceDistribution from "../../../components/TeacherPerformanceDistribution";
import TeacherWorkloadChart from "../../../components/TeacherWorkloadChart";
import PageTitle from "../../../components/other/PageTitle";
import Title from "../../../components/other/Title";
import AdminCharts from "../../../components/charts/AdminCharts";
import { useAppContext } from "../../../contexts/AppContext";
import axios from "axios";
import ComponentLoader from "../../../components/ComponentLoader";

const SuperAdminDashboardPage = () => {
  const { backendUrl } = useAppContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Call the API endpoint we discussed earlier
        const response = await axios.get(`${backendUrl}/api/super-admin/overview-cards`, {
          withCredentials: true
        });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch chart data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [backendUrl]);

  if (loading) return <ComponentLoader />

  return (
    <div className="p-2">
      <PageTitle title="Dashboard Overview" subtitle="Track the Platforms Insights" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        <OverviewCard icon={Users} title="Total Users" value={data.totalUsers} />
        <OverviewCard icon={BookOpen} title="Total Courses" value={data.totalCourses} />
        <OverviewCard icon={CalendarDays} title="Live Lectures" value={data.totalLiveLectures} />
        <OverviewCard icon={Users} title="Today's Active Users" value={data.activeUsersToday} />
      </div>
      <Title title="Platform Insights" />
      <AdminCharts />
      <Title title="Student Insights" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <StudentPerformanceOverTime />
        <StudentActivityBreakdown />
      </div>
      <Title title="Teacher Insights" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <TeacherPerformanceDistribution />
        <TeacherWorkloadChart />
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
