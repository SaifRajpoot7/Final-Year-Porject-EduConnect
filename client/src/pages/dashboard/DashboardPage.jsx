// import React, { useEffect, useState } from "react";
// import OverviewCard from "../../components/OverviewCard";
// import { BookOpen, CalendarDays, FileText, HelpCircle } from "lucide-react";
// import StudentPerformanceOverTime from "../../components/StudentPerformanceOverTime";
// import StudentActivityBreakdown from "../../components/StudentActivityBreakdown";
// import TeacherPerformanceDistribution from "../../components/TeacherPerformanceDistribution";
// import TeacherWorkloadChart from "../../components/TeacherWorkloadChart";
// import PageTitle from "../../components/other/PageTitle";
// import Title from "../../components/other/Title";
// import { useAppContext } from "../../contexts/AppContext";
// import ComponentLoader from "../../components/ComponentLoader";
// import axios from "axios";

// const DashboardPage = () => {
//   const { backendUrl } = useAppContext();
//   const [cardsData, setCardsData] = useState([]);
//   const [studentPerformanceData, setStudentPerformanceData] = useState([]);
//   const [studentActivityData, setStudentActivityData] = useState([]);
//   const [teacherPerformanceData, setTeacherPerformanceData] = useState([]);
//   const [teacherWorkloadData, setTeacherWorkloadData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // Execute both requests in parallel
//         const [cardsResponse, performanceResponse, activityResponse, teacherPerformanceResponse, teacherWorkloadResponse] = await Promise.all([
//           axios.get(`${backendUrl}/api/user/overview-cards`, { withCredentials: true }),
//           axios.get(`${backendUrl}/api/user/student-performance`, { withCredentials: true }),
//           axios.get(`${backendUrl}/api/user/assignment-quiz-status`, { withCredentials: true }),
//           axios.get(`${backendUrl}/api/user/teacher-student-performance`, { withCredentials: true }),
//           axios.get(`${backendUrl}/api/user/teacher-workload`, { withCredentials: true }),
//         ]);

//         // Handle Overview Cards
//         if (cardsResponse.data.success) {
//           setCardsData(cardsResponse.data.data);
//           console.log("Fetched overview cards:", cardsResponse.data.data);
//         }

//         // Handle Student Performance
//         if (performanceResponse.data.success) {
//           setStudentPerformanceData(performanceResponse.data.data);
//           console.log("Fetched student performance:", performanceResponse.data.data);
//         }

//         // Handle Student Activity
//         if (activityResponse.data.success) {
//           setStudentActivityData(activityResponse.data.data);
//           console.log("Fetched student activity:", activityResponse.data.data);
//         }

//         // Handle Teacher Performance
//         if (teacherPerformanceResponse.data.success) {
//           setTeacherPerformanceData(teacherPerformanceResponse.data.data);
//           console.log("Fetched teacher performance:", teacherPerformanceResponse.data.data);
//         }

//         // Handle Teacher Workload
//         if (teacherWorkloadResponse.data.success) {
//           setTeacherWorkloadData(teacherWorkloadResponse.data.data);
//           console.log("Fetched teacher workload:", teacherWorkloadResponse.data.data);
//         }

//       } catch (error) {
//         console.error("Failed to fetch dashboard data", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [backendUrl]);

//   if (loading) return <ComponentLoader />

//   return (
//     <div className="p-2">
//       <PageTitle title="Dashboard Overview" subtitle="Track your progress, courses, assignments, and performance insight" />
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
//         <OverviewCard icon={BookOpen} title="Total Courses" value={cardsData.totalCourse} />
//         <OverviewCard icon={FileText} title="Active Assignments" value={cardsData.activeAssignments} />
//         <OverviewCard icon={CalendarDays} title="Upcoming Lectures(Today)" value={cardsData.upcomingLectures} />
//         <OverviewCard icon={HelpCircle} title="Active Quizzes" value={cardsData.activeQuizzes} />
//       </div>
//       <Title title="Student Insights" />
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
//         <StudentPerformanceOverTime performanceData={studentPerformanceData} />
//         <StudentActivityBreakdown activityData={studentActivityData} />
//       </div>
//       <Title title="Teacher Insights" />
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
//         <TeacherPerformanceDistribution performanceDistribution={teacherPerformanceData} />
//         <TeacherWorkloadChart workloadData={teacherWorkloadData} />
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


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