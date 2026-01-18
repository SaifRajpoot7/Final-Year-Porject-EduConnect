// import React, { useEffect, useState } from "react";
// import OverviewCard from "../../components/OverviewCard";
// import { CalendarDays, FileText, HelpCircle, TrendingUp, Users } from "lucide-react";
// import StudentPerformanceOverTime from "../../components/StudentPerformanceOverTime";
// import StudentActivityBreakdown from "../../components/StudentActivityBreakdown";
// import TeacherPerformanceDistribution from "../../components/TeacherPerformanceDistribution";
// import TeacherWorkloadChart from "../../components/TeacherWorkloadChart";
// import PageTitle from "../../components/other/PageTitle";
// import Title from "../../components/other/Title";
// import { useAppContext } from "../../contexts/AppContext";
// import { useParams } from "react-router";
// import LoaderComponent from "../../components/FullPageLoaderComponent";
// import axios from "axios";
// import ComponentLoader from "../../components/ComponentLoader";
// // import { useParams } from "react-router"; // enable later

// const CourseDashboardPage = () => {
//   const { backendUrl, userData, setMenuType, courseId } = useAppContext(); // 1. Get userData from context
//   const [isTeacher, setIsTeacher] = useState(false);
//   const [cardsData, setCardsData] = useState({});
//   const [studentPerformanceData, setStudentPerformanceData] = useState([]);
//   const [studentActivityData, setStudentActivityData] = useState([]);
//   const [teacherPerformanceData, setTeacherPerformanceData] = useState([]);
//   const [teacherWorkloadData, setTeacherWorkloadData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 2. Define visibility logic based on dashboardType
//   const showStudentCharts = userData?.dashboardType === 'general' || userData?.dashboardType === 'student';
//   const showTeacherCharts = userData?.dashboardType === 'general' || userData?.dashboardType === 'teacher';

//   useEffect(() => {

//     const fetchCourseData = async () => {
//       try {
//         setLoading(true);

//         const response = await axios.get(`${backendUrl}/api/course/${courseId}`, { withCredentials: true });

//         if (response?.data?.success) {
//           setIsTeacher(response.data.courseData.teacher._id === userData._id);
//         }

//       } catch (error) {
//         console.error("Failed to fetch dashboard data", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // Fetch requests array
//         const requests = [
//           axios.get(`${backendUrl}/api/course/${courseId}/overview-cards`, { withCredentials: true }),
//         ];

//         // Only fetch student data if needed (Optimization)
//         if (showStudentCharts) {
//           requests.push(
//             axios.get(`${backendUrl}/api/course/${courseId}/student-performance`, { withCredentials: true }),
//             axios.get(`${backendUrl}/api/course/${courseId}/assignment-quiz-status`, { withCredentials: true })
//           );
//         }

//         // Only fetch teacher data if needed (Optimization)
//         if (showTeacherCharts) {
//           requests.push(
//             axios.get(`${backendUrl}/api/course/${courseId}/teacher-student-performance`, { withCredentials: true }),
//             axios.get(`${backendUrl}/api/course/${courseId}/teacher-workload`, { withCredentials: true })
//           );
//         }

//         // Execute all relevant requests
//         const responses = await Promise.all(requests);

//         // --- Response Handling ---

//         // const courseDetailResponse = responses[0];
//         // if (courseDetailResponse?.data?.success) {
//         //   setIsTeacher(courseDetailResponse.data.courseData.teacher._id === userData._id);
//         // }

//         // 1. Overview Cards
//         const cardsResponse = responses[0];
//         if (cardsResponse?.data?.success) {
//           setCardsData(cardsResponse.data.data);
//         }

//         let indexCounter = 1;

//         // 2. Handle Student Data if fetched
//         if (showStudentCharts) {
//           const perfResponse = responses[indexCounter++];
//           const activityResponse = responses[indexCounter++];
          
//           if (perfResponse?.data?.success) setStudentPerformanceData(perfResponse.data.data);
//           if (activityResponse?.data?.success) setStudentActivityData(activityResponse.data.data);
//         }

//         // 3. Handle Teacher Data if fetched
//         if (showTeacherCharts) {
//           const teacherPerfResponse = responses[indexCounter++];
//           const workloadResponse = responses[indexCounter++];

//           if (teacherPerfResponse?.data?.success) setTeacherPerformanceData(teacherPerfResponse.data.data);
//           if (workloadResponse?.data?.success) setTeacherWorkloadData(workloadResponse.data.data);
//         }

//       } catch (error) {
//         console.error("Failed to fetch dashboard data", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userData) {
//       fetchCourseData();
//       fetchDashboardData();
//     }
//   }, [backendUrl, userData, showStudentCharts, showTeacherCharts]);
  
//   useEffect(() => {
//     setMenuType("course");
//     return () => setMenuType("general");
//   }, [setMenuType]);

//   if (loading) return <ComponentLoader />;

//   return (
//     <div className="p-2 min-h-screen">
//       <PageTitle
//         title="Dashboard Overview"
//         subtitle="Track your progress, lectures, assignments, and performance insight"
//       />
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
//             <OverviewCard icon={CalendarDays} title="Upcoming Lectures (Today)" value={cardsData.upcomingLectures} />
//             {isTeacher ? (
//               <OverviewCard icon={Users} title="Total Students" value={cardsData.totalStudents} />
//             ) : (
//               <OverviewCard icon={Users} title="Class Mates" value={cardsData.totalStudents} />
//             )}
//             <OverviewCard icon={FileText} title="Active Assignments" value={cardsData.activeAssignments} />
//             <OverviewCard icon={HelpCircle} title="Active Quizzes" value={cardsData.activeQuizzes} />
//           </div>

//           {isTeacher ? (
//             <>
//               <Title title="Teacher Insights" />
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
//                 <TeacherPerformanceDistribution />
//                 <TeacherWorkloadChart />
//               </div>
//             </>
//           ) : (
//             <>
//               <Title title="Student Insights" />
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
//                 <StudentPerformanceOverTime performanceData={studentPerformanceData} />
//                 <StudentActivityBreakdown activityData={studentActivityData} />
//               </div>
//             </>
//           )}
//     </div>
//   );
// };

// export default CourseDashboardPage;


import React, { useEffect, useState } from "react";
import OverviewCard from "../../components/OverviewCard";
import { CalendarDays, FileText, HelpCircle, Users } from "lucide-react";
import StudentPerformanceOverTime from "../../components/StudentPerformanceOverTime";
import StudentActivityBreakdown from "../../components/StudentActivityBreakdown";
import TeacherPerformanceDistribution from "../../components/TeacherPerformanceDistribution";
import TeacherWorkloadChart from "../../components/TeacherWorkloadChart";
import PageTitle from "../../components/other/PageTitle";
import Title from "../../components/other/Title";
import { useAppContext } from "../../contexts/AppContext";
import axios from "axios";
import ComponentLoader from "../../components/ComponentLoader";

const CourseDashboardPage = () => {
  const { backendUrl, userData, setMenuType, courseId } = useAppContext();
  
  const [isTeacher, setIsTeacher] = useState(false);
  const [cardsData, setCardsData] = useState({});
  const [studentPerformanceData, setStudentPerformanceData] = useState([]);
  const [studentActivityData, setStudentActivityData] = useState([]);
  const [teacherPerformanceData, setTeacherPerformanceData] = useState([]);
  const [teacherWorkloadData, setTeacherWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We define one async function to handle the sequence:
    // 1. Check Role (Teacher/Student) for THIS course.
    // 2. Fetch the relevant data based on that role.
    const initCourseDashboard = async () => {
      try {
        setLoading(true);

        // --- Step 1: Fetch Course Details to determine Role ---
        const courseResponse = await axios.get(`${backendUrl}/api/course/${courseId}`, {
          withCredentials: true,
        });

        let isCourseTeacher = false;
        if (courseResponse?.data?.success) {
          // Check if current user is the teacher of this course
          isCourseTeacher = courseResponse.data.courseData.teacher._id === userData._id;
          setIsTeacher(isCourseTeacher);
        }

        // --- Step 2: Prepare Dashboard Data Requests ---
        // Always fetch Overview Cards
        const requests = [
          axios.get(`${backendUrl}/api/course/${courseId}/overview-cards`, { withCredentials: true }),
        ];

        // Conditional Fetching based on the role we just determined
        if (isCourseTeacher) {
          // Fetch Teacher Data
          requests.push(
            axios.get(`${backendUrl}/api/course/${courseId}/teacher-student-performance`, { withCredentials: true }),
            axios.get(`${backendUrl}/api/course/${courseId}/teacher-workload`, { withCredentials: true })
          );
        } else {
          // Fetch Student Data
          requests.push(
            axios.get(`${backendUrl}/api/course/${courseId}/student-performance`, { withCredentials: true }),
            axios.get(`${backendUrl}/api/course/${courseId}/assignment-quiz-status`, { withCredentials: true })
          );
        }

        // Execute all requests in parallel
        const responses = await Promise.all(requests);

        // --- Step 3: Handle Responses ---
        
        // 1. Overview Cards (Always Index 0)
        const cardsRes = responses[0];
        if (cardsRes?.data?.success) {
          setCardsData(cardsRes.data.data);
        }

        // 2. Specific Data (Indices 1 & 2)
        if (isCourseTeacher) {
          const perfRes = responses[1];
          const workloadRes = responses[2];

          if (perfRes?.data?.success) setTeacherPerformanceData(perfRes.data.data);
          if (workloadRes?.data?.success) setTeacherWorkloadData(workloadRes.data.data);
        } else {
          const perfRes = responses[1];
          const activityRes = responses[2];

          if (perfRes?.data?.success) setStudentPerformanceData(perfRes.data.data);
          if (activityRes?.data?.success) setStudentActivityData(activityRes.data.data);
        }

      } catch (error) {
        console.error("Failed to fetch course dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData && courseId) {
      initCourseDashboard();
    }
  }, [backendUrl, userData, courseId]);

  // Set the Sidebar Menu Type
  useEffect(() => {
    setMenuType("course");
    return () => setMenuType("general");
  }, [setMenuType]);

  if (loading) return <ComponentLoader />;

  return (
    <div className="p-2">
      <PageTitle
        title="Dashboard Overview"
        subtitle="Track your progress, lectures, assignments, and performance insight"
      />
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        <OverviewCard 
            icon={CalendarDays} 
            title="Upcoming Lectures (Today)" 
            value={cardsData.upcomingLectures || 0} 
        />
        <OverviewCard 
            icon={Users} 
            title={isTeacher ? "Total Students" : "Class Mates"} 
            value={cardsData.totalStudents || 0} 
        />
        <OverviewCard 
            icon={FileText} 
            title="Active Assignments" 
            value={cardsData.activeAssignments || 0} 
        />
        <OverviewCard 
            icon={HelpCircle} 
            title="Active Quizzes" 
            value={cardsData.activeQuizzes || 0} 
        />
      </div>

      {/* Conditional Insights Section */}
      {isTeacher ? (
        <>
          <Title title="Teacher Insights" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            {/* Added missing props here */}
            <TeacherPerformanceDistribution performanceDistribution={teacherPerformanceData} />
            <TeacherWorkloadChart workloadData={teacherWorkloadData} />
          </div>
        </>
      ) : (
        <>
          <Title title="Student Insights" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
            <StudentPerformanceOverTime performanceData={studentPerformanceData} />
            <StudentActivityBreakdown activityData={studentActivityData} />
          </div>
        </>
      )}
    </div>
  );
};

export default CourseDashboardPage;