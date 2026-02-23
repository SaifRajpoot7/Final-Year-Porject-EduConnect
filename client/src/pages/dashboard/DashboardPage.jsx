import React, { useEffect, useState } from "react";
import OverviewCard from "../../components/OverviewCard";
import { BookOpen, CalendarDays, FileText, HelpCircle } from "lucide-react";
import StudentPerformanceOverTime from "../../components/StudentPerformanceOverTime";
import StudentActivityBreakdown from "../../components/StudentActivityBreakdown";
import TeacherPerformanceDistribution from "../../components/TeacherPerformanceDistribution";
import TeacherWorkloadChart from "../../components/TeacherWorkloadChart";
import PageTitle from "../../components/other/PageTitle";
import Title from "../../components/other/Title";
import { useAppContext } from "../../contexts/AppContext";
import ComponentLoader from "../../components/ComponentLoader";
import axios from "axios";

const DashboardPage = () => {
  const { backendUrl, userData } = useAppContext(); // 1. Get userData from context
  const [cardsData, setCardsData] = useState({});
  const [studentPerformanceData, setStudentPerformanceData] = useState([]);
  const [studentActivityData, setStudentActivityData] = useState([]);
  const [teacherPerformanceData, setTeacherPerformanceData] = useState([]);
  const [teacherWorkloadData, setTeacherWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Define visibility logic based on dashboardType
  const showStudentCharts = userData?.dashboardType === 'general' || userData?.dashboardType === 'student';
  const showTeacherCharts = userData?.dashboardType === 'general' || userData?.dashboardType === 'teacher';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch requests array
        const requests = [
          axios.get(`${backendUrl}/api/user/overview-cards`, { withCredentials: true }),
        ];

        // Only fetch student data if needed (Optimization)
        if (showStudentCharts) {
          requests.push(
            axios.get(`${backendUrl}/api/user/student-performance`, { withCredentials: true }),
            axios.get(`${backendUrl}/api/user/assignment-quiz-status`, { withCredentials: true })
          );
        }

        // Only fetch teacher data if needed (Optimization)
        if (showTeacherCharts) {
          requests.push(
            axios.get(`${backendUrl}/api/user/teacher-student-performance`, { withCredentials: true }),
            axios.get(`${backendUrl}/api/user/teacher-workload`, { withCredentials: true })
          );
        }

        // Execute all relevant requests
        const responses = await Promise.all(requests);

        // --- Response Handling ---
        
        // 1. Overview Cards (Always first)
        const cardsResponse = responses[0];
        if (cardsResponse?.data?.success) {
          setCardsData(cardsResponse.data.data);
        }

        let indexCounter = 1;

        // 2. Handle Student Data if fetched
        if (showStudentCharts) {
          const perfResponse = responses[indexCounter++];
          const activityResponse = responses[indexCounter++];
          
          if (perfResponse?.data?.success) setStudentPerformanceData(perfResponse.data.data);
          if (activityResponse?.data?.success) setStudentActivityData(activityResponse.data.data);
        }

        // 3. Handle Teacher Data if fetched
        if (showTeacherCharts) {
          const teacherPerfResponse = responses[indexCounter++];
          const workloadResponse = responses[indexCounter++];

          if (teacherPerfResponse?.data?.success) setTeacherPerformanceData(teacherPerfResponse.data.data);
          if (workloadResponse?.data?.success) setTeacherWorkloadData(workloadResponse.data.data);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchDashboardData();
    }
  }, [backendUrl, userData, showStudentCharts, showTeacherCharts]);

  if (loading) return <ComponentLoader />;

  return (
    <div className="p-2">
      <PageTitle
        title="Dashboard Overview"
        subtitle="Track your progress, courses, assignments, and performance insight"
      />
      
      {/* Overview Cards (Always Visible) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        <OverviewCard icon={BookOpen} title="Total Courses" value={cardsData.totalCourse || 0} />
        <OverviewCard icon={FileText} title="Active Assignments" value={cardsData.activeAssignments || 0} />
        <OverviewCard icon={CalendarDays} title="Upcoming Lectures (Today)" value={cardsData.upcomingLectures || 0} />
        <OverviewCard icon={HelpCircle} title="Active Quizzes" value={cardsData.activeQuizzes || 0} />
      </div>

      {/* --- Student Section --- */}
      {showStudentCharts && (
        <>
          <Title title="Student Insights" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <StudentPerformanceOverTime performanceData={studentPerformanceData} />
            <StudentActivityBreakdown activityData={studentActivityData} />
          </div>
        </>
      )}

      {/* --- Teacher Section --- */}
      {showTeacherCharts && (
        <>
          <Title title="Teacher Insights" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <TeacherPerformanceDistribution performanceDistribution={teacherPerformanceData} />
            <TeacherWorkloadChart workloadData={teacherWorkloadData} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;